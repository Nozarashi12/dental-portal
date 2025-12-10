// Server Component

import Navbar from "../../components/Navbar";
import CourseNavbar from "../../components/CourseNavbar";
import Footer from "../../components/Footer";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function CourseLayout({ children, params }: CourseLayoutProps) {
  const { id } = await params; // ✅ FIXED: await params

  return (
    <>
      <Navbar />
      <CourseNavbar courseId={id} />
      <main className="min-h-screen mt-8">{children}</main>
      <Footer />
    </>
  );
}
