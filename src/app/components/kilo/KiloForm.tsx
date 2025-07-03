'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  // Soil
  soil_texture: z.array(z.string()).min(1, 'Please choose one or more options'),
  soil_moisture: z.array(z.string()).min(1, 'Please choose one or more options'),
  soil_life: z.array(z.string()).min(1, 'Please choose one or more options'),
  
  // Weather
  sky_condition: z.array(z.string()).min(1, 'Please choose one or more options'),
  rain_today: z.array(z.string()).min(1, 'Please choose one or more options'),
  wind_condition: z.array(z.string()).min(1, 'Please choose one or more options'),
  
  // Plant Health
  leaf_condition: z.array(z.string()).min(1, 'Please choose one or more options'),
  growth_rate: z.array(z.string()).min(1, 'Please choose one or more options'),
  pest_disease: z.array(z.string()).min(1, 'Please choose one or more options'),
  
  // Other Lifeforms
  beneficial_insects: z.array(z.string()).min(1, 'Please choose one or more options'),
  pest_insects: z.array(z.string()).min(1, 'Please choose one or more options'),
  larger_animals: z.array(z.string()).min(1, 'Please choose one or more options'),
  
  // Seasonal
  seasonal_markers: z.array(z.string()).min(1, 'Please choose one or more options'),
  moon_phase: z.array(z.string()).min(1, 'Please choose one or more options'),
  planting_action: z.array(z.string()).min(1, 'Please choose one or more options')
});

type FormData = z.infer<typeof formSchema>;

export default function KiloForm() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmittedData(data);
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

  const renderCheckboxGroup = (name: keyof FormData, label: string, options: string[]) => {
    const isChecked = (option: string) => {
      const field = watch(name);
      return Array.isArray(field) ? field.includes(option) : false;
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`${name}-${option.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                value={option}
                checked={isChecked(option)}
                {...register(name as keyof FormData, {
                  validate: (value) => value.length > 0 || 'Please select at least one option'
                })}
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
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8">
      {submittedData ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Submitted Kilo Data</h2>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Name</h3>
              <p>{submittedData.name}</p>
            </div>
            {/* Soil */}
            <div>
              <h3 className="font-medium text-gray-700">Soil</h3>
              <div className="space-y-2">
                <p>Texture: {submittedData.soil_texture.join(', ')}</p>
                <p>Moisture: {submittedData.soil_moisture.join(', ')}</p>
                <p>Life: {submittedData.soil_life.join(', ')}</p>
              </div>
            </div>

            {/* Weather */}
            <div>
              <h3 className="font-medium text-gray-700">Weather</h3>
              <div className="space-y-2">
                <p>Sky: {submittedData.sky_condition.join(', ')}</p>
                <p>Rain: {submittedData.rain_today.join(', ')}</p>
                <p>Wind: {submittedData.wind_condition.join(', ')}</p>
              </div>
            </div>

            {/* Plant Health */}
            <div>
              <h3 className="font-medium text-gray-700">Plant Health</h3>
              <div className="space-y-2">
                <p>Leaf Condition: {submittedData.leaf_condition.join(', ')}</p>
                <p>Growth Rate: {submittedData.growth_rate.join(', ')}</p>
                <p>Pest/Disease: {submittedData.pest_disease.join(', ')}</p>
              </div>
            </div>

            {/* Other Lifeforms */}
            <div>
              <h3 className="font-medium text-gray-700">Other Lifeforms</h3>
              <div className="space-y-2">
                <p>Beneficial Insects: {submittedData.beneficial_insects.join(', ')}</p>
                <p>Pest Insects: {submittedData.pest_insects.join(', ')}</p>
                <p>Larger Animals: {submittedData.larger_animals.join(', ')}</p>
              </div>
            </div>

            {/* Seasonal */}
            <div>
              <h3 className="font-medium text-gray-700">Seasonal</h3>
              <div className="space-y-2">
                <p>Seasonal Markers: {submittedData.seasonal_markers.join(', ')}</p>
                <p>Moon Phase: {submittedData.moon_phase.join(', ')}</p>
                <p>Planting Actions: {submittedData.planting_action.join(', ')}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => {
                reset();
                setSubmittedData(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Submit Another Form
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Soil Section */}
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

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Submit
            </button>
            {submittedData && (
              <button
                onClick={() => {
                  reset();
                  setSubmittedData(null);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Submit Another Kilo Form
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
