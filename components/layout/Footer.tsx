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
  const [logoUrl, setLogoUrl] = useState('https://res.cloudinary.com/dsu49fx2b/image/upload/v1762306740/logo_big1-1_dyd6xs.png');
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

  const currentYear = new Date().getFullYear();

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
  
  // Deduplicate certifications by image URL (or label) so each badge shows only once
  const getUniqueCerts = (): Certification[] => {
    const fallback: Certification[] = [
      { image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762546210/lastsave_lr47kb.gif', label: '' },
    ];
    const src = (certs && certs.length > 0 ? certs : fallback);
    const seen = new Set<string>();
    const unique: Certification[] = [];
    for (const c of src) {
      const key = (c.image?.trim().toLowerCase() || c.label?.trim().toLowerCase() || '').replace(/\s+/g, ' ');
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(c);
    }
    return unique;
  };
  return (
    <footer className="bg-[#1e1e1e] text-white py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
    {/* Top Section: Logo, Company Links, Certification (3 equal columns) */}
  <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-6 border-b border-gray-700/50 pb-10 mb-10">
          
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center space-x-2 mb-6 h-10 ">
              {isValidImageSrc(logoUrl) ? (
                <Image src={logoUrl} alt="Logo" width={144} height={32} className="h-13 w-auto" unoptimized />
              ) : (
                <span className="text-2xl font-bold text-white">Logo</span>
              )}
            </div>
            {tagline && (
              <p className="text-gray-400 text-sm max-w-xs">{tagline}</p>
            )}
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-base mb-4">Company</h4>
            <div className="flex items-start gap-8"> {/* switch to flex so columns hug with no extra space */}
              <ul className="space-y-2 flex-none"> {/* content-width column; no stretching */}
                {(links.length ? links : [
                  { label: 'Home', href: '/' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Blogs', href: '/blogs' },
                  { label: 'Contact Us', href: '/Contactus' }
                ]).slice(0,5).map((l, i) => (
                  <FooterLink key={i} href={l.href}>{l.label}</FooterLink>
                ))}
              </ul>
              <ul className="space-y-1 flex flex-col justify-start flex-none"> {/* content-width column; no stretching */}
                {(links.length > 5 ? links.slice(5) : [

                  { label: 'Services', href: '/services' },
                ]).slice(0,5).map((l, i) => (
                  <FooterLink key={i} href={l.href}>{l.label}</FooterLink>
                ))}
              </ul>
            </div>
          </div>

          {/* Certification */}
          <div>
            <h4 className="font-bold text-base mb-4">Certification:</h4>
            <div className="flex flex-nowrap items-center gap-8 mb-4 overflow-x-auto pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
              {getUniqueCerts().slice(0,3).map((b, i) => (
                isValidImageSrc(b.image || '') ? (
                  <Image
                    key={i}
                    src={b.image as string}
                    alt={b.label ? b.label : `Certification ${i+1}`}
                    width={240}
                    height={84}
                    className="h-24 w-auto object-contain"
                    unoptimized
                    quality={100}
                  />
                ) : (
                  <div key={i} className="w-28 h-10 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-300">
                    {b.label ? b.label : `Badge ${i+1}`}
                  </div>
                )
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
                <li className="text-gray-400 flex items-center gap-2">
                  <span aria-hidden><img src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673c2e6eab323a15bc059a76_flag-us-svgrepo-com.svg" alt="USA Flag" className="w-4 h-4" /></span>
                  <span className="font-semibold text-white">USA</span>
                  <span>{contactPhoneUSA}</span>
                </li>
              )}
              {contactPhoneIND && (
                <li className="text-gray-400 flex items-center gap-2">
                  <span aria-hidden><img src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673c2edf97f8bb52c7e28017_india-svgrepo-com.svg" alt="India Flag" className="w-4 h-4" /></span>
                  <span className="font-semibold text-white">IND</span>
                  <span>{contactPhoneIND}</span>
                </li>
              )}
              {contactEmail && (
                <li className="text-gray-400 flex items-center gap-2">
                  {/* Envelope icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-white/80"
                    aria-hidden
                  >
                    <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v.33l8 5.17 8-5.17V6.5a.5.5 0 0 0-.5-.5h-15Zm15 3.76-7.53 4.87a1 1 0 0 1-1.1 0L3.5 9.76V17.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V9.76Z" />
                  </svg>
                  <span className="font-semibold text-white">Email</span>
                  <Link href={`mailto:${contactEmail}`} className="hover:underline">
                    {contactEmail}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* USA Office */}
          <div>
            <h4 className="font-bold text-base mb-4"><img src='https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673c2e6eab323a15bc059a76_flag-us-svgrepo-com.svg' alt="USA Flag" className="inline-block w-4 h-4 mr-2" />   {officeUSA.title}</h4>
            <p className="text-gray-400 text-sm">
              {officeUSA.lines.map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
            </p>
          </div>

          {/* India Office */}
          <div>
            <h4 className="font-bold text-base mb-4"><img src='https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673c2edf97f8bb52c7e28017_india-svgrepo-com.svg' alt="India Flag" className="inline-block w-4 h-4 mr-2" />   {officeIND.title}</h4>
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
          <p className="text-xs mb-4 md:mb-0 flex items-center gap-2">
            <span aria-hidden className="text-sm">&copy;</span>
            <span>
              {copyrightText || `${currentYear} SB Accounting. All rights reserved.`}
            </span>
          </p>
          <div className="flex space-x-4">
            {/* Social Icons Placeholder */}
            <Link href="https://www.linkedin.com/company/sbaccounting/" className="hover:text-[var(--primary-color)] transition">
              {/* LinkedIn Icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.366-4.041-3.238-4.041 0v5.604h-3v-11h3v1.765c1.396-2.586 7.041-2.793 7.041 2.072v7.163z"/></svg>
            </Link>

           <Link
  href="https://www.facebook.com/SBGlobalAccounting/"
  className="hover:text-[var(--primary-color)] transition"
>
  {/* Facebook Icon */}
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22.675 0h-21.35C.595 0 0 .594 0 1.326v21.348C0 23.406.595 24 1.326 24h11.49v-9.294H9.692V11.01h3.124V8.414c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.588l-.467 3.696h-3.121V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .594 23.406 0 22.675 0z" />
  </svg>
</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;