'use client';

import { useLogin } from '@/hooks/use-auth';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin()
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // clear any stale login information
    login.reset()

    // set user query client on successful login
    login.mutate({
      username: formData.username,
      password: formData.password
    })    
  };

  return (
     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {login.error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
          {login.error.message}
        </div>
      )}  
      
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
        value={formData.username}
        onChange={handleChange}
        disabled={login.isPending}
        required
      />
      
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          className="w-full rounded border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-lime-500"
          value={formData.password}
          onChange={handleChange}
          disabled={login.isPending}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      <button
        type="submit"
        disabled={login.isPending || !formData.username || !formData.password}
        className="rounded-lg bg-lime-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed md:text-base"
      >
        {login.isPending ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}