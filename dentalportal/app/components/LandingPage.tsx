'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search,
  Filter,
  X,
  Clock,
  Star,
  ArrowRight,
  GraduationCap,
  Shield,
  TrendingUp,
  PlayCircle,
  Users,
  Award,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  BookOpen,
  FilterX,
  Calendar,
  CheckCircle,
  ExternalLink,
  Eye
} from 'lucide-react'
import { debounce } from 'lodash'

export default function LandingPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save search history
  const saveToHistory = useCallback((query: string) => {
    if (!query.trim()) return
    
    const updatedHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 5)
    
    setSearchHistory(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
  }, [searchHistory])

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value: string) => {
      setIsSearching(false)
      if (value.trim()) {
        saveToHistory(value)
      }
    }, 300),
    [saveToHistory]
  )

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setIsSearching(true)
    handleSearch(value)
    
    if (value.trim()) {
      setShowSearchResults(true)
      setShowSearchHistory(false)
    } else {
      setShowSearchResults(false)
      setShowSearchHistory(true)
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
        setShowSearchHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle specialty selection - clear search and close dropdowns
  const handleSpecialtyClick = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId)
    setSearchQuery('')
    setShowSearchResults(false)
    setShowSearchHistory(false)
    
    // Scroll to courses section smoothly
    setTimeout(() => {
      document.getElementById('courses-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  // Handle filter toggle
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  // Clear all filters and search
  const clearAll = () => {
    setSearchQuery('')
    setSelectedSpecialty('all')
    setActiveFilters([])
    setShowSearchResults(false)
    setShowSearchHistory(false)
    searchInputRef.current?.focus()
  }

  // Handle search from history
  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    setShowSearchHistory(false)
    setShowSearchResults(true)
    searchInputRef.current?.focus()
  }

  // Filter courses based on selection and search
  const filteredCourses = getFilteredCourses(selectedSpecialty, searchQuery, activeFilters)

  // Get instant search results for dropdown
  const instantResults = searchQuery.trim() ? 
    allCourses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5) : []

  // Get popular searches
  const popularSearches = [
    'Implantology',
    'Orthodontics',
    'Endodontics',
    'Pediatric Dentistry',
    'CAD/CAM',
    'Laser Dentistry'
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Improved Color Balance */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.1)_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        
        <div className="relative container mx-auto px-4 lg:px-8 py-16 lg:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              {/* Accent Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 text-sm font-medium mb-8 shadow-sm">
                <Shield className="w-4 h-4 mr-2" />
                <span className="font-semibold">DCI Accredited</span>
                <span className="mx-2">•</span>
                <span>NABH Recognized</span>
              </div>
              
              {/* Main Heading with Better Hierarchy */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                <span className="block">Continuing Dental</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800 mt-2">
                  Education Portal
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                Advance your dental practice with accredited courses, expert-led training, 
                and the latest clinical techniques from Yenepoya Dental College
              </p>
              
              {/* Main Search Bar - Enhanced */}
              <div ref={searchRef} className="max-w-3xl mx-auto mb-16">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                    <Search className={`h-5 w-5 ${isSearching ? 'text-emerald-600 animate-pulse' : 'text-gray-400'}`} />
                  </div>
                  
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim()) {
                        setShowSearchResults(true)
                      } else {
                        setShowSearchHistory(true)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        setShowSearchResults(false)
                        saveToHistory(searchQuery)
                      }
                    }}
                    placeholder="Search courses, specialties, or instructors..."
                    className="block w-full pl-12 pr-12 py-4 bg-white border border-gray-300 rounded-xl 
                             text-gray-900 placeholder-gray-500 text-base shadow-sm hover:shadow-md
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-lg transition-all"
                  />
                  
                  {/* Clear/Close Button */}
                  {searchQuery && (
                    <button
                      onClick={clearAll}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center hover:bg-gray-100 rounded-r-xl px-2 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                  
                  {/* Search Results & History Dropdown */}
                  {(showSearchResults || showSearchHistory) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5">
                      {showSearchResults && instantResults.length > 0 ? (
                        <>
                          {/* Search Results Header */}
                          <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700">
                                Search Results
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                {instantResults.length} found
                              </span>
                            </div>
                          </div>
                          
                          {/* Search Results List */}
                          <div className="max-h-80 overflow-y-auto">
                            {instantResults.map((course) => (
                              <Link
                                key={course.id}
                                href={`/course/${course.id}`}
                                onClick={() => {
                                  setShowSearchResults(false)
                                  setShowSearchHistory(false)
                                }}
                                className="flex items-center p-4 hover:bg-emerald-50/50 border-b border-gray-100 group transition-colors"
                              >
                                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                  <BookOpen className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                      {course.category}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {course.duration}
                                    </span>
                                  </div>
                                  <h4 className="font-medium text-gray-900 group-hover:text-emerald-700 truncate">
                                    {course.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 truncate">{course.instructor}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 ml-4 flex-shrink-0 transition-colors" />
                              </Link>
                            ))}
                          </div>
                          
                          {/* View All Results */}
                          <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <Link
                              href={`/search?q=${encodeURIComponent(searchQuery)}`}
                              onClick={() => {
                                setShowSearchResults(false)
                                setShowSearchHistory(false)
                              }}
                              className="flex items-center justify-center text-emerald-700 hover:text-emerald-800 font-medium group"
                            >
                              View all results for "{searchQuery}"
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </>
                      ) : showSearchHistory ? (
                        <>
                          {/* Search History Header */}
                          <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700">
                                Recent Searches
                              </span>
                              {searchHistory.length > 0 && (
                                <button
                                  onClick={() => {
                                    setSearchHistory([])
                                    localStorage.removeItem('searchHistory')
                                  }}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  Clear all
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Search History List */}
                          <div className="max-h-60 overflow-y-auto">
                            {searchHistory.length > 0 ? (
                              searchHistory.map((query, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleHistoryClick(query)}
                                  className="flex items-center justify-between w-full p-4 hover:bg-gray-50 border-b border-gray-100 group"
                                >
                                  <div className="flex items-center">
                                    <Search className="w-4 h-4 text-gray-400 mr-3" />
                                    <span className="text-gray-700 group-hover:text-emerald-700">
                                      {query}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500" />
                                </button>
                              ))
                            ) : (
                              <div className="p-8 text-center">
                                <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">No recent searches</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Popular Searches */}
                          <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <p className="text-xs text-gray-500 mb-2">Popular searches</p>
                            <div className="flex flex-wrap gap-2">
                              {popularSearches.map((search) => (
                                <button
                                  key={search}
                                  onClick={() => handleHistoryClick(search)}
                                  className="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                >
                                  {search}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-8 text-center">
                          <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                          <button
                            onClick={clearAll}
                            className="mt-3 text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                          >
                            Clear search and try again
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Search Tips - Subtle */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-emerald-500" />
                    <span>Try: <span className="font-medium">"Implants"</span> or <span className="font-medium">"Pediatric"</span></span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-emerald-500" />
                    <span>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> for full results</span>
                  </span>
                </div>
              </div>
              
              {/* Quick Stats - Subtle Design */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <QuickStat 
                  value="300+"
                  label="Accredited Courses"
                  icon={<BookOpen className="w-5 h-5" />}
                />
                <QuickStat 
                  value="50+"
                  label="Expert Faculty"
                  icon={<GraduationCap className="w-5 h-5" />}
                />
                <QuickStat 
                  value="5K+"
                  label="Dental Professionals"
                  icon={<Users className="w-5 h-5" />}
                />
                <QuickStat 
                  value="24/7"
                  label="Flexible Access"
                  icon={<PlayCircle className="w-5 h-5" />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Navigation - Clean & Professional */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-4 h-4 mr-2 text-emerald-600" />
                Browse by Specialty
              </h2>
            </div>
            
            {/* Active Filters & Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Active Filters Display */}
              {(activeFilters.length > 0 || searchQuery || selectedSpecialty !== 'all') && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm text-gray-600 hidden sm:inline">Active:</span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm hover:bg-emerald-100 transition-colors"
                    >
                      Search: "{searchQuery}"
                      <X className="ml-2 w-3 h-3" />
                    </button>
                  )}
                  {selectedSpecialty !== 'all' && (
                    <button
                      onClick={() => setSelectedSpecialty('all')}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
                    >
                      {specialties.find(s => s.id === selectedSpecialty)?.name}
                      <X className="ml-2 w-3 h-3" />
                    </button>
                  )}
                  {activeFilters.map(filter => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                    >
                      {filter}
                      <X className="ml-2 w-3 h-3" />
                    </button>
                  ))}
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <FilterX className="w-4 h-4 mr-1" />
                    Clear all
                  </button>
                </div>
              )}
              
              {/* Sort Options */}
              <div className="relative">
                <select 
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                  defaultValue="popular"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Shortest Duration</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Specialty Pills */}
          <div className="pb-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSpecialtyClick('all')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center ${
                  selectedSpecialty === 'all'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedSpecialty === 'all' && <CheckCircle className="w-4 h-4 mr-2" />}
                All Specialties
              </button>
              {specialties.map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => handleSpecialtyClick(specialty.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center ${
                    selectedSpecialty === specialty.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedSpecialty === specialty.id && <CheckCircle className="w-4 h-4 mr-2" />}
                  {specialty.name}
                </button>
              ))}
            </div>
            
            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['Free Courses', 'Advanced Level', 'Beginner Friendly', 'Certificate Program'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeFilters.includes(filter)
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Courses Section */}
      <section id="courses-section" className="py-12 bg-gradient-to-b from-white via-gray-50/30 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {selectedSpecialty === 'all' 
                      ? 'All Continuing Education Courses' 
                      : `${specialties.find(s => s.id === selectedSpecialty)?.name} Courses`}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {filteredCourses.length} courses found
                    </span>
                    {selectedSpecialty !== 'all' && (
                      <>
                        <span className="mx-3">•</span>
                        <span>{specialties.find(s => s.id === selectedSpecialty)?.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
                
               
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No courses found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
                    : 'No courses available for this specialty at the moment.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors group"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </button>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    View All Courses
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-5 bg-gradient-to-b from-white via-white to-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-4 border border-emerald-100">
                <Sparkles className="w-4 h-4 mr-2" />
                Why Dental Professionals Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Trusted by Dentists Nationwide
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                30+ years of excellence in dental education and clinical training
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ValueCard
                icon={<Shield className="w-8 h-8" />}
                title="DCI Accredited"
                description="All courses are accredited by Dental Council of India, ensuring recognized CDE credits for license renewal"
                accent="emerald"
              />
              <ValueCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Career Advancement"
                description="Learn the latest techniques and technologies to stay competitive in modern dental practice"
                accent="blue"
                highlight
              />
              <ValueCard
                icon={<GraduationCap className="w-8 h-8" />}
                title="Expert Faculty"
                description="Learn directly from senior faculty and industry leaders with decades of clinical experience"
                accent="purple"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Advance Your Dental Career?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of dental professionals who trust Yenepoya for their continuing education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Get Started Free
                <ExternalLink className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all group"
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Browse Courses
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 pt-12 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-6">Trusted by dental professionals from</p>
              <div className="flex flex-wrap items-center justify-center gap-8 text-gray-300">
                <span className="text-sm">Private Clinics</span>
                <span className="text-sm">•</span>
                <span className="text-sm">Government Hospitals</span>
                <span className="text-sm">•</span>
                <span className="text-sm">Dental Colleges</span>
                <span className="text-sm">•</span>
                <span className="text-sm">Research Institutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

/* -----------------------------
   COMPONENTS
------------------------------*/

function QuickStat({ value, label, icon }: { 
  value: string; 
  label: string; 
  icon: React.ReactNode 
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:border-emerald-200 hover:shadow-sm transition-all group">
      <div className="flex justify-center mb-3">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 font-medium mt-1">{label}</div>
    </div>
  )
}

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/course/${course.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Course Image with Overlay */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="px-3 py-1 bg-white/95 text-emerald-700 text-xs font-bold rounded-full shadow-sm">
              {course.category}
            </span>
            {course.price === 'Free' && (
              <span className="px-3 py-1 bg-emerald-600/95 text-white text-xs font-bold rounded-full shadow-sm">
                FREE
              </span>
            )}
          </div>
          
          {/* Level Indicator */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
              course.level === 'Beginner' ? 'bg-green-500 text-white' :
              course.level === 'Intermediate' ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {course.level}
            </span>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-5">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-1">{course.instructor}</p>
          </div>
          
          {/* Course Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              {course.rating || '4.8'}
            </div>
            <div className="text-emerald-600 font-medium">
              {course.credits} Credits
            </div>
          </div>
          
          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className={`text-lg font-bold ${
              course.price === 'Free' ? 'text-emerald-600' : 'text-gray-900'
            }`}>
              {course.price === 'Free' ? 'Free Access' : `₹${course.price.toLocaleString()}`}
            </div>
            
            <div className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 font-medium text-sm rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all">
              View Details
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ValueCard({ icon, title, description, highlight = false, accent = 'emerald' }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  highlight?: boolean;
  accent?: 'emerald' | 'blue' | 'purple';
}) {
  const accentColors = {
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100'
  }
  
  return (
    <div className={`p-6 rounded-xl border ${highlight ? 'border-emerald-200 bg-white shadow-lg' : 'border-gray-200 bg-white'}`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${accentColors[accent]} border`}>
        {icon}
      </div>
      <h3 className={`text-xl font-bold mb-3 ${highlight ? 'text-emerald-700' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

/* -----------------------------
   DATA TYPES & CONSTANTS
------------------------------*/

interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  credits: number;
  category: string;
  specialty: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number | 'Free';
  rating?: number;
  image: string;
}

interface Specialty {
  id: string;
  name: string;
  description: string;
}

const specialties: Specialty[] = [
  { id: 'endodontics', name: 'Endodontics', description: 'Root canal treatments' },
  { id: 'medically-complex', name: 'Medically Complex', description: 'Complex patient care' },
  { id: 'oral-surgery', name: 'Oral & Maxillofacial Surgery', description: 'Surgical procedures' },
  { id: 'orthodontics', name: 'Orthodontics', description: 'Braces and aligners' },
  { id: 'pediatric-dentistry', name: 'Pediatric Dentistry', description: 'Child dental care' },
  { id: 'periodontics', name: 'Periodontics', description: 'Gum disease treatment' },
  { id: 'public-health', name: 'Public Health', description: 'Community oral health' },
  { id: 'restorative-sciences', name: 'Restorative Sciences', description: 'Crowns and bridges' },
  { id: 'wellbeing', name: 'Wellbeing', description: 'Professional wellness' },
]

const allCourses: Course[] = [
  {
    id: "1",
    title: "Advanced Endodontic Surgery Techniques & Microscopy",
    instructor: "Dr. Arvind Singh, MDS",
    duration: "8 Hours",
    credits: 8,
    category: "Endodontics",
    specialty: "endodontics",
    level: "Advanced",
    price: 7999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "2",
    title: "Microscopic Endodontics for General Practitioners",
    instructor: "Dr. Meena Patel, MDS",
    duration: "6 Hours",
    credits: 6,
    category: "Endodontics",
    specialty: "endodontics",
    level: "Intermediate",
    price: 5999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1584302179602-e9e5f10d7c1f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "3",
    title: "Dental Management of Cardiac & Diabetic Patients",
    instructor: "Dr. Sanjay Reddy, MDS",
    duration: "4 Hours",
    credits: 4,
    category: "Medically Complex",
    specialty: "medically-complex",
    level: "Intermediate",
    price: 4999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "4",
    title: "Advanced Dental Implant Surgery Masterclass",
    instructor: "Dr. Rajesh Kumar, MDS",
    duration: "12 Hours",
    credits: 12,
    category: "Oral Surgery",
    specialty: "oral-surgery",
    level: "Advanced",
    price: 12999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "5",
    title: "Clear Aligner Therapy Certification Program",
    instructor: "Dr. Anil Verma, MDS",
    duration: "20 Hours",
    credits: 20,
    category: "Orthodontics",
    specialty: "orthodontics",
    level: "Intermediate",
    price: 14999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555633514-abceb6d8c8c9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "6",
    title: "Pediatric Behavior Management Techniques",
    instructor: "Dr. Sunita Rao, MDS",
    duration: "6 Hours",
    credits: 6,
    category: "Pediatric Dentistry",
    specialty: "pediatric-dentistry",
    level: "Beginner",
    price: 4499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "7",
    title: "Laser Periodontal Therapy Workshop",
    instructor: "Dr. Kavita Nair, MDS",
    duration: "8 Hours",
    credits: 8,
    category: "Periodontics",
    specialty: "periodontics",
    level: "Intermediate",
    price: 6999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "8",
    title: "Community Oral Health Programs - Public Health",
    instructor: "Dr. Vikram Joshi, MPH",
    duration: "4 Hours",
    credits: 4,
    category: "Public Health",
    specialty: "public-health",
    level: "Beginner",
    price: "Free",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "9",
    title: "Digital Smile Design & Prosthetics Mastery",
    instructor: "Dr. Amit Desai, MDS",
    duration: "10 Hours",
    credits: 10,
    category: "Restorative Sciences",
    specialty: "restorative-sciences",
    level: "Advanced",
    price: 9999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "10",
    title: "Stress Management for Dental Professionals",
    instructor: "Dr. Rohan Mehta, PhD",
    duration: "3 Hours",
    credits: 3,
    category: "Wellbeing",
    specialty: "wellbeing",
    level: "Beginner",
    price: "Free",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "11",
    title: "Advanced Bone Grafting Techniques",
    instructor: "Dr. Naveen Gupta, MDS",
    duration: "14 Hours",
    credits: 14,
    category: "Oral Surgery",
    specialty: "oral-surgery",
    level: "Advanced",
    price: 11999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "12",
    title: "Invisalign Advanced Treatment Planning",
    instructor: "Dr. Priya Sharma, MDS",
    duration: "16 Hours",
    credits: 16,
    category: "Orthodontics",
    specialty: "orthodontics",
    level: "Advanced",
    price: 17999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1606811971618-4483e5db5d2c?auto=format&fit=crop&w=600&q=80"
  }
]

function getFilteredCourses(specialtyId: string, searchQuery: string, activeFilters: string[]): Course[] {
  let filtered = allCourses
  
  // Filter by specialty
  if (specialtyId !== 'all') {
    filtered = filtered.filter(course => course.specialty === specialtyId)
  }
  
  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query)
    )
  }
  
  // Apply active filters
  if (activeFilters.includes('Free Courses')) {
    filtered = filtered.filter(course => course.price === 'Free')
  }
  
  if (activeFilters.includes('Advanced Level')) {
    filtered = filtered.filter(course => course.level === 'Advanced')
  }
  
  if (activeFilters.includes('Beginner Friendly')) {
    filtered = filtered.filter(course => course.level === 'Beginner')
  }
  
  return filtered
}