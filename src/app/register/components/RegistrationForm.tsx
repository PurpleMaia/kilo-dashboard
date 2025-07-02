'use client';
import React, { useState } from 'react';

interface Aina {
  id: number;
  name: string | null;
}

interface RegistrationFormProps {
  ainaList: Aina[];
}

export default function RegistrationForm({ ainaList }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    aina: '',
    customAina: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  // Determine if "Other" is selected
  const isOtherAina = formData.aina === '__other__';

  return (
    <>
      {step === 1 && (
        <form onSubmit={handleNext} className="flex flex-col gap-4">
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
          <button
            type="submit"
            className="rounded-lg bg-lime-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lime-700 md:text-base"
          >
            Next
          </button>
        </form>
      )}
      {step === 2 && (
        <form action="/api/register" method="POST" className="flex flex-col gap-4">
          {/* Hidden fields to pass previous step data */}
          <input type="hidden" name="username" value={formData.username} />
          <input type="hidden" name="email" value={formData.email} />
          <input type="hidden" name="password" value={formData.password} />
          <input type="hidden" name="confirmPassword" value={formData.confirmPassword} />

          <label htmlFor="aina" className="text-sm font-medium text-gray-700">Select ʻĀina</label>
          <select
            name="aina"
            id="aina"
            className="rounded border px-3 py-2"
            value={formData.aina}
            onChange={handleChange}
            required
          >
            <option value="">Choose an ʻāina to ?</option>
            {ainaList.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
            <option value="__other__">Other (not listed)</option>
          </select>

          {isOtherAina && (
            <input
              type="text"
              name="customAina"
              placeholder="Enter your ʻāina name"
              className="rounded border px-3 py-2"
              value={formData.customAina}
              onChange={handleChange}
              required
            />
          )}

          {/* On submit, if customAina is filled, submit that as the aina field */}
          <input type="hidden" name="finalAina" value={isOtherAina ? formData.customAina : formData.aina} />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg bg-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-400 md:text-base"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-lg bg-lime-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lime-700 md:text-base"
            >
              Create Account
            </button>
          </div>
        </form>
      )}
    </>
  );
} 