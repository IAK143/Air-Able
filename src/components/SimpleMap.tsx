import React, { useEffect, useRef, useState } from 'react';
import { Location } from '@/types';
import { Card } from '@/components/ui/card';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDistance } from '@/utils/routeUtils';
import { calculateTomTomRoute, extractRoutePoints } from '@/utils/tomtomUtils';
import { toast } from '@/components/ui/use-toast';

// Fix the Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons for different purposes
const startIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const endIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const waypointIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface SimpleMapProps {
  center?: Location;
  markers?: (Location & { className?: string })[];
  onLocationSelect?: (location: Location) => void;
  interactive?: boolean;
  className?: string;
  showAirQuality?: boolean;
  showRoutes?: boolean;
  startLocation?: Location;
  endLocation?: Location;
  waypoints?: Location[];
  mapHeight?: string;
  animateLocations?: boolean;
}

const SimpleMap: React.FC<SimpleMapProps> = ({
  center,
  markers = [],
  onLocationSelect,
  interactive = true,
  className = "",
  showAirQuality = false,
  showRoutes = false,
  startLocation,
  endLocation,
  waypoints = [],
  mapHeight = "200px",
  animateLocations = true
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Layer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const defaultCenter = center || { lat: 20.5937, lng: 78.9629 }; // Center of India
    
    const map = L.map(mapContainer.current, {
      zoomControl: true,
      scrollWheelZoom: interactive,
      dragging: interactive
    }).setView(
      [defaultCenter.lat, defaultCenter.lng],
      5
    );

    // Use OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    if (interactive) {
      map.on('click', (e) => {
        if (onLocationSelect) {
          const location: Location = {
            lat: e.latlng.lat,
            lng: e.latlng.lng
          };
          onLocationSelect(location);
        }
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Create or update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((location) => {
      const markerOptions: L.MarkerOptions = {};
      const marker = L.marker([location.lat, location.lng], markerOptions);
      
      // Add animation by adding a class to the DOM element after the marker is added
      if (animateLocations) {
        marker.on('add', function() {
          if (marker.getElement()) {
            marker.getElement()?.classList.add('animate-bounce-small');
          }
        });
      }
      
      if (showAirQuality && location.className) {
        const customIcon = L.divIcon({
          className: `w-6 h-6 rounded-full ${location.className}`,
          iconSize: [24, 24],
          html: `<div class="w-6 h-6 rounded-full ${location.className} border-2 border-white shadow-lg animate-pulse"></div>`
        });
        marker.setIcon(customIcon);
      }
      
      // Create a detailed popup content
      if (location.name || location.address) {
        const popupContent = `
          <div class="p-1">
            ${location.name ? `<div class="font-bold">${location.name}</div>` : ''}
            ${location.address && location.address !== location.name ? 
              `<div class="text-sm mt-1">${location.address}</div>` : ''}
            <div class="text-xs text-gray-500 mt-1">
              ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent, {
          closeButton: true,
          className: 'custom-popup'
        });
      }
      
      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // If there are markers, fit the map to show all of them
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
    }
  }, [markers, showAirQuality, animateLocations]);

  // Draw routes between locations using TomTom API
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !showRoutes) return;
    
    const fetchRoute = async () => {
      if (!startLocation || !endLocation) return;
      
      setIsLoading(true);
      
      try {
        // Clear previous routes
        routeLayersRef.current.forEach(layer => layer.remove());
        routeLayersRef.current = [];
        
        // Add special styled markers for start, end and waypoints
        const startMarker = L.marker([startLocation.lat, startLocation.lng], { icon: startIcon }).addTo(map);
        const endMarker = L.marker([endLocation.lat, endLocation.lng], { icon: endIcon }).addTo(map);
        
        if (startLocation.name) {
          startMarker.bindPopup(`<b>Start:</b> ${startLocation.name}`);
        }
        
        if (endLocation.name) {
          endMarker.bindPopup(`<b>End:</b> ${endLocation.name}`);
        }
        
        // Store markers as layers
        routeLayersRef.current.push(startMarker);
        routeLayersRef.current.push(endMarker);
        
        // Add waypoint markers if any
        waypoints.forEach(waypoint => {
          const waypointMarker = L.marker([waypoint.lat, waypoint.lng], { icon: waypointIcon }).addTo(map);
          if (waypoint.name) {
            waypointMarker.bindPopup(`<b>Via:</b> ${waypoint.name}`);
          }
          routeLayersRef.current.push(waypointMarker);
        });
        
        // Try to get a route from TomTom
        console.log("Requesting route from TomTom...");
        const routeData = await calculateTomTomRoute(startLocation, endLocation, waypoints);
        
        if (routeData && routeData.routes && routeData.routes.length > 0) {
          // Extract route points from the TomTom response
          const routePoints = extractRoutePoints(routeData);
          
          if (routePoints.length > 0) {
            console.log("Drawing route with", routePoints.length, "points");
            // Create a polyline with the route points
            const routeLine = L.polyline(routePoints, {
              color: '#3b82f6', // blue-500
              weight: 5,
              opacity: 0.7,
              lineJoin: 'round'
            }).addTo(map);
            
            // Get route details from TomTom response
            const routeSummary = routeData.routes[0].summary;
            const distanceInKm = (routeSummary.lengthInMeters / 1000).toFixed(2);
            const travelTimeInMinutes = Math.round(routeSummary.travelTimeInSeconds / 60);
            
            routeLine.bindTooltip(
              `<b>Distance:</b> ${distanceInKm} km<br>` + 
              `<b>Est. Time:</b> ${travelTimeInMinutes} min`,
              { permanent: false, direction: 'auto' }
            );
            
            routeLayersRef.current.push(routeLine);
            
            // Fit map to show the route
            map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
            
            // Show success toast
            toast({
              title: "Route Found",
              description: `Route found: ${distanceInKm} km, ${travelTimeInMinutes} min`,
            });
            return;
          }
        }
        
        // If we reach here, either route data is missing or empty
        fallbackToStraightLines(map);
      } catch (error) {
        console.error("Failed to calculate route:", error);
        fallbackToStraightLines(map);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoute();
    
    function fallbackToStraightLines(map: L.Map) {
      toast({
        title: "Route Calculation",
        description: "Could not fetch detailed route. Showing direct path instead.",
        variant: "destructive"
      });
      
      // For direct route without waypoints
      if (waypoints.length === 0) {
        const routeLine = L.polyline(
          [[startLocation!.lat, startLocation!.lng], [endLocation!.lat, endLocation!.lng]],
          {
            color: '#ef4444', // red-500
            weight: 4,
            opacity: 0.7,
            dashArray: '5, 5', // Dashed line for fallback routes
          }
        ).addTo(map);

        const distance = calculateDistance(
          startLocation!.lat, 
          startLocation!.lng, 
          endLocation!.lat, 
          endLocation!.lng
        );
        
        routeLine.bindTooltip(`Direct distance: ${distance.toFixed(2)} km`);
        routeLayersRef.current.push(routeLine);
      } else {
        // For route with waypoints
        const points = [startLocation!, ...waypoints, endLocation!];
        
        for (let i = 0; i < points.length - 1; i++) {
          const point1 = points[i];
          const point2 = points[i + 1];
          
          const routeLine = L.polyline(
            [[point1.lat, point1.lng], [point2.lat, point2.lng]], 
            {
              color: '#ef4444', // red-500
              weight: 4,
              opacity: 0.7,
              dashArray: '5, 5',
            }
          ).addTo(map);
          
          const distance = calculateDistance(
            point1.lat, 
            point1.lng, 
            point2.lat, 
            point2.lng
          );
          
          routeLine.bindTooltip(`Direct distance: ${distance.toFixed(2)} km`);
          routeLayersRef.current.push(routeLine);
        }
      }
      
      // Fit bounds to include the entire route
      const routePoints = [startLocation!, ...waypoints, endLocation!];
      const bounds = L.latLngBounds(routePoints.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [showRoutes, startLocation, endLocation, waypoints]);

  // Update map center when center prop changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center) return;
    
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center]);

  return (
    <Card className={className}>
      <div 
        ref={mapContainer} 
        className={`w-full h-full min-h-[${mapHeight}] rounded-lg relative transition-all duration-300 animate-fade-in`}
        style={{ minHeight: mapHeight }}
      >
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/10 flex items-center justify-center z-50 rounded-lg">
            <div className="bg-white p-3 rounded-full shadow-lg animate-pulse">
              <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SimpleMap;
