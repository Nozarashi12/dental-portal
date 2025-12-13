'use client'

import { useState } from 'react'
import { Button } from "../../../components/ui/Button"
import { Card } from "../../../components/ui/Card"

export default function CourseDiscussionPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'discussions' | 'photos'>('discussions')
  const [activeGroup, setActiveGroup] = useState<'forum' | 'closed'>('forum')
  const [showForumModal, setShowForumModal] = useState(false)
  const [showTopicModal, setShowTopicModal] = useState(false)
  const [selectedForum, setSelectedForum] = useState<string | null>(null)

  const discussions = [
    {
      id: 1,
      title: "SDF (Silver Diamine Fluoride)",
      description: "Discussion about SDF applications in special needs dentistry",
      date: "August 13, 2022",
      topics: 12,
      comments: 47,
      lastActivity: "2 hours ago",
      isPinned: true,
      category: "Clinical Techniques"
    },
    {
      id: 2,
      title: "Preventive health considerations for individuals with special needs",
      description: "Strategies and best practices for preventive care",
      date: "April 28, 2022",
      topics: 8,
      comments: 32,
      lastActivity: "1 day ago",
      isPinned: true,
      category: "Preventive Care"
    },
    {
      id: 3,
      title: "Questions about course materials",
      description: "General questions and clarifications about lecture content",
      date: "April 28, 2021",
      topics: 45,
      comments: 189,
      lastActivity: "Just now",
      isPinned: false,
      category: "General"
    },
    {
      id: 4,
      title: "Behavior management techniques",
      description: "Sharing experiences with patient behavior management",
      date: "March 15, 2022",
      topics: 6,
      comments: 28,
      lastActivity: "3 days ago",
      isPinned: false,
      category: "Patient Management"
    },
    {
      id: 5,
      title: "Equipment adaptations for wheelchair users",
      description: "Discussing office modifications and adaptive equipment",
      date: "February 10, 2022",
      topics: 5,
      comments: 31,
      lastActivity: "1 week ago",
      isPinned: true,
      category: "Practice Management"
    }
  ]

  const learningObjectives = [
    "Learn to become a competent and willing provider of care for patients with differing needs.",
    "Learn to utilize best accommodations to optimize oral health through the lifetime focusing on preventing, reversing and arresting disease through evidence-based interventions in-office and at-home.",
    "Develop skills in prevention, primary care and maintaining oral health without being dependent on sedation and general anesthesia for the disabled population.",
    "Learn how team utilization can improve the quality of life for both the disabled individual and their families."
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Persons with Disabilities Presentation Series
              </h1>
              <p className="text-gray-600 mt-1 text-sm">Community Discussion Forum</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Discussions */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tabs Navigation */}
            <div className="flex items-center justify-between border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors duration-200 ${activeTab === 'discussions' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  💬 Discussions
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors duration-200 ${activeTab === 'photos' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  📸 Photos
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative hidden sm:block">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search discussions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-48 sm:w-64"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowForumModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:shadow-md transition-all duration-200"
                >
                  + New Forum
                </button>
              </div>
            </div>

            {/* Group Selection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveGroup('forum')}
                  className={`px-6 py-2 rounded-md transition-all duration-200 ${activeGroup === 'forum' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Public Forum
                </button>
                <button
                  onClick={() => setActiveGroup('closed')}
                  className={`px-6 py-2 rounded-md transition-all duration-200 ${activeGroup === 'closed' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Study Groups
                </button>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">📊</span>
                {discussions.length} active discussions • 124 participants
              </div>
            </div>

            {/* Discussions List - Improved card spacing */}
            <div className="space-y-6">
              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  onClick={() => setSelectedForum(discussion.id.toString() === selectedForum ? null : discussion.id.toString())}
                  className="cursor-pointer"
                >
                  <Card 
                    className="p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {discussion.isPinned && (
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center">
                                📌 Pinned
                              </span>
                            )}
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                              {discussion.category}
                            </span>
                            <span className="text-sm text-gray-500">
                              Started {discussion.date}
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-emerald-600 transition-colors">
                              {discussion.title}
                            </h3>
                            <p className="text-gray-600">
                              {discussion.description}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <span className="mr-1">💭</span>
                              {discussion.topics} topics
                            </span>
                            <span className="flex items-center">
                              <span className="mr-1">💬</span>
                              {discussion.comments} comments
                            </span>
                            <span className="flex items-center">
                              <span className="mr-1">🕒</span>
                              Last activity {discussion.lastActivity}
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowTopicModal(true)
                          }}
                          className="ml-4 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 rounded-lg font-medium hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200"
                        >
                          + New Topic
                        </button>
                      </div>
                      
                      {/* Expanded Content */}
                      {selectedForum === discussion.id.toString() && (
                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Recent Topics</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                <div>
                                  <p className="font-medium">SDF application techniques for special needs patients</p>
                                  <p className="text-sm text-gray-600">Posted by Dr. Sarah Chen • 2 hours ago</p>
                                </div>
                                <span className="text-emerald-600 text-sm font-medium">12 replies</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                <div>
                                  <p className="font-medium">Caries risk assessment in patients with disabilities</p>
                                  <p className="text-sm text-gray-600">Posted by Dr. Michael Torres • 1 day ago</p>
                                </div>
                                <span className="text-emerald-600 text-sm font-medium">8 replies</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:shadow-md">
                              Join Discussion
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                              View All Topics
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center pt-4">
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium">
                Load More Discussions
              </button>
            </div>
          </div>

          {/* Right Column - Learning Objectives (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Learning Card - Emerald theme */}
            <Card className="p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Learning Objectives</h2>
                  <p className="text-sm text-gray-600">Through course discussions</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{objective}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Discussion Guidelines</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-600 text-sm">✓</span>
                    </div>
                    <p className="text-sm text-gray-600">Respect diverse perspectives and experiences</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-600 text-sm">✓</span>
                    </div>
                    <p className="text-sm text-gray-600">Share evidence-based practices and clinical experiences</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-600 text-sm">✓</span>
                    </div>
                    <p className="text-sm text-gray-600">Maintain patient confidentiality in case discussions</p>
                  </div>
                </div>
              </div>
            </Card>

          

            
          </div>
        </div>
      </main>

      {/* New Forum Modal - Emerald theme */}
      {showForumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Forum</h2>
                <p className="text-gray-600 mt-1">Start a dedicated discussion space</p>
              </div>
              <button
                onClick={() => setShowForumModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Forum Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Advanced Behavioral Management"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>Clinical Techniques</option>
                  <option>Patient Management</option>
                  <option>Practice Management</option>
                  <option>Equipment & Technology</option>
                  <option>Research & Evidence</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What will this forum focus on? What topics will be discussed?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Forum Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                    <span className="text-2xl text-emerald-500">🖼️</span>
                  </div>
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">Recommended: 98x98px • JPG, PNG, BMP</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                <h3 className="font-bold text-gray-900 mb-3">Community Guidelines</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-600 text-xs">1</span>
                    </div>
                    <p>The User is responsible for all content uploaded, posted, or transmitted through the forum.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-600 text-xs">2</span>
                    </div>
                    <p>The User undertakes to not upload unlawful material, harass others, or violate intellectual property rights.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-600 text-xs">3</span>
                    </div>
                    <p>The User will use the Services at his/her own risk and is responsible for verifying clinical information.</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-3" />
                    <span className="text-gray-700">I accept the terms and conditions and community guidelines</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowForumModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:shadow-md transition-all duration-200">
                  Create Forum
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Topic Modal - Emerald theme */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Start New Discussion</h2>
                <p className="text-gray-600 mt-1">Share your question or insight with the community</p>
              </div>
              <button
                onClick={() => setShowTopicModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center mr-4">
                  <span className="text-white text-xl">💬</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Posting to: Preventive Health Considerations Forum</p>
                  <p className="text-sm text-gray-600">Your discussion will be visible to all course participants</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Topic Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Effective communication strategies for patients with autism"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Question', 'Case Study', 'Resource Share', 'Best Practice', 'Research'].map((category) => (
                    <button
                      key={category}
                      className="px-4 py-2 border border-gray-300 rounded-full hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Discussion Content *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="border-b border-gray-300 bg-gray-50 px-4 py-2">
                    <div className="flex items-center space-x-4 text-gray-600">
                      <button className="hover:text-gray-900">B</button>
                      <button className="hover:text-gray-900">I</button>
                      <button className="hover:text-gray-900">🔗</button>
                      <button className="hover:text-gray-900">📎</button>
                    </div>
                  </div>
                  <textarea
                    rows={8}
                    placeholder="Share your question, clinical experience, or insight. Be specific to help others provide helpful responses."
                    className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-gray-600 hover:text-gray-900">
                    <span className="mr-2">📎</span>
                    Attach Files
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-gray-900">
                    <span className="mr-2">👁️</span>
                    Preview
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowTopicModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Save Draft
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:shadow-md transition-all duration-200">
                    Publish Discussion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}