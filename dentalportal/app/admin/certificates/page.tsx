'use client'

import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  email: string
}

interface Course {
  id: number
  title: string
}

interface Certificate {
  id: number
  user_id: number
  course_id: number
  username: string
  email: string
  course_title: string
  status: 'pending' | 'approved'
  issued_at: string | null
}

export default function AdminCertificatesPage() {
  // State for data
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  
  // State for creating new certificate
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  
  // State for editing certificate
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [editStatus, setEditStatus] = useState<'pending' | 'approved'>('pending')
  const [editIssuedAt, setEditIssuedAt] = useState<string>('')
  
  // State for deleting certificate
  const [deletingCertificateId, setDeletingCertificateId] = useState<number | null>(null)
  
  // Loading and error states
  const [loading, setLoading] = useState({
    users: true,
    courses: true,
    certificates: true,
    approving: false,
    updating: false,
    deleting: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedUserName, setSelectedUserName] = useState('')
  const [selectedCourseName, setSelectedCourseName] = useState('')

  // Fetch all data - NO AUTH CHECKS
  const fetchData = async () => {
    try {
      setLoading({ 
        users: true, 
        courses: true, 
        certificates: true, 
        approving: false,
        updating: false,
        deleting: false
      })
      setError('')
      
      // Fetch data without authentication checks
      const [usersRes, coursesRes, certsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/courses'),
        fetch('/api/admin/certificates')
      ])

      // Handle response errors
      if (!usersRes.ok) {
        const errorText = await usersRes.text()
        throw new Error(`Failed to fetch users: ${usersRes.status}`)
      }
      if (!coursesRes.ok) {
        const errorText = await coursesRes.text()
        throw new Error(`Failed to fetch courses: ${coursesRes.status}`)
      }
      if (!certsRes.ok) {
        const errorText = await certsRes.text()
        throw new Error(`Failed to fetch certificates: ${certsRes.status}`)
      }

      const [usersData, coursesData, certsData] = await Promise.all([
        usersRes.json(),
        coursesRes.json(),
        certsRes.json()
      ])

      // Handle API response structure (may contain warning for development)
      setUsers(usersData.data || usersData)
      setCourses(coursesData.data || coursesData)
      setCertificates(certsData.data || certsData)
    } catch (err: any) {
      setError(err.message || 'Error loading data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading({ 
        users: false, 
        courses: false, 
        certificates: false, 
        approving: false,
        updating: false,
        deleting: false
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Update selected user/course names
  useEffect(() => {
    if (selectedUserId) {
      const user = users.find(u => u.id.toString() === selectedUserId)
      setSelectedUserName(user ? `${user.name} (${user.email})` : '')
    } else {
      setSelectedUserName('')
    }

    if (selectedCourseId) {
      const course = courses.find(c => c.id.toString() === selectedCourseId)
      setSelectedCourseName(course ? course.title : '')
    } else {
      setSelectedCourseName('')
    }
  }, [selectedUserId, selectedCourseId, users, courses])

  // Create new certificate - NO AUTH CHECKS
  const createCertificate = async () => {
    if (!selectedUserId || !selectedCourseId) {
      setError('Please select both a user and a course')
      return
    }

    const alreadyExists = certificates.some(
      cert => cert.user_id.toString() === selectedUserId && 
               cert.course_id.toString() === selectedCourseId
    )

    if (alreadyExists) {
      setError('This user already has a certificate for this course')
      return
    }

    setError('')
    setSuccess('')
    setLoading(prev => ({ ...prev, approving: true }))

    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(selectedUserId),
          course_id: parseInt(selectedCourseId),
          status: 'approved'
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Certificate created successfully!')
        setSelectedUserId('')
        setSelectedCourseId('')
        fetchData() // Refresh all data
      } else {
        setError(data.message || 'Error creating certificate')
      }
    } catch (err: any) {
      console.error('Error creating certificate:', err)
      setError(err.message || 'Error creating certificate')
    } finally {
      setLoading(prev => ({ ...prev, approving: false }))
    }
  }

  // Update certificate status - NO AUTH CHECKS
  const updateCertificate = async () => {
    if (!editingCertificate) return

    setError('')
    setSuccess('')
    setLoading(prev => ({ ...prev, updating: true }))

    try {
      const res = await fetch(`/api/admin/certificates/${editingCertificate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          issued_at: editStatus === 'approved' && !editingCertificate.issued_at 
            ? new Date().toISOString() 
            : editingCertificate.issued_at
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Certificate updated successfully!')
        setEditingCertificate(null)
        fetchData() // Refresh all data
      } else {
        setError(data.message || 'Error updating certificate')
      }
    } catch (err: any) {
      console.error('Error updating certificate:', err)
      setError(err.message || 'Error updating certificate')
    } finally {
      setLoading(prev => ({ ...prev, updating: false }))
    }
  }

  // Delete certificate - NO AUTH CHECKS
  const deleteCertificate = async () => {
    if (!deletingCertificateId) return

    setError('')
    setSuccess('')
    setLoading(prev => ({ ...prev, deleting: true }))

    try {
      const res = await fetch(`/api/admin/certificates/${deletingCertificateId}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Certificate deleted successfully!')
        setDeletingCertificateId(null)
        fetchData() // Refresh all data
      } else {
        setError(data.message || 'Error deleting certificate')
      }
    } catch (err: any) {
      console.error('Error deleting certificate:', err)
      setError(err.message || 'Error deleting certificate')
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }))
    }
  }

  // Open edit modal
  const openEditModal = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setEditStatus(certificate.status)
    setEditIssuedAt(certificate.issued_at || '')
  }

  // Open delete confirmation
  const openDeleteConfirmation = (certificateId: number) => {
    setDeletingCertificateId(certificateId)
  }

  // Check if certificate exists
  const certificateExists = (userId: string, courseId: string) => {
    return certificates.some(
      cert => cert.user_id.toString() === userId && 
               cert.course_id.toString() === courseId
    )
  }

  // Get existing certificates for user/course info
  const getUserCertificates = (userId: string) => {
    return certificates.filter(cert => cert.user_id.toString() === userId)
  }

  const getCourseCertificates = (courseId: string) => {
    return certificates.filter(cert => cert.course_id.toString() === courseId)
  }

  const isLoading = loading.users || loading.courses || loading.certificates

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Certificate Management</h1>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Development Warning */}
      {/* <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-yellow-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">Development Mode</p>
            <p className="text-sm text-yellow-700">Authentication is disabled for testing purposes.</p>
          </div>
        </div>
      </div> */}

      {/* Create Certificate Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Certificate</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Select User {loading.users && '(Loading...)'}
            </label>
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              disabled={loading.users}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Select User --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Select Course {loading.courses && '(Loading...)'}
            </label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              disabled={loading.courses}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Select Course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedUserId && selectedCourseId && (
          <div className="mb-6">
            <div className={`p-4 rounded-lg border ${
              certificateExists(selectedUserId, selectedCourseId) 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-blue-50 border-blue-100'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {certificateExists(selectedUserId, selectedCourseId) ? (
                    <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`font-medium ${
                    certificateExists(selectedUserId, selectedCourseId) 
                      ? 'text-yellow-800' 
                      : 'text-blue-800'
                  }`}>
                    {certificateExists(selectedUserId, selectedCourseId) 
                      ? '⚠️ Certificate already exists' 
                      : '✅ Ready to create certificate'}
                  </p>
                  <p className="text-sm mt-1 text-gray-700">
                    User: <span className="font-semibold">{selectedUserName}</span>
                    <br/>
                    Course: <span className="font-semibold">{selectedCourseName}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={createCertificate}
          disabled={!selectedUserId || !selectedCourseId || loading.approving || certificateExists(selectedUserId, selectedCourseId)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading.approving ? 'Creating...' : 'Create Certificate'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.66 0-1.293-.102-1.896-.292L17 21m-1.121-9.121A6 6 0 0117 9m-6 12l-1-1 2-4-4-2-1 1" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Courses</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Certificates</p>
              <p className="text-2xl font-bold">{certificates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">
                {certificates.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">All Certificates</h2>
            <p className="text-sm text-gray-500 mt-1">
              {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} • 
              <span className="text-green-600 ml-2">
                {certificates.filter(c => c.status === 'approved').length} Approved
              </span>
              <span className="text-yellow-600 ml-2">
                {certificates.filter(c => c.status === 'pending').length} Pending
              </span>
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading.certificates}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        {loading.certificates ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-lg mb-2">No certificates yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issued Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map(cert => (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {cert.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{cert.username}</div>
                          <div className="text-sm text-gray-500">{cert.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{cert.course_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        cert.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {cert.status === 'approved' ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cert.issued_at 
                        ? new Date(cert.issued_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'Not issued'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(cert)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteConfirmation(cert.id)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Certificate Modal */}
      {editingCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Certificate</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User
                </label>
                <p className="text-gray-900">{editingCertificate.username}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <p className="text-gray-900">{editingCertificate.course_title}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'pending' | 'approved')}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              {editStatus === 'approved' && !editingCertificate.issued_at && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    Setting status to "Approved" will automatically set the issue date to today.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingCertificate(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={updateCertificate}
                  disabled={loading.updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading.updating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCertificateId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Certificate</h3>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this certificate? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeletingCertificateId(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteCertificate}
                  disabled={loading.deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading.deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}