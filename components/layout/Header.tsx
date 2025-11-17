"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaFileInvoiceDollar, FaChartLine, FaBook, FaCalculator, FaTools } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import axios from "axios";

interface ServiceItem {
  _id: string;
  heroSection?: { title: string; description: string };
  slug?: string;
  categoryId: string;
  serviceCardView: { title: string; description: string }
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

// --- Header Component ---
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);

  // Toggle Services mega menu
  const toggleServicesMenu = () => setServicesOpen((prev: boolean) => !prev);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/service/categories');
        if (response.status === 200 && response.data) {
          let cats = Array.isArray(response.data) ? response.data : [];
          // Ensure categories are shown oldest-first (createdAt ascending)
          cats = cats.slice().sort((a, b) => {
            const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
            return ta - tb;
          });
          setCategories(cats);
          // Set first category (oldest) as active by default
          if (cats.length > 0) {
            setActiveTab(cats[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const response = await axios.get('/api/service');
        // console.log('Services API Response:', response.data[0]?.serviceCardView);

        if (response.status === 200 && response.data) {
          const result = response.data;
          // Handle different response formats
          let data: ServiceItem[] = [];

          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (Array.isArray(result)) {
            data = result;
          }

          console.log('Parsed services data:', data[0].serviceCardView);
          setServices(data);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const List = [
    { id: "1", link: "Home", path: "/" },
    { id: "2", link: "About Us", path: "/about" },
    { id: "3", link: "Services", path: "/services", isDropdown: true },
    { id: "4", link: "Blogs", path: "/blogs" },
    { id: "5", link: "Contact Us", path: "/Contactus" },
  ];

  // const CustomButton = ({ text }: { text: string }) => (
  //   <button className="px-5 py-2.5 bg-[var(--primary-color)] text-[var(--primary-color-contrast)] rounded-full text-sm font-semibold shadow-[0_4px_14px_rgba(53,154,255,0.25)] hover:shadow-[0_6px_18px_rgba(53,154,255,0.35)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]">
  //     {text}
  //   </button>
  // );

  const renderServiceIcon = (title?: string) => {
    const t = (title || '').toLowerCase();
    if (t.includes('tax')) return <FaFileInvoiceDollar className="text-xl" />;
    if (t.includes('payroll')) return <FaChartLine className="text-xl" />;
    if (t.includes('report') || t.includes('financial')) return <FaChartLine className="text-xl" />;
    if (t.includes('bookkeep')) return <FaBook className="text-xl" />;
    if (t.includes('account') || t.includes('outsourc')) return <FaCalculator className="text-xl" />;
    if (t.includes('consult') || t.includes('advis')) return <FaTools className="text-xl" />;
    return <FaCalculator className="text-xl" />;
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 relative">
        {/* Logo and Site Name */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/favicon.png"
              alt="Company logo"
              width={225}
              height={60}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
            {/* Site name - visible on small and larger screens */}
            {/* <span className="hidden sm:inline-block text-lg md:text-xl font-extrabold text-gray-800">SB Accounting</span> */}
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-4">
          {List.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => {
                if (item.isDropdown) {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setServicesOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (item.isDropdown) {
                  closeTimer.current = setTimeout(() => setServicesOpen(false), 200);
                }
              }}
            // Close on mouse leave
            >
              <div className="flex items-center gap-1">
                <Link
                  href={item.path}
                  className="text-[15px] text-gray-700 font-medium px-3 py-2 rounded-full hover:bg-gray-100 hover:text-[var(--primary-color)] transition-colors"
                >
                  {item.link}
                </Link>
                {item.isDropdown && (
                  <button
                    type="button"
                    aria-label="Toggle services menu"
                    aria-expanded={servicesOpen}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleServicesMenu();
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                  >
                    <MdExpandMore className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {/* Mega Menu - SB Accounting Style */}
              {item.isDropdown && servicesOpen && (
                <div
                  onMouseEnter={() => {
                    if (closeTimer.current) clearTimeout(closeTimer.current);
                    setServicesOpen(true);
                  }}
                  onMouseLeave={() => {
                    closeTimer.current = setTimeout(() => setServicesOpen(false), 200);
                  }}

                  className="fixed top-20 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-2xl border border-gray-200 z-50 overflow-hidden"
                  style={{ width: "940px", maxWidth: "92vw" }}
                >
                  <div className="flex">
                    {/* Left Sidebar - Category Tabs */}
                    <div className="w-1/4 bg-gray-50 p-6 border-r border-gray-200">
                      {categories.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No categories
                        </div>
                      ) : (
                        categories.map((category: Category) => (
                          <button
                            key={category._id}
                            onClick={() => setActiveTab(category._id)}
                            className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 mb-2 ${activeTab === category._id
                                ? "bg-[color-mix(in_srgb,var(--primary-color)_16%,white)] text-[var(--primary-color)] shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                              }`}
                          >
                            {category.name}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Right Content - Services Grid */}
                    <div className="w-3/4 p-6">
                      {loadingServices ? (
                        <div className="flex justify-center items-center h-full text-gray-500">
                          Loading services...
                        </div>
                      ) : (() => {
                        const filteredServices = services.filter((svc: ServiceItem) => svc.categoryId === activeTab);
                        console.log("filteredServices", filteredServices)
                        return filteredServices.length === 0 ? (
                          <div className="flex justify-center items-center h-full text-gray-400">
                            No services in this category
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {filteredServices.map((svc) => (
                              <Link
                                key={svc._id}
                                href={`/services/${svc.slug ||
                                  (svc.heroSection?.title || svc.categoryId)
                                    .toLowerCase()
                                    .trim()
                                    .replace(/[^a-z0-9\s-]/g, "")
                                    .replace(/\s+/g, "-")
                                    .replace(/-+/g, "-")
                                  }`}
                                className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-200"
                              >
                                <div className="w-10 h-10 flex items-center justify-center text-xl bg-[#e6f3ff] text-[var(--primary-color)] rounded-full flex-shrink-0 border border-[color-mix(in_srgb,var(--primary-color)_40%,white)]">
                                  {renderServiceIcon(svc.heroSection?.title)}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[var(--primary-color)] transition-colors">
                                    {svc.heroSection?.title || svc.serviceCardView?.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {svc.heroSection?.description || svc.serviceCardView?.title}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}
          {/* Phone number (click-to-call) and Book A Call (calls the number) */}
          <div className="flex items-center gap-3 ml-2">
            <a
              href="tel:+13134258280"
              className="text-[15px] text-gray-700 font-medium hover:text-[var(--primary-color)] transition-colors"
            >
              {/* (313) 425 8280 */}
            </a>

            <a
              href="tel:+13134258280"
              className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 bg-[var(--primary-color)] text-[var(--primary-color-contrast)]"
            >
              Book A Call
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur shadow-lg border-b border-gray-100 flex flex-col items-center gap-4 py-6 md:hidden z-50">
            {List.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="text-gray-700 hover:text-[var(--primary-color)] text-lg font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.link}
              </Link>
            ))}
            {/* Mobile: call the number and close the menu */}
            <a
              href="tel:+13134258280"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 bg-[var(--primary-color)] text-[var(--primary-color-contrast)]"
            >
              Book A Call
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
