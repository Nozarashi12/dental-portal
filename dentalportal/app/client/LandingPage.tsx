'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
  Eye,
  Loader2,
  AlertCircle,
  Tag,
  Grid,
  List,
  ArrowUpDown
} from 'lucide-react'
import { debounce } from 'lodash'

// Interface for course data from backend
interface Course {
  id: number;
  title: string;
  author: string;
  author_description?: string;
  cover_image: string;
  overview: string;
  description: string;
  category: string;
  specialty_id: number | null;
  specialty_name: string | null;
  created_at: string;
  updated_at: string;
  classroom_count?: number;
}

// Interface for specialty data
interface Specialty {
  id: number;
  name: string;
  description?: string;
}

// Interface for search results
interface SearchResult {
  id: number;
  title: string;
  author: string;
  category: string;
  cover_image: string;
  overview: string;
  specialty_name: string | null;
}

// Interface for category data
interface Category {
  name: string;
  count: number;
}

// Interface for statistics data
interface Statistics {
  totalCourses: number;
  totalCategories: number;
  totalAuthors: number;
  totalClassrooms: number;
  coursesWithClassrooms: number;
}

// Format date function
const formatDate = (dateString: string) => {
  if (!dateString) return 'Date not available';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export default function LandingPage() {
  // State for data
  const [courses, setCourses] = useState<Course[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState({
    courses: true,
    specialties: true,
    statistics: true
  })
  const [error, setError] = useState<string | null>(null)
  
  // Statistics state
  const [statistics, setStatistics] = useState<Statistics>({
    totalCourses: 0,
    totalCategories: 0,
    totalAuthors: 0,
    totalClassrooms: 0,
    coursesWithClassrooms: 0
  })
  
  // UI State
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all')
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'alphabetical'>('newest')
  
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load data on mount
  useEffect(() => {
    fetchData()
    loadSearchHistory()
  }, [])

  // Fetch courses, specialties and statistics from backend
  const fetchData = async () => {
    try {
      setError(null)
      
      // Fetch courses
      const coursesRes = await fetch('/api/admin/courses')
      if (!coursesRes.ok) throw new Error('Failed to fetch courses')
      const coursesData = await coursesRes.json()
      setCourses(coursesData)
      
      // Fetch specialties
      const specialtiesRes = await fetch('/api/admin/specialties')
      if (specialtiesRes.ok) {
        const specialtiesData = await specialtiesRes.json()
        setSpecialties(specialtiesData)
      }
      
      // Fetch statistics from dedicated endpoint
      const statsRes = await fetch('/api/admin/statistics')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStatistics(statsData)
      } else {
        // Calculate statistics from courses data if API fails
        calculateStatisticsFromCourses(coursesData)
      }
      
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data. Please try again later.')
      
      // Try to calculate from existing data if available
      if (courses.length > 0) {
        calculateStatisticsFromCourses(courses)
      }
    } finally {
      setLoading({ courses: false, specialties: false, statistics: false })
    }
  }

  // Calculate statistics from courses data
  const calculateStatisticsFromCourses = (coursesData: Course[]) => {
    const uniqueCategories = [...new Set(coursesData.map(c => c.category).filter(Boolean))]
    const uniqueAuthors = [...new Set(coursesData.map(c => c.author).filter(Boolean))]
    const coursesWithClassrooms = coursesData.filter(c => c.classroom_count && c.classroom_count > 0).length
    const totalClassrooms = coursesData.reduce((acc, course) => acc + (course.classroom_count || 0), 0)
    
    setStatistics({
      totalCourses: coursesData.length,
      totalCategories: uniqueCategories.length,
      totalAuthors: uniqueAuthors.length,
      coursesWithClassrooms,
      totalClassrooms
    })
  }

  // Extract unique categories from courses
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>()
    
    courses.forEach(course => {
      if (course.category) {
        categoryMap.set(course.category, (categoryMap.get(course.category) || 0) + 1)
      }
    })
    
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [courses])

  // Load search history from localStorage
  const loadSearchHistory = () => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('searchHistory')
      if (savedHistory) {
        try {
          setSearchHistory(JSON.parse(savedHistory))
        } catch (err) {
          console.error('Error loading search history:', err)
        }
      }
    }
  }

  // Save search history
  const saveToHistory = useCallback((query: string) => {
    if (!query.trim()) return
    
    const updatedHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 5)
    
    setSearchHistory(updatedHistory)
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
    }
  }, [searchHistory])

  // Search courses
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const res = await fetch(`/api/admin/courses/search?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data)
      }
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value: string) => {
      performSearch(value)
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
      setSearchResults([])
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

  // Handle category selection
  const handleCategoryClick = (categoryName: string | 'all') => {
    setSelectedCategory(categoryName)
    // Don't reset specialty when category is selected - allow both filters
    setSearchQuery('')
    setShowSearchResults(false)
    setShowSearchHistory(false)
    setSearchResults([])
    
    // Scroll to courses section
    setTimeout(() => {
      document.getElementById('courses-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  // Handle specialty selection
  const handleSpecialtyClick = (specialtyId: number | 'all') => {
    setSelectedSpecialty(specialtyId)
    // Don't reset category when specialty is selected - allow both filters
    setSearchQuery('')
    setShowSearchResults(false)
    setShowSearchHistory(false)
    setSearchResults([])
    
    // Scroll to courses section
    setTimeout(() => {
      document.getElementById('courses-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  // Clear all filters and search
  const clearAll = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedSpecialty('all')
    setShowSearchResults(false)
    setShowSearchHistory(false)
    setSearchResults([])
    searchInputRef.current?.focus()
  }

  // Handle search from history
  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    setShowSearchHistory(false)
    setShowSearchResults(true)
    searchInputRef.current?.focus()
    performSearch(query)
  }

  // Filter courses based on selection and search
  const filteredCourses = useMemo(() => {
    let result = [...courses]
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory)
    }
    
    // Filter by specialty - handle both number comparison and string comparison
    if (selectedSpecialty !== 'all') {
      result = result.filter(course => {
        // Check if specialty_id matches (for number comparison)
        if (course.specialty_id === selectedSpecialty) return true;
        
        // Also check if specialty_name matches the selected specialty name
        const specialty = specialties.find(s => s.id === selectedSpecialty);
        if (specialty && course.specialty_name === specialty.name) return true;
        
        return false;
      })
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.author.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        (course.overview?.toLowerCase().includes(query) || false) ||
        (course.description?.toLowerCase().includes(query) || false) ||
        (course.specialty_name?.toLowerCase().includes(query) || false)
      )
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'popular':
        result.sort((a, b) => (b.classroom_count || 0) - (a.classroom_count || 0))
        break
    }
    
    return result
  }, [courses, selectedCategory, selectedSpecialty, searchQuery, sortBy, specialties])

  // Popular searches based on course categories
  const popularSearches = [
    ...new Set(courses.map(c => c.category).filter(Boolean))
  ].slice(0, 6)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-gray-200 shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Content</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.1)_1px,transparent_0)] bg-[length:40px_40px]" />
        </div>
        
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        
        <div className="relative container mx-auto px-4 lg:px-8 py-16 lg:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              {/* Accent Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 text-sm font-medium mb-8 shadow-sm hover:shadow-md transition-shadow">
                <Shield className="w-4 h-4 mr-2" />
                <span className="font-semibold">Smart Learning</span>
                <span className="mx-2">•</span>
                <span>Dental Focused</span>
              </div>
              
              {/* Main Heading */}
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
              
              {/* Main Search Bar */}
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
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5">
                      {showSearchResults ? (
                        <>
                          {/* Search Results Header */}
                          <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700">
                                {isSearching ? 'Searching...' : 'Search Results'}
                              </span>
                              {!isSearching && searchResults.length > 0 && (
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                  {searchResults.length} found
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Search Results List */}
                          {isSearching ? (
                            <div className="p-8 text-center">
                              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                              <p className="text-sm text-gray-500">Searching courses...</p>
                            </div>
                          ) : searchResults.length > 0 ? (
                            <div className="max-h-80 overflow-y-auto">
                              {searchResults.map((course) => (
                                <Link
                                  key={course.id}
                                  href={`/client/course/${course.id}`}
                                  onClick={() => {
                                    setShowSearchResults(false)
                                    setShowSearchHistory(false)
                                  }}
                                  className="flex items-center p-4 hover:bg-emerald-50/50 border-b border-gray-100 group transition-colors"
                                >
                                  <div className="shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                    <BookOpen className="w-5 h-5 text-emerald-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        {course.category}
                                      </span>
                                      {course.specialty_name && (
                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                          {course.specialty_name}
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="font-medium text-gray-900 group-hover:text-emerald-700 truncate">
                                      {course.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 truncate">{course.author}</p>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 ml-4 shrink-0 transition-colors" />
                                </Link>
                              ))}
                            </div>
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
                          {popularSearches.length > 0 && (
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
                          )}
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
                
                {/* Search Tips */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-emerald-500" />
                    <span>Try searching by course title or author</span>
                  </span>
                </div>
              </div>
              
              {/* Quick Stats - Updated to use statistics state */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <QuickStat 
                  value={`${statistics.totalCourses}+`}
                  label="Accredited Courses"
                  icon={<BookOpen className="w-5 h-5" />}
                  loading={loading.statistics}
                />
                <QuickStat 
                  value={`${statistics.totalCategories}+`}
                  label="Categories"
                  icon={<Filter className="w-5 h-5" />}
                  loading={loading.statistics}
                />
                <QuickStat 
                  value={`${statistics.totalAuthors}+`}
                  label="Expert Faculty"
                  icon={<GraduationCap className="w-5 h-5" />}
                  loading={loading.statistics}
                />
                <QuickStat 
                  value={`${statistics.totalClassrooms}+`}
                  label="Classrooms"
                  icon={<PlayCircle className="w-5 h-5" />}
                  loading={loading.statistics}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-4 h-4 mr-2 text-emerald-600" />
                Browse by Category & Specialty
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Filter courses by category, specialty, or both
              </p>
            </div>
            
            {/* Active Filters Display */}
            {(selectedCategory !== 'all' || selectedSpecialty !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">Active filters:</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm hover:bg-emerald-100 transition-colors"
                  >
                    Search: "{searchQuery}"
                    <X className="ml-2 w-3 h-3" />
                  </button>
                )}
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors"
                  >
                    Category: {selectedCategory}
                    <X className="ml-2 w-3 h-3" />
                  </button>
                )}
                {selectedSpecialty !== 'all' && (
                  <button
                    onClick={() => setSelectedSpecialty('all')}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                  >
                    {specialties.find(s => s.id === selectedSpecialty)?.name || 'Selected Specialty'}
                    <X className="ml-2 w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  <FilterX className="w-4 h-4 mr-1" />
                  Clear all
                </button>
              </div>
            )}
          </div>
          
          {/* Category Pills */}
          <div className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Categories:</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedCategory === 'all' && <CheckCircle className="w-4 h-4 mr-2" />}
                All Categories
                <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {statistics.totalCourses}
                </span>
              </button>
              
              {loading.courses ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Loading categories...</span>
                </div>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center ${
                      selectedCategory === category.name
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedCategory === category.name && <CheckCircle className="w-4 h-4 mr-2" />}
                    {category.name}
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      selectedCategory === category.name 
                        ? 'bg-white/20' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))
              ) : (
                <span className="text-sm text-gray-500">No categories available</span>
              )}
            </div>
            
            {/* Specialty Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Specialties:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSpecialtyClick('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    selectedSpecialty === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Specialties
                </button>
                {loading.specialties ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-sm text-gray-500">Loading specialties...</span>
                  </div>
                ) : specialties.length > 0 ? (
                  specialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => handleSpecialtyClick(specialty.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        selectedSpecialty === specialty.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {specialty.name}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No specialties available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Courses Section */}
      <section id="courses-section" className="py-12 bg-gradient-to-b from-white via-gray-50/30 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header with Controls */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {(() => {
                      if (selectedCategory === 'all' && selectedSpecialty === 'all') {
                        return 'All Continuing Education Courses'
                      } else if (selectedCategory !== 'all' && selectedSpecialty === 'all') {
                        return `Courses in "${selectedCategory}"`
                      } else if (selectedCategory === 'all' && selectedSpecialty !== 'all') {
                        const specialty = specialties.find(s => s.id === selectedSpecialty)
                        return `Courses in "${specialty?.name || 'Selected Specialty'}"`
                      } else {
                        const specialty = specialties.find(s => s.id === selectedSpecialty)
                        return `Courses in "${selectedCategory}" & "${specialty?.name || 'Selected Specialty'}"`
                      }
                    })()}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {filteredCourses.length} courses found
                      {(selectedCategory !== 'all' || selectedSpecialty !== 'all') && (
                        <span className="ml-2 text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                          Filtered
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                
                {/* View Controls */}
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="alphabetical">Alphabetical</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Results Summary */}
              {(selectedCategory !== 'all' || selectedSpecialty !== 'all' || searchQuery) && (
                <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-emerald-800">
                        Showing {filteredCourses.length} of {statistics.totalCourses} courses
                        {selectedCategory !== 'all' && ` in category "${selectedCategory}"`}
                        {selectedSpecialty !== 'all' && ` in specialty "${specialties.find(s => s.id === selectedSpecialty)?.name}"`}
                        {searchQuery && ` matching "${searchQuery}"`}
                      </p>
                    </div>
                    <button
                      onClick={clearAll}
                      className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Courses Grid/List */}
            {loading.courses ? (
              <div className="py-20 text-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading courses...</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredCourses.map((course) => (
                      <CourseListCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
                
                {/* Results Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">
                      Showing {filteredCourses.length} courses • 
                      {selectedCategory !== 'all' && ` Category: ${selectedCategory} •`}
                      {selectedSpecialty !== 'all' && ` Specialty: ${specialties.find(s => s.id === selectedSpecialty)?.name} •`}
                      Sorted by {sortBy}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                      >
                        Back to top ↑
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No courses found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
                    : selectedCategory !== 'all' 
                    ? `No courses found in "${selectedCategory}". Try another category.`
                    : selectedSpecialty !== 'all'
                    ? `No courses found in "${specialties.find(s => s.id === selectedSpecialty)?.name}". Try another specialty.`
                    : 'No courses available at the moment.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg group"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </button>
                  <button
                    onClick={fetchData}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Refresh Courses
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gradient-to-b from-white via-white to-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-sm font-semibold mb-4 border border-emerald-100 shadow-sm">
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
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900">
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
                href="/client/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Get Started Free
                <ExternalLink className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/client/login"
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
                <span className="text-sm font-medium">Private Clinics</span>
                <span className="text-sm">•</span>
                <span className="text-sm font-medium">Government Hospitals</span>
                <span className="text-sm">•</span>
                <span className="text-sm font-medium">Dental Colleges</span>
                <span className="text-sm">•</span>
                <span className="text-sm font-medium">Research Institutes</span>
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

function QuickStat({ value, label, icon, loading = false }: { 
  value: string; 
  label: string; 
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-center mb-3">
        <div className="p-2 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 rounded-lg group-hover:from-emerald-100 group-hover:to-green-100 transition-colors">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {loading ? '...' : value}
      </div>
      <div className="text-sm text-gray-600 font-medium mt-1">{label}</div>
    </div>
  )
}

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Link href={`/client/course/${course.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Course Image with Overlay */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-blue-50">
          {course.cover_image && !imageError ? (
            <div className="relative w-full h-full">
              <Image
                src={course.cover_image}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-emerald-300" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {course.category && (
              <span className="px-3 py-1 bg-white/95 text-emerald-700 text-xs font-bold rounded-full shadow-sm">
                {course.category}
              </span>
            )}
            {course.specialty_name && (
              <span className="px-3 py-1 bg-blue-600/95 text-white text-xs font-bold rounded-full shadow-sm">
                {course.specialty_name}
              </span>
            )}
            {course.classroom_count && course.classroom_count > 0 && (
              <span className="px-3 py-1 bg-emerald-600/95 text-white text-xs font-bold rounded-full shadow-sm flex items-center">
                <PlayCircle className="w-3 h-3 mr-1" />
                {course.classroom_count} classes
              </span>
            )}
          </div>
          
          {/* Date Indicator */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
              {formatDate(course.created_at)}
            </span>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-4 flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-1 mb-3">{course.author}</p>
            
            {/* Course Description */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {course.overview || course.description || 'No description available'}
            </p>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {course.category && (
                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  {course.category}
                </div>
              )}
              {course.specialty_name && (
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {course.specialty_name}
                </div>
              )}
              {course.classroom_count && course.classroom_count > 0 && (
                <div className="text-xs text-gray-500 flex items-center">
                  <PlayCircle className="w-3 h-3 mr-1" />
                  {course.classroom_count}
                </div>
              )}
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

function CourseListCard({ course }: CourseCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/client/course/${course.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Course Image */}
          <div className="lg:w-48 lg:h-40 w-full h-48 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-50 to-blue-50 relative">
            {course.cover_image && !imageError ? (
              <div className="relative w-full h-full">
                <Image
                  src={course.cover_image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 20vw"
                  onError={() => setImageError(true)}
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-emerald-300" />
              </div>
            )}
          </div>
          
          {/* Course Info */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {course.category && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                      {course.category}
                    </span>
                  )}
                  {course.specialty_name && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                      {course.specialty_name}
                    </span>
                  )}
                  {course.classroom_count && course.classroom_count > 0 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full flex items-center">
                      <PlayCircle className="w-3 h-3 mr-1" />
                      {course.classroom_count} classrooms
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-3">{course.author}</p>
                
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {course.overview || course.description || 'No description available'}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Clock className="w-3 h-3 mr-1" />
                  Published: {formatDate(course.created_at)}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 font-medium text-sm rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all">
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
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
    emerald: 'text-emerald-600 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100',
    blue: 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100',
    purple: 'text-purple-600 bg-gradient-to-r from-purple-50 to-violet-50 border-purple-100'
  }
  
  return (
    <div className={`p-8 rounded-2xl border-2 ${highlight ? 'border-emerald-200 bg-white shadow-2xl' : 'border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow'}`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${accentColors[accent]} border`}>
        {icon}
      </div>
      <h3 className={`text-2xl font-bold mb-4 ${highlight ? 'text-emerald-700' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}