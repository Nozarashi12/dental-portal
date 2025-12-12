'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Video, MessageSquare, FileText, Award } from 'lucide-react';

interface CourseNavbarProps {
  courseId: string;
}

export default function CourseNavbar({ courseId }: CourseNavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', path: '', icon: <Home className="w-5 h-5" /> },
    { 
      id: 'classroom', 
      label: 'Learning Modules', 
      path: 'classroom', 
      icon: <Video className="w-5 h-5" />,
      description: 'Video lectures and materials'
    },
    { id: 'discussion', label: 'Discussion', path: 'discussion', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'assessment', label: 'Assessment', path: 'assessment', icon: <FileText className="w-5 h-5" /> },
    { id: 'certificate', label: 'Certificate', path: 'certificate', icon: <Award className="w-5 h-5" /> },
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = useCallback(
    (path: string) => {
      if (path === '') return pathname === `/course/${courseId}` || pathname === `/course/${courseId}/`;
      return pathname?.includes(`/course/${courseId}/${path}`);
    },
    [pathname, courseId]
  );

  if (!mounted) return null;

  return (
    <>
      <div
        className={`left-0 right-0 z-50 transition-all duration-300 mt-6${
          isScrolled 
            ? ' bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50' 
            : ' bg-white/90 backdrop-blur-sm border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Desktop Navbar */}
            <div className="hidden lg:flex items-center space-x-1 flex-1">
              {navItems.map((item) => {
                const href = item.path === '' ? `/course/${courseId}` : `/course/${courseId}/${item.path}`;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={`group relative flex flex-col items-center py-3 px-6 transition-all duration-200 ${
                      active
                        ? 'text-emerald-700 bg-linear-to-b from-emerald-50/50 to-transparent'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                      </div>
                    </div>
                    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-emerald-500 to-emerald-600" />}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Navbar - Icons only */}
            <div className="flex lg:hidden justify-between w-full">
              {navItems.map((item) => {
                const href = item.path === '' ? `/course/${courseId}` : `/course/${courseId}/${item.path}`;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={`flex flex-col items-center justify-center p-2 transition-all ${
                      active ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-600'
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs mt-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}    </>
  );
}
