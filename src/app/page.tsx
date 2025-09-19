'use client'

import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function Home() {  
  return (
    <main className="flex min-h-screen flex-col">      
      <div className="mt-36 flex justify-center">
        <div className="shadow-lg border-gray-300 flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:py-20 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal antialiased`}>
            <strong>Welcome to KILO Dashboard.</strong>
          </p>
          
          {/* Login Form */}
          <LoginForm />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Sign Up Button */}
          <Link
            href="/register"
            className="rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 md:text-base text-center"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </main>
  );
}
