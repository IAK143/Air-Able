import { Location } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw, MapPin, Navigation, Map } from 'lucide-react';
import SimpleMap from '@/components/SimpleMap';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { reverseGeocode } from '@/services/api';
import { getLocationDetails } from '@/utils/tomtomUtils';

interface HomeLocationProps {
  userLocation: Location | null;
  refreshing: boolean;
  onRefresh: () => void;
}

const HomeLocation = ({ userLocation, refreshing, onRefresh }: HomeLocationProps) => {
  const [locationWithName, setLocationWithName] = useState<Location | null>(userLocation);

  useEffect(() => {
    const getLocationName = async () => {
      if (!userLocation) {
        setLocationWithName(null);
        return;
      }
      
      if (!userLocation.name || userLocation.name.includes("Location at")) {
        try {
          const tomtomDetails = await getLocationDetails(userLocation.lat, userLocation.lng);
          
          if (tomtomDetails && tomtomDetails.name && !tomtomDetails.name.includes("Location at")) {
            setLocationWithName({
              ...userLocation,
              name: tomtomDetails.name,
              address: tomtomDetails.address
            });
            return;
          }
          
          const apiDetails = await reverseGeocode(userLocation.lat, userLocation.lng);
          
          if (apiDetails && apiDetails.name) {
            setLocationWithName({
              ...userLocation,
              name: apiDetails.name,
              address: apiDetails.address
            });
          } else {
            setLocationWithName(userLocation);
          }
        } catch (error) {
          console.error("Error getting location name:", error);
          setLocationWithName(userLocation);
        }
      } else {
        setLocationWithName(userLocation);
      }
    };
    
    getLocationName();
  }, [userLocation]);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="h-60 relative">
        <SimpleMap 
          center={locationWithName || undefined}
          markers={locationWithName ? [locationWithName] : []}
          className="h-full"
          interactive={false}
          animateLocations={true}
          mapHeight="240px"
        />
        
        {!locationWithName && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="bg-white/90 p-4 rounded-lg shadow-lg text-center max-w-xs">
              <Map className="h-10 w-10 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">No location set</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click refresh to detect your current location
              </p>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-lg">Your Location</h3>
            {locationWithName ? (
              <>
                <p className={cn(
                  "text-base font-medium",
                  locationWithName.name ? "" : "text-muted-foreground italic"
                )}>
                  {locationWithName.name || "Getting location name..."}
                </p>
                <div className="flex items-center text-sm text-muted-foreground gap-1 animate-fade-in">
                  <MapPin className="h-4 w-4" />
                  <span>{locationWithName.lat.toFixed(6)}, {locationWithName.lng.toFixed(6)}</span>
                </div>
                {locationWithName.address && locationWithName.address !== locationWithName.name && (
                  <p className="text-xs text-muted-foreground mt-1 animate-fade-in">
                    {locationWithName.address}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No location set
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRefresh}
              disabled={refreshing}
              className="transition-all duration-300 hover:bg-primary/5"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
            
            {locationWithName && (
              <Button
                size="sm"
                variant="default"
                asChild
                className="shadow-md transition-all duration-300 hover:shadow-lg animate-fade-in"
              >
                <a href="/route">
                  <Navigation className="h-4 w-4 mr-1" />
                  Plan Route
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeLocation;
