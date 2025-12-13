'use client';
import Link from 'next/link';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
return (
<div className="min-h-screen bg-gray-50">
<div className="flex">
<aside className="w-64 bg-white border-r">
<div className="p-6 border-b">
<h2 className="text-lg font-semibold">Admin Panel</h2>
</div>
<nav className="p-4 space-y-1">
<Link href="/admin" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
<Link href="/admin/courses" className="block px-3 py-2 rounded hover:bg-gray-100">Courses</Link>
<Link href="/admin/classrooms" className="block px-3 py-2 rounded hover:bg-gray-100">Classrooms</Link>
</nav>
</aside>


<main className="flex-1 p-8">{children}</main>
</div>
</div>
);
}