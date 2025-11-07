#!/usr/bin/env node
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/BlogApp';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define Schemas
const HeroSchema = new mongoose.Schema({
  title: String,
  disc: String,
  image: String,
  buttonText: String,
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
}, { timestamps: true });

const ServiceSchema = new mongoose.Schema({
  categoryId: String,
  heroSection: {
    image: String,
    title: String,
    description: String,
  },
  slug: String,
  cardSections: [{
    sectionTitle: String,
    sectionDescription: String,
    cards: [{
      title: String,
      description: String,
    }],
  }],
  content: String,
}, { timestamps: true });

const TrustedCompanySchema = new mongoose.Schema({
  name: String,
  image: String,
}, { timestamps: true });

const TeamSchema = new mongoose.Schema({
  name: String,
  position: String,
  image: String,
  bio: String,
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  image: String,
  author: String,
  published: Boolean,
}, { timestamps: true });

const CaseStudySchema = new mongoose.Schema({
  title: String,
  content: String,
  client: String,
  industry: String,
}, { timestamps: true });

// Models
const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const TrustedCompany = mongoose.models.TructedCompany || mongoose.model('TructedCompany', TrustedCompanySchema);
const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);

// Professional Data
const professionalData = {
  hero: {
    title: "Your Trusted Partner in Professional Accounting & Bookkeeping Services",
    disc: "Maximize Efficiency, Minimize Costs - Your Trusted Outsourcing Accounting Services. We provide comprehensive accounting, bookkeeping, and financial services tailored to meet your business needs.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    buttonText: "Get Started Today"
  },

  categories: [
    {
      name: "Business Owners",
      description: "Comprehensive accounting and bookkeeping solutions designed specifically for business owners and entrepreneurs."
    },
    {
      name: "Valuation Services",
      description: "Professional business valuation and financial assessment services for strategic decision-making."
    },
    {
      name: "Advisory Services",
      description: "Expert financial advisory and consulting services to help your business grow and succeed."
    }
  ],

  services: [
    // Business Owners Services
    {
      categoryName: "Business Owners",
      title: "Accounting Outsourcing Services",
      description: "CPA's Go-to firm for all accounting needs. Comprehensive outsourcing solutions for your financial operations.",
      slug: "accounting-outsourcing-services",
      content: `<h2>Professional Accounting Outsourcing Services</h2>
<p>Partner with us for complete accounting outsourcing solutions that streamline your financial operations and reduce costs.</p>
<h3>Our Services Include:</h3>
<ul>
<li>Monthly financial reporting and analysis</li>
<li>Accounts payable and receivable management</li>
<li>Bank reconciliation and cash flow management</li>
<li>Financial statement preparation</li>
<li>General ledger maintenance</li>
</ul>`,
      cards: [
        { title: "Cost Savings", description: "Reduce overhead costs by up to 60% with our outsourcing solutions" },
        { title: "Expert Team", description: "Access to certified accountants and bookkeepers with years of experience" },
        { title: "Scalable Solutions", description: "Flexible services that grow with your business needs" },
      ]
    },
    {
      categoryName: "Business Owners",
      // title: "Bookkeeping Services",
      description: "Expert and reliable bookkeeping at your service. Accurate financial records for informed business decisions.",
      slug: "bookkeeping-services",
      content: `<h2>Professional Bookkeeping Services</h2>
<p>Keep your financial records accurate and up-to-date with our comprehensive bookkeeping services.</p>
<h3>What We Offer:</h3>
<ul>
<li>Daily transaction recording</li>
<li>Invoice and bill management</li>
<li>Expense tracking and categorization</li>
<li>Monthly reconciliation</li>
<li>Financial reports generation</li>
</ul>`,
      cards: [
        { title: "Accuracy", description: "99.9% accuracy in all bookkeeping tasks" },
        { title: "Timeliness", description: "Real-time updates and monthly closing within 5 business days" },
        { title: "Compliance", description: "Ensure full compliance with accounting standards" },
      ]
    },
    {
      categoryName: "Business Owners",
      title: "Payroll Management",
      description: "Streamline your CPA's payroll processes. Comprehensive payroll solutions for businesses of all sizes.",
      slug: "payroll-management",
      content: `<h2>Complete Payroll Management Solutions</h2>
<p>Simplify your payroll process with our end-to-end payroll management services.</p>
<h3>Services Include:</h3>
<ul>
<li>Payroll processing and calculations</li>
<li>Tax filing and compliance</li>
<li>Direct deposit setup</li>
<li>Pay stub generation</li>
<li>Year-end tax forms (W-2, 1099)</li>
</ul>`,
      cards: [
        { title: "Compliance", description: "Stay compliant with all federal and state payroll regulations" },
        { title: "Efficiency", description: "Process payroll in hours, not days" },
        { title: "Security", description: "Bank-level security for all payroll data" },
      ]
    },
    // Valuation Services
    {
      categoryName: "Valuation Services",
      title: "Business Valuation Consulting",
      description: "Expert assessment for M&A and regulatory needs. Professional business valuation services.",
      slug: "business-valuation-consulting",
      content: `<h2>Professional Business Valuation Services</h2>
<p>Get accurate business valuations for mergers, acquisitions, litigation, or strategic planning.</p>
<h3>Our Expertise:</h3>
<ul>
<li>Market approach valuation</li>
<li>Income approach analysis</li>
<li>Asset-based valuation</li>
<li>Fairness opinions</li>
<li>Purchase price allocations</li>
</ul>`,
      cards: [
        { title: "Certified Experts", description: "CVA and ABV certified valuation professionals" },
        { title: "Comprehensive Reports", description: "Detailed valuation reports meeting all standards" },
        { title: "Industry Expertise", description: "Experience across multiple industries" },
      ]
    },
    {
      categoryName: "Valuation Services",
      title: "Due Diligence Support",
      description: "Thorough financial investigation for acquisitions. Comprehensive due diligence services.",
      slug: "due-diligence-support",
      content: `<h2>Due Diligence Support Services</h2>
<p>Minimize risk in acquisitions with our thorough due diligence support.</p>
<h3>Services Include:</h3>
<ul>
<li>Financial statement analysis</li>
<li>Quality of earnings reports</li>
<li>Working capital analysis</li>
<li>Tax due diligence</li>
<li>Operational review</li>
</ul>`,
      cards: [
        { title: "Risk Mitigation", description: "Identify potential risks before closing" },
        { title: "Fast Turnaround", description: "Complete due diligence in 2-4 weeks" },
        { title: "Actionable Insights", description: "Clear recommendations for decision-making" },
      ]
    },
    // Advisory Services
    {
      categoryName: "Advisory Services",
      title: "Virtual CFO Services",
      description: "Reliable Virtual CFO Solutions. Strategic financial leadership for growing businesses.",
      slug: "virtual-cfo-services",
      content: `<h2>Virtual CFO Services</h2>
<p>Get C-level financial expertise without the full-time cost with our Virtual CFO services.</p>
<h3>What We Provide:</h3>
<ul>
<li>Strategic financial planning</li>
<li>Cash flow management</li>
<li>Financial forecasting and budgeting</li>
<li>Board presentation preparation</li>
<li>Fundraising support</li>
</ul>`,
      cards: [
        { title: "Executive Experience", description: "20+ years average CFO experience" },
        { title: "Cost-Effective", description: "70% less cost than full-time CFO" },
        { title: "Strategic Growth", description: "Drive business growth with financial strategy" },
      ]
    },
    {
      categoryName: "Advisory Services",
      title: "Financial Planning & Analysis",
      description: "Drive profitability and make data-backed decisions. Comprehensive FP&A services.",
      slug: "financial-planning-analysis",
      content: `<h2>Financial Planning & Analysis Services</h2>
<p>Make informed business decisions with our comprehensive financial planning and analysis services.</p>
<h3>Our Services:</h3>
<ul>
<li>Budget preparation and monitoring</li>
<li>Variance analysis</li>
<li>Financial forecasting</li>
<li>KPI dashboard development</li>
<li>Scenario modeling</li>
</ul>`,
      cards: [
        { title: "Data-Driven", description: "Insights based on comprehensive financial analysis" },
        { title: "Predictive Modeling", description: "Forecast future performance accurately" },
        { title: "Custom Dashboards", description: "Real-time visibility into key metrics" },
      ]
    },
  ],

  trustedCompanies: [
    { name: "Aykin CPA", image: "https://placehold.co/180x70/1e40af/white?text=Aykin+CPA&font=roboto" },
    { name: "Reeder CPA Group", image: "https://placehold.co/180x70/7c3aed/white?text=Reeder+CPA&font=roboto" },
    { name: "David Oase CPA", image: "https://placehold.co/180x70/0891b2/white?text=David+Oase&font=roboto" },
    { name: "Legion Tax", image: "https://placehold.co/180x70/ea580c/white?text=Legion+Tax&font=roboto" },
    { name: "Unboxed Advisors", image: "https://placehold.co/180x70/16a34a/white?text=Unboxed&font=roboto" },
    { name: "Agranda CPA", image: "https://placehold.co/180x70/dc2626/white?text=Agranda&font=roboto" },
  ],

  team: [
    {
      name: "Raj Sharma",
      position: "Senior Accountant",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
      bio: "Certified Public Accountant with 15+ years of experience in financial reporting and tax compliance."
    },
    {
      name: "Shiv Panchal",
      position: "Auditee",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300",
      bio: "Experienced audit professional specializing in internal controls and compliance auditing."
    },
    {
      name: "Kajol Shah",
      position: "Bookkeeper",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
      bio: "Detail-oriented bookkeeper with expertise in QuickBooks and financial reconciliation."
    },
    {
      name: "Pinky Mehta",
      position: "Fractional CFO",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300",
      bio: "Strategic financial leader with 20+ years helping businesses scale and grow profitably."
    },
  ],

  blogs: [
    {
      title: "Top 10 Accounting Mistakes Small Businesses Make",
      slug: "top-10-accounting-mistakes-small-businesses-make",
      excerpt: "Avoid these common accounting pitfalls that can cost your business thousands. Learn from experts.",
      content: `<h2>Top 10 Accounting Mistakes Small Businesses Make</h2>
<p>Small businesses often make critical accounting mistakes that can lead to financial losses, compliance issues, and missed opportunities. Here are the top 10 mistakes and how to avoid them.</p>
<h3>1. Mixing Personal and Business Finances</h3>
<p>One of the most common mistakes is not separating personal and business expenses. This can lead to tax complications and inaccurate financial reporting.</p>
<h3>2. Not Keeping Proper Records</h3>
<p>Failing to maintain organized financial records can result in missed deductions and audit issues.</p>
<h3>3. Ignoring Reconciliation</h3>
<p>Regular bank reconciliation is crucial for catching errors and preventing fraud.</p>
<h3>Conclusion</h3>
<p>By avoiding these mistakes and working with professional accountants, you can ensure your business stays financially healthy.</p>`,
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
      author: "Sbaccounting Team",
      published: true
    },
    {
      title: "How to Choose the Right Accounting Software for Your Business",
      slug: "choose-right-accounting-software-business",
      excerpt: "A comprehensive guide to selecting accounting software that fits your business needs and budget.",
      content: `<h2>How to Choose the Right Accounting Software</h2>
<p>Selecting the right accounting software is a critical decision for any business. Here's what you need to consider.</p>
<h3>Key Features to Look For</h3>
<ul>
<li>Invoicing and billing capabilities</li>
<li>Expense tracking</li>
<li>Financial reporting</li>
<li>Integration with banks</li>
<li>Multi-user access</li>
</ul>
<h3>Popular Options</h3>
<p>QuickBooks, Xero, and FreshBooks are among the most popular choices for small businesses.</p>`,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      author: "Sbaccounting Team",
      published: true
    },
    {
      title: "Year-End Tax Planning Strategies for 2025",
      slug: "year-end-tax-planning-strategies-2025",
      excerpt: "Maximize your tax savings with these proven year-end tax planning strategies for businesses.",
      content: `<h2>Year-End Tax Planning Strategies</h2>
<p>As the year comes to a close, it's time to implement tax-saving strategies that can reduce your tax liability.</p>
<h3>Strategies to Consider</h3>
<ul>
<li>Accelerate deductible expenses</li>
<li>Defer income to next year</li>
<li>Maximize retirement contributions</li>
<li>Review depreciation opportunities</li>
<li>Evaluate tax credits</li>
</ul>
<p>Consult with a tax professional to implement these strategies effectively.</p>`,
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
      author: "Sbaccounting Team",
      published: true
    },
  ],

  caseStudies: [
    {
      title: "How We Helped a Retail Business Reduce Costs by 45%",
      content: "A mid-sized retail company was struggling with high accounting costs and inefficient processes. We implemented automated bookkeeping systems and streamlined their financial operations, resulting in a 45% reduction in accounting costs while improving accuracy by 30%.",
      client: "Retail Plus Inc.",
      industry: "Retail"
    },
    {
      title: "Successful E-commerce Financial Transformation",
      content: "An e-commerce startup needed scalable financial systems to support rapid growth. We implemented cloud-based accounting solutions, established proper financial controls, and provided virtual CFO services. The result was improved cash flow management and successful Series A fundraising of $5M.",
      client: "ShopNow Online",
      industry: "E-commerce"
    },
    {
      title: "Manufacturing Company's Compliance Success Story",
      content: "A manufacturing company facing compliance issues and audit challenges partnered with us for comprehensive accounting services. We restructured their financial processes, implemented proper controls, and successfully resolved all compliance issues, resulting in a clean audit for 3 consecutive years.",
      client: "TechMfg Solutions",
      industry: "Manufacturing"
    },
  ],
};

