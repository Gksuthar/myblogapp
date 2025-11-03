#!/usr/bin/env node
import axios from 'axios';

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-–—]/g, '')
    .replace(/[\s–—]+/g, '-')
    .replace(/-+/g, '-');
}

const posts = [
  {
    title: 'Why is outsource bookkeeping so important for the growth of your Business ?',
    excerpt:
      'In the growth phase, business owners face critical turning points. With revenue scaling, bookkeeping often becomes a burden to catch up…',
    content:
      '<p>In the growing phase we meet a lot of clients and their critical turning points. Business owners who have annual revenue in million dollar would have many other priorities than bookkeeping and suddenly they feel the burden of accounts catching up. This post explores why outsourcing bookkeeping is crucial to sustain growth and maintain financial clarity.</p>',
    tags: ['outsourcing', 'bookkeeping', 'growth'],
  },
  {
    title: 'Strategic Ways to Outsource: Guide to Global Marketing Outsourcing',
    excerpt:
      'Bookkeeping principles remain the same, but tools and methods evolve. Here are strategic ways to outsource effectively in a global context…',
    content:
      '<p>For centuries, basic bookkeeping principles have remained the same, but the technology and methods have changed. This guide discusses strategic approaches to outsourcing marketing and support operations globally, with a focus on quality and controls.</p>',
    tags: ['outsourcing', 'strategy', 'global'],
  },
  {
    title: 'Outsourcing Guidelines | Everything That You Want to Know',
    excerpt:
      'From startup multi-tasking to scaling with specialist teams—this guide walks through practical outsourcing guidelines you can apply…',
    content:
      '<p>During the start-up of a company, founders and early employees take on many tasks. As you grow, outsourcing can bring speed and quality. This post summarizes key guidelines for deciding what and how to outsource.</p>',
    tags: ['outsourcing', 'guidelines'],
  },
  {
    title: 'Build a Better Business with Outsourcing | Convergent Outsourcing',
    excerpt:
      'Outsourcing can unlock productivity and growth. Learn how to leverage the right partners and processes to build a better business…',
    content:
      '<p>For larger businesses and ambitious SMEs, outsourcing is a strategy to accelerate outcomes. We discuss partner selection, SLAs, and performance tracking to ensure success.</p>',
    tags: ['outsourcing', 'operations'],
  },
  {
    title: 'You Should Never Pay These Financial Fees',
    excerpt:
      'Some fees are simply unnecessary. Here are common financial fees you can avoid and how to structure your finances to skip them…',
    content:
      '<p>Fees are not always good value. Some are worth the cost, but others are a waste of money. We cover common financial fees to avoid and alternatives you can consider.</p>',
    tags: ['finance', 'fees'],
  },
  {
    title: 'Why You Should Use Inventory Management Software for Better Control?',
    excerpt:
      'Optimal inventory levels matter. Software helps you avoid stockouts, overstocking, and cash lock-ups in your supply chain…',
    content:
      '<p>Inventory variations are hard to predict. With the right software, you can improve visibility, forecasting, and working capital efficiency. This post outlines key practices and tools.</p>',
    tags: ['inventory', 'software', 'operations'],
  },
  {
    title: 'Which is Better? Xero or Quickbook – Xero vs Quickbooks ProAdvisor',
    excerpt:
      'The great debate—Xero vs QuickBooks. We compare features, ecosystem, and use cases to help you choose the right platform…',
    content:
      '<p>In the accounting industry, choosing between Xero and QuickBooks can be difficult. We compare capabilities and scenarios where each excels to support your decision.</p>',
    tags: ['xero', 'quickbooks', 'software'],
  },
  {
    title: 'How to Use Cloud Accounting Software – Small Business Accounting Software',
    excerpt:
      'Cloud accounting brings speed and access. Learn how to set up, migrate, and run your books in the cloud for real-time insights…',
    content:
      '<p>With modern cloud tools, accounting is faster and more collaborative. This post covers setup steps, integrations, and tips to get the most from your stack.</p>',
    tags: ['cloud', 'accounting', 'software'],
  },
];

async function createPost(p) {
  const payload = {
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    author: 'SB Accounting',
    image: '',
    tags: p.tags || [],
    slug: slugify(p.title),
    published: true,
  };
  try {
    const res = await axios.post(`${API_BASE}/api/blogs`, payload);
    return { title: p.title, status: 'created', id: res.data?._id || res.data?.id || null };
  } catch (err) {
    const msg = err?.response?.data?.error || err?.message;
    if (msg && /already exists/i.test(msg)) {
      return { title: p.title, status: 'exists' };
    }
    return { title: p.title, status: 'failed', error: msg };
  }
}

async function run() {
  const results = [];
  for (const p of posts) {
    // brief backoff to avoid flooding
    const r = await createPost(p);
    results.push(r);
    await new Promise((r) => setTimeout(r, 150));
  }
  const created = results.filter(x => x.status === 'created').length;
  const exists = results.filter(x => x.status === 'exists').length;
  const failed = results.filter(x => x.status === 'failed').length;
  console.log(`Blogs: created=${created}, exists=${exists}, failed=${failed}`);
  if (failed) console.log(results.filter(x => x.status === 'failed'));
}

run().catch(e => {
  console.error('Seeding failed:', e?.message || e);
  process.exit(1);
});
