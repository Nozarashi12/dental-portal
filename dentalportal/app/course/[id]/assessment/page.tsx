// app/course/[id]/assessment/page.tsx
"use client";

import { useState } from 'react';

interface Assessment {
  id: number;
  title: string;
  type: 'quiz' | 'assignment' | 'exam' | 'self-assessment';
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue' | 'in-progress';
  score?: number;
  total: number;
  timeEstimate: string;
  attempts: number;
  maxAttempts: number;
  description?: string;
  topics: string[];
}

export default function AssessmentPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const assessments: Assessment[] = [
    {
      id: 1,
      title: 'SDF Application Techniques Quiz',
      type: 'quiz',
      dueDate: 'Dec 20, 2024',
      status: 'completed',
      score: 42,
      total: 50,
      timeEstimate: '15 min',
      attempts: 1,
      maxAttempts: 3,
      description: 'Test your knowledge of Silver Diamine Fluoride application procedures for patients with special needs.',
      topics: ['SDF', 'Clinical Techniques', 'Preventive Care']
    },
    {
      id: 2,
      title: 'Behavior Management Case Study Analysis',
      type: 'assignment',
      dueDate: 'Dec 25, 2024',
      status: 'pending',
      total: 100,
      timeEstimate: '2 hours',
      attempts: 0,
      maxAttempts: 1,
      description: 'Analyze a case study and develop a comprehensive behavior management plan for a patient with autism spectrum disorder.',
      topics: ['Behavior Management', 'Case Study', 'Autism Spectrum']
    },
    {
      id: 3,
      title: 'Mid-Term Clinical Knowledge Exam',
      type: 'exam',
      dueDate: 'Dec 15, 2024',
      status: 'overdue',
      total: 200,
      timeEstimate: '3 hours',
      attempts: 0,
      maxAttempts: 2,
      description: 'Comprehensive examination covering modules 1-8 on disability dentistry principles and clinical applications.',
      topics: ['Clinical Knowledge', 'Comprehensive Exam', 'Disability Dentistry']
    },
    {
      id: 4,
      title: 'Communication Strategies Self-Assessment',
      type: 'self-assessment',
      dueDate: 'Jan 10, 2025',
      status: 'in-progress',
      score: 15,
      total: 25,
      timeEstimate: '30 min',
      attempts: 1,
      maxAttempts: 1,
      description: 'Reflect on your communication techniques with patients who have sensory impairments.',
      topics: ['Communication', 'Self-Reflection', 'Sensory Impairments']
    },
    {
      id: 5,
      title: 'Equipment Adaptation Practical Assignment',
      type: 'assignment',
      dueDate: 'Jan 5, 2025',
      status: 'pending',
      total: 75,
      timeEstimate: '4 hours',
      attempts: 0,
      maxAttempts: 1,
      description: 'Design adaptive equipment modifications for a dental practice serving wheelchair users.',
      topics: ['Equipment', 'Practice Management', 'Accessibility']
    },
    {
      id: 6,
      title: 'Final Certification Exam',
      type: 'exam',
      dueDate: 'Jan 30, 2025',
      status: 'pending',
      total: 300,
      timeEstimate: '4 hours',
      attempts: 0,
      maxAttempts: 1,
      description: 'Final comprehensive exam for the Disabilities Dentistry Clinician Expert certification.',
      topics: ['Certification', 'Comprehensive', 'Final Exam']
    }
  ];

  const filteredAssessments = assessments.filter(assessment => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return assessment.status === 'completed';
    if (activeFilter === 'pending') return assessment.status === 'pending';
    if (activeFilter === 'overdue') return assessment.status === 'overdue';
    return true;
  });

  const getStatusConfig = (status: Assessment['status']) => {
    switch (status) {
      case 'completed':
        return { 
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: '✅',
          label: 'Completed'
        };
      case 'pending':
        return { 
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: '⏳',
          label: 'Pending'
        };
      case 'overdue':
        return { 
          color: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: '⚠️',
          label: 'Overdue'
        };
      case 'in-progress':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '▶️',
          label: 'In Progress'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '📋',
          label: status
        };
    }
  };

  const getTypeConfig = (type: Assessment['type']) => {
    switch (type) {
      case 'quiz':
        return { 
          color: 'from-blue-500 to-indigo-500',
          icon: '📝',
          label: 'Quiz'
        };
      case 'assignment':
        return { 
          color: 'from-purple-500 to-pink-500',
          icon: '📄',
          label: 'Assignment'
        };
      case 'exam':
        return { 
          color: 'from-orange-500 to-red-500',
          icon: '📚',
          label: 'Exam'
        };
      case 'self-assessment':
        return { 
          color: 'from-teal-500 to-emerald-500',
          icon: '🧠',
          label: 'Self-Assessment'
        };
      default:
        return { 
          color: 'from-gray-500 to-gray-600',
          icon: '📋',
          label: type
        };
    }
  };

  const calculateOverallProgress = () => {
    const completed = assessments.filter(a => a.status === 'completed').length;
    const total = assessments.length;
    return Math.round((completed / total) * 100);
  };

  const calculateAverageScore = () => {
    const completed = assessments.filter(a => a.status === 'completed' && a.score !== undefined);
    if (completed.length === 0) return 0;
    const totalScore = completed.reduce((sum, a) => sum + (a.score || 0), 0);
    const totalPossible = completed.reduce((sum, a) => sum + a.total, 0);
    return Math.round((totalScore / totalPossible) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center text-sm text-gray-600 mb-3">
                <a href="#" className="hover:text-blue-600">Courses</a>
                <span className="mx-2">/</span>
                <a href="#" className="hover:text-blue-600">Disabilities Dentistry</a>
                <span className="mx-2">/</span>
                <span className="text-blue-600 font-medium">Assessments</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">Course Assessments</h1>
              <p className="text-gray-600 mt-2 max-w-3xl">
                Track your progress through quizzes, assignments, and exams for the Persons with Disabilities Presentation Series
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                Resume Last Assessment
              </button>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer">
                  AJ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{calculateOverallProgress()}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  style={{ width: `${calculateOverallProgress()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>{assessments.filter(a => a.status === 'completed').length}/{assessments.length} completed</span>
                <span>{calculateOverallProgress()}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{calculateAverageScore()}%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Based on {assessments.filter(a => a.status === 'completed').length} completed assessments
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Next due: Dec 25, 2024
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">CE Credits</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Earned from assessments
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {(['all', 'pending', 'completed', 'overdue'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeFilter === filter 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option>All Types</option>
                <option>Quizzes</option>
                <option>Assignments</option>
                <option>Exams</option>
              </select>
              <span className="absolute left-3 top-2.5 text-gray-400">📊</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <span className="text-xl">⏹️</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <span className="text-xl">📋</span>
              </button>
            </div>
            <button className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
              Export Results
            </button>
          </div>
        </div>

        {/* Assessments Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment) => (
              <div 
                key={assessment.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                onClick={() => {
                  setSelectedAssessment(assessment.id);
                  setIsModalOpen(true);
                }}
              >
                {/* Assessment Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getTypeConfig(assessment.type).color} flex items-center justify-center`}>
                      <span className="text-2xl">{getTypeConfig(assessment.type).icon}</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusConfig(assessment.status).color}`}>
                      {getStatusConfig(assessment.status).label}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {assessment.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {assessment.topics.slice(0, 2).map((topic, index) => (
                      <span key={index} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {topic}
                      </span>
                    ))}
                    {assessment.topics.length > 2 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{assessment.topics.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Assessment Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Due Date</div>
                      <div className="font-medium">{assessment.dueDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Time</div>
                      <div className="font-medium">{assessment.timeEstimate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Attempts</div>
                      <div className="font-medium">{assessment.attempts}/{assessment.maxAttempts}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Points</div>
                      <div className="font-medium">{assessment.total}</div>
                    </div>
                  </div>

                  {/* Score Display */}
                  {assessment.score !== undefined ? (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Your Score</span>
                        <span className="font-bold text-gray-900">
                          {assessment.score}/{assessment.total} ({(assessment.score/assessment.total*100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${(assessment.score/assessment.total)*100}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="text-sm text-gray-600 mb-2">Not attempted yet</div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full"></div>
                    </div>
                  )}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAssessment(assessment.id);
                      setIsModalOpen(true);
                    }}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                      assessment.status === 'completed' 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-md'
                        : assessment.status === 'overdue'
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-md'
                        : assessment.status === 'in-progress'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-md'
                    }`}
                  >
                    {assessment.status === 'completed' ? 'Review Results' : 
                     assessment.status === 'overdue' ? 'Submit Late' :
                     assessment.status === 'in-progress' ? 'Continue' : 'Start Assessment'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Assessment</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Type</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Due Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Score</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAssessments.map((assessment) => (
                    <tr 
                      key={assessment.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedAssessment(assessment.id);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getTypeConfig(assessment.type).color} flex items-center justify-center mr-4`}>
                            <span className="text-lg">{getTypeConfig(assessment.type).icon}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{assessment.title}</div>
                            <div className="text-sm text-gray-600">{assessment.timeEstimate} • {assessment.total} points</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          getTypeConfig(assessment.type).color.includes('blue') ? 'bg-blue-100 text-blue-800' :
                          getTypeConfig(assessment.type).color.includes('purple') ? 'bg-purple-100 text-purple-800' :
                          getTypeConfig(assessment.type).color.includes('orange') ? 'bg-orange-100 text-orange-800' :
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {getTypeConfig(assessment.type).label}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium">{assessment.dueDate}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          getStatusConfig(assessment.status).color
                        }`}>
                          {getStatusConfig(assessment.status).icon} {getStatusConfig(assessment.status).label}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {assessment.score !== undefined ? (
                          <div>
                            <div className="font-bold text-gray-900">{assessment.score}/{assessment.total}</div>
                            <div className="text-sm text-gray-600">{(assessment.score/assessment.total*100).toFixed(1)}%</div>
                          </div>
                        ) : (
                          <div className="text-gray-500">—</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAssessment(assessment.id);
                            setIsModalOpen(true);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            assessment.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : assessment.status === 'overdue'
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {assessment.status === 'completed' ? 'Review' : 'Start'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAssessments.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No assessments found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new assessments.</p>
            <button 
              onClick={() => setActiveFilter('all')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-md"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Assessment Detail Modal */}
      {isModalOpen && selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                  getTypeConfig(assessments.find(a => a.id === selectedAssessment)?.type || 'quiz').color
                } flex items-center justify-center mr-4`}>
                  <span className="text-2xl">
                    {getTypeConfig(assessments.find(a => a.id === selectedAssessment)?.type || 'quiz').icon}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {assessments.find(a => a.id === selectedAssessment)?.title}
                  </h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {assessments.find(a => a.id === selectedAssessment)?.timeEstimate} • 
                      {assessments.find(a => a.id === selectedAssessment)?.total} points
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Due Date</div>
                  <div className="font-bold text-gray-900">
                    {assessments.find(a => a.id === selectedAssessment)?.dueDate}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    getStatusConfig(assessments.find(a => a.id === selectedAssessment)?.status || 'pending').color
                  }`}>
                    {getStatusConfig(assessments.find(a => a.id === selectedAssessment)?.status || 'pending').label}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Attempts</div>
                  <div className="font-bold text-gray-900">
                    {assessments.find(a => a.id === selectedAssessment)?.attempts}/
                    {assessments.find(a => a.id === selectedAssessment)?.maxAttempts}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Assessment Type</div>
                  <div className="font-bold text-gray-900">
                    {getTypeConfig(assessments.find(a => a.id === selectedAssessment)?.type || 'quiz').label}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {assessments.find(a => a.id === selectedAssessment)?.description}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {assessments.find(a => a.id === selectedAssessment)?.topics.map((topic, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {assessments.find(a => a.id === selectedAssessment)?.score !== undefined && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">Your Performance</h3>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {assessments.find(a => a.id === selectedAssessment)?.score}/
                          {assessments.find(a => a.id === selectedAssessment)?.total}
                        </div>
                        <div className="text-lg text-gray-700">
                          {((assessments.find(a => a.id === selectedAssessment)?.score || 0) / 
                            (assessments.find(a => a.id === selectedAssessment)?.total || 1) * 100).toFixed(1)}% Score
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Class Average</div>
                        <div className="text-2xl font-bold text-gray-900">78%</div>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Your score: 85%</span>
                      <span>Class average: 78%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-md transition-all duration-200">
                  {assessments.find(a => a.id === selectedAssessment)?.status === 'completed' 
                    ? 'Review Detailed Results' 
                    : 'Start Assessment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}