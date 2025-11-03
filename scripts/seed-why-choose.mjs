#!/usr/bin/env node
import axios from 'axios';

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

const payload = {
  title: 'Why Choose Us?',
  intro: [
    'Founded in 2014, SB Accounting is one of the leading CPA firms based in India, providing Audit, Accounting, Tax, Healthcare Management, Business Valuation, and much more to companies of all sizes across the globe. SB Accounting currently serves clients in the US and UK. SB Accounting flawlessly blends innovative business thinking, attentive personal assistance and an unyielding dedication to accuracy, quality, and timeliness.',
  ],
  benefits: [
    {
      title: 'Save Money & Reduce Overheads',
      description:
        'Businesses typically spend 2 to 5 percent of revenues to properly train and staff internal accounting departments. While it might not seem like a lot, outsourcing your accounting can actually lower your total costs by eliminating expenses related to employee benefits, training, accounting software, hardware, and office supplies.',
    },
    {
      title: 'Improve Operational Efficiency',
      description:
        'By spending less of your day overseeing bills and payroll, you’ll free up valuable time that can be redirected back into managing and growing your business. As an expert in your field, it’s critical that you use that expertise to focus on business goals, growth and managing your day-to-day operations.',
    },
    {
      title: 'Access To Expert Accounting Professionals',
      description:
        'By outsourcing you’ll have access to a team of skilled accountants having a wide range of experience in the area. This ensures that your books are always up to date, payroll is done on time and you’re not at risk of being subjected to penalties due to inaccurate paperwork and under payments.',
    },
  ],
  mission:
    'SB Accounting is driven by a mission to evince superlative and result-oriented solutions. Our mission is to help clients keep up with the financial practicality in the present while embracing a proactive approach to achieve future goals. This requires unrestricted correspondence to achieve a perception of our clients’ necessities through research and sound analysis. We are dedicated to reaching these goals with a comprehensive outsourcing solution and a proven polished methodology.',
  vision:
    'Housing the best talent resource, to have in-depth industry insight and to deliver mission-critical outsourcing solutions has always been the vision of SB Accounting. Our commitment to diligent work has earned the honor of some of the major business and financial groups. We believe this to be a direct derivative of our knowledge and responsiveness to our client base. Regardless of whether you are a current or future client, rest assured that choosing our services will get you skillful and promising advice.',
//   coreValues: [
//     'Grow meaningful relationships with clients based on exceptional services and mutual trust.',
//     'Maintain a high level of sincerity and honesty in our job.',
//     'Treat others justly and considerately and show a high regard for the honor of people.',
//     'Give back to the society where we operate and live to enrich the lives of others.',
//     'Assume accountability for our actions, services, and decisions.',
//     'Appreciate each individual’s contribution and enhance their growth and development.',
//   ],
};

async function upsert() {
  try {
    // Try update via PUT upsert
    const res = await axios.put(`${API_BASE}/api/why-choose`, payload);
    console.log('WhyChooseUs upserted:', !!res?.data?.data);
  } catch (e) {
    console.error('Failed to upsert WhyChooseUs:', e?.response?.data || e?.message);
    process.exit(1);
  }
}

upsert();
