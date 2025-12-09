"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function FAQPage() {
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
      <nav className="w-full bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center font-semibold">
              YD
            </div>
            <h1 className="font-semibold text-lg">Yenepoya Dental CDE Portal</h1>
          </div>

          <div className="flex gap-6 text-sm font-medium items-center">
            {!loggedIn && (
              <>
                <Link href="/courses" className="hover:text-green-700">
                  Course Catalog
                </Link>
                <Link href="/login" className="hover:text-green-700">
                  Login
                </Link>
                <Link href="/signup" className="bg-green-700 text-white px-4 py-1.5 rounded-md hover:bg-green-800 transition">
                  Sign Up
                </Link>
              </>
            )}

            {loggedIn && (
              <div className="flex items-center gap-6">

                <Link href="/courses" className="flex items-center gap-2 hover:opacity-80">
                  <Image src="/icon/catalog.png" alt="Courses" width={22} height={22} />
                  <span className="hidden sm:inline">Courses</span>
                </Link>

                <Link href="/faq" className="flex items-center gap-2 hover:opacity-80">
                  <Image src="/icon/faq.png" alt="FAQ" width={22} height={22} />
                  <span className="hidden sm:inline">FAQ</span>
                </Link>

                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80">
                  <Image src="/icon/profile.png" alt="Profile" width={22} height={22} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button onClick={handleLogout} className="flex items-center gap-2 hover:opacity-80">
                  <Image src="/icon/logout.png" alt="Logout" width={22} height={22} />
                  <span className="hidden sm:inline text-red-700">Logout</span>
                </button>

              </div>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE HEADER / BANNER */}
      <section className="bg-[#003366] text-white py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold mb-2">Online Classroom</h1>
          <p className="text-white/90 text-lg max-w-2xl">
            Access live webinars, self-paced courses, recordings, certificates, CE forms, and more.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-4xl mx-auto px-6 my-10">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <Accordion key={index} question={item.question} answer={item.answer} />
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

/* ACCORDION COMPONENT */
function Accordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border border-gray-300 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 hover:bg-gray-200"
      >
        <span className="font-medium text-gray-800">{question}</span>
        <span className="text-gray-600 text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-5 py-4 text-gray-700 whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}

/* FULL FAQ LIST (ALL QUESTIONS FROM YOUR ORIGINAL VERSION) */
const faqData = [
  {
    question: "How do I get started?",
    answer: `Click "Sign Up" → complete registration → login → update your profile → start enrolling in courses.`,
  },
  {
    question: "How do I register for a program?",
    answer: `Open Course Catalog → click a course → click "Register". If not logged in, you will be prompted to log in.`,
  },
  {
    question: "How do I join a live webinar?",
    answer: `After registering:  
Profile → Course & Payment History → Select Course → Go To Course → Get Zoom Link.`,
  },
  {
    question: "How do I access a self-study course I purchased?",
    answer: `Profile → Course & Payment History → Locate Course → Go To Course → Access recorded modules.`,
  },
  {
    question: "How do I get my CE Certificate?",
    answer: `Complete the course + quiz.  
Then: Profile → Course & Payment History → Download Certificate.`,
  },
  {
    question: "What are the technical requirements for live webinars?",
    answer:
      "Stable internet, laptop/PC, updated browser, Zoom (recommended), working audio/video.",
  },
  {
    question: "Can I watch recorded webinars later?",
    answer:
      "Yes. Recordings are uploaded within 5–14 days after live event depending on processing.",
  },
  {
    question: "I forgot my password. How do I reset it?",
    answer:
      "Go to Login → Forgot Password → enter email → check inbox for reset instructions.",
  },
  {
    question: "My name is wrong on the certificate. How to correct it?",
    answer:
      "Go to Profile → Edit Profile → Update your name → re-download the certificate.",
  },
  {
    question: "Are the CE credits recognized by the Dental Council?",
    answer:
      "Credits are institution-issued. Recognition depends on your local/state Dental Council regulations.",
  },
];
