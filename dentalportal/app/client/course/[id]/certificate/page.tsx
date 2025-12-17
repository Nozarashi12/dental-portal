'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { jsPDF } from 'jspdf'

interface CertificateData {
  id: number | null
  status: 'pending' | 'approved'
  username: string
  email: string
  course_title: string
  issued_at: string | null
  message?: string
}

// Updated Certificate Preview Component with professional design
function CertificatePreview({
  username,
  courseTitle,
  status,
  issuedAt
}: {
  username: string
  courseTitle: string
  status: 'pending' | 'approved'
  issuedAt: string | null
}) {
  return (
    <div className="relative bg-white max-w-4xl mx-auto rounded-xl shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:border-2 print:border-gray-300">
      {/* Certificate Background Pattern */}
      <div className="absolute inset-0 opacity-5 print:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23059669' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '300px'
        }}></div>
      </div>

      {/* Pending Overlay */}
      {status === 'pending' && (
        <div className="absolute inset-0 z-50 bg-white/95 flex items-center justify-center print:hidden backdrop-blur-sm">
          <div className="text-center p-10 bg-gradient-to-br from-yellow-50/95 to-amber-50/95 border-2 border-yellow-300 rounded-2xl shadow-2xl max-w-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4 border-2 border-yellow-300">
              <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-yellow-700 mb-2">PENDING</div>
            <div className="text-base text-yellow-600">Awaiting Verification & Approval</div>
          </div>
        </div>
      )}

      {/* Certificate Container */}
      <div className="relative p-10 print:p-8">
        {/* Decorative Border Elements */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 print:bg-emerald-600"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 print:bg-emerald-600"></div>
        
        {/* Ornamental Corner Designs */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-emerald-300 rounded-tl-lg print:border-emerald-400"></div>
        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-emerald-300 rounded-tr-lg print:border-emerald-400"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-emerald-300 rounded-bl-lg print:border-emerald-400"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-emerald-300 rounded-br-lg print:border-emerald-400"></div>

        {/* Header Section */}
        <div className="text-center mb-10 print:mb-8">
          {/* Institution Logo/Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full mb-6 shadow-lg print:shadow print:bg-emerald-600">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path d="M12 14l-6.16-3.422a12.076 12.076 0 010 6.844L12 14z" opacity="0.4" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent mb-3 print:text-emerald-800">
            Yenepoya Dental Medicine
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 print:text-lg">
            Continuing Dental Education
          </h2>
          
          {/* Decorative Separator */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-1 bg-emerald-400 rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full mx-2"></div>
            <div className="w-8 h-1 bg-emerald-400 rounded-full"></div>
          </div>
          
          <p className="text-sm text-gray-600 italic max-w-2xl mx-auto leading-relaxed print:text-xs">
            Advancing dental excellence through innovative education, clinical training, 
            and research since 1992. Empowering dental professionals worldwide.
          </p>
        </div>

        {/* Certificate Title with Seal */}
        <div className="text-center mb-12 print:mb-10 relative">
          {/* Background Seal Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-emerald-100 opacity-30"></div>
          </div>
          
          <h3 className="text-4xl font-bold text-gray-900 mb-8 print:text-3xl relative">
            Certificate of Completion
          </h3>
          
          {/* Official Seal */}
          <div className="inline-flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-white mb-6 print:w-20 print:h-20 shadow-lg border-4 border-emerald-200 relative">
            {/* Inner Ring */}
            <div className="absolute inset-4 rounded-full border-2 border-emerald-300"></div>
            
            {/* Seal Content */}
            <div className="text-center z-10">
              <div className="text-xs font-bold text-emerald-800 tracking-wider mb-0.5">YDM</div>
              <div className="text-[8px] font-semibold text-emerald-600 tracking-tight">CERTIFIED</div>
            </div>
            
            {/* Decorative Dots */}
            <div className="absolute top-2 left-2 w-1 h-1 bg-emerald-400 rounded-full"></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-emerald-400 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-emerald-400 rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-emerald-400 rounded-full"></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-2xl mx-auto mb-12 print:mb-10">
          {/* Recipient Section */}
          <div className="mb-10 print:mb-8">
            <p className="text-base text-gray-600 mb-8 text-center italic print:text-base">
              This certificate is proudly presented to
            </p>
            
            <div className="text-center mb-10">
              <div className="inline-block relative">
                <h4 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent py-4 px-8 print:text-2xl print:text-emerald-800">
                  {username}
                </h4>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
              </div>
            </div>
            
            <p className="text-base text-gray-600 mb-8 text-center leading-relaxed print:text-base">
              for successfully completing the Continuing Dental Education course
            </p>
            
            {/* Course Title Box */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 mb-8 border border-emerald-100 shadow-sm">
              <h5 className="text-xl font-semibold text-gray-800 text-center leading-snug print:text-lg">
                "{courseTitle}"
              </h5>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 print:mb-8">
            {/* Date of Issue */}
            {status === 'approved' && issuedAt && (
              <div className="text-center">
                <div className="mb-3">
                  <svg className="w-6 h-6 text-emerald-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-500 mb-1">Date of Issue</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(issuedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Status Badge */}
            <div className="text-center">
              <div className="mb-3">
                <div className={`w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  status === 'approved' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {status === 'approved' ? (
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Certificate Status</p>
              </div>
              <div className={`inline-flex items-center px-5 py-2 rounded-full ${
                status === 'approved' 
                  ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm' 
                  : 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 border border-yellow-200 shadow-sm'
              } print:border print:border-gray-300`}>
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  status === 'approved' ? 'bg-emerald-500' : 'bg-yellow-500'
                } print:bg-gray-500`}></div>
                <span className="font-bold text-sm tracking-wide">
                  {status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="text-center mb-10">
            <p className="text-xs text-gray-500 mb-2">Certificate ID: YDM-{Date.now().toString().slice(-8)}</p>
            <p className="text-xs text-gray-400">
              Verify this certificate at: verify.yenepoyadental.edu.in
            </p>
          </div>
        </div>

        {/* Footer Contact Information */}
        <div className="border-t border-gray-100 pt-8 text-center print:border-t print:border-gray-300">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3 print:text-sm">Contact Information</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>University Road, Deralakatte</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 824 220 4666</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>cde@yenepoya.edu.in</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 italic mt-4 print:text-xs">
            Yenepoya Dental Medicine - A Legacy of Dental Excellence Since 1992
          </p>
        </div>
      </div>
    </div>
  )
}

// Main Page Component
export default function CertificatePage() {
  const params = useParams()
  const [data, setData] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!params?.id) return
    
    const fetchCertificate = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/certificates/${params.id}`)
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Failed to fetch certificate')
        }
        const certificateData: CertificateData = await res.json()
        setData(certificateData)
      } catch (err: any) {
        console.error('Error fetching certificate:', err)
        setError(err.message || 'Could not load certificate')
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [params?.id])

  const generatePDF = async () => {
    if (!data || data.status !== 'approved') return
    
    setDownloading(true)
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Set default font
      doc.setFont('helvetica')

      // Light background color
      doc.setFillColor(240, 253, 244) // emerald-50
      doc.rect(0, 0, 297, 210, 'F')

      // Top border - solid color instead of gradient
      doc.setFillColor(5, 150, 105) // emerald-600
      doc.rect(0, 0, 297, 5, 'F')

      // Bottom border
      doc.rect(0, 205, 297, 5, 'F')

      // Institution Header
      doc.setFontSize(22)
      doc.setTextColor(5, 150, 105)
      doc.setFont('helvetica', 'bold')
      doc.text('YENEPOYA DENTAL MEDICINE', 148, 22, { align: 'center' })

      doc.setFontSize(16)
      doc.setTextColor(75, 85, 99)
      doc.setFont('helvetica', 'semibold')
      doc.text('Continuing Dental Education', 148, 32, { align: 'center' })

      // Decorative separator - solid color instead of gradient
      doc.setDrawColor(167, 243, 208) // emerald-200
      doc.setLineWidth(0.8)
      doc.line(120, 40, 176, 40)

      // Tagline
      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128)
      doc.setFont('helvetica', 'italic')
      doc.text(
        'Advancing dental excellence through innovative education, clinical training, and research since 1992.',
        148,
        48,
        { align: 'center', maxWidth: 240 }
      )

      // Certificate title
      doc.setFontSize(34)
      doc.setTextColor(15, 23, 42)
      doc.setFont('helvetica', 'bold')
      doc.text('Certificate of Completion', 148, 70, { align: 'center' })

      // Official Seal - solid colors instead of gradient
      doc.setFillColor(209, 250, 229) // emerald-100
      doc.circle(148, 93, 15, 'F')
      
      doc.setDrawColor(5, 150, 105)
      doc.setLineWidth(1.5)
      doc.circle(148, 93, 15, 'S')
      
      // Inner ring
      doc.setDrawColor(167, 243, 208)
      doc.circle(148, 93, 12, 'S')

      // Seal text
      doc.setFontSize(12)
      doc.setTextColor(5, 150, 105)
      doc.setFont('helvetica', 'bold')
      doc.text('YDM', 148, 94, { align: 'center' })
      
      doc.setFontSize(7)
      doc.text('CERTIFIED', 148, 99, { align: 'center' })

      // Recipient text
      doc.setFontSize(14)
      doc.setTextColor(75, 85, 99)
      doc.setFont('helvetica', 'normal')
      doc.text('This certificate is proudly presented to', 148, 115, { align: 'center' })

      // Recipient name with underline effect
      doc.setFontSize(32)
      doc.setTextColor(5, 150, 105)
      doc.setFont('helvetica', 'bold')
      doc.text(data.username, 148, 130, { align: 'center' })
      
      // Underline
      doc.setDrawColor(167, 243, 208)
      doc.setLineWidth(1.5)
      doc.line(110, 134, 186, 134)

      // Course completion text
      doc.setFontSize(14)
      doc.setTextColor(75, 85, 99)
      doc.setFont('helvetica', 'normal')
      doc.text('for successfully completing the Continuing Dental Education course', 148, 150, { align: 'center' })

      // Course title box
      doc.setFillColor(240, 253, 244) // emerald-50
      doc.setDrawColor(209, 250, 229) // emerald-100
      doc.roundedRect(80, 158, 137, 14, 3, 3, 'FD')
      
      doc.setFontSize(18)
      doc.setTextColor(31, 41, 55)
      doc.setFont('helvetica', 'semibold')
      doc.text(`"${data.course_title}"`, 148, 167, { align: 'center' })

      // Date and Status in two columns
      const leftX = 90
      const rightX = 206
      const baseY = 185

      // Date of Issue
      if (data.issued_at) {
        const date = new Date(data.issued_at)
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        
        // Date icon (using text as emoji)
        doc.setFontSize(12)
        doc.setTextColor(75, 85, 99)
        doc.text('📅', leftX, baseY)
        
        doc.setFontSize(12)
        doc.setTextColor(75, 85, 99)
        doc.setFont('helvetica', 'normal')
        doc.text('Date of Issue', leftX + 8, baseY)
        
        doc.setFontSize(14)
        doc.setTextColor(15, 23, 42)
        doc.setFont('helvetica', 'semibold')
        doc.text(formattedDate, leftX, baseY + 8)
      }

      // Status
      // Status icon (using checkmark)
      doc.setFontSize(12)
      doc.setTextColor(5, 150, 105)
      doc.setFont('helvetica', 'bold')
      doc.text('✓', rightX, baseY)
      
      doc.setFontSize(12)
      doc.setTextColor(75, 85, 99)
      doc.setFont('helvetica', 'normal')
      doc.text('Certificate Status', rightX + 8, baseY)
      
      doc.setFontSize(14)
      doc.setTextColor(5, 150, 105)
      doc.setFont('helvetica', 'bold')
      doc.text('APPROVED', rightX, baseY + 8)

      // Certificate ID
      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128)
      doc.setFont('helvetica', 'normal')
      doc.text(`Certificate ID: YDM-${Date.now().toString().slice(-8)}`, 148, 205, { align: 'center' })

      // Verification information
      doc.setFontSize(9)
      doc.setTextColor(156, 163, 175)
      doc.text('Verify this certificate at: verify.yenepoyadental.edu.in', 148, 210, { align: 'center' })

      // Footer contact information
      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128)
      doc.setFont('helvetica', 'normal')
      
      doc.text('Contact Information', 148, 220, { align: 'center' })
      
      doc.setFontSize(9)
      doc.text('University Road, Deralakatte, Mangalore, Karnataka 575018', 148, 225, { align: 'center' })
      doc.text('+91 824 220 4666 | cde@yenepoya.edu.in', 148, 230, { align: 'center' })
      
      doc.setFontSize(8)
      doc.setTextColor(156, 163, 175)
      doc.text('Yenepoya Dental Medicine - A Legacy of Dental Excellence Since 1992', 148, 237, { align: 'center' })

      // Add decorative corners
      doc.setLineWidth(1)
      doc.setDrawColor(5, 150, 105)
      
      // Top-left corner
      doc.line(20, 20, 30, 20)
      doc.line(20, 20, 20, 30)
      
      // Top-right corner
      doc.line(277, 20, 287, 20)
      doc.line(287, 20, 287, 30)
      
      // Bottom-left corner
      doc.line(20, 190, 20, 200)
      doc.line(20, 200, 30, 200)
      
      // Bottom-right corner
      doc.line(287, 200, 287, 190)
      doc.line(277, 200, 287, 200)

      // Save PDF
      const filename = `YDM_Certificate_${data.username.replace(/\s+/g, '_')}_${data.course_title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      doc.save(filename)

    } catch (err) {
      console.error('Error generating PDF:', err)
      alert('Error generating certificate. Please try again.')
    } finally {
      setDownloading(false)
    }
  }


  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading certificate...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your professional certificate</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Unable to load certificate</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Certificate not found</h2>
          <p className="text-gray-600">The requested certificate could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent mb-3">
            Certificate of Completion
          </h1>
          <p className="text-gray-600 text-lg">Yenepoya Dental Medicine Continuing Dental Education</p>
        </div>

        {/* Certificate Preview */}
        <div ref={certificateRef} id="certificate-preview" className="mb-10">
          <CertificatePreview
            username={data.username}
            courseTitle={data.course_title}
            status={data.status}
            issuedAt={data.issued_at}
          />
        </div>

        {/* Status Message */}
        {data.status === 'pending' ? (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-yellow-800">Certificate Pending</h3>
                  <p className="text-yellow-700 mt-2">
                    This certificate is awaiting verification and approval. 
                    You will receive a notification and be able to download it once approved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-emerald-800">Certificate Approved</h3>
                  <p className="text-emerald-700 mt-2">
                    Congratulations! This certificate has been verified and approved. 
                    You can now download or print your official certificate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {data.status === 'approved' && (
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <button
              onClick={generatePDF}
              disabled={downloading}
              className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Certificate
                </>
              )}
            </button>


           
          </div>
        )}

        {/* Certificate Information */}
        <div className="bg-white rounded-xl p-8 max-w-2xl mx-auto shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">Certificate Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Recipient Name</p>
                <p className="text-lg font-semibold text-gray-800">{data.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                <p className="text-base text-gray-700">{data.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Course Title</p>
                <p className="text-lg font-semibold text-gray-800">{data.course_title}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    data.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {data.status === 'approved' ? (
                      <>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        Approved
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Pending
                      </>
                    )}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Issue Date</p>
                  <p className="text-base font-semibold text-gray-800">
                    {data.issued_at 
                      ? new Date(data.issued_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not issued'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
          </div>
        </div>
      </div>
    </div>
  )
}