
import { useState, useEffect } from 'react';
import { Location, AirQualityData } from '@/types';
import { fetchAirQuality } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import AirQualityIndicator from '@/components/AirQualityIndicator';
import MapContainer from '@/components/air-map/MapContainer';
import LocationDisplay from '@/components/air-map/LocationDisplay';
import InstructionsCard from '@/components/air-map/InstructionsCard';

const AirMap = () => {
  const { user } = useUser();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(user?.homeLocation || null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fetchAirQualityForLocation = async (location: Location) => {
    setLoading(true);
    try {
      const data = await fetchAirQuality(location.lat, location.lng);
      if (data) {
        setAirQuality(data);
        setCurrentLocation(location);
      }
    } catch (error) {
      console.error('Error fetching air quality:', error);
      toast({
        title: "Error",
        description: "Failed to get air quality data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (currentLocation) {
      fetchAirQualityForLocation(currentLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          fetchAirQualityForLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Could not access your location. Please enable location services.",
            variant: "destructive"
          });
        }
      );
    }
  }, []);
  
  const handleMapClick = (location: Location) => {
    fetchAirQualityForLocation(location);
  };
  
  const handleRefresh = () => {
    if (currentLocation) {
      fetchAirQualityForLocation(currentLocation);
    }
  };

  return (
    <div className="container mx-auto pb-20 px-4">
      <div className="pt-8 pb-4">
        <h1 className="text-2xl font-bold">Air Quality Map</h1>
        <p className="text-muted-foreground">
          Explore air quality in different locations
        </p>
      </div>
      
      <div className="space-y-5">
        <MapContainer 
          currentLocation={currentLocation}
          onLocationSelect={handleMapClick}
        />
        
        <LocationDisplay
          currentLocation={currentLocation}
          loading={loading}
          onRefresh={handleRefresh}
        />
        
        <AirQualityIndicator 
          data={airQuality} 
          isLoading={loading} 
        />
        
        <InstructionsCard />
      </div>
    </div>
  );
};

export default AirMap;
