'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);

      const response = await fetch('/api/login', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Login successful, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
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
        type="password"
        name="password"
        placeholder="Password"
        className="rounded border px-3 py-2"
        value={formData.password}
        onChange={handleChange}
        required
      />
      {loading ? (
        <button
          type="button"
          disabled
          className="rounded-lg bg-lime-700 px-6 py-3 text-sm font-medium text-white transition-colors md:text-base"
        >
          Logging in...
        </button>
      ) : (
        <button
          type="submit"
          className="rounded-lg bg-lime-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lime-700 md:text-base"
        >
          Log In
        </button>
      )}
    </form>
  );
}