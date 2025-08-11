import { z } from 'zod';

// Define the form schema
export const formSchema = z.object({
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

export type FormData = z.infer<typeof formSchema>;