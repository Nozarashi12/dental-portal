'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Clock,
  Download,
  Edit,
  Save,
  X,
  Camera,
  Award,
  FileText,
  ChevronRight,
  LogOut,
  CheckCircle,
  School,
  BarChart,
  Settings,
  Bookmark,
  Home
} from 'lucide-react'

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: 'Rahul Verma',
    email: 'rahul.v@yenepoya.edu',
    phone: '+91 98765 43210',
    studentId: 'YD2023BDS045',
    year: '3rd Year BDS',
    college: 'Yenepoya Dental College',
    city: 'Mangalore, Karnataka',
    bio: 'Passionate dental student interested in orthodontics and oral surgery. Active participant in college events and research projects.',
    cgpa: '8.7/10',
    attendance: '92%'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ ...userData })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load student data from localStorage or API
    const savedData = localStorage.getItem('studentProfile')
    if (savedData) {
      setUserData(JSON.parse(savedData))
      setEditData(JSON.parse(savedData))
    }
  }, [])

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({ ...userData })
    }
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUserData({ ...editData })
      localStorage.setItem('studentProfile', JSON.stringify(editData))
      setIsEditing(false)
      setLoading(false)
    }, 500)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  // Mock data for student profile
  const enrolledCourses = [
    {
      id: 1,
      title: 'Basic Life Support (BLS) Certification',
      category: 'Essential Skills',
      progress: 100,
      status: 'Completed',
      completedDate: '2024-01-15',
      credits: 4,
      grade: 'A+'
    },
    {
      id: 2,
      title: 'Dental Radiology Basics',
      category: 'Pre-Clinical',
      progress: 85,
      status: 'In Progress',
      dueDate: '2024-03-20',
      credits: 3,
      grade: 'In Progress'
    },
    {
      id: 3,
      title: 'Ethics in Dental Practice',
      category: 'Professional Development',
      progress: 100,
      status: 'Completed',
      completedDate: '2023-12-10',
      credits: 2,
      grade: 'A'
    }
  ]

  const totalCredits = enrolledCourses.filter(c => c.status === 'Completed').reduce((sum, c) => sum + c.credits, 0)
  const completedCourses = enrolledCourses.filter(c => c.status === 'Completed').length

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-linear-to-b from-gray-50 to-white overflow-x-hidden">
        
        {/* Student Profile Header */}
        <section className="relative bg-linear-to-br from-blue-50 via-white to-emerald-50/30 border-b border-blue-100">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-linear(circle_at_1px_1px,rgba(37,99,235,0.1)_1px,transparent_0)] bg-size-[40px_40px]" />
          </div>
          
          <div className="relative container mx-auto px-4 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {userData.name}
                    </h1>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      Student
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2">
                      <School className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 font-medium">{userData.year}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{userData.college}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3 max-w-2xl">
                    {userData.bio}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                {/* <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download ID Card
                </button> */}
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Student Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">CGPA</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{userData.cgpa}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <BarChart className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Current Academic Score</p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Attendance</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{userData.attendance}</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Overall Attendance</p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Courses Completed</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{completedCourses}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">CDE Courses</p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Credits</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalCredits}</h3>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Earned Credits</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Student Info & Courses */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Student Information Card */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Student Information
                      </h2>
                    </div>
                    
                    <div className="p-6">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={editData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Student ID
                              </label>
                              <input
                                type="text"
                                value={editData.studentId}
                                onChange={(e) => handleInputChange('studentId', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Year
                              </label>
                              <select
                                value={editData.year}
                                onChange={(e) => handleInputChange('year', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option>1st Year BDS</option>
                                <option>2nd Year BDS</option>
                                <option>3rd Year BDS</option>
                                <option>4th Year BDS</option>
                                <option>Internship</option>
                                <option>Post-Graduate</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                CGPA
                              </label>
                              <input
                                type="text"
                                value={editData.cgpa}
                                onChange={(e) => handleInputChange('cgpa', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="8.5/10"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bio / Introduction
                            </label>
                            <textarea
                              value={editData.bio}
                              onChange={(e) => handleInputChange('bio', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={handleEditToggle}
                              className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={loading}
                              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                            >
                              {loading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  Save Changes
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">Email</span>
                              </div>
                              <p className="text-gray-900">{userData.email}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm font-medium">Phone</span>
                              </div>
                              <p className="text-gray-900">{userData.phone}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-sm font-medium">Student ID</span>
                              </div>
                              <p className="text-gray-900 font-mono">{userData.studentId}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <School className="w-4 h-4" />
                                <span className="text-sm font-medium">Current Year</span>
                              </div>
                              <p className="text-gray-900">{userData.year}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <GraduationCap className="w-4 h-4" />
                                <span className="text-sm font-medium">College</span>
                              </div>
                              <p className="text-gray-900">{userData.college}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">Location</span>
                              </div>
                              <p className="text-gray-900">{userData.city}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enrolled CDE Courses */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                        My CDE Courses
                      </h2>
                      <span className="text-sm text-blue-600 font-medium">
                        {enrolledCourses.length} courses
                      </span>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        {enrolledCourses.map((course) => (
                          <div key={course.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    course.grade === 'In Progress' 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {course.grade}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 mb-3">
                                  <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded">
                                    {course.category}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {course.credits} Credits
                                  </span>
                                </div>
                                
                                {course.status === 'In Progress' && (
                                  <div className="mb-3">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                      <span>Progress</span>
                                      <span>{course.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full rounded-full bg-blue-400"
                                        style={{ width: `${course.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                      course.status === 'Completed' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      {course.status}
                                    </div>
                                    {course.status === 'Completed' ? (
                                      <span className="text-gray-600">
                                        Completed on {course.completedDate}
                                      </span>
                                    ) : (
                                      <span className="text-gray-600">
                                        Due: {course.dueDate}
                                      </span>
                                    )}
                                  </div>
                                  <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                                    {course.status === 'Completed' ? 'View Certificate' : 'Continue Course'}
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 text-center">
                        <button className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                          Browse More Courses
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Only Quick Links */}
                <div className="space-y-8">
                  
                  {/* Quick Links Card */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-blue-600" />
                        Quick Links
                      </h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-3">
                        <a href="/" className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <span className="flex items-center gap-3">
                            <Home className="w-5 h-5 text-gray-500" />
                            <span>Home</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </a>
                        <a href="/courses" className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <span className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-gray-500" />
                            <span>Course Catalog</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </a>
                        <a href="/timetable" className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <span className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <span>Class Timetable</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </a>
                        <a href="/library" className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <span className="flex items-center gap-3">
                            <Bookmark className="w-5 h-5 text-gray-500" />
                            <span>Digital Library</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </a>
                        <a href="/assignments" className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <span className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <span>Assignments</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </a>
                        <a href="/certificates" className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <span className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-gray-500" />
                            <span>My Certificates</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </a>
                        <a href="/faq" className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <span className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-gray-500" />
                            <span>FAQ & Help</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </a>
                        <a href="/logout" className="flex items-center justify-between p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <span className="flex items-center gap-3">
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                          </span>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
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