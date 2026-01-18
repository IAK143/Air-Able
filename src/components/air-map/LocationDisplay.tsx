
import { Location } from '@/types';
import { MapPin, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';

interface LocationDisplayProps {
  currentLocation: Location | null;
  loading: boolean;
  onRefresh: () => void;
}

const LocationDisplay = ({ currentLocation, loading, onRefresh }: LocationDisplayProps) => {
  return (
    <CardContent className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {currentLocation ? (
              currentLocation.address || 
              `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
            ) : (
              'Select a location on the map'
            )}
          </span>
        </div>
        
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onRefresh}
          disabled={loading || !currentLocation}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </div>
    </CardContent>
  );
};

export default LocationDisplay;
