"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLoggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

    {/* NAVBAR */}
<nav className="w-full bg-green-700 shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

    {/* LEFT — LOGO + TITLE */}
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
        <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
          YD
        </div>
      </div>

      <h1 className="text-white font-semibold text-xl tracking-wide">
        Yenepoya Dental CDE Portal
      </h1>
    </div>

    {/* RIGHT NAV ICONS */}
    {loggedIn && (
      <div className="flex items-center gap-8">

        {/* COURSES ICON */}
        <IconWithTooltip href="/courses" icon="/icon/catalog.png" label="Courses" />

        {/* FAQ ICON */}
        <IconWithTooltip href="/faq" icon="/icon/faq.png" label="FAQ" />

        {/* PROFILE ICON */}
        <IconWithTooltip href="/profile" icon="/icon/profile.png" label="Profile" />

        {/* LOGOUT ICON */}
        <div className="relative group cursor-pointer" onClick={handleLogout}>
          <Image src="/icon/logout.png" alt="Logout" width={24} height={24} />
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-md bg-white text-black text-xs shadow-md opacity-0 group-hover:opacity-100 transition">
            Logout
          </div>
        </div>

      </div>
    )}

    {!loggedIn && (
      <div className="flex gap-6">
        <Link href="/login" className="text-white hover:opacity-80">Login</Link>
        <Link
          href="/signup"
          className="text-white bg-white/20 px-4 py-2 rounded-md hover:bg-white/30 transition"
        >
          Sign Up
        </Link>
      </div>
    )}

  </div>
</nav>


      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-14 text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-800">
          Advancing Dental Education at Yenepoya
        </h2>
        <p className="text-gray-600 max-w-2xl text-lg mx-auto">
          Explore webinars, hands-on courses, lecture series, and digital learning
          materials. Track your growth and earn Continuing Dental Education credits.
        </p>
      </section>

      {/* COURSE CATALOG ACCORDION */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-2xl font-bold mb-6">Course Catalog</h3>

        <div className="space-y-4">

          {/* Featured Programs (Opened by default) */}
          <CatalogAccordion title="Featured Programs" defaultOpen={true}>
            <FeaturedPrograms />
          </CatalogAccordion>

          {/* Other categories */}
          {[
            "Endodontics",
            "Medically Complex",
            "Oral and Maxillofacial Surgery",
            "Orthodontics",
            "Pediatric Dentistry",
            "Periodontics",
            "Public Health",
          ].map((category, index) => (
            <CatalogAccordion key={index} title={category}>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>Course 1 (placeholder)</li>
                <li>Course 2 (placeholder)</li>
                <li>Course 3 (placeholder)</li>
              </ul>
            </CatalogAccordion>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t py-6 mt-10 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Yenepoya Dental College — Continuing Dental Education
      </footer>

    </main>
  );
}

/* REUSABLE ICON + TOOLTIP BELOW */
function IconWithTooltip({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link href={href} className="relative group">
      <Image src={icon} alt={label} width={24} height={24} className="invert" />

      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-md bg-white text-black text-xs shadow-md opacity-0 group-hover:opacity-100 transition">
        {label}
      </div>
    </Link>
  );
}

/* FEATURED PROGRAMS GRID */
function FeaturedPrograms() {
  const programs = [
    {
      title: "Special Care Dentistry",
      img: "https://cde.dental.upenn.edu/Uploads/Modules/5/CPDPS%20Archived%20Webinars.jpg",
    },
    {
      title: "Global Oral Health Lecture Series",
      img: "https://cde.dental.upenn.edu/Uploads/Modules/8/DC_CIGOH%20Archived%20Webinars.jpg",
    },
    {
      title: "Clinical Excellence Interviews",
      img: "https://cde.dental.upenn.edu/Uploads/Modules/1348/DC_CIGOH%20Course%20Buttons%20(16).jpg",
    },
    {
      title: "Wellbeing for Dental Providers",
      img: "https://cde.dental.upenn.edu/Uploads/Modules/1512/DSS-%20Schmidt%20v2.jpg",
    },
    {
      title: "Implant Dentistry Programs",
      img: "https://cde.dental.upenn.edu/Uploads/Modules/1348/DC_CIGOH%20Course%20Buttons%20(16).jpg",
    },
    {
      title: "Digital Dentistry Webinars",
      img: "https://cde.dental.upenn.edu/Uploads/Modules/8/DC_CIGOH%20Archived%20Webinars.jpg",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
          <div className="relative h-40 w-full">
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 600px) 100vw, 300px"
            />
          </div>
          <div className="p-4">
            <h4 className="font-semibold text-lg">{item.title}</h4>
            <Link href="#" className="text-green-700 text-sm hover:underline">
              View Program →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ACCORDION */
function CatalogAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-gray-300 bg-white rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 bg-gray-100 hover:bg-gray-200"
      >
        <h4 className="text-lg font-medium">{title}</h4>
        <span className="text-gray-700 text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && <div className="p-5">{children}</div>}
    </div>
  );
}
