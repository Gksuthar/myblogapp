#!/usr/bin/env node
/*
  Import content from the archived SB Accounting site into this app via API endpoints.
  Usage:
    1) Ensure the dev server is running: npm run dev (or production server at PORT)
    2) Run: node scripts/import-archive.js

  Config via env vars:
    API_BASE=http://localhost:3000
    ARCHIVE_BASE=https://web.archive.org/web/20241205110457/https://sbaccounting.us
*/

const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const ARCHIVE_BASE = (process.env.ARCHIVE_BASE || 'https://web.archive.org/web/20241205110457/https://sbaccounting.us').replace(/\/$/, '');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchHtml(url) {
  const res = await axios.get(url, { timeout: 20000, headers: { 'User-Agent': 'sb-importer/1.0' }});
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
    // if already exists (PATCH flow belongs elsewhere), just log and continue
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
    // fallback to main content area
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
    } catch { /* try next */ }
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

async function run() {
  console.log('Starting import from archive...');
  const hero = await importHero();
  console.log('Hero:', hero.ok ? 'OK' : `ERR ${JSON.stringify(hero.error)}`);

  const blogs = await importBlogs();
  console.log('Blogs:', blogs.ok ? `${blogs.results.length} processed` : `ERR ${blogs.error}`);

  console.log('Done');
}

run().catch(err => {
  console.error('Import run failed:', err);
  process.exit(1);
});
