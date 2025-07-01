'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the form schema
const formSchema = z.object({
  // Soil
  soil_texture: z.array(z.string()).min(1, 'Please select at least one option'),
  soil_moisture: z.array(z.string()).min(1, 'Please select at least one option'),
  soil_life: z.array(z.string()).min(1, 'Please select at least one option'),
  
  // Weather
  sky_condition: z.array(z.string()).min(1, 'Please select at least one option'),
  rain_today: z.array(z.string()).min(1, 'Please select at least one option'),
  wind_condition: z.array(z.string()).min(1, 'Please select at least one option'),
  
  // Plant Health
  leaf_condition: z.array(z.string()).min(1, 'Please select at least one option'),
  growth_rate: z.array(z.string()).min(1, 'Please select at least one option'),
  pest_disease: z.array(z.string()).min(1, 'Please select at least one option'),
  
  // Other Lifeforms
  beneficial_insects: z.array(z.string()).min(1, 'Please select at least one option'),
  pest_insects: z.array(z.string()).min(1, 'Please select at least one option'),
  larger_animals: z.array(z.string()).min(1, 'Please select at least one option'),
  
  // Seasonal
  seasonal_markers: z.array(z.string()).min(1, 'Please select at least one option'),
  moon_phase: z.array(z.string()).min(1, 'Please select at least one option'),
  planting_action: z.array(z.string()).min(1, 'Please select at least one option')
});

type FormData = z.infer<typeof formSchema>;

export default function KiloForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // We'll implement the API call once you provide the questions
      console.log('Form submitted:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const soilOptions = {
    texture: ['Sandy', 'Silty', 'Clay', 'Loamy', 'Compacted'],
    moisture: ['Dry', 'Damp', 'Wet', 'Muddy', 'Cracking'],
    life: ['Worms', 'Roots', 'Fungi', 'Insects', 'None']
  };

  const weatherOptions = {
    sky: ['Clear', 'Cloudy', 'Overcast', 'Rainy', 'Windy'],
    rain: ['None', 'Light', 'Steady', 'Heavy', 'Flash'],
    wind: ['Calm', 'Breeze', 'Gusts', 'Consistent', 'Strong']
  };

  const plantOptions = {
    leaf: ['Green', 'Yellow', 'Brown', 'Spots', 'Wilting'],
    growth: ['Fast', 'Steady', 'Stunted', 'Leggy', 'Bolting'],
    pests: ['Aphids', 'Caterpillars', 'Fungus', 'Mildew', 'None']
  };

  const lifeOptions = {
    beneficial: ['Bees', 'Ladybugs', 'Butterflies', 'Dragonflies', 'None'],
    pest: ['Beetles', 'Moths', 'Flies', 'Ants', 'None'],
    animals: ['Birds', 'Pigs', 'Deer', 'Fish', 'None']
  };

  const seasonalOptions = {
    markers: ['ʻŌhiʻa bloom', 'Mango fruit', 'Kolea seen', 'Makani blowing', 'None'],
    moon: ['Hilo', 'Huna', 'Māhealani', 'Kāne', 'ʻOle'],
    action: ['Seeded', 'Transplanted', 'Harvested', 'Pruned', 'Observed only']
  };

  const renderCheckboxGroup = (name: keyof FormData, label: string, options: string[]) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={`${name}-${option.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
              value={option}
              {...register(name as keyof FormData, { required: true })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor={`${name}-${option.toLowerCase().replace(/[^a-z0-9]/g, '')}`} className="text-sm text-gray-700">
              {option}
            </label>
          </div>
        ))}
        {errors[name as keyof typeof errors]?.message && (
          <p className="text-sm text-red-600">{errors[name as keyof typeof errors]?.message}</p>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Soil Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Soil</h2>
        {renderCheckboxGroup('soil_texture', 'What is the soil texture?', soilOptions.texture)}
        {renderCheckboxGroup('soil_moisture', 'What is the soil moisture like?', soilOptions.moisture)}
        {renderCheckboxGroup('soil_life', 'What signs of soil life do you see?', soilOptions.life)}
      </div>

      {/* Weather Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Weather</h2>
        {renderCheckboxGroup('sky_condition', 'What is the sky like?', weatherOptions.sky)}
        {renderCheckboxGroup('rain_today', 'Has there been rain today?', weatherOptions.rain)}
        {renderCheckboxGroup('wind_condition', 'What is the wind doing?', weatherOptions.wind)}
      </div>

      {/* Plant Health Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Plant Health</h2>
        {renderCheckboxGroup('leaf_condition', 'What leaf conditions do you notice?', plantOptions.leaf)}
        {renderCheckboxGroup('growth_rate', 'Are plants growing as expected?', plantOptions.growth)}
        {renderCheckboxGroup('pest_disease', 'Any pests or disease visible?', plantOptions.pests)}
      </div>

      {/* Other Lifeforms Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Other Lifeforms</h2>
        {renderCheckboxGroup('beneficial_insects', 'What beneficial insects are present?', lifeOptions.beneficial)}
        {renderCheckboxGroup('pest_insects', 'What pest insects are present?', lifeOptions.pest)}
        {renderCheckboxGroup('larger_animals', 'What larger animals did you see?', lifeOptions.animals)}
      </div>

      {/* Seasonal Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Seasonal</h2>
        {renderCheckboxGroup('seasonal_markers', 'What seasonal markers are visible?', seasonalOptions.markers)}
        {renderCheckboxGroup('moon_phase', 'What moon phase is it?', seasonalOptions.moon)}
        {renderCheckboxGroup('planting_action', 'What planting actions did you take?', seasonalOptions.action)}
      </div>

      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
}
