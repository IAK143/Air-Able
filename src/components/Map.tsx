
import React from 'react';
import { Location } from '@/types';
import { Card } from '@/components/ui/card';
import SimpleMap from './SimpleMap';

interface MapProps {
  initialCenter?: Location;
  markers?: Location[];
  showAirQuality?: boolean;
  onLocationSelect?: (location: Location) => void;
  interactive?: boolean;
  className?: string;
  showRoutes?: boolean;
  startLocation?: Location;
  endLocation?: Location;
  waypoints?: Location[];
  mapHeight?: string;
  animateLocations?: boolean;
}

const Map: React.FC<MapProps> = ({ 
  initialCenter, 
  markers = [],
  showAirQuality = true,
  onLocationSelect,
  interactive = true,
  className = "",
  showRoutes = false,
  startLocation,
  endLocation,
  waypoints = [],
  mapHeight = "400px",
  animateLocations = true
}) => {
  return (
    <Card className={`overflow-hidden shadow-lg rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-xl ${className}`}>
      <SimpleMap
        center={initialCenter}
        markers={markers}
        onLocationSelect={onLocationSelect}
        interactive={interactive}
        showAirQuality={showAirQuality}
        showRoutes={showRoutes}
        startLocation={startLocation}
        endLocation={endLocation}
        waypoints={waypoints}
        mapHeight={mapHeight}
        animateLocations={animateLocations}
        className="h-full"
      />
    </Card>
  );
};

export default Map;
