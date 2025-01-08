'use client'
import React from 'react';
import { LockKeyhole, User } from 'lucide-react';

const AdminLogin = () => {

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-lg bg-gradient-to-br from-[#000000] to-[rgb(50,66,102)] bg-opacity-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-[#ddd7e4]">Enter your credentials to continue</p>
        </div>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#8680ff]" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-black border-[#3228e0] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8680ff] focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockKeyhole className="h-5 w-5 text-[#8680ff]" />
              </div>
              <input
                type="password"
                className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-black border-[#3228e0] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8680ff] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-[#3228e0] bg-black text-[#8680ff] focus:ring-[#8680ff]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                Remember me
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#312e5b] hover:bg-[#8680ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8680ff] transition-colors duration-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;