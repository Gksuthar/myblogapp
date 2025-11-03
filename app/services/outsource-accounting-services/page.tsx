"use client";
import React, { Suspense } from "react";
import ComponentLoader from "@/components/ComponentLoader";

// Long-form service page inspired by SB Accounting's "Outsource Accounting Services"
// Lightweight, content-first layout with headings, paragraphs and bullet lists.

const Section: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
    {title && (
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
        {title}
      </h2>
    )}
    <div className="prose prose-slate max-w-none leading-relaxed text-gray-700">
      {children}
    </div>
  </section>
);

export default function OutsourceAccountingServicesPage() {
  return (
    <Suspense fallback={<ComponentLoader height="h-screen" message="Loading service..." />}> 
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <header className="border-b border-gray-100 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Outsource Accounting Services
            </h1>
            <p className="mt-4 text-gray-600 max-w-3xl">
              The frequency, volume, and complexity of financial operations are growing rapidly. 
              In this environment—of evolving regulation and technology—reliable accounting services are essential. 
              Our team helps you streamline processes, stay compliant, and get actionable insights without the overheads of in‑house staffing.
            </p>
          </div>
        </header>

        {/* Intro */}
        <Section>
          <p>
            With our outsourced model, you get an experienced accounting partner who adapts to your systems and 
            preferences, while maintaining rigorous controls and best practices. No add‑ons, no patchwork—just a 
            consistent process that scales with your business.
          </p>
          <p>
            We deliver dependable books, clear financials, and timely reports—so you can make confident decisions 
            and keep your team focused on growth.
          </p>
        </Section>

        {/* What we cover */}
        <Section title="Outsource Accounting Services">
          <p>
            Our specialists work across US GAAP and IFRS, bringing proven methodologies and strong communication. 
            Whether you’re starting fresh or modernizing an existing setup, we ensure smooth onboarding and 
            thoughtful handoffs with your internal teams or CPA.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-4">
            <li>General ledger and financial statement preparation</li>
            <li>Monthly, quarterly, and annual bookkeeping</li>
            <li>Accounts payable and receivable processing</li>
            <li>Bank and credit card reconciliations</li>
            <li>Payroll coordination and journal postings</li>
            <li>Fixed asset register and depreciation schedules</li>
            <li>Management reports and KPI dashboards</li>
            <li>Year‑end close support and schedules for auditors/CPAs</li>
          </ul>
        </Section>

        {/* Benefits */}
        <Section title="Why outsource with us?">
          <ul className="list-disc pl-6 space-y-1">
            <li>Scalable team with controls and review cycles built‑in</li>
            <li>Standard operating procedures tailored to your tools</li>
            <li>Reliable timelines and clear communication</li>
            <li>Data security and compliance at every step</li>
            <li>Lower cost of ownership vs. fully in‑house operations</li>
          </ul>
        </Section>

        {/* CTA */}
        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Ready to modernize your accounting?
              </h3>
              <p className="mt-2 text-gray-600">
                Let’s discuss your current process and map a quick, risk‑free migration plan.
              </p>
              <div className="mt-4">
                <a href="/Contactus" className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-slate-800 text-white hover:bg-slate-900">
                  Talk to an expert
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Suspense>
  );
}
