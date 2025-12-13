'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { 
  HelpCircle,
  BookOpen,
  Video,
  Award,
  User,
  Settings,
  Mail,
  Lock,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react'

type FAQCategory = 'all' | 'courses' | 'webinars' | 'certificates' | 'account' | 'technical'

interface FAQItem {
  question: string
  answer: string
  category: FAQCategory[]
}

export default function FAQPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all')
  const [filteredFAQ, setFilteredFAQ] = useState<FAQItem[]>(faqData)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true"
    setLoggedIn(isLoggedIn)
  }, [])

  // Filter FAQ based on category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredFAQ(faqData)
    } else {
      const filtered = faqData.filter(item => 
        item.category.includes(activeCategory)
      )
      setFilteredFAQ(filtered)
    }
  }, [activeCategory])

  const clearFilters = () => {
    setActiveCategory('all')
  }

  const getCategoryStats = () => {
    const stats = {
      all: faqData.length,
      courses: faqData.filter(item => item.category.includes('courses')).length,
      webinars: faqData.filter(item => item.category.includes('webinars')).length,
      certificates: faqData.filter(item => item.category.includes('certificates')).length,
      account: faqData.filter(item => item.category.includes('account')).length,
      technical: faqData.filter(item => item.category.includes('technical')).length,
    }
    return stats
  }

  const categoryStats = getCategoryStats()

  return (
    <>
      <Navbar />
      
      {/* Added overflow-x-hidden to main container */}
      <main className="min-h-screen bg-linear-to-b from-gray-50 to-white overflow-x-hidden">
        
        {/* Hero Banner - Added max-w-full */}
        <section className="relative bg-lin-to-br from-emerald-50 via-white to-emerald-50/30 border-b border-emerald-100 w-full">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-lin(circle_at_1px_1px,rgba(16,185,129,0.1)_1px,transparent_0)] bg-size-[40px_40px]" />
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          {/* Added max-w-full to container */}
          <div className="relative container mx-auto px-4 lg:px-8 py-16 max-w-full">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 text-sm font-medium mb-6 shadow-sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 px-4">
                Frequently Asked
                <span className="block text-transparent bg-clip-text bg-lin-to-r from-emerald-600 to-emerald-800 mt-2">
                  Questions
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
                Find quick answers to common questions about courses, certificates, 
                technical requirements, and account management.
              </p>
              
              {/* Quick Stats - Added overflow-x-auto for mobile */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto px-4">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
                  <div className="text-lg font-bold text-gray-900">{categoryStats.all}</div>
                  <div className="text-xs text-gray-600 font-medium">Total Questions</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
                  <div className="text-lg font-bold text-gray-900">{categoryStats.courses}</div>
                  <div className="text-xs text-gray-600 font-medium">Course Related</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
                  <div className="text-lg font-bold text-gray-900">{categoryStats.certificates}</div>
                  <div className="text-xs text-gray-600 font-medium">Certificate Related</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
                  <div className="text-lg font-bold text-gray-900">{categoryStats.technical}</div>
                  <div className="text-xs text-gray-600 font-medium">Technical Issues</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories - Added max-w-full */}
        <section className="py-12 bg-lin-to-b from-white via-gray-50/30 to-white w-full">
          <div className="container mx-auto px-4 lg:px-8 max-w-full">
            <div className="max-w-6xl mx-auto">
              
              {/* Active Filters Bar */}
              {activeCategory !== 'all' && (
                <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200 mx-4 lg:mx-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">Active filter:</span>
                    </div>
                    
                    <button
                      onClick={() => setActiveCategory('all')}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm hover:bg-emerald-200 transition-colors"
                    >
                      {getCategoryLabel(activeCategory)}
                      <span className="ml-2 text-emerald-600">✕</span>
                    </button>
                    
                    <button
                      onClick={clearFilters}
                      className="ml-auto text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                    >
                      Clear filter
                    </button>
                  </div>
                </div>
              )}
              
              {/* Category Tabs - Added overflow-x-auto and max-w-full for mobile */}
              <div className="flex flex-wrap gap-2 mb-10 justify-center px-4 lg:px-0 max-w-full overflow-x-auto lg:overflow-visible">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 shrink-0 ${
                    activeCategory === 'all'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Topics
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeCategory === 'all' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {categoryStats.all}
                  </span>
                </button>
                
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 shrink-0 ${
                      activeCategory === tab.id
                        ? tab.activeClasses
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeCategory === tab.id ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {categoryStats[tab.id]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between px-4 lg:px-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  {filteredFAQ.length} {filteredFAQ.length === 1 ? 'question' : 'questions'} found
                  {activeCategory !== 'all' && ` in ${getCategoryLabel(activeCategory)}`}
                </h3>
                
                {filteredFAQ.length === 0 && activeCategory !== 'all' && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                  >
                    Show all questions
                  </button>
                )}
              </div>

              {/* FAQ Grid - Added max-w-full */}
              <div className="space-y-4 px-4 lg:px-0 max-w-full">
                {filteredFAQ.length > 0 ? (
                  filteredFAQ.map((item, index) => (
                    <Accordion 
                      key={index} 
                      question={item.question} 
                      answer={item.answer} 
                      index={index} 
                      categories={item.category}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <HelpCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No questions found
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      No questions available in this category.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      View All Questions
                    </button>
                  </div>
                )}
              </div>

              {/* Still Need Help? - Added max-w-full */}
              <div className="mt-16 p-8 bg-lin-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 text-center mx-4 lg:mx-0 max-w-full">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <HelpCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Still need help?
                </h3>
                <p className="text-gray-600 max-w-lg mx-auto mb-6">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:support@yenepoyadental.edu" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors group"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                    <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Contact Form
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

/* ACCORDION COMPONENT */
function Accordion({ 
  question, 
  answer, 
  index,
  categories 
}: { 
  question: string
  answer: string
  index: number
  categories: FAQCategory[]
}) {
  const [open, setOpen] = useState(false)

  // Get icon based on first category
  const getIcon = () => {
    if (categories.includes('certificates')) return <Award className="w-5 h-5" />
    if (categories.includes('account')) return <User className="w-5 h-5" />
    if (categories.includes('webinars')) return <Video className="w-5 h-5" />
    if (categories.includes('courses')) return <BookOpen className="w-5 h-5" />
    if (categories.includes('technical')) return <Settings className="w-5 h-5" />
    return <HelpCircle className="w-5 h-5" />
  }

  // Get category colors
  const getCategoryColors = () => {
    const colors = categories.map(category => {
      switch(category) {
        case 'courses': return 'bg-emerald-100 text-emerald-700'
        case 'webinars': return 'bg-orange-100 text-orange-700'
        case 'certificates': return 'bg-purple-100 text-purple-700'
        case 'account': return 'bg-blue-100 text-blue-700'
        case 'technical': return 'bg-red-100 text-red-700'
        default: return 'bg-gray-100 text-gray-700'
      }
    })
    return colors
  }

  const categoryColors = getCategoryColors()

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-emerald-200 transition-all hover:shadow-sm max-w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between p-6 text-left hover:bg-gray-50/50 transition-colors group max-w-full"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4 w-full">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1 ${categoryColors[0]}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors truncate">
                  {question}
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {categories.map((category, idx) => (
                    <span 
                      key={idx}
                      className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[idx]} shrink-0`}
                    >
                      {getCategoryLabel(category)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0">
                {open ? (
                  <ChevronUp className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {open ? 'Click to collapse' : 'Click to expand for detailed answer'}
            </p>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-5 max-w-full">
          <div className="pl-14 border-t border-gray-100 pt-6 max-w-full">
            <div className="prose prose-emerald max-w-full">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed wrap-break-word">
                {answer}
              </p>
            </div>
            
            {/* {question.includes("How do I") && (
              <div className="mt-4 pt-4 border-t border-gray-100 max-w-full">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 mb-2">
                  <Sparkles className="w-4 h-4" />
                  Quick Tip
                </div>
                <p className="text-sm text-gray-600 break-words">
                  Need step-by-step guidance? Visit our <a href="/tutorials" className="text-emerald-600 hover:text-emerald-800 font-medium break-words">video tutorials</a> section.
                </p>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  )
}

/* HELPER FUNCTIONS */
const getCategoryLabel = (category: FAQCategory): string => {
  switch(category) {
    case 'all': return 'All Topics'
    case 'courses': return 'Courses'
    case 'webinars': return 'Webinars'
    case 'certificates': return 'Certificates'
    case 'account': return 'Account'
    case 'technical': return 'Technical'
    default: return 'General'
  }
}

const categoryTabs = [
  {
    id: 'courses' as FAQCategory,
    label: 'Courses',
    icon: <BookOpen className="w-4 h-4" />,
    activeClasses: 'bg-emerald-600 text-white shadow-md'
  },
  {
    id: 'webinars' as FAQCategory,
    label: 'Webinars',
    icon: <Video className="w-4 h-4" />,
    activeClasses: 'bg-orange-600 text-white shadow-md'
  },
  {
    id: 'certificates' as FAQCategory,
    label: 'Certificates',
    icon: <Award className="w-4 h-4" />,
    activeClasses: 'bg-purple-600 text-white shadow-md'
  },
  {
    id: 'account' as FAQCategory,
    label: 'Account',
    icon: <User className="w-4 h-4" />,
    activeClasses: 'bg-blue-600 text-white shadow-md'
  },
  {
    id: 'technical' as FAQCategory,
    label: 'Technical',
    icon: <Settings className="w-4 h-4" />,
    activeClasses: 'bg-red-600 text-white shadow-md'
  }
]

/* FAQ DATA WITH CATEGORIES */
const faqData: FAQItem[] = [
  {
    question: "How do I get started?",
    answer: `Click "Get Started" or "Sign Up" button → Complete registration form → Verify your email → Login → Update your profile → Start browsing and enrolling in courses.

📋 Required for registration:
• Dental license number
• Professional email
• Contact information
• Specialty details`,
    category: ['account', 'courses']
  },
  {
    question: "How do I register for a program?",
    answer: `1. Navigate to "Course Catalog" 
2. Browse or search for your desired course
3. Click on the course card
4. Click "Register Now" or "Enroll"
5. If not logged in, you'll be prompted to login
6. Complete payment (if applicable)
7. Access course immediately in your dashboard`,
    category: ['courses']
  },
  {
    question: "How do I join a live webinar?",
    answer: `After registration:

1. Go to your Profile → "My Courses"
2. Find the live webinar course
3. Click "Go To Course"
4. Access the Zoom link 30 minutes before start
5. Join 10-15 minutes early for technical check

📅 Live sessions are recorded and available for 30 days after the event.`,
    category: ['webinars', 'courses']
  },
  {
    question: "How do I access a self-study course I purchased?",
    answer: `Access self-paced courses anytime:

1. Profile → "Course & Payment History"
2. Locate your purchased course
3. Click "Go To Course"
4. Access all recorded modules, slides, and materials
5. Complete at your own pace
6. Take final quiz when ready

⏰ Self-study courses never expire.`,
    category: ['courses']
  },
  {
    question: "How do I get my CE Certificate?",
    answer: `Certificate process:

1. Complete all course modules
2. Pass the final quiz (70% or higher)
3. Submit course feedback form
4. Certificate generates automatically
5. Download from: Profile → "My Certificates"

📄 Certificates include:
• Your name and license number
• Course title and credits
• DCI accreditation details
• Issuance date and QR verification`,
    category: ['certificates', 'courses']
  },
  {
    question: "What are the technical requirements for live webinars?",
    answer: `Minimum requirements:

💻 Hardware:
• Stable internet connection (10+ Mbps)
• Laptop/PC recommended (tablet/mobile optional)
• Webcam and microphone
• Headphones for better audio

🌐 Software:
• Latest Chrome/Firefox/Safari
• Zoom Client (latest version)
• PDF reader for materials
• Pop-ups enabled for quiz

🎯 Best practices:
• Test connection 30 minutes before
• Use wired connection if possible
• Close unnecessary applications`,
    category: ['technical', 'webinars']
  },
  {
    question: "Can I watch recorded webinars later?",
    answer: `Yes! All live webinars are recorded:

• Uploaded within 24-48 hours after live event
• Available in your course dashboard for 30 days
• Can be watched multiple times
• Includes downloadable slides and materials
• Same CE credits as live attendance

Recordings are processed automatically and notification emails are sent when available.`,
    category: ['webinars']
  },
  {
    question: "I forgot my password. How do I reset it?",
    answer: `Password reset process:

1. Go to Login page
2. Click "Forgot Password?"
3. Enter your registered email
4. Check inbox for reset link (check spam folder)
5. Click link and create new password
6. Login with new credentials

🔒 Security tips:
• Use strong, unique password
• Enable two-factor authentication
• Don't share your login credentials`,
    category: ['account', 'technical']
  },
  {
    question: "My name is wrong on the certificate. How to correct it?",
    answer: `Certificate corrections:

1. Go to Profile → "Edit Profile"
2. Update your name exactly as it appears on your dental license
3. Save changes
4. Go to "My Certificates"
5. Re-download the certificate

Important: Name changes only apply to future certificates. For past certificates, contact support with:
• Certificate number
• Correct name proof
• License verification`,
    category: ['certificates', 'account']
  },
  {
    question: "Are the CE credits recognized by the Dental Council?",
    answer: `Credit recognition:

• All courses are DCI (Dental Council of India) accredited
• Credits are valid for license renewal requirements
• Certificate includes accreditation details
• Recognition varies by state council regulations

📋 For state-specific requirements:
• Check your state dental council website
• Keep certificate copies for audit
• Contact support for verification letters if needed

Note: While we provide accredited courses, ultimate recognition depends on your local regulatory body.`,
    category: ['certificates']
  },
  {
    question: "How long do I have access to purchased courses?",
    answer: `Access duration depends on course type:

🕒 Live Webinars:
• Live session + 30 days recording access
• Downloadable materials: Unlimited

📚 Self-Study Courses:
• Unlimited access forever
• All materials available 24/7

📖 Certificate Programs:
• Duration specified in course details
• Usually 6-12 months access

⏰ Expired courses can be extended for a small fee.`,
    category: ['courses']
  },
  {
    question: "Can I get a refund for a course?",
    answer: `Refund policy:

✅ Refundable within 7 days if:
• Course hasn't been accessed
• Live webinar hasn't occurred
• Technical issues preventing access

❌ Non-refundable if:
• Course has been accessed
• Live webinar has occurred
• Certificate has been issued

💡 Contact support for refund requests.`,
    category: ['account']
  },
  {
    question: "How do I update my contact information?",
    answer: `Update your profile:

1. Login and go to Profile
2. Click "Edit Profile"
3. Update contact details
4. Save changes

📞 Important updates:
• Email: Used for login and notifications
• Phone: Emergency contact for live sessions
• Address: For physical certificate delivery (if applicable)

🔒 Profile changes require verification for security.`,
    category: ['account']
  }
]