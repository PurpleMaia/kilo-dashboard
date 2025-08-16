
// Authentication Types
export interface Session {
  id: string;
  user_id: string;
  expiresAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  aina: Aina | null
}

export interface Aina {
    id: number;
    name: string;
    createdAt: Date;
}

export interface LoginResponse {
  user: User,
  token: string
}

// Sensor Data Types
export interface SensorDataPoint {
  timestamp: string;
  value: number;
}

export interface LocationData {
  siteName: string; // location name
  data: Record<string, SensorDataPoint[]>; // key is the metric type
}

export interface Sensor {
    id: number,
    name: string,
    typeName: string,
    unit: string,
    category: string,
    locations: string,
}

export interface LatestSensorsData {
  count: number,
  timestamp: Date,
  timeDiff: number
}