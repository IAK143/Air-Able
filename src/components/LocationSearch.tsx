
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Location } from '@/types';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { geocodeLocation } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

const LocationSearch = ({
  onLocationSelect,
  placeholder = "Search for a location...",
  buttonText = "Search",
  className = ""
}: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const location = await geocodeLocation(searchTerm);
      if (location) {
        onLocationSelect(location);
      }
    } catch (err) {
      setError('Failed to find location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUserLocation = () => {
    setIsSearching(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        onLocationSelect(userLocation);
        setIsSearching(false);
      },
      (err) => {
        console.error('Error getting user location:', err);
        setError('Could not access your location. Please allow location access or enter manually.');
        setIsSearching(false);
      }
    );
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isSearching}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2"
            onClick={handleUserLocation}
            disabled={isSearching}
          >
            <MapPin className="h-4 w-4" />
            <span>Use my current location</span>
          </Button>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSearch;
