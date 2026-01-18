export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  hasRespiratoryIssues: boolean;
  sensitivityLevel: 'low' | 'medium' | 'high';
  homeLocation?: Location;
  preferredRoutes?: SavedRoute[];
  airCredits: number;
  lastCreditRefresh: string; // ISO date string of when credits were last refreshed
}

export interface Location {
  id?: string;
  name?: string;
  address?: string;
  lat: number;
  lng: number;
}

export interface AirQualityData {
  aqi: number; // Air Quality Index
  pm25: number; // PM2.5 concentration
  pm10: number; // PM10 concentration
  o3: number; // Ozone
  no2: number; // Nitrogen dioxide
  timestamp: string;
  location: Location;
}

export interface SavedRoute {
  id: string;
  name: string;
  startLocation: Location;
  endLocation: Location;
  waypoints?: Location[];
  totalDistance: number;
  estimatedAQI: number;
  duration?: number; // Adding duration property as optional
}

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export type AirQualityLevel = 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
