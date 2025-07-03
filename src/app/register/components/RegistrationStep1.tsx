'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function RegistrationStep1() {  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    aina: '',
    customAina: '',
  });
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    // submit to table
    const res = await fetch('api/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      console.log('Insert to user table successful... redirecting to aina selection')
      router.push(`/register/aina`);
    } else {
      const result = await res.json();
      setError(result.error || 'Registration failed');
    }      

    setLoading(false)
  };

  return (
    <>              
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="text-red-600">{error}</div>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="rounded border px-3 py-2"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="rounded border px-3 py-2"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="rounded border px-3 py-2"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="rounded border px-3 py-2"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {loading ? (
            <button
              className="flex rounded-lg bg-lime-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lime-700 md:text-base"              
            >
              Loading...
            </button>          
          ) : (
            <button
              type="submit"
              className="rounded-lg bg-lime-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lime-700 md:text-base"
            >
              Create Account
            </button>
          )
        }
        </form>            
    </>
  );
} 