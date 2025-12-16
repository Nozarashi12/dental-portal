'use client'

import React, { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { 
  Loader2, AlertCircle, Search, Users, BookOpen, ChevronDown, ChevronUp, 
  Calendar, Clock, GraduationCap, PlayCircle, FileText, Mail, Home, 
  ArrowLeft, Filter, Eye, Award, CheckCircle, Star, Download, 
  Share2, Maximize2, Minimize2, Youtube, ExternalLink
} from "lucide-react";
import Link from "next/link";
import YouTubePlayer from "../../../components/YouTubePlayer";

// Interface for classroom data
interface Classroom {
  id: number;
  course_id: number;
  title: string;
  speaker: string;
  description: string;
  author_description?: string;
  video_url: string;
  learning_objectives?: string;
  published_date: string;
  expiration_date?: string;
  discussion_enabled: boolean;
  google_classroom_link?: string; 
  assessment_link?: string;
  created_at: string;
  updated_at: string;
  course_title: string;
  duration_minutes?: number;
  views?: number;
}


// Interface for course data
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

export default function ClassroomPage() {
  const [expandedLecture, setExpandedLecture] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState({
    classrooms: true,
    course: true
  })
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'with-video' | 'with-assessment'>('all')
  const [fullscreenVideo, setFullscreenVideo] = useState<number | null>(null)
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  // Fetch classrooms and course data
  useEffect(() => {
    if (!courseId) return
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    try {
      setError(null)
      
      // Fetch course data
      const courseRes = await fetch(`/api/admin/courses/${courseId}`)
      if (!courseRes.ok) {
        if (courseRes.status === 404) {
          throw new Error('Course not found')
        }
        throw new Error(`Failed to fetch course: ${courseRes.status}`)
      }
      const courseData = await courseRes.json()
      setCourse(courseData)
      
      // Fetch classrooms for this course
      const classroomsRes = await fetch(`/api/admin/classrooms/course/${courseId}`)
      if (!classroomsRes.ok) {
        if (classroomsRes.status === 404) {
          setClassrooms([])
        } else {
          throw new Error(`Failed to fetch classrooms: ${classroomsRes.status}`)
        }
      } else {
        const classroomsData = await classroomsRes.json()
        setClassrooms(classroomsData)
      }
      
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading({ classrooms: false, course: false })
    }
  }

  // Filter classrooms based on search query and active filter
  const filteredClassrooms = useMemo(() => {
    return classrooms.filter(classroom => {
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = (
          classroom.title.toLowerCase().includes(query) ||
          classroom.speaker.toLowerCase().includes(query) ||
          (classroom.description?.toLowerCase().includes(query) || '')
        )
        if (!matchesSearch) return false
      }
      
      // Apply type filter
      switch (activeFilter) {
        case 'with-video':
          return classroom.video_url && classroom.video_url.trim() !== ''
        case 'with-assessment':
          return classroom.assessment_link && classroom.assessment_link.trim() !== ''
        default:
          return true
      }
    })
  }, [classrooms, searchQuery, activeFilter])

  // Calculate statistics from actual data
  const stats = useMemo(() => {
    const totalLectures = classrooms.length
    const totalSpeakers = [...new Set(classrooms.map(c => c.speaker))].length
    const totalDuration = classrooms.reduce((sum, c) => sum + (c.duration_minutes || 60), 0)
    const lecturesWithVideo = classrooms.filter(c => c.video_url && c.video_url.trim() !== '').length
    const lecturesWithAssessment = classrooms.filter(c => c.assessment_link && c.assessment_link.trim() !== '').length
    
    return {
      totalLectures,
      totalSpeakers,
      totalCE: Math.round(totalLectures * 1.5),
      totalDuration,
      lecturesWithVideo,
      lecturesWithAssessment,
      totalViews: classrooms.reduce((sum, c) => sum + (c.views || 0), 0)
    }
  }, [classrooms])

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Date not set'
    }
  }

  // Format duration
  const formatDuration = (minutes: number = 60) => {
    if (!minutes) return 'Duration not set'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins} minutes`
  }

  // Check if URL is YouTube
  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  // Get speaker initials
  const getSpeakerInitials = (speaker: string) => {
    if (!speaker) return '??'
    return speaker
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Handle video play
  const handleVideoPlay = (lectureId: number, videoUrl: string) => {
    if (isYouTubeUrl(videoUrl)) {
      setExpandedLecture(expandedLecture === lectureId ? null : lectureId)
    } else {
      window.open(videoUrl, '_blank')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
        <Card className="max-w-md w-full p-8 shadow-xl">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Content</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={fetchData}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
              <Link
                href={`/client/course/${courseId}`}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Back to Course Overview
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (loading.classrooms || loading.course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="text-center max-w-md">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Loading Classroom</h2>
          <p className="text-gray-600">Fetching course materials and lectures...</p>
          <div className="mt-8 w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Navigation bar */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/"
              className="flex items-center text-emerald-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Courses</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                href={`/client/course/${courseId}`}
                className="hidden md:inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Course Overview
              </Link>
              <button
                onClick={fetchData}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                title="Refresh"
              >
                <Loader2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main header content */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-lg">
              <div className="w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-semibold">Interactive Classroom</span>
              {stats.totalLectures > 0 && (
                <span className="ml-3 px-2 py-1 bg-emerald-600 rounded-full text-xs">
                  {stats.totalLectures} Lectures
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 tracking-tight">
              {course?.title || "Course Classroom"}
              {course?.category && (
                <span className="block text-2xl text-emerald-200/80 mt-3">
                  {course.category}
                </span>
              )}
            </h1>
            
            <p className="text-xl text-emerald-100/90 leading-relaxed mb-10 max-w-3xl">
              {course?.overview || course?.description || "Access all lectures and learning materials"}
            </p>
            
            {/* Stats bar */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                <div className="flex -space-x-3 mr-4">
                  {[...Array(Math.min(3, stats.totalSpeakers))].map((_, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold"
                    >
                      {getSpeakerInitials(classrooms[i]?.speaker || 'SP')}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm text-emerald-200/80">Expert Faculty</div>
                  <div className="font-bold text-lg">{stats.totalSpeakers} Speakers</div>
                </div>
              </div>
              
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                <BookOpen className="w-8 h-8 mr-4 text-emerald-300" />
                <div>
                  <div className="text-sm text-emerald-200/80">Total Content</div>
                  <div className="font-bold text-lg">{formatDuration(stats.totalDuration)}</div>
                </div>
              </div>
              
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                <Award className="w-8 h-8 mr-4 text-emerald-300" />
                <div>
                  <div className="text-sm text-emerald-200/80">CE Credits</div>
                  <div className="font-bold text-lg">{stats.totalCE} Credits</div>
                </div>
              </div>
              
              {stats.totalViews > 0 && (
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                  <Eye className="w-8 h-8 mr-4 text-emerald-300" />
                  <div>
                    <div className="text-sm text-emerald-200/80">Total Views</div>
                    <div className="font-bold text-lg">{stats.totalViews}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content area - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Search and filter section */}
            <Card className="p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Lecture Series</h2>
                  <p className="text-gray-600 mt-2">
                    Browse through {stats.totalLectures} lectures • {formatDuration(stats.totalDuration)} of content
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  {/* Search input */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search lectures, speakers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
                    />
                  </div>
                  
                  {/* Filter buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeFilter === 'all'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveFilter('with-video')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        activeFilter === 'with-video'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      With Video
                    </button>
                    <button
                      onClick={() => setActiveFilter('with-assessment')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        activeFilter === 'with-assessment'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      With Assessment
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Active filters indicator */}
              {(searchQuery || activeFilter !== 'all') && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {searchQuery && (
                      <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-2 text-emerald-600 hover:text-emerald-800"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {activeFilter !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {activeFilter === 'with-video' ? 'With Video' : 'With Assessment'}
                        <button
                          onClick={() => setActiveFilter('all')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Lectures List */}
            <div className="space-y-6">
              {filteredClassrooms.length === 0 ? (
                <Card className="p-12 text-center shadow-lg">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No lectures found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchQuery || activeFilter !== 'all'
                      ? 'No lectures match your current filters. Try adjusting your search or filters.'
                      : 'No lectures have been added to this classroom yet.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setActiveFilter('all')
                      }}
                      className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                    >
                      Clear All Filters
                    </button>
                    <Link
                      href={`/client/course/${courseId}`}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back to Course
                    </Link>
                  </div>
                </Card>
              ) : (
                filteredClassrooms.map((lecture, index) => (
                  <Card key={lecture.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    {/* Lecture Header */}
                    <div className={`p-6 ${expandedLecture === lecture.id ? 'bg-gradient-to-r from-emerald-50 to-green-50' : 'bg-white'}`}>
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        {/* Left content */}
                        <div className="flex-1 space-y-4">
                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 rounded-full text-sm font-semibold">
                              #{index + 1}
                            </span>
                            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-medium">
                              1.5 CE Credits
                            </span>
                            {lecture.video_url && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
                                <PlayCircle className="w-3 h-3 mr-1" />
                                Video Available
                              </span>
                            )}
                            {lecture.assessment_link && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                Assessment
                              </span>
                            )}
                          </div>
                          
                          {/* Title and Speaker */}
                          <div>
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-3">
                              {lecture.title}
                            </h3>
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                                <span className="text-white font-bold text-sm">
                                  {getSpeakerInitials(lecture.speaker)}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{lecture.speaker}</div>
                                {lecture.published_date && (
                                  <div className="text-sm text-gray-600 flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Published {formatDate(lecture.published_date)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
                          {lecture.video_url ? (
                            <Button 
                              variant="primary" 
                              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all"
                              onClick={() => handleVideoPlay(lecture.id, lecture.video_url)}
                            >
                              {isYouTubeUrl(lecture.video_url) ? (
                                <>
                                  <Youtube className="w-5 h-5 mr-2" />
                                  {expandedLecture === lecture.id ? 'Hide Video' : 'Watch Lecture'}
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-5 h-5 mr-2" />
                                  Play Video
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button 
                              variant="primary" 
                              className="bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                              disabled
                            >
                              <PlayCircle className="w-5 h-5 mr-2" />
                              No Video
                            </Button>
                          )}
                          
                          {lecture.assessment_link && (
                            <button 
                              className="flex items-center justify-center px-4 py-3 text-purple-600 hover:text-purple-800 font-medium text-sm border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors shadow-sm"
                              onClick={() => window.open(lecture.assessment_link, '_blank')}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Take Assessment
                            </button>
                          )}
                          {lecture.discussion_enabled && lecture.google_classroom_link && (
  <button
    onClick={() => window.open(lecture.google_classroom_link!, '_blank')}
    className="flex items-center justify-center px-4 py-3 text-emerald-700 hover:text-emerald-900 font-medium text-sm border-2 border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
  >
    <Users className="w-4 h-4 mr-2" />
    Join Classroom Discussion
  </button>
)}

                          <button 
                            onClick={() => setExpandedLecture(expandedLecture === lecture.id ? null : lecture.id)}
                            className="flex items-center justify-center px-4 py-3 text-emerald-600 hover:text-emerald-800 font-medium text-sm border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                          >
                            {expandedLecture === lecture.id ? (
                              <>
                                <Minimize2 className="w-4 h-4 mr-2" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <Maximize2 className="w-4 h-4 mr-2" />
                                Show Details
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expandable Content */}
                    {expandedLecture === lecture.id && (
                      <div className="border-t border-gray-200">
                        <div className="p-6 space-y-8 animate-in fade-in">
                          {/* Video Player Section */}
                          {lecture.video_url && isYouTubeUrl(lecture.video_url) && (
                            <div className="space-y-4">
                              <h4 className="text-lg font-bold text-gray-900 flex items-center">
                                <PlayCircle className="w-5 h-5 mr-2 text-emerald-600" />
                                Watch Lecture
                              </h4>
                              <YouTubePlayer 
                                url={lecture.video_url} 
                                title={lecture.title}
                                className="rounded-xl overflow-hidden shadow-lg"
                              />
                            </div>
                          )}
                          
                          {/* Lecture Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <div className="text-sm text-gray-600 mb-1">Duration</div>
                              <div className="font-bold text-gray-900 flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                                {formatDuration(lecture.duration_minutes)}
                              </div>
                            </div>
                            
                            {lecture.published_date && (
                              <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="text-sm text-gray-600 mb-1">Published</div>
                                <div className="font-bold text-gray-900 flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                                  {formatDate(lecture.published_date)}
                                </div>
                              </div>
                            )}
                            
                            {lecture.expiration_date && (
                              <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="text-sm text-gray-600 mb-1">Expires</div>
                                <div className="font-bold text-gray-900 flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-red-600" />
                                  {formatDate(lecture.expiration_date)}
                                </div>
                              </div>
                            )}
                            
                            {lecture.views && (
                              <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="text-sm text-gray-600 mb-1">Views</div>
                                <div className="font-bold text-gray-900 flex items-center">
                                  <Eye className="w-4 h-4 mr-2 text-blue-600" />
                                  {lecture.views.toLocaleString()}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Description */}
                          {lecture.description && (
                            <div className="space-y-3">
                              <h4 className="text-lg font-bold text-gray-900 flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                                Lecture Description
                              </h4>
                              <div className="prose prose-emerald max-w-none p-5 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                  {lecture.description}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Learning Objectives */}
                          {lecture.learning_objectives && (
                            <div className="space-y-4">
                              <h4 className="text-lg font-bold text-gray-900 flex items-center">
                                <Star className="w-5 h-5 mr-2 text-emerald-600" />
                                Learning Objectives
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {lecture.learning_objectives.split('\n').map((objective, idx) => (
                                  objective.trim() && (
                                    <div 
                                      key={idx} 
                                      className="flex items-start p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100"
                                    >
                                      <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                                      <span className="text-gray-700">{objective}</span>
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Speaker Information */}
                          {(lecture.speaker || lecture.author_description) && (
                            <Card className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 border-2 border-emerald-100">
                              <div className="p-6">
                                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                  <Users className="w-5 h-5 mr-2 text-emerald-600" />
                                  Speaker Information
                                </h4>
                                <div className="flex items-start gap-6">
                                  <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                                      <span className="text-white font-bold text-lg">
                                        {getSpeakerInitials(lecture.speaker)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-bold text-gray-900 text-lg mb-2">{lecture.speaker}</h5>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                      {lecture.author_description || "Expert speaker in the field."}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <aside className="space-y-8">
            {/* Course Info Card */}
            {course && (
              <Card className="p-6 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-10 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full mr-4"></div>
                  <h2 className="text-xl font-bold text-gray-900">Course Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <BookOpen className="w-8 h-8 text-emerald-600 mr-4" />
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Course</div>
                      <div className="font-bold text-gray-900 text-lg">{course.title}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Users className="w-8 h-8 text-emerald-600 mr-4" />
                    <div>
                      <div className="text-sm text-gray-600 font-medium">Instructor</div>
                      <div className="font-bold text-gray-900">{course.author}</div>
                    </div>
                  </div>
                  
                  {course.category && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <GraduationCap className="w-8 h-8 text-emerald-600 mr-4" />
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Category</div>
                        <div className="font-bold text-gray-900">{course.category}</div>
                      </div>
                    </div>
                  )}
                  
                  {course.specialty_name && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <Award className="w-8 h-8 text-emerald-600 mr-4" />
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Specialty</div>
                        <div className="font-bold text-gray-900">{course.specialty_name}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Classroom Statistics</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Total Lectures', value: stats.totalLectures, icon: BookOpen, color: 'emerald' },
                        { label: 'Total Duration', value: formatDuration(stats.totalDuration), icon: Clock, color: 'blue' },
                        { label: 'CE Credits', value: stats.totalCE, icon: Award, color: 'purple' },
                        { label: 'Videos Available', value: stats.lecturesWithVideo, icon: PlayCircle, color: 'red' },
                        { label: 'Assessments', value: stats.lecturesWithAssessment, icon: FileText, color: 'indigo' },
                      ].map((stat, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                              <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                            </div>
                            <span className="text-gray-700">{stat.label}</span>
                          </div>
                          <span className="font-bold text-gray-900">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Actions Card */}
            <Card className="p-6 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-2 h-10 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full mr-4"></div>
                <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const printContent = document.querySelector('.lg\\:col-span-2')
                    if (printContent) {
                      const printWindow = window.open('', '_blank')
                      printWindow?.document.write(`
                        <html>
                          <head>
                            <title>${course?.title || 'Course'} - Syllabus</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; }
                              h1 { color: #065f46; }
                              .lecture { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
                            </style>
                          </head>
                          <body>
                            <h1>${course?.title || 'Course'} - Lecture Syllabus</h1>
                            ${printContent.innerHTML}
                          </body>
                        </html>
                      `)
                      printWindow?.document.close()
                      printWindow?.print()
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-xl border border-emerald-200 transition-all hover:shadow-md"
                >
                  <div className="flex items-center">
                    <Download className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="font-medium text-gray-900">Download Syllabus</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
                
                <button 
                  onClick={() => {
                    const firstLecture = filteredClassrooms[0]
                    if (firstLecture) {
                      setExpandedLecture(firstLecture.id)
                      document.querySelector('.lg\\:col-span-2')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all hover:shadow-md"
                >
                  <div className="flex items-center">
                    <PlayCircle className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Start First Lecture</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                <Link
                  href={`/client/course/${courseId}`}
                  className="block w-full text-center p-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Back to Course Overview
                </Link>
              </div>
            </Card>

            {/* Support Card */}
            <Card className="p-6 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Need Assistance?</h3>
                  <p className="text-gray-600 text-sm">24/7 support available</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="mailto:support@yenepoya.edu"
                  className="block p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:from-emerald-100 hover:to-green-100 transition-all hover:shadow-md group"
                >
                  <div className="font-bold text-emerald-800 mb-1 group-hover:text-emerald-900">
                    support@yenepoya.edu
                  </div>
                  <div className="text-sm text-gray-600">Technical & Learning Support</div>
                </a>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Learning Resources</h4>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center p-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all group">
                      <BookOpen className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600" />
                      <span className="font-medium">Student Guide & FAQs</span>
                    </a>
                    <a href="#" className="flex items-center p-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all group">
                      <Award className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600" />
                      <span className="font-medium">CE Credit Guidelines</span>
                    </a>
                    <a href="#" className="flex items-center p-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all group">
                      <GraduationCap className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-600" />
                      <span className="font-medium">Yenepoya Dental College</span>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}