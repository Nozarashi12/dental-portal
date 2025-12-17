import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Card } from "../../components/ui/Card";
import pool from '@/lib/db';

// Interface for course data from database
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

// Function to fetch course data
async function getCourseData(id: string): Promise<Course | null> {
  try {
    const [rows]: any[] = await pool.query(
      `SELECT 
        c.id, 
        c.title, 
        c.author, 
        c.author_description,
        c.cover_image, 
        c.overview, 
        c.description, 
        c.category, 
        c.specialty_id,
        c.created_at,
        c.updated_at,
        s.name AS specialty_name,
        (SELECT COUNT(*) FROM classrooms WHERE course_id = c.id) as classroom_count
      FROM courses c
      LEFT JOIN specialties s ON c.specialty_id = s.id
      WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as Course;
  } catch (error) {
    console.error("Error fetching course data:", error);
    return null;
  }
}

// Function to fetch related courses
async function getRelatedCourses(courseId: string, category: string): Promise<Course[]> {
  try {
    const [rows]: any[] = await pool.query(
      `SELECT 
        c.id, 
        c.title, 
        c.author, 
        c.cover_image, 
        c.overview, 
        c.category
      FROM courses c
      WHERE c.category = ? AND c.id != ?
      ORDER BY c.created_at DESC
      LIMIT 3`,
      [category, courseId]
    );

    return rows as Course[];
  } catch (error) {
    console.error("Error fetching related courses:", error);
    return [];
  }
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch course data
  const course = await getCourseData(id);
  
  if (!course) {
    notFound();
  }

  // Fetch related courses
  const relatedCourses = await getRelatedCourses(id, course.category);

  // Format stats
  const stats = {
    lectures: course.classroom_count || 0,
    credits: course.classroom_count ? course.classroom_count * 1.5 : 0, // Assuming 1.5 credits per classroom
    duration: "Self-paced",
    certificate: true
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Emerald theme */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            {/* Tag with emerald accent */}
            <div className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full mr-2 animate-pulse"></div>
              Online Course
            </div>
            
            {/* Course Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
              {course.title}
            </h1>
            
            {/* Author */}
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {course.author.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-semibold">{course.author}</p>
                {course.author_description && (
                  <p className="text-emerald-100/80 text-sm">{course.author_description}</p>
                )}
              </div>
            </div>
            
            {/* Course Description */}
            <p className="text-lg md:text-xl text-emerald-100/90 leading-relaxed mb-8 max-w-2xl">
              {course.overview || course.description}
            </p>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium tracking-wide">Expert Instructors</span>
              </div>
              
              <div className="h-4 w-px bg-white/30 hidden sm:block"></div>
              
              <div className="flex items-center">
                <span className="mr-2 text-xl">🎓</span>
                <span className="text-sm font-medium tracking-wide">Certificate Available</span>
              </div>

              {course.category && (
                <>
                  <div className="h-4 w-px bg-white/30 hidden sm:block"></div>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">📚</span>
                    <span className="text-sm font-medium tracking-wide">{course.category}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Overview Card */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    Course Overview
                  </h2>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {course.description || course.overview}
                  </p>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-emerald-700 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                          Certification Opportunity
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          Complete all modules to earn a professional certificate in {course.category}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Learning Objectives Card */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full mr-4"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                    What You'll Learn
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Master advanced techniques and procedures",
                    "Develop clinical decision-making skills",
                    "Implement evidence-based practices",
                    "Enhance patient communication and care"
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-start p-3 bg-gray-50/50 rounded-lg border border-gray-100 hover:border-emerald-200 transition-colors duration-150"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-green-600 rounded-full mr-4"></div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                      Related Courses
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedCourses.map((relatedCourse) => (
                      <a
                        key={relatedCourse.id}
                        href={`/client/course/${relatedCourse.id}`}
                        className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-150 group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-emerald-600 text-lg">📚</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700 mb-1">
                            {relatedCourse.title}
                          </h4>
                          <p className="text-sm text-gray-600">{relatedCourse.author}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                              {relatedCourse.category}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Enrollment Card */}
            
                     </div>
        </div>
      </main>
    </div>
  );
}