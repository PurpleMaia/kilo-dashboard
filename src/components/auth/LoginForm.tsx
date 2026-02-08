'use client';

import { useLogin } from '@/hooks/use-auth';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const login = useLogin()
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsPending(true)
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
        disabled={isPending}
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
          disabled={isPending}
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

      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => {
          setIsPending(true);
          window.location.href = '/api/auth/google/authorize';
        }}
        disabled={isPending}
      >
        <svg className="mr-2 h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </Button>
      
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