import getPool from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const pool = await getPool()
    const [rows]: any = await pool.query('SELECT 1+1 AS result')
    return NextResponse.json({ dbOk: rows })
  } catch (error: any) {
    return NextResponse.json({ dbError: error.message })
  }
}
