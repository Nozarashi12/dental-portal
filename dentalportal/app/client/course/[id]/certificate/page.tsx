// app/course/[id]/certificate/page.tsx
"use client";

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

export default function CertificatePage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'share' | 'history'>('preview');
  const [certificateData] = useState({
    studentName: 'Dr. Sarah Johnson',
    date: 'December 15, 2024',
    certificateId: 'PDM-DIS-2024-001234',
    courseName: 'Persons with Disabilities Presentation Series',
    courseHours: '66',
    ceCredits: '44',
    instructor: 'Dr. Michael Chen, DDS',
    director: 'Dr. Elizabeth Rodriguez, Dean of Continuing Education',
    verificationUrl: 'https://verify.penndental.edu/cert/PDM-DIS-2024-001234',
    issueDate: 'December 15, 2024',
    expiryDate: 'December 15, 2027',
    specialization: 'Disabilities Dentistry Clinician Expert'
  });

  const handlePrint = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${certificateData.certificateId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `${certificateData.certificateId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Certificate - Penn Dental Medicine',
          text: `I completed the ${certificateData.courseName} course!`,
          url: certificateData.verificationUrl
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(certificateData.verificationUrl);
      alert('Verification link copied to clipboard!');
    }
  };

  const certificateHistory = [
    {
      id: 1,
      name: 'Basic Life Support Certification',
      date: 'November 20, 2024',
      status: 'active'
    },
    {
      id: 2,
      name: 'Advanced Pediatric Dentistry',
      date: 'October 15, 2024',
      status: 'active'
    },
    {
      id: 3,
      name: 'Infection Control Masterclass',
      date: 'September 5, 2024',
      status: 'expired'
    }
  ];

  return (
      <div className="w-full max-w-[100vw] overflow-x-hidden">
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <nav className="flex items-center text-sm text-gray-600 mb-3">
                <a href="#" className="hover:text-emerald-600">Courses</a>
                <span className="mx-2">/</span>
                <a href="#" className="hover:text-emerald-600">Disabilities Dentistry</a>
                <span className="mx-2">/</span>
                <span className="text-emerald-600 font-medium">Certificate</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Course Certificate</h1>
              <p className="text-gray-600 mt-2">
                Congratulations! You've earned a professional certification. Download, print, or share your achievement.
              </p>
            </div>
            
           
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-gray-200 mt-6">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors duration-200 ${activeTab === 'preview' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              🏆 Certificate Preview
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors duration-200 ${activeTab === 'share' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              🔗 Share & Verify
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors duration-200 ${activeTab === 'history' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              📜 Certificate History
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'preview' && (
          <div className="space-y-8">
            {/* Certificate Preview */}
            <div className="relative">
              {/* Decorative elements - Emerald theme */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-green-50 rounded-full translate-x-1/3 translate-y-1/3 opacity-30"></div>
              
              {/* Certificate Container */}
              <div 
                ref={certificateRef}
                className="relative bg-white border-2 border-gray-200 rounded-3xl shadow-2xl overflow-hidden"
              >
                {/* Certificate Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2310b981' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '600px'
                  }}></div>
                </div>

                {/* University Seal - Emerald theme */}
                <div className="absolute top-8 left-8 w-24 h-24 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs text-center p-2">
                  PENN DENTAL MEDICINE
                </div>

                {/* Certificate Content */}
                <div className="relative p-8 lg:p-12">
                  <div className="text-center max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                      <div className="flex justify-center mb-8">
                        <div className="w-32 h-32 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center shadow-2xl">
                          <span className="text-6xl">🏆</span>
                        </div>
                      </div>
                      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Certificate of Completion
                      </h1>
                      <div className="h-1.5 w-48 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mb-6"></div>
                      <p className="text-2xl text-gray-600 font-light">
                        This is to certify that
                      </p>
                    </div>

                    {/* Student Name */}
                    <div className="mb-16">
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 border-b-8 border-emerald-300 pb-8 inline-block px-16">
                        {certificateData.studentName}
                      </h2>
                      <div className="mt-4 text-xl text-gray-600">
                        DDS, MSD • Licensed Dental Practitioner
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="mb-16">
                      <p className="text-2xl text-gray-700 mb-8 leading-relaxed">
                        has successfully completed and demonstrated exceptional proficiency in
                      </p>
                      <h3 className="text-3xl lg:text-4xl font-bold text-emerald-800 mb-6 leading-tight">
                        {certificateData.courseName}
                      </h3>
                      <p className="text-xl text-gray-600 mb-8">
                        Specializing in: <span className="font-bold text-gray-900">{certificateData.specialization}</span>
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                          <div className="text-4xl font-bold text-emerald-700 mb-2">{certificateData.courseHours}</div>
                          <div className="text-gray-700">Hours of Instruction</div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                          <div className="text-4xl font-bold text-emerald-700 mb-2">{certificateData.ceCredits}</div>
                          <div className="text-gray-700">CE Credits Earned</div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                          <div className="text-4xl font-bold text-amber-700 mb-2">3 Years</div>
                          <div className="text-gray-700">Certification Valid Until</div>
                        </div>
                      </div>
                    </div>

                    {/* Signatures and Date */}
                    <div className="flex flex-col lg:flex-row justify-between items-center mt-16 pt-12 border-t-2 border-gray-300">
                      <div className="text-center mb-8 lg:mb-0">
                        <div className="relative mb-4">
                          <div className="h-24 w-48 mx-auto relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-10 rounded-lg"></div>
                            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-green-500 mt-16"></div>
                          </div>
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl">✍️</div>
                        </div>
                        <p className="font-bold text-gray-900">{certificateData.instructor}</p>
                        <p className="text-gray-600">Course Instructor</p>
                      </div>
                      
                      <div className="text-center mb-8 lg:mb-0">
                        <div className="relative mb-4">
                          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-3xl">🏛️</span>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900 mb-2">{certificateData.date}</p>
                        <p className="text-gray-600">Date of Issue</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="relative mb-4">
                          <div className="h-24 w-48 mx-auto relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-10 rounded-lg"></div>
                            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-green-500 mt-16"></div>
                          </div>
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl">📋</div>
                        </div>
                        <p className="font-bold text-gray-900">{certificateData.director}</p>
                        <p className="text-gray-600">Director of Continuing Education</p>
                      </div>
                    </div>

                    {/* Certificate ID and Verification */}
                    <div className="mt-16 pt-12 border-t-2 border-gray-300">
                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Certificate ID</p>
                            <p className="text-xl font-mono font-bold text-gray-900">
                              {certificateData.certificateId}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Valid Until</p>
                            <p className="text-xl font-bold text-gray-900">
                              {certificateData.expiryDate}
                            </p>
                          </div>
                        </div>
                        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                          <p className="text-sm text-gray-600">
                            Verify this certificate at: 
                            <a 
                              href={certificateData.verificationUrl}
                              className="ml-2 text-emerald-600 hover:text-emerald-800 break-all"
                            >
                              {certificateData.verificationUrl}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Certificate Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={handlePrint}
                    disabled={isGenerating}
                    className="group relative bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6 hover:border-emerald-400 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                        <span className="text-2xl text-white">🖨️</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Print Certificate</h3>
                      <p className="text-sm text-gray-600 text-center">High-quality PDF for printing</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleDownloadImage}
                    disabled={isGenerating}
                    className="group relative bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6 hover:border-emerald-400 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                        <span className="text-2xl text-white">📥</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Download PNG</h3>
                      <p className="text-sm text-gray-600 text-center">High-resolution image file</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="group relative bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6 hover:border-emerald-400 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                        <span className="text-2xl text-white">🔗</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Share & Verify</h3>
                      <p className="text-sm text-gray-600 text-center">Share your achievement online</p>
                    </div>
                  </button>
                </div>
                
                {isGenerating && (
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mr-3"></div>
                      <span className="text-emerald-700">Generating certificate file...</span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'share' && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mr-6">
                  <span className="text-3xl">🔗</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Share Your Achievement</h2>
                  <p className="text-gray-600 mt-1">Showcase your certification and verify its authenticity</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Verification Link */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Verification Link</h3>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={certificateData.verificationUrl}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-white"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(certificateData.verificationUrl)}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-r-lg font-medium hover:shadow-md"
                    >
                      Copy Link
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Share this link for anyone to verify your certificate's authenticity
                  </p>
                </div>

                {/* Social Sharing */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Share on Social Media</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { platform: 'LinkedIn', icon: '💼', color: 'from-emerald-500 to-emerald-700' },
                      { platform: 'Twitter', icon: '🐦', color: 'from-emerald-400 to-green-600' },
                      { platform: 'Facebook', icon: '👥', color: 'from-emerald-600 to-green-800' },
                      { platform: 'Email', icon: '✉️', color: 'from-gray-500 to-gray-700' }
                    ].map((social) => (
                      <button
                        key={social.platform}
                        className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${social.color} flex items-center justify-center mb-3`}>
                            <span className="text-xl text-white">{social.icon}</span>
                          </div>
                          <span className="font-medium text-gray-900">{social.platform}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Embed Code */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Embed on Your Website</h3>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                    {`<div class="penn-certificate-badge" data-id="${certificateData.certificateId}"></div>`}
                    <br />
                    {`<script src="https://verify.penndental.edu/badge.js"></script>`}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Add this code to your website to display a verified certification badge
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mr-6">
                  <span className="text-3xl">📜</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Certificate History</h2>
                  <p className="text-gray-600 mt-1">View all your completed certifications from Penn Dental Medicine</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Current Certificate */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mr-3">
                          Active
                        </span>
                        <h3 className="font-bold text-gray-900">{certificateData.courseName}</h3>
                      </div>
                      <p className="text-gray-600 mt-1">
                        Certificate ID: {certificateData.certificateId} • Issued: {certificateData.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-emerald-700">Current</div>
                      <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Previous Certificates */}
                {certificateHistory.map((cert) => (
                  <Card key={cert.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${
                            cert.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {cert.status === 'active' ? 'Active' : 'Expired'}
                          </span>
                          <h3 className="font-medium text-gray-900">{cert.name}</h3>
                        </div>
                        <p className="text-gray-600 mt-1">
                          Completed: {cert.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
    </div>
  );
}