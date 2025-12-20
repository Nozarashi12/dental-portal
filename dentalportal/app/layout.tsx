// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './Client/context/AuthContext' // Import the provider

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yenepoya Dental CDE',
  description: 'Continuing Dental Education Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}