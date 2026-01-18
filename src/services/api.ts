
import { AirQualityData, Location, AirQualityLevel, WeatherData } from '../types';
import { toast } from '@/components/ui/use-toast';
import { getLocationDetails } from '@/utils/tomtomUtils';

const API_KEY = 'd88a5d9c25b36002625f24baa0738917';
const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENCAGE_API_KEY = '4a269be064ea4736a067d46faebe149b';
const OPENCAGE_BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';

export async function fetchAirQuality(lat: number, lng: number): Promise<AirQualityData | null> {
  try {
    const response = await fetch(
      `${OPEN_WEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lng}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch air quality data');
    }
    
    const data = await response.json();
    
    if (!data.list || data.list.length === 0) {
      console.error('No air quality data received for coordinates:', lat, lng);
      return null;
    }
    
    const airQuality = data.list[0];
    
    return {
      aqi: airQuality.main.aqi,
      pm25: airQuality.components.pm2_5,
      pm10: airQuality.components.pm10,
      o3: airQuality.components.o3,
      no2: airQuality.components.no2,
      timestamp: new Date(airQuality.dt * 1000).toISOString(),
      location: { lat, lng }
    };
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return null;
  }
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `${OPEN_WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    
    return {
      temp: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

export async function geocodeLocation(address: string): Promise<Location | null> {
  try {
    // Try OpenCage first
    const opencageResponse = await fetch(
      `${OPENCAGE_BASE_URL}?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&limit=1`
    );
    
    if (opencageResponse.ok) {
      const opencageData = await opencageResponse.json();
      
      if (opencageData.results.length > 0) {
        const result = opencageData.results[0];
        return {
          name: result.formatted,
          address: result.formatted,
          lat: result.geometry.lat,
          lng: result.geometry.lng
        };
      }
    }
    
    // Try TomTom as fallback
    try {
      const tomtomResponse = await fetch(
        `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=EjxSGlhjMwHQInHG32QxLtGUr0pMkMJ2`
      );
      
      if (tomtomResponse.ok) {
        const tomtomData = await tomtomResponse.json();
        
        if (tomtomData.results && tomtomData.results.length > 0) {
          const result = tomtomData.results[0];
          return {
            name: result.address.freeformAddress,
            address: result.address.freeformAddress,
            lat: result.position.lat,
            lng: result.position.lon
          };
        }
      }
    } catch (tomtomError) {
      console.error("TomTom geocoding failed:", tomtomError);
    }
    
    toast({
      title: "Not Found",
      description: "Could not find location. Please try a different address.",
    });
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    toast({
      title: "Error",
      description: "Failed to search for location. Please try again.",
      variant: "destructive"
    });
    return null;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<Location | null> {
  try {
    // Try OpenCage first
    const opencageResponse = await fetch(
      `${OPENCAGE_BASE_URL}?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&limit=1`
    );
    
    if (opencageResponse.ok) {
      const opencageData = await opencageResponse.json();
      
      if (opencageData.results.length > 0) {
        const result = opencageData.results[0];
        const components = result.components;
        
        // Build a name based on available components
        let name = '';
        if (components.city || components.town || components.village) {
          name = components.city || components.town || components.village;
        }
        
        if (components.state && (!name || !name.includes(components.state))) {
          name = name ? `${name}, ${components.state}` : components.state;
        }
        
        return {
          lat,
          lng,
          name: name || result.formatted,
          address: result.formatted
        };
      }
    }
    
    // Try TomTom as fallback
    try {
      return await getLocationDetails(lat, lng);
    } catch (tomtomError) {
      console.error("TomTom reverse geocoding failed:", tomtomError);
    }
    
    // Return basic location if all geocoding fails
    return {
      lat,
      lng,
      name: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      lat,
      lng,
      name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    };
  }
}

export function getAirQualityLevel(aqi: number): AirQualityLevel {
  switch (aqi) {
    case 1:
      return 'Good';
    case 2:
      return 'Moderate';
    case 3:
      return 'Unhealthy for Sensitive Groups';
    case 4:
      return 'Unhealthy';
    case 5:
      return 'Very Unhealthy';
    default:
      return 'Hazardous';
  }
}

export function getAirQualityColor(aqi: number): string {
  switch (aqi) {
    case 1:
      return 'bg-airquality-good';
    case 2:
      return 'bg-airquality-moderate';
    case 3:
      return 'bg-amber-500';
    case 4:
      return 'bg-airquality-bad';
    case 5:
      return 'bg-red-600';
    default:
      return 'bg-airquality-hazardous';
  }
}

export function getAirQualityTextColor(aqi: number): string {
  switch (aqi) {
    case 1:
      return 'text-airquality-good';
    case 2:
      return 'text-airquality-moderate';
    case 3:
      return 'text-amber-500';
    case 4:
      return 'text-airquality-bad';
    case 5:
      return 'text-red-600';
    default:
      return 'text-airquality-hazardous';
  }
}

export async function estimateRouteAQI(startLocation: Location, endLocation: Location, waypoints: Location[] = []): Promise<number> {
  try {
    // Fetch AQI for start and end locations
    const startAQI = await fetchAirQuality(startLocation.lat, startLocation.lng);
    const endAQI = await fetchAirQuality(endLocation.lat, endLocation.lng);
    
    let totalAQI = 0;
    let validPoints = 0;
    
    if (startAQI) {
      totalAQI += startAQI.aqi;
      validPoints++;
    }
    
    if (endAQI) {
      totalAQI += endAQI.aqi;
      validPoints++;
    }
    
    // If there are waypoints, fetch their AQIs too
    if (waypoints.length > 0) {
      for (const waypoint of waypoints) {
        const waypointAQI = await fetchAirQuality(waypoint.lat, waypoint.lng);
        if (waypointAQI) {
          totalAQI += waypointAQI.aqi;
          validPoints++;
        }
      }
    }
    
    // Calculate average AQI
    const avgAQI = validPoints > 0 ? Math.round(totalAQI / validPoints) : 3; // Default to 3 if no data
    return avgAQI;
  } catch (error) {
    console.error('Error estimating route AQI:', error);
    return 3; // Default to "Unhealthy for Sensitive Groups" if estimation fails
  }
}
