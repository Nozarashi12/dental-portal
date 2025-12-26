'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Cookies from 'js-cookie'
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, BookOpen,
  Edit, Save, X, Award, FileText, ChevronRight, LogOut,
  CheckCircle, School, BarChart, Settings, Bookmark, Home, Shield, AlertCircle,
  Briefcase, Globe
} from 'lucide-react'

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  specialty: string | null;
  college: string | null;
  city: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<UserData>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      })

      if (response.status === 401) {
        Cookies.remove('token')
        router.push('/client/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      setUserData(data.user)
      setEditData(data.user)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData(userData || {})
      setError('')
      setSuccess('')
    } else {
      setEditData(userData || {})
    }
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editData.name,
          phone: editData.phone || '',
          specialty: editData.specialty || '',
          college: editData.college || '',
          city: editData.city || '',
          bio: editData.bio || ''
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setUserData(data.user)
      setSuccess(data.message || 'Profile updated successfully!')
      
      setTimeout(() => {
        setIsEditing(false)
        setSuccess('')
      }, 2000)

    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center pt-30">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </main>
      </>
    )
  }

  if (!userData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">User not found</h2>
            <p className="text-gray-600 mb-8">Please log in to access your profile.</p>
            <button
              onClick={() => router.push('/client/login')}
              className="px-8 py-3 bg-emerald-700 text-white font-medium rounded-xl hover:bg-emerald-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Go to Login
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Enhanced Profile Header */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-white to-emerald-50"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full -translate-x-64 translate-y-64 opacity-30"></div>
          
          <div className="container mx-auto px-4 lg:px-8 py-10 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white ring-offset-2">
                      {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        {userData.name}
                      </h1>
                      <span className={`px-4 py-1.5 text-sm font-semibold rounded-full border ${
                        userData.role === 'admin' 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {userData.role === 'admin' ? 'Administrator' : 'Professional Member'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">{userData.email}</span>
                      </div>
                      {userData.city && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Globe className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium">{userData.city}</span>
                        </div>
                      )}
                    </div>
                    
                    {userData.bio ? (
                      <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">
                        "{userData.bio}"
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">
                        {isEditing ? 'Add a professional bio...' : 'Share your professional journey with a bio'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleEditToggle}
                    className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isEditing 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' 
                        : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-5 h-5 mr-2" />
                        Cancel Edit
                      </>
                    ) : (
                      <>
                        <Edit className="w-5 h-5 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success/Error Messages */}
        {(success || error) && (
          <div className="container mx-auto px-4 lg:px-8 pt-6">
            <div className="max-w-7xl mx-auto">
              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 animate-fade-in">
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <p className="text-sm font-medium text-emerald-800">{success}</p>
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <section className="py-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Single Stats Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Account Type</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2 capitalize">
                        {userData.role === 'admin' ? 'Administrator' : 'Professional'}
                      </h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <Shield className="w-7 h-7 text-emerald-700" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Verified account with full access</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Mem Since</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">
                        {new Date(userData.created_at).getFullYear()}
                      </h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Calendar className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {new Date(userData.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Last Updated</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">
                        {new Date(userData.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <FileText className="w-7 h-7 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Profile details last updated</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - User Info */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 rounded-lg">
                            <User className="w-6 h-6 text-emerald-700" />
                          </div>
                          <h2 className="text-xl font-bold text-gray-900">
                            Professional Information
                          </h2>
                        </div>
                        <div className="text-sm text-gray-500">
                          {isEditing ? 'Edit Mode' : 'View Mode'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {isEditing ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Full Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={editData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Email Address
                              </label>
                              <input
                                type="email"
                                value={editData.email || ''}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                              />
                              <p className="text-xs text-gray-400 mt-2">Contact support to change email</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={editData.phone || ''}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="+91 98765 43210"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Professional Specialty
                              </label>
                              <select
                                value={editData.specialty || ''}
                                onChange={(e) => handleInputChange('specialty', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                              >
                                <option value="">Select your specialty</option>
                                <option value="general">General Dentistry</option>
                                <option value="ortho">Orthodontics</option>
                                <option value="endo">Endodontics</option>
                                <option value="perio">Periodontics</option>
                                <option value="prostho">Prosthodontics</option>
                                <option value="oral_surgery">Oral Surgery</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                College/Institution
                              </label>
                              <input
                                type="text"
                                value={editData.college || ''}
                                onChange={(e) => handleInputChange('college', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="Enter your institution"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                City & Location
                              </label>
                              <input
                                type="text"
                                value={editData.city || ''}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="e.g., Mangalore, Karnataka"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                              Professional Bio
                            </label>
                            <textarea
                              value={editData.bio || ''}
                              onChange={(e) => handleInputChange('bio', e.target.value)}
                              rows={4}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                              placeholder="Share your professional background, expertise, and interests..."
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              This will be displayed on your public profile
                            </p>
                          </div>
                          
                          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={handleEditToggle}
                              className="px-6 py-3 text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300"
                            >
                              Discard Changes
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="px-6 py-3 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {saving ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                  Saving Changes...
                                </>
                              ) : (
                                <>
                                  <Save className="w-5 h-5 mr-2" />
                                  Save Profile
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div className="group">
                                <div className="flex items-center gap-3 text-gray-600 mb-2">
                                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                    <Mail className="w-5 h-5" />
                                  </div>
                                  <span className="text-sm font-semibold">Email Address</span>
                                </div>
                                <p className="text-gray-900 text-lg font-medium pl-11">{userData.email}</p>
                              </div>
                              
                              <div className="group">
                                <div className="flex items-center gap-3 text-gray-600 mb-2">
                                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                    <Phone className="w-5 h-5" />
                                  </div>
                                  <span className="text-sm font-semibold">Phone Number</span>
                                </div>
                                <p className="text-gray-900 text-lg font-medium pl-11">
                                  {userData.phone || <span className="text-gray-400">Not provided</span>}
                                </p>
                              </div>
                              
                              <div className="group">
                                <div className="flex items-center gap-3 text-gray-600 mb-2">
                                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                    <Briefcase className="w-5 h-5" />
                                  </div>
                                  <span className="text-sm font-semibold">Specialty</span>
                                </div>
                                <p className="text-gray-900 text-lg font-medium pl-11">
                                  {userData.specialty ? 
                                    userData.specialty.replace('_', ' ').split(' ').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ') 
                                    : <span className="text-gray-400">Not specified</span>
                                  }
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <div className="group">
                                <div className="flex items-center gap-3 text-gray-600 mb-2">
                                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                    <School className="w-5 h-5" />
                                  </div>
                                  <span className="text-sm font-semibold">College/Institution</span>
                                </div>
                                <p className="text-gray-900 text-lg font-medium pl-11">
                                  {userData.college || <span className="text-gray-400">Not specified</span>}
                                </p>
                              </div>
                              
                              <div className="group">
                                <div className="flex items-center gap-3 text-gray-600 mb-2">
                                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                    <MapPin className="w-5 h-5" />
                                  </div>
                                  <span className="text-sm font-semibold">Location</span>
                                </div>
                                <p className="text-gray-900 text-lg font-medium pl-11">
                                  {userData.city || <span className="text-gray-400">Not specified</span>}
                                </p>
                              </div>
                              
                              <div className="group">
                                <div className="flex items-center gap-3 text-gray-600 mb-2">
                                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                    <Calendar className="w-5 h-5" />
                                  </div>
                                  <span className="text-sm font-semibold">Member Since</span>
                                </div>
                                <p className="text-gray-900 text-lg font-medium pl-11">
                                  {new Date(userData.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {userData.bio && (
                            <div className="pt-6 border-t border-gray-100">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Bio</h3>
                              <div className="bg-gray-50 rounded-xl p-6">
                                <p className="text-gray-700 leading-relaxed">
                                  {userData.bio}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Quick Links & Actions */}
                <div className="space-y-8">
                  {/* Account Actions Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <Settings className="w-6 h-6 text-emerald-700" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Account Actions
                        </h2>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-3">
                        <button
                          onClick={() => router.push('/')}
                          className="flex items-center justify-between p-4 text-gray-800 hover:bg-emerald-50 rounded-xl transition-all duration-300 w-full text-left group border border-transparent hover:border-emerald-100"
                        >
                          <span className="flex items-center gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                              <Home className="w-5 h-5 text-gray-600 group-hover:text-emerald-700" />
                            </div>
                            <div>
                              <span className="font-semibold block">Dashboard Home</span>
                              <span className="text-sm text-gray-500">Return to main dashboard</span>
                            </div>
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                        </button>
                        
                        <button
                          onClick={() => router.push('/client/faq')}
                          className="flex items-center justify-between p-4 text-gray-800 hover:bg-emerald-50 rounded-xl transition-all duration-300 w-full text-left group border border-transparent hover:border-emerald-100"
                        >
                          <span className="flex items-center gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                              <BookOpen className="w-5 h-5 text-gray-600 group-hover:text-emerald-700" />
                            </div>
                            <div>
                              <span className="font-semibold block">Help & Support</span>
                              <span className="text-sm text-gray-500">FAQs and documentation</span>
                            </div>
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                        </button>
                        
                        <button
                          onClick={() => {
                            Cookies.remove('token')
                            router.push('/client/login')
                          }}
                          className="flex items-center justify-between p-4 text-gray-800 hover:bg-red-50 rounded-xl transition-all duration-300 w-full text-left group border border-transparent hover:border-red-100 mt-6"
                        >
                          <span className="flex items-center gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-red-100 transition-colors">
                              <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                            </div>
                            <div>
                              <span className="font-semibold block">Sign Out</span>
                              <span className="text-sm text-gray-500">Securely logout from account</span>
                            </div>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Account Status Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Award className="w-6 h-6 text-emerald-700" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Account Status</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Profile Completeness</span>
                        <span className="font-bold text-emerald-700">
                          {[
                            userData.name,
                            userData.email,
                            userData.phone,
                            userData.specialty,
                            userData.bio
                          ].filter(Boolean).length * 20}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${[
                              userData.name,
                              userData.email,
                              userData.phone,
                              userData.specialty,
                              userData.bio
                            ].filter(Boolean).length * 20}%` 
                          }}
                        ></div>
                      </div>
                      
                      <p className="text-sm text-gray-600 pt-2">
                        Complete your profile for better experience
                      </p>
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