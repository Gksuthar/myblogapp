#!/usr/bin/env node
import axios from 'axios';

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

const categories = [
  {
    name: 'Bookkeeping Services',
    description: 'Full-cycle bookkeeping and transaction processing for SMBs and firms.'
  },
  {
    name: 'Accounting Services',
    description: 'Month/quarter/year-end adjustments, GL review, setup, and GAAP compliance.'
  },
  {
    name: 'Financial Reporting',
    description: 'KPIs, cash forecasting, working capital control, and management reports.'
  },
  {
    name: 'Tax Filing Services',
    description: 'Individual and business tax return preparation (federal and multi-state).'
  }
];

const servicesByCategory = {
  'Bookkeeping Services': {
    heroSection: {
      title: 'Bookkeeping Services',
      description: 'Outsource bookkeeping to save 40–50% on accounting overheads with certified professionals.'
    },
    cards: [
      { title: 'Accounts Payable Management', description: 'Manage vendor bills, approvals, and timely payments.' },
      { title: 'Accounts Receivables Management', description: 'Invoice, follow-ups, and collections to improve DSO.' },
      { title: 'Recording Payroll Transactions', description: 'Accurate payroll entries and ledgers maintained monthly.' },
      { title: 'Reconciling Payroll Transactions', description: 'Validate payroll postings with reconciliation checks.' },
      { title: 'Bank & Credit Card Reconciliations', description: 'Monthly reconciliations to maintain accurate balances.' },
      { title: 'Merchant Account Reconciliation', description: 'Match gateway settlements and fee deductions reliably.' },
      { title: 'Inventory Management', description: 'Track stock moves and maintain valuation integrity.' }
    ],
    content:
      '<p>It is crucial to maintain precise entries of all transactions. For SMEs, in-house bookkeeping can be expensive. Outsourcing to SB Accounting eliminates the need for an internal team while giving access to CPAs and certified bookkeepers—typically saving 40–50% on accounting overheads.</p>'
  },
  'Accounting Services': {
    heroSection: {
      title: 'Accounting Services',
      description: 'Close faster with adjustments, GL review, cost accounting, and fixed assets management.'
    },
    cards: [
      { title: 'Period-End Adjustments', description: 'Prepayments, accruals, deferred revenue, depreciation.' },
      { title: 'Cost / Project Accounting', description: 'Track costs by job/project with accurate allocations.' },
      { title: 'General Ledger Clean-up', description: 'Identify and correct GL anomalies and misclassifications.' },
      { title: 'Fixed Assets Management', description: 'Register, capitalize, and depreciate assets consistently.' },
      { title: 'US GAAP Compliance', description: 'Policies and entries aligned with GAAP guidance.' },
      { title: 'Accounting Setup', description: 'Chart of accounts and process setup for new entities.' }
    ],
    content:
      '<p>Upgrade your accounting process with best practices, controls, and shortened close cycles. Our team helps you benchmark, baseline, and support regulatory requirements.</p>'
  },
  'Financial Reporting': {
    heroSection: {
      title: 'Financial Reporting',
      description: 'Management reports and metrics to drive decisions and performance.'
    },
    cards: [
      { title: 'AP/AR Aging Analysis', description: 'Visibility into due payables and receivables.' },
      { title: 'Job/Project Costing & Analysis', description: 'Profitability insights by workstream.' },
      { title: 'Working Capital Control', description: 'Optimize cash cycles and liquidity buffers.' },
      { title: 'Cash Forecasting', description: 'Short and medium-term forecasts for planning.' },
      { title: 'KPI Reporting', description: 'Metrics tailored to your business model.' },
      { title: 'Monthly/Quarterly Analysis', description: 'Regular reviews and feedback for improvement.' },
      { title: 'Profit Improvement Monitoring', description: 'Identify levers to enhance margins.' }
    ],
    content:
      '<p>We deliver accurate and timely financial reporting so you can steer the business with confidence.</p>'
  },
  'Tax Filing Services': {
    heroSection: {
      title: 'Tax Filing Services',
      description: 'Individual (1040) and business returns (1065/1120/1120S) with federal and multi-state filings.'
    },
    cards: [
      { title: 'Individual 1040', description: 'W-2, 1099 (Misc/Int/Div), 1098-B, itemized deductions, Schedule C.' },
      { title: 'Business Returns', description: '1065, 1120, 1120S preparation and filing.' },
      { title: 'Federal & State', description: 'Full support for federal and multi-state tax returns.' }
    ],
    content:
      '<p>Rely on our experienced tax team for accurate and compliant filings across states.</p>'
  }
};

async function ensureCategories() {
  const created = [];
  // Preload existing categories to avoid duplicates
  let existing = [];
  try {
    const list = await axios.get(`${API_BASE}/api/service/categories`);
    existing = Array.isArray(list.data) ? list.data : [];
  } catch {}

  for (const c of categories) {
    const already = existing.find((x) => x.name === c.name);
    if (already) {
      created.push({ name: c.name, id: already._id?.toString() || already.id });
      continue;
    }
    try {
      const res = await axios.post(`${API_BASE}/api/service/categories`, c);
      created.push({ name: c.name, id: res.data?.data?.id || res.data?.id });
  } catch {
      // Fallback: refetch and try to pick by name
      try {
        const list = await axios.get(`${API_BASE}/api/service/categories`);
        const found = (list.data || []).find((x) => x.name === c.name);
        if (found) created.push({ name: c.name, id: found._id?.toString() || found.id });
      } catch {}
    }
  }
  return created;
}

async function createServiceForCategory(cat) {
  const def = servicesByCategory[cat.name];
  if (!def) return null;
  const payload = {
    categoryId: cat.id,
    heroSection: def.heroSection,
    cardSections: [
      {
        sectionTitle: 'We Provide',
        sectionDescription: '',
        cards: def.cards.map((c) => ({ title: c.title, description: c.description }))
      }
    ],
    content: def.content,
  };
  try {
    const res = await axios.post(`${API_BASE}/api/service`, payload);
    return { category: cat.name, status: 'created', id: res.data?.data?._id };
  } catch {
    return { category: cat.name, status: 'failed', error: e?.response?.data?.error || e?.message };
  }
}

async function run() {
  const cats = await ensureCategories();
  const results = [];
  for (const c of cats) {
    const r = await createServiceForCategory(c);
    if (r) results.push(r);
    await new Promise((r) => setTimeout(r, 150));
  }
  const created = results.filter(x => x?.status === 'created').length;
  const failed = results.filter(x => x?.status === 'failed');
  console.log(`Services: created=${created}, failed=${failed.length}`);
  if (failed.length) console.log(failed);
}

run().catch((e) => {
  console.error('Seeding services failed:', e?.message || e);
  process.exit(1);
});
