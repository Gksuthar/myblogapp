#!/usr/bin/env node
/*
  Import content from the archived SB Accounting site into this app via API endpoints.
  Usage:
    1) Ensure the dev server is running: npm run dev (or production server at PORT)
    2) Run: node scripts/import-archive.mjs

  Config via env vars:
    API_BASE=http://localhost:3000
    ARCHIVE_BASE=https://web.archive.org/web/20241205110457/https://sbaccounting.us
*/

import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = (process.env.API_BASE || 'http://localhost:3000').replace(/\/$/, '');
const ARCHIVE_BASE = (process.env.ARCHIVE_BASE || 'https://web.archive.org/web/20241205110457/https://sbaccounting.us').replace(/\/$/, '');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
  const res = await axios.get(url, { timeout: 20000, headers: { 'User-Agent': 'sb-importer/1.0' } });
  return res.data;
}

function makeSlug(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function importHero() {
  try {
    const html = await fetchHtml(`${ARCHIVE_BASE}/`);
    const $ = cheerio.load(html);

    // Heuristics: first prominent h1 and following paragraph
    const title = $('h1').first().text().trim() || 'Welcome to SB Accounting';
    const disc = $('h1').first().nextAll('p').first().text().trim() || 'Your trusted partner for accounting and bookkeeping services.';

    const body = { title, disc, image: '', buttonText: 'Contact Us' };
    const res = await axios.post(`${API_BASE}/api/hero`, body);
    return { ok: true, res: res.data };
  } catch (err) {
    return { ok: false, error: err?.response?.data || err?.message };
  }
}

async function discoverBlogLinks(listUrl) {
  const html = await fetchHtml(listUrl);
  const $ = cheerio.load(html);
  const links = new Set();
  $('a').each((_, a) => {
    const href = $(a).attr('href') || '';
    // pick likely blog links (contains /blog or /blogs and excludes query anchors)
    if (/\/(blog|blogs)\//i.test(href) && !href.includes('#')) {
      const abs = href.startsWith('http') ? href : `${ARCHIVE_BASE}${href.startsWith('/') ? '' : '/'}${href}`;
      links.add(abs);
    }
  });
  return Array.from(links).slice(0, 10);
}

function extractBlog($) {
  const title = ($('article h1').first().text().trim() || $('h1').first().text().trim() || $('title').text().trim());
  const author = ($('[class*="author" i]').first().text().trim() || 'Admin');
  let contentHtml = '';
  const article = $('article');
  if (article.length) {
    contentHtml = article.html() || '';
  } else {
    const main = $('main');
    contentHtml = (main.length ? main.html() : $('body').html()) || '';
  }
  const cleanText = cheerio.load(contentHtml).text().replace(/\s+/g, ' ').trim();
  const excerpt = cleanText.substring(0, 260);
  const slug = makeSlug(title) || `post-${Date.now()}`;
  return { title, author, content: contentHtml, excerpt, slug, published: true, image: '', tags: [] };
}

async function importBlogs() {
  const listCandidates = [
    `${ARCHIVE_BASE}/blogs`,
    `${ARCHIVE_BASE}/blog`,
    `${ARCHIVE_BASE}/blog/`,
  ];

  let links = [];
  for (const url of listCandidates) {
    try {
      links = await discoverBlogLinks(url);
      if (links.length) break;
    } catch {
      // try next
    }
  }

  if (!links.length) {
    return { ok: false, error: 'No blog links discovered' };
  }

  const results = [];
  for (const link of links) {
    try {
      const html = await fetchHtml(link);
      const $ = cheerio.load(html);
      const doc = extractBlog($);
      const res = await axios.post(`${API_BASE}/api/blogs`, doc);
      results.push({ link, status: 'created', id: res.data?._id || null });
      await sleep(300);
    } catch (err) {
      results.push({ link, status: 'failed', error: err?.response?.data || err?.message });
    }
  }
  return { ok: true, results };
}

// --- Trusted Companies ---
async function importTrusted() {
  try {
    const html = await fetchHtml(`${ARCHIVE_BASE}/`);
    const $ = cheerio.load(html);
    const logos = [];
    // Heuristics: img tags with alt that includes 'logo' or inside a section mentioning 'trusted'/'clients'
    $('img').each((_, img) => {
      const alt = ($(img).attr('alt') || '').toLowerCase();
      const src = $(img).attr('src') || '';
      if (!src) return;
      if (alt.includes('logo') || alt.includes('client') || alt.includes('partner')) {
        const abs = src.startsWith('http') ? src : `${ARCHIVE_BASE}${src.startsWith('/') ? '' : '/'}${src}`;
        logos.push({ name: alt || 'Logo', image: abs });
      }
    });
    // Deduplicate and limit
    const unique = [];
    const seenImg = new Set();
    for (const l of logos) {
      if (!seenImg.has(l.image)) {
        seenImg.add(l.image);
        unique.push(l);
      }
      if (unique.length >= 10) break;
    }
    const results = [];
    for (const l of unique) {
      try {
        const res = await axios.post(`${API_BASE}/api/tructedCompany`, l);
        results.push({ name: l.name, status: 'created', id: res.data?._id || null });
        await sleep(150);
      } catch (err) {
        results.push({ name: l.name, status: 'failed', error: err?.response?.data || err?.message });
      }
    }
    return { ok: true, results };
  } catch (err) {
    return { ok: false, error: err?.message };
  }
}

// --- Industries ---
async function importIndustries() {
  try {
    const html = await fetchHtml(`${ARCHIVE_BASE}/`);
    const $ = cheerio.load(html);
    const items = [];
    // Heuristics: find sections with 'Industries' heading, then take descendant cards (h3 + p + img)
    const section = $('h2:contains("Industries"), h3:contains("Industries")').first().closest('section, div');
    const scope = section.length ? section : $('body');
    scope.find('article, .card, .industry, .item, li').each((_, el) => {
      const title = $(el).find('h3, h4, strong').first().text().trim();
      const description = $(el).find('p').first().text().trim();
      const imgEl = $(el).find('img').first();
      const src = imgEl.attr('src') || '';
      if (title && description && src) {
        const image = src.startsWith('http') ? src : `${ARCHIVE_BASE}${src.startsWith('/') ? '' : '/'}${src}`;
        items.push({ title, description, image, tags: [] });
      }
    });
    const unique = [];
    const seen = new Set();
    for (const it of items) {
      const key = `${it.title}|${it.image}`;
      if (!seen.has(key)) { seen.add(key); unique.push(it); }
      if (unique.length >= 8) break;
    }
    const results = [];
    for (const it of unique) {
      try {
        const res = await axios.post(`${API_BASE}/api/industries`, it);
        results.push({ title: it.title, status: 'created', id: res.data?.data?._id || null });
        await sleep(150);
      } catch (err) {
        results.push({ title: it.title, status: 'failed', error: err?.response?.data || err?.message });
      }
    }
    return { ok: true, results };
  } catch (err) {
    return { ok: false, error: err?.message };
  }
}

// --- Categories & Services ---
async function importCategoriesAndServices() {
  try {
    // Try services or services-list pages
    const candidates = [
      `${ARCHIVE_BASE}/services`,
      `${ARCHIVE_BASE}/services-list`,
      `${ARCHIVE_BASE}/services/`,
    ];
    let html = null;
    for (const url of candidates) {
      try { html = await fetchHtml(url); break; } catch { /* try next */ }
    }
    if (!html) return { ok: false, error: 'Services page not found on archive' };

    const $ = cheerio.load(html);
    // Very loose heuristics: take prominent service links/blocks as categories and services
    const blocks = [];
    $('a, article, .card, .service').each((_, el) => {
      const title = $(el).find('h2, h3, h4, strong').first().text().trim() || $(el).text().trim();
      if (!title) return;
      // avoid menu/footer junk
      if (title.length < 6 || title.length > 80) return;
      const desc = $(el).find('p').first().text().trim();
      const imgSrc = $(el).find('img').first().attr('src') || '';
      const image = imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `${ARCHIVE_BASE}${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`) : '';
      blocks.push({ title, desc, image });
    });

    // Pick top 2 as categories (Accounting Outsourcing, Bookkeeping) if present; else first two
    const byTitle = (t) => blocks.find(b => b.title.toLowerCase().includes(t));
    const cat1 = byTitle('accounting') || blocks[0];
    const cat2 = byTitle('bookkeeping') || blocks[1];
    const categories = [cat1, cat2].filter(Boolean);

    const createdCats = [];
    for (const c of categories) {
      try {
        const res = await axios.post(`${API_BASE}/api/service/categories`, {
          name: c.title,
          description: c.desc || c.title,
        });
        createdCats.push({ id: res.data?.data?.id, name: c.title });
        await sleep(150);
      } catch { /* ignore duplicates */ }
    }
    if (!createdCats.length) return { ok: false, error: 'No categories created' };

    // Create one service under each created category, using the title/desc as heroSection
    const results = [];
    for (const cat of createdCats) {
      try {
        const block = blocks.find(b => b.title.toLowerCase().includes(cat.name.toLowerCase())) || blocks[0];
        const res = await axios.post(`${API_BASE}/api/service`, {
          categoryId: cat.id,
          heroSection: {
            image: block?.image || '',
            title: block?.title || `${cat.name} Service`,
            description: block?.desc || `Professional ${cat.name} services to grow your business.`,
          },
          cardSections: [
            {
              sectionTitle: 'Why choose us',
              sectionDescription: 'Key reasons our clients trust us',
              cards: [
                { title: 'Experienced Team', description: 'Skilled professionals with domain expertise.' },
                { title: 'Time & Cost Savings', description: 'Streamlined processes lower your costs.' },
                { title: 'Quality & Accuracy', description: 'We focus on accurate and timely delivery.' },
              ],
            },
          ],
          content: '<p>Imported from archive (heuristic).</p>',
        });
        results.push({ category: cat.name, id: res.data?.data?._id || null, status: 'created' });
        await sleep(200);
      } catch (err) {
        results.push({ category: cat.name, status: 'failed', error: err?.response?.data || err?.message });
      }
    }
    return { ok: true, results };
  } catch (err) {
    return { ok: false, error: err?.message };
  }
}

