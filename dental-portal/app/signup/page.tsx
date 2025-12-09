"use client";

import Link from "next/link";
import React from "react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Join Yenepoya Dental CDE Platform
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg 
                text-gray-900 placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg 
                text-gray-900 placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg 
                text-gray-900 placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2.5 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-green-700 font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
