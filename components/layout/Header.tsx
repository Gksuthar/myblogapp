"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import axios from "axios";

interface ServiceItem {
  _id: string;
  heroSection?: { title: string; description: string };
  slug?: string;
  categoryId: string;
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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/service/categories');
        if (response.status === 200 && response.data) {
          const cats = Array.isArray(response.data) ? response.data : [];
          setCategories(cats);
          // Set first category as active by default
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
        console.log('Services API Response:', response.data);
        
        if (response.status === 200 && response.data) {
          const result = response.data;
          // Handle different response formats
          let data: ServiceItem[] = [];
          
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (Array.isArray(result)) {
            data = result;
          }
          
          console.log('Parsed services data:', data);
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

  const CustomButton = ({ text }: { text: string }) => (
    <button className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md text-sm font-medium hover:bg-[var(--primary-color)] transition">
      {text}
    </button>
  );

  return (
    <header className=" w-full bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 relative">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image
              src="https://web.archive.org/web/20241205104115im_/https://sbaccounting.us/wp-content/uploads/2018/05/logo_big1-1.png"
              alt="Company logo"
              width={180}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {List.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => item.isDropdown && setServicesOpen(true)}
            >
              <div className="flex items-center gap-1">
                <Link
                  href={item.path}
                  className="text-gray-700 font-medium hover:text-[var(--primary-color)]"
                  onClick={(e) => {
                    if (item.isDropdown) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleServicesMenu();
                    }
                  }}
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
                    className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                  >
                    <MdExpandMore className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {/* Mega Menu - Stanfox Style */}
              {item.isDropdown && servicesOpen && (
                <div
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                  className="fixed top-18 left-7/10 -translate-x-1/2 bg-white shadow-2xl rounded-2xl border border-gray-200 z-50 overflow-hidden"
                  style={{ width: "900px", maxWidth: "90vw" }}
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
                            className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 mb-2 ${
                              activeTab === category._id
                                ? "bg-[color-mix(in srgb, var(--primary-color) 15%, white)] text-[var(--primary-color)] shadow-sm"
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
                          return filteredServices.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-gray-400">
                              No services in this category
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              {filteredServices.map((svc) => (
                            <Link
                              key={svc._id}
                              href={`/services/${
                                svc.slug ||
                                (svc.heroSection?.title || "service")
                                  .toLowerCase()
                                  .trim()
                                  .replace(/[^a-z0-9\s-]/g, "")
                                  .replace(/\s+/g, "-")
                                  .replace(/-+/g, "-")
                              }`}
                              className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-200"
                            >
                              <div className="w-10 h-10 flex items-center justify-center text-xl bg-[#e6f3ff] text-[var(--primary-color)] rounded-full flex-shrink-0 border border-[color-mix(in srgb, var(--primary-color) 40%, white)]">
                                �
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-[var(--primary-color)] transition-colors">
                                  {svc.heroSection?.title || "Untitled"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {svc.heroSection?.description || "—"}
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
          <CustomButton text="Book A Call" />
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
          <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-center gap-4 py-6 md:hidden z-50">
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
            <CustomButton text="Book A Call" />
          </div>
        )}
      </div>
    </header>
  );
}
