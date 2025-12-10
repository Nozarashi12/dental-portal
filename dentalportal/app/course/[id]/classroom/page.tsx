'use client'

import React, { useState } from "react"
import { Button } from "../../../components/ui/Button";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { Card } from "../../../components/ui/Card";

export default function ClassroomPage() {
  const [expandedLecture, setExpandedLecture] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with emerald gradient */}
      <header className="bg-gradient-to-r from-emerald-700 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <div className="w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Online Learning Series</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
              Persons with Disabilities<br className="hidden lg:block" /> Presentation Series
            </h1>
            
            <p className="text-lg text-emerald-100/90 leading-relaxed max-w-3xl mb-8">
              Comprehensive education for dental professionals on providing equitable care 
              to patients with disabilities and special needs
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">16 Expert Speakers</span>
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <div className="text-sm">
                <span className="font-semibold">44</span> Video Lectures
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <div className="text-sm">
                <span className="font-semibold">66</span> CE Credits Available
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator for entire series */}
        <div className="bg-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/90">Series Progress</span>
              <span className="font-semibold">25% Complete</span>
            </div>
            <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
                style={{ width: '25%' }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content area - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Important notice - emerald theme */}
            <Card className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-xl">ℹ️</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Important Completion Guidelines</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Your CE certificate will be available immediately upon completion of the self assessment, 
                    which will be unlocked once the video is viewed in full. Skipping ahead will interrupt 
                    progress tracking and may impact access to the self assessment.
                  </p>
                  <div className="flex items-center text-sm text-emerald-600 font-medium">
                    <span className="mr-2">⏱️</span>
                    Each lecture must be completed in sequence for credit
                  </div>
                </div>
              </div>
            </Card>

            {/* Course catalog header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Course Lectures</h2>
                <p className="text-gray-600 mt-1">44 lectures • 66 total CE credits</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Filter Lectures
                </button>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search lectures..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Course list */}
            <div className="space-y-6">
              
              {/* Example course item */}
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Course header */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                          Lecture 1 of 44
                        </div>
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                          1.5 CE Credits
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 leading-snug">
                        Preventive Health Considerations for Individuals with Special Needs
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <span className="flex items-center">
                          <span className="mr-2">👤</span>
                          Dr. Ann Eshenaur Spolarich
                        </span>
                        <span className="flex items-center">
                          <span className="mr-2">👁️</span>
                          124 views
                        </span>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                      <Button variant="primary" className="bg-gradient-to-r from-emerald-600 to-green-600">
                        Watch Now
                      </Button>
                      <button className="text-emerald-600 hover:text-emerald-800 font-medium text-sm flex items-center justify-center">
                        <span className="mr-2">📝</span>
                        Take Assessment
                      </button>
                    </div>
                  </div>

                  {/* Meta information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Published</p>
                      <p className="font-semibold text-gray-900">August 12, 2025</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Expires</p>
                      <p className="font-semibold text-gray-900">August 12, 2028</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Duration</p>
                      <p className="font-semibold text-gray-900">60 minutes</p>
                    </div>
                  </div>

                  {/* Expandable content */}
                  <div>
                    <button 
                      onClick={() => setExpandedLecture(expandedLecture === 1 ? null : 1)}
                      className="flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
                    >
                      {expandedLecture === 1 ? 'Show Less' : 'Show Details'}
                      <span className="ml-2">{expandedLecture === 1 ? '▲' : '▼'}</span>
                    </button>
                    
                    {expandedLecture === 1 && (
                      <div className="mt-6 space-y-6 pt-6 border-t border-gray-100">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="mr-2">📋</span>
                            Course Description
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            Attainment of optimal oral health and wellness is a challenging and dynamic 
                            process that occurs along the aging continuum for individuals with all types 
                            of disabilities and related special care needs. This lecture will review 
                            important challenges and considerations related to health prevention…
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="mr-2">🎯</span>
                            Learning Objectives
                          </h4>
                          <ul className="space-y-3">
                            {[
                              "Identify desired health outcomes for patients with special needs",
                              "Describe important variables that influence preventive care planning",
                              "Identify components of a comprehensive preventive practice plan"
                            ].map((objective, index) => (
                              <li key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                </div>
                                <span className="text-gray-700">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Card className="p-6">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="mr-2">👨‍🏫</span>
                            Speaker Information
                          </h4>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Ann Eshenaur Spolarich, RDH, PhD, FSCDH is an internationally recognized 
                            author and speaker on pharmacology and the care of medically complex patients…
                          </p>
                          <div className="inline-flex px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                            <strong>Disclosure:</strong> No relevant financial relationships to disclose
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* More course items would be repeated here */}
              
            </div>

            {/* Load more */}
            <div className="flex justify-center pt-6">
              <Button variant="outline" className="px-8">
                Load More Lectures
              </Button>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <aside className="space-y-8">
            
            {/* Learning outcomes card */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full mr-4"></div>
                <h2 className="text-xl font-bold text-gray-900">Learning Outcomes</h2>
              </div>
              
              <ul className="space-y-4">
                {[
                  "Become a competent and willing provider of care for patients with differing needs",
                  "Utilize best accommodations to optimize oral health through the lifetime",
                  "Develop skills in prevention and primary care without dependency on sedation",
                  "Learn how team utilization improves quality of life for the disabled population"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-emerald-700 font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 leading-relaxed text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Series Completion</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total CE Credits</span>
                    <span className="font-bold text-gray-900">66</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Time</span>
                    <span className="font-bold text-gray-900">44 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Access Duration</span>
                    <span className="font-bold text-gray-900">Lifetime</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Support card */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl text-emerald-700">❤️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Generously Supported By</h3>
                  <p className="text-gray-600 text-sm">Community partnership</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                <div className="text-xl font-bold text-emerald-800 mb-2">Delta Dental</div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Committed to improving oral health and expanding access to care for 
                  individuals with disabilities
                </p>
              </div>
            </Card>

            {/* Contact card */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full mr-4"></div>
                <h3 className="text-lg font-bold text-gray-900">Need Help?</h3>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="mailto:PDMContinuingEd@dental.upenn.edu"
                  className="flex items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-emerald-700">✉️</span>
                  </div>
                  <div>
                    <div className="font-medium text-emerald-800">
                      PDMContinuingEd@dental.upenn.edu
                    </div>
                    <div className="text-sm text-gray-600">Continuing Education Support</div>
                  </div>
                </a>
                
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Links</h4>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center text-gray-700 hover:text-emerald-600 text-sm">
                      <span className="mr-2">📄</span>
                      Download Course Syllabus
                    </a>
                    <a href="#" className="flex items-center text-gray-700 hover:text-emerald-600 text-sm">
                      <span className="mr-2">📋</span>
                      CE Credit Requirements
                    </a>
                    <a href="#" className="flex items-center text-gray-700 hover:text-emerald-600 text-sm">
                      <span className="mr-2">🏛️</span>
                      Penn Dental Medicine
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Welcome card */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-lg">🏛️</span>
                </div>
                <h3 className="font-bold text-gray-900">Welcome to PennPath</h3>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                You're visiting the new eLearning platform for Penn Dental Medicine's 
                online classroom. This portal is your one-stop shop to register, join, 
                and track your continuing education courses and credits.
              </p>
              
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>New Users:</strong> If you haven't created an account, you'll need to 
                  register via PennPath to access all lecture materials and track your progress.
                </p>
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}