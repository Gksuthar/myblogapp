"use client";
// components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Certification = { label: string; image?: string };
type CompanyLink = { label: string; href: string };
type Address = { title: string; lines: string[] };

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link href={href} className="text-gray-400 hover:text-[var(--primary-color)] transition text-sm">
      {children}
    </Link>
  </li>
);

const isValidImageSrc = (src: string) => {
  if (!src) return false;
  if (src.startsWith('/')) return true; // local/static asset
  try {
    const u = new URL(src);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const Footer: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [links, setLinks] = useState<CompanyLink[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [associatePartner, setAssociatePartner] = useState('');
  const [contactPhoneUSA, setContactPhoneUSA] = useState('');
  const [contactPhoneIND, setContactPhoneIND] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [officeUSA, setOfficeUSA] = useState<Address>({ title: 'USA Office', lines: [] });
  const [officeIND, setOfficeIND] = useState<Address>({ title: 'India Office', lines: [] });
  const [contactNotes, setContactNotes] = useState<string[]>([]);
  const [internationalNote, setInternationalNote] = useState('');
  const [copyrightText, setCopyrightText] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/footer', { cache: 'no-store' });
        const data = await res.json();
        const d = data?.data || {};
        setLogoUrl(d.logoUrl || '');
        setTagline(d.tagline || '');
        setLinks(Array.isArray(d.companyLinks) ? d.companyLinks : []);
        setCerts(Array.isArray(d.certifications) ? d.certifications : []);
        setAssociatePartner(d.associatePartner || '');
        setContactPhoneUSA(d.contactPhoneUSA || '');
        setContactPhoneIND(d.contactPhoneIND || '');
        setContactEmail(d.contactEmail || '');
        setOfficeUSA(d.officeUSA || { title: 'USA Office', lines: [] });
        setOfficeIND(d.officeIND || { title: 'India Office', lines: [] });
  setContactNotes(Array.isArray(d.contactNotes) ? d.contactNotes : []);
  setInternationalNote(d.internationalNote || '');
        setCopyrightText(d.copyrightText || '');
      } catch {
        setCerts([]);
      }
    };
    load();
  }, []);
  return (
    <footer className="bg-[#1e1e1e] text-white py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Logo, Company Links, Certification */}
  <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-12 border-b border-gray-700/50 pb-10 mb-10">
          
          {/* Logo & Tagline (Col 1-4) */}
          <div className="md:col-span-4">
            <div className="flex items-center space-x-2 mb-4">
              {isValidImageSrc(logoUrl) ? (
                <Image src={logoUrl} alt="Logo" width={144} height={32} className="h-8 w-auto" unoptimized />
              ) : (
                <span className="text-2xl font-bold text-white">Logo</span>
              )}
            </div>
            {tagline && (
              <p className="text-gray-400 text-sm max-w-xs">{tagline}</p>
            )}
          </div>

          {/* Company Links (Col 5-7) */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-base mb-4">Company</h4>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-3">
                {(links.length ? links : [
                  { label: 'Home', href: '/' },
                  { label: 'About Us', href: '/about' },
                  { label: 'How We Work', href: '/how-we-work' },
                  { label: 'Contact Us', href: '/Contactus' }
                ]).slice(0,5).map((l, i) => (
                  <FooterLink key={i} href={l.href}>{l.label}</FooterLink>
                ))}
              </ul>
              <ul className="space-y-3">
                {(links.length > 5 ? links.slice(5) : [
                  { label: 'Blogs', href: '/blogs' },
                  { label: 'Services', href: '/services' },
                  { label: 'Privacy Policy', href: '/privacy' }
                ]).slice(0,5).map((l, i) => (
                  <FooterLink key={i} href={l.href}>{l.label}</FooterLink>
                ))}
              </ul>
            </div>
          </div>

          {/* Certification (Col 8-12) */}
          <div className="md:col-span-5">
            <h4 className="font-bold text-base mb-4">Certification</h4>
            <div className="flex space-x-3 mb-4">
              {(certs.length ? certs : [{label:'Badge 1'}, {label:'Badge 2'}, {label:'Badge 3'}]).slice(0,3).map((b, i) => (
                <div key={i} className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-300">
                  {b.label || `Badge ${i+1}`}
                </div>
              ))}
            </div>
            {associatePartner && (
              <>
                <h4 className="font-bold text-base mb-2">Associate Partner:</h4>
                <div className="text-3xl font-extrabold tracking-widest text-white/90">{associatePartner}</div>
              </>
            )}
          </div>
        </div>

        {/* Middle Section removed per request (Business Owners & Accounting/CPA Firms) */}
        
        {/* Bottom Section: Contact & Addresses */}
  <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-10 mb-10">
          
          {/* Contact Information */}
          <div>
            <h4 className="font-bold text-base mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              {contactPhoneUSA && (
                <li className="text-gray-400">
                  <span className="font-semibold text-white">USA </span>{contactPhoneUSA}
                </li>
              )}
              {contactPhoneIND && (
                <li className="text-gray-400">
                  <span className="font-semibold text-white">IND </span>{contactPhoneIND}
                </li>
              )}
              {contactEmail && (
                <li className="text-gray-400">
                  <span className="font-semibold text-white">Email </span>
                  <Link href={`mailto:${contactEmail}`} className="hover:underline">
                    {contactEmail}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* USA Office */}
          <div>
            <h4 className="font-bold text-base mb-4">🇺🇸 {officeUSA.title}</h4>
            <p className="text-gray-400 text-sm">
              {officeUSA.lines.map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
            </p>
          </div>

          {/* India Office */}
          <div>
            <h4 className="font-bold text-base mb-4">🇮🇳 {officeIND.title}</h4>
            <p className="text-gray-400 text-sm">
              {officeIND.lines.map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
            </p>
          </div>

   
        </div>

        {/* Contact Notes */}
        {(contactNotes.length > 0 || internationalNote) && (
          <div className="mb-8 text-sm text-gray-400 space-y-3">
            {contactNotes.filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {internationalNote && (
              <p className="font-medium text-white/80">{internationalNote}</p>
            )}
          </div>
        )}

        {/* Footer Bar: Copyright and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-700/50">
          <p className="text-gray-500 text-xs mb-4 md:mb-0">
            {copyrightText || '© 2025. All rights reserved.'}
          </p>
          <div className="flex space-x-4">
            {/* Social Icons Placeholder */}
            <Link href="#" className="text-gray-500 hover:text-[var(--primary-color)] transition">
              {/* LinkedIn Icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.366-4.041-3.238-4.041 0v5.604h-3v-11h3v1.765c1.396-2.586 7.041-2.793 7.041 2.072v7.163z"/></svg>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-[var(--primary-color)] transition">
              {/* Instagram Icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.275.148 4.772 1.637 4.909 4.909.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.147 3.276-1.636 4.773-4.909 4.91-.976.058-1.357.07-4.85.07s-3.584-.012-4.85-.07c-3.275-.148-4.772-1.637-4.909-4.909-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.276 1.637-4.773 4.909-4.91 1.1-.057 1.35-.07 3.522-.07h.046zm0 2.242c-3.181 0-3.578.012-4.721.069-2.923.132-3.951 1.157-4.08 4.08-.058 1.144-.069 1.542-.069 4.722s.012 3.578.069 4.721c.129 2.923 1.157 3.951 4.08 4.08.76.035 1.05.042 2.37.042s1.61-.007 2.37-.042c2.923-.129 3.951-1.157 4.08-4.08.057-1.143.069-1.542.069-4.721s-.012-3.578-.069-4.721c-.129-2.923-1.157-3.951-4.08-4.08-1.143-.057-1.542-.069-4.721-.069zm0 5.86c-2.063 0-3.737 1.674-3.737 3.737s1.674 3.737 3.737 3.737 3.737-1.674 3.737-3.737-1.674-3.737-3.737-3.737zm0 6.242c-1.385 0-2.505-1.12-2.505-2.505s1.12-2.505 2.505-2.505 2.505 1.12 2.505 2.505-1.12 2.505-2.505 2.505zm4.845-8.527c.483 0 .874.391.874.874s-.391.874-.874.874-.874-.391-.874-.874.391-.874.874-.874z"/></svg>
            </Link>
             <Link href="#" className="text-gray-500 hover:text-[var(--primary-color)] transition">
              {/* Other social icon (e.g., X / Twitter) */}
              <span className="w-5 h-5 text-lg">X</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;