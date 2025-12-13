import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return new Response(JSON.stringify({ token, role: user.role }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