async function run() {
  console.log('Starting import from archive...');
  const hero = await importHero();
  console.log('Hero:', hero.ok ? 'OK' : `ERR ${JSON.stringify(hero.error)}`);

  const blogs = await importBlogs();
  if (blogs.ok) {
    const created = blogs.results.filter(r => r.status === 'created').length;
    const failed = blogs.results.length - created;
    console.log(`Blogs: created=${created}, failed=${failed}`);
    if (failed) console.log('Blog import details:', blogs.results);
  } else {
    console.log('Blogs: ERR', blogs.error);
  }

  const trusted = await importTrusted();
  console.log('Trusted:', trusted.ok ? `${trusted.results.filter(r=>r.status==='created').length} created` : `ERR ${trusted.error}`);

  const industries = await importIndustries();
  console.log('Industries:', industries.ok ? `${industries.results.filter(r=>r.status==='created').length} created` : `ERR ${industries.error}`);

  const svc = await importCategoriesAndServices();
  if (svc.ok) {
    const created = svc.results?.filter(r=>r.status==='created').length || 0;
    const failed = (svc.results?.length || 0) - created;
    console.log(`Services: created=${created}, failed=${failed}`);
  } else {
    console.log('Services: ERR', svc.error);
  }

  console.log('Done');
}

run().catch(err => {
  console.error('Import run failed:', err);
  process.exit(1);
});
