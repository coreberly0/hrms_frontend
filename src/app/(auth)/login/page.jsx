"use client";
import LoginForm from '@/components/common/login-form';
import Image from 'next/image';
import React from 'react'
import sampleImage from '@/components/asset/sample.jpg';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Section - Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-700 via-blue-600 to-slate-900 flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome Back</h1>
          <p className="text-blue-100 text-base md:text-lg mb-8 max-w-md">
            Manage your workforce efficiently with our comprehensive HRMS solution
          </p>
          
          {/* Image from assets */}
          <div className="relative mt-8 md:mt-12 w-full max-w-xs md:max-w-sm">
            <Image 
              src={sampleImage} 
              alt="HRMS Team Collaboration" 
              className="rounded-2xl shadow-2xl object-cover w-full h-80"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent rounded-2xl opacity-30"></div>
          </div>
          
          <div className="mt-8 flex gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-blue-200"></div>
            <div className="w-2 h-2 rounded-full bg-blue-200"></div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-md px-4 sm:px-0">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
 