// Seed Function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Hero.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await TrustedCompany.deleteMany({});
    await Team.deleteMany({});
    await Blog.deleteMany({});
    await CaseStudy.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Seed Hero
    console.log('📝 Seeding hero section...');
    await Hero.create(professionalData.hero);
    console.log('✅ Hero section seeded\n');

    // Seed Categories and get IDs
    console.log('📝 Seeding categories...');
    const categories = await Category.insertMany(professionalData.categories);
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id.toString();
    });
    console.log('✅ Categories seeded\n');

    // Seed Services with category IDs
    console.log('📝 Seeding services...');
    const servicesWithCategories = professionalData.services.map(service => ({
      categoryId: categoryMap[service.categoryName],
      heroSection: {
        image: service.image || '',
        title: service.title,
        description: service.description,
      },
      slug: service.slug,
      cardSections: [{
        sectionTitle: 'Why Choose Us',
        sectionDescription: 'Here\'s why businesses trust us with their ' + service.title.toLowerCase(),
        cards: service.cards
      }],
      content: service.content,
    }));
    await Service.insertMany(servicesWithCategories);
    console.log('✅ Services seeded\n');

    // Seed Trusted Companies
    console.log('📝 Seeding trusted companies...');
    await TrustedCompany.insertMany(professionalData.trustedCompanies);
    console.log('✅ Trusted companies seeded\n');

    // Seed Team
    console.log('📝 Seeding team members...');
    await Team.insertMany(professionalData.team);
    console.log('✅ Team members seeded\n');

    // Seed Blogs
    console.log('📝 Seeding blogs...');
    await Blog.insertMany(professionalData.blogs);
    console.log('✅ Blogs seeded\n');

    // Seed Case Studies
    console.log('📝 Seeding case studies...');
    await CaseStudy.insertMany(professionalData.caseStudies);
    console.log('✅ Case studies seeded\n');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Hero: 1 entry`);
    console.log(`   - Categories: ${professionalData.categories.length} entries`);
    console.log(`   - Services: ${professionalData.services.length} entries`);
    console.log(`   - Trusted Companies: ${professionalData.trustedCompanies.length} entries`);
    console.log(`   - Team Members: ${professionalData.team.length} entries`);
    console.log(`   - Blogs: ${professionalData.blogs.length} entries`);
    console.log(`   - Case Studies: ${professionalData.caseStudies.length} entries`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeder
(async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('\n✅ All done! You can now close this process.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
})();
