
import { Location } from '@/types';

/**
 * Calculate distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of point 1 in decimal degrees
 * @param lon1 Longitude of point 1 in decimal degrees
 * @param lat2 Latitude of point 2 in decimal degrees
 * @param lon2 Longitude of point 2 in decimal degrees
 * @returns Distance in kilometers
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Convert degrees to radians
 * @param deg Angle in degrees
 * @returns Angle in radians
 */
export const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

/**
 * Format a location for display
 * @param location Location object
 * @returns Formatted location string
 */
export const formatLocation = (location: { lat: number, lng: number, name?: string, address?: string }): string => {
  if (location.name) return location.name;
  if (location.address) return location.address;
  return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
};

/**
 * Calculate total distance of a route with waypoints
 * @param start Start location
 * @param end End location
 * @param waypoints Optional waypoints
 * @returns Total distance in kilometers
 */
export const calculateTotalDistance = (start: Location, end: Location, waypoints: Location[] = []): number => {
  let totalDistance = 0;
  
  if (waypoints.length === 0) {
    // Direct route from start to end
    return calculateDistance(start.lat, start.lng, end.lat, end.lng);
  }
  
  // Route with waypoints
  // Calculate from start to first waypoint
  totalDistance += calculateDistance(start.lat, start.lng, waypoints[0].lat, waypoints[0].lng);
  
  // Calculate between waypoints
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateDistance(
      waypoints[i].lat, waypoints[i].lng,
      waypoints[i+1].lat, waypoints[i+1].lng
    );
  }
  
  // Calculate from last waypoint to end
  totalDistance += calculateDistance(
    waypoints[waypoints.length-1].lat, waypoints[waypoints.length-1].lng,
    end.lat, end.lng
  );
  
  return totalDistance;
};

/**
 * Gets a detailed formatted location string with name and coordinates
 * @param location Location object
 * @returns Formatted location string with coordinates
 */
export const getDetailedLocationString = (location: Location): string => {
  let result = '';
  
  if (location.name) {
    result += location.name;
    result += ` (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`;
    return result;
  }
  
  if (location.address) {
    result += location.address;
    result += ` (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`;
    return result;
  }
  
  return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
};
