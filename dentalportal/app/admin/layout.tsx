'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, User, BookOpen, FileText, Users, School, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/admin";
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Client mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Login check
  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [mounted]);

  // Scroll effect
  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Close mobile menu on route change
  useEffect(() => {
    if (!mounted) return;
    setIsMobileMenuOpen(false);
  }, [pathname, mounted]);

  // Click outside to close mobile menu
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, mounted]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  // Admin navigation items
  const adminNavItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Courses', href: '/admin/courses', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Classrooms', href: '/admin/classrooms', icon: <School className="w-4 h-4" /> },
    { label: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Profile', href: '/admin/profile', icon: <User className="w-4 h-4" /> },
    { label: 'certificates', href: '/admin/certificates', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar - Same style as provided example */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300
          ${isScrolled ? 'shadow-md py-3' : 'py-4'}
          border-b border-gray-100
        `}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <div className="relative w-16 h-16 md:w-32 md:h-20">
                <Image
                  src="/images/yenepoya_logo.png"
                  alt="Yenepoya Dental College Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 64px, 80px"
                />
              </div>
              <div className="hidden md:block w-px h-8 bg-gray-300"></div>
              <div className="hidden md:block">
                <h1 className="text-base font-semibold text-gray-900 leading-tight">Yenepoya Dental</h1>
                <p className="text-xs text-emerald-700 font-medium">Admin Panel</p>
              </div>
            </Link>

            {/* Desktop Navigation - Admin Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium text-sm
                    transition-all duration-200 hover:bg-emerald-50
                    ${pathname === item.href ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:text-emerald-700'}
                  `}
                >
                  <span className={pathname === item.href ? 'text-emerald-600' : 'text-gray-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Logout Button */}
              <div className="ml-4 pl-4 border-l border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20"></div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`
          lg:hidden fixed inset-y-0 right-0 z-40 bg-white w-full max-w-xs
          transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          shadow-xl
        `}
      >
        <div className="h-full flex flex-col">
          {/* Mobile header */}
          <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
            <div className="relative w-14 h-14">
              <Image src="/images/yenepoya_logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Yenepoya Dental</h2>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </div>

          {/* Mobile nav items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  pathname === item.href ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${pathname === item.href ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full p-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Page Content */}
      <main className="p-8">{children}</main>
    </div>
  );
}