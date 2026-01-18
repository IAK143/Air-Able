import { Location } from '@/types';
import { toast } from "@/components/ui/use-toast";

const API_KEY = 'EjxSGlhjMwHQInHG32QxLtGUr0pMkMJ2';

/**
 * Calculate a route between two points using TomTom API
 */
export const calculateTomTomRoute = async (
  startPoint: Location, 
  endPoint: Location,
  waypoints: Location[] = []
): Promise<any> => {
  try {
    console.log("Calculating route between:", startPoint, "and", endPoint);
    
    // Format all points into a single array (start, waypoints, end)
    const allPoints = [startPoint, ...waypoints, endPoint];
    
    // Format coordinates string for TomTom API
    // TomTom routing API v1 accepts coordinates in the format: lat,long:lat,long:lat,long
    const coordinatesString = allPoints
      .map(point => `${point.lat},${point.lng}`)
      .join(':');
    
    // URL for the routing API
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${coordinatesString}/json?key=${API_KEY}&routeType=eco&traffic=false&instructionsType=tagged`;
    
    console.log("Requesting route with URL:", url);
    
    // Make API call
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("TomTom API error response:", errorText);
      throw new Error(`Failed to calculate route: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Route calculation successful:", data);
    return data;
  } catch (error) {
    console.error('Error calculating TomTom route:', error);
    toast({
      title: "Route Error",
      description: "Could not calculate a route. Falling back to direct lines.",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Extract route points from TomTom route response
 */
export const extractRoutePoints = (routeData: any): Array<[number, number]> => {
  if (!routeData || !routeData.routes || routeData.routes.length === 0) {
    return [];
  }
  
  try {
    const legs = routeData.routes[0].legs;
    const points: Array<[number, number]> = [];
    
    // Extract all points from all legs
    legs.forEach((leg: any) => {
      const legPoints = leg.points.map((point: any) => [point.latitude, point.longitude]);
      points.push(...legPoints);
    });
    
    console.log(`Extracted ${points.length} route points`);
    return points;
  } catch (error) {
    console.error('Error extracting route points:', error);
    return [];
  }
};

/**
 * Get detailed information about a location using TomTom's Geocoding API
 */
export const getLocationDetails = async (lat: number, lng: number): Promise<Location | null> => {
  try {
    const response = await fetch(
      `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${API_KEY}&radius=10000`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get location details');
    }
    
    const data = await response.json();
    console.log("Location details response:", data);
    
    if (!data.addresses || data.addresses.length === 0) {
      return {
        lat,
        lng,
        name: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`
      };
    }
    
    const address = data.addresses[0].address;
    
    // Try to extract the most meaningful name
    let name = address.municipalitySubdivision || 
               address.municipality || 
               address.countrySecondarySubdivision ||
               address.countrySubdivision;
               
    // Fallback to freeformAddress if no specific field is available
    if (!name) {
      name = address.freeformAddress || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    
    return {
      lat,
      lng,
      name: name,
      address: address.freeformAddress
    };
  } catch (error) {
    console.error('Error getting location details:', error);
    // Return basic location info if API fails
    return {
      lat,
      lng,
      name: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
  }
};

/**
 * Search for cities by name using TomTom API
 */
export const searchCitiesByName = async (query: string): Promise<Location[]> => {
  try {
    if (!query || query.trim().length < 2) return [];
    
    console.log("Searching cities with query:", query);

    const response = await fetch(
      `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${API_KEY}&countrySet=IN&limit=10&idxSet=Geo&typeahead=true`
    );

    if (!response.ok) {
      throw new Error('Failed to search cities');
    }

    const data = await response.json();
    console.log("City search response:", data);
    
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((result: any) => {
      // Extract the most relevant name
      const address = result.address || {};
      const name = address.municipality || 
                   address.municipalitySubdivision || 
                   address.freeformAddress ||
                   result.poi?.name;

      return {
        lat: result.position.lat,
        lng: result.position.lon,
        name: name || "Unknown Location",
        address: address.freeformAddress
      };
    });
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

/**
 * Get nearby cities using TomTom API
 */
export const getNearbyPlaces = async (lat: number, lng: number, radius: number = 10000): Promise<Location[]> => {
  try {
    const response = await fetch(
      `https://api.tomtom.com/search/2/nearbySearch/.json?key=${API_KEY}&lat=${lat}&lon=${lng}&radius=${radius}&limit=20&categorySet=7315`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch nearby places');
    }

    const data = await response.json();
    console.log("Nearby places response:", data);
    
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((result: any) => ({
      lat: result.position.lat,
      lng: result.position.lon,
      name: result.poi?.name || result.address?.freeformAddress || "Nearby Location",
      address: result.address?.freeformAddress
    }));
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};
