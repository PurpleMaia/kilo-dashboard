'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Aina {
  id: number;
  name: string | null;
}

interface RegistrationFormProps {
  ainaList: Aina[];
}

export default function RegistrationStep2({ ainaList }: RegistrationFormProps) {  
    const [formData, setFormData] = useState({selectedAina: '', customAina: ''})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleSkip = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      router.push('/dashboard')
    }    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('selectedAina', formData.selectedAina);
        formDataToSend.append('customAina', formData.customAina);
        formDataToSend.append('finalAina', isOtherAina ? formData.customAina : formData.selectedAina);
        
        const response = await fetch('/api/register/aina', {
          method: 'POST',
          body: formDataToSend,
        });
        
        const result = await response.json();
        
        if (result.success) {
          router.push('/dashboard');
        } else {
          console.error('Registration failed:', result.error);
          // You could add error handling here
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        // You could add error handling here
      } finally {
        setIsSubmitting(false);
      }
    };

     // Determine if "Other" is selected
    const isOtherAina = formData.selectedAina === '__other__';
    
    return (
        <>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="aina" className="text-sm font-medium text-gray-700">Select ʻĀina</label>
          <select
            name="selectedAina"
            id="aina"
            className="rounded border px-3 py-2"
            value={formData.selectedAina}
            onChange={handleChange}
            required
          >
            <option value="">Choose an ʻāina?</option>
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
          <input type="hidden" name="finalAina" value={isOtherAina ? formData.customAina : formData.selectedAina} />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-lg bg-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-400 md:text-base"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-lime-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lime-700 md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </button>
          </div>
        </form>
        </>
    )
}