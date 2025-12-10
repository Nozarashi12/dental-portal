import { notFound } from "next/navigation";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Card } from "../../components/ui/Card";

const courseData = {
  "1": {
    title: "Disabilities Dentistry Series",
    author: "Multiple Experts & Advocates",
    description: "Learn to provide equitable dental care for patients with disabilities through evidence-based practices.",
    stats: {
      lectures: 16,
      credits: 24,
      duration: "Self-paced",
      certificate: true
    }
  },
};

export default async function CoursePage({ params }) {
  const { id } = await params;
  const course = courseData[id];
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Emerald theme */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            {/* Tag with emerald accent */}
            <div className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full mr-2 animate-pulse"></div>
              Online Course
            </div>
            
            {/* Typography with perfect line-height */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
              {course.title}
            </h1>
            
            <p className="text-lg md:text-xl text-emerald-100/90 leading-relaxed mb-8 max-w-2xl">
              {course.description}
            </p>
            
            {/* Metadata with consistent item spacing */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium tracking-wide">Expert Instructors</span>
              </div>
              
              <div className="h-4 w-px bg-white/30 hidden sm:block"></div>
              
              <div className="flex items-center">
                <span className="mr-2 text-xl">🎓</span>
                <span className="text-sm font-medium tracking-wide">Certificate Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Emerald theme grid spacing and alignment */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Overview Card - Emerald theme */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    Course Overview
                  </h2>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    This comprehensive series prepares dental professionals to care for patients with 
                    disabilities and special needs through evidence-based practices and inclusive approaches.
                  </p>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-emerald-700 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                          Certification Opportunity
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          Complete 18+ courses within three years to earn the Disabilities Dentistry 
                          Clinician Expert certificate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Learning Objectives Card - Emerald theme */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full mr-4"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                    Learning Objectives
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Master techniques for patients with sensory impairments",
                    "Develop behavioral management strategies",
                    "Implement inclusive communication methods",
                    "Adapt clinical environments for accessibility"
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-start p-3 bg-gray-50/50 rounded-lg border border-gray-100 hover:border-emerald-200 transition-colors duration-150"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Column - Emerald theme visual hierarchy */}
          <div className="space-y-8">
            {/* Enrollment Card - Emerald theme */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Enroll Now</h3>
                  <span className="inline-flex items-center px-3 py-1.5 bg-emerald-700 text-white rounded-full text-sm font-medium">
                    Free
                  </span>
                </div>
                
                {/* Course Details - Emerald theme icon alignment */}
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50/50 rounded-lg">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-emerald-700 text-lg">📅</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium tracking-wide">Duration</p>
                      <p className="text-gray-900 font-semibold">Self-paced</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50/50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-700 text-lg">🎓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium tracking-wide">CE Credits</p>
                      <p className="text-gray-900 font-semibold">24 total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50/50 rounded-lg">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-emerald-600 text-lg">👥</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium tracking-wide">Format</p>
                      <p className="text-gray-900 font-semibold">Online lectures + community</p>
                    </div>
                  </div>
                </div>
                
                {/* CTA with emerald theme */}
                <div className="pt-4">
                  <Button 
                    variant="primary" 
                    className="w-full py-3.5 text-base font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Start Learning Free
                  </Button>
                  <p className="text-center text-gray-500 text-sm mt-3 tracking-wide">
                    No registration required
                  </p>
                </div>
              </div>
            </Card>

            {/* Progress Card - Emerald theme enhanced visual hierarchy */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-emerald-700 mr-2">25%</span>
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">→</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: '25%' }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className="font-semibold text-gray-900">4 of 16 lectures</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats Grid with emerald accent */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                  <div className="text-center p-4 bg-gradient-to-b from-emerald-50 to-white rounded-lg border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-800 mb-2">16</div>
                    <div className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Lectures</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-b from-emerald-50 to-white rounded-lg border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-800 mb-2">24h</div>
                    <div className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Content</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-b from-emerald-50 to-white rounded-lg border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-800 mb-2">∞</div>
                    <div className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Access</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}