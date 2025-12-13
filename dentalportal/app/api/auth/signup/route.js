import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    // Check if user already exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'client']
    );

    const userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign({ id: userId, email, role: role || 'client' }, JWT_SECRET, { expiresIn: '1h' });

    return new Response(JSON.stringify({ token, role: role || 'client' }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
