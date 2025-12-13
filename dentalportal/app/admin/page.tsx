import Link from 'next/link';
import pool from '@/lib/db';


export default async function AdminPage() {
// simple stats
const [[{ coursesCount }]] = await pool.query('SELECT COUNT(*) as coursesCount FROM courses');
const [[{ classroomsCount }]] = await pool.query('SELECT COUNT(*) as classroomsCount FROM classrooms');
const [[{ usersCount }]] = await pool.query('SELECT COUNT(*) as usersCount FROM users');


return (
<div>
<h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
<div className="grid grid-cols-3 gap-4 mb-8">
<div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">Courses</div><div className="text-2xl font-semibold">{coursesCount}</div></div>
<div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">Classrooms</div><div className="text-2xl font-semibold">{classroomsCount}</div></div>
<div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">Users</div><div className="text-2xl font-semibold">{usersCount}</div></div>
</div>


<div className="space-x-2">
<Link href="/admin/courses/create" className="px-4 py-2 bg-emerald-600 text-white rounded">Create Course</Link>
<Link href="/admin/classrooms/create" className="px-4 py-2 bg-emerald-600 text-white rounded">Create Classroom</Link>
</div>
</div>
);
}