
import { useState, useEffect } from "react";
import SimpleMap from "@/components/SimpleMap";
import { Location, AirQualityData } from "@/types";
import { indiaStates, getAllDistricts } from "@/utils/indiaData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAirQuality, getAirQualityColor, getAirQualityLevel } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Map as MapIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PollutionMapProps {
  center?: Location;
  onLocationSelect?: (location: Location) => void;
}

interface MarkerWithAQI extends Location {
  aqi?: number;
}

const PollutionMap: React.FC<PollutionMapProps> = ({ center, onLocationSelect }) => {
  const [pollutionData, setPollutionData] = useState<Map<string, AirQualityData>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [markers, setMarkers] = useState<MarkerWithAQI[]>([]);
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [showingCount, setShowingCount] = useState<number>(50);
  
  // Filter markers based on selected state
  const filteredMarkers = selectedState 
    ? markers.filter(marker => marker.name?.includes(selectedState))
    : markers.slice(0, showingCount);
  
  // Fetch pollution data for cities
  useEffect(() => {
    const fetchPollutionForCities = async () => {
      setLoading(true);
      
      // Get all district data from India states
      const allDistricts = getAllDistricts();
      
      // Limit to avoid rate limiting on the API
      const districtsToShow = allDistricts.slice(0, showingCount);
      
      try {
        const pollutionMap = new Map<string, AirQualityData>();
        const markersWithData: MarkerWithAQI[] = [];
        
        // Fetch air quality for each city/district
        await Promise.all(districtsToShow.map(async (district) => {
          try {
            const data = await fetchAirQuality(district.lat, district.lng);
            if (data) {
              pollutionMap.set(district.name, data);
              markersWithData.push({
                ...district,
                aqi: data.aqi
              });
            }
          } catch (err) {
            console.error(`Failed to fetch data for ${district.name}:`, err);
          }
        }));
        
        setPollutionData(pollutionMap);
        setMarkers(markersWithData);
      } catch (error) {
        console.error("Error fetching pollution data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPollutionForCities();
  }, [showingCount]);
  
  const loadMoreCities = () => {
    setShowingCount(prev => prev + 50);
  };
  
  return (
    <Card className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              India Air Quality Map
            </CardTitle>
            <div className="flex gap-2 mt-2">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm">Loading air quality data...</span>
                </div>
              ) : (
                <>
                  <Badge variant="outline" className="animate-fade-in">
                    Cities shown: {filteredMarkers.length}
                  </Badge>
                  <Badge variant="outline" className="animate-fade-in">
                    Updated: {new Date().toLocaleTimeString()}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All States</SelectItem>
              {indiaStates.map(state => (
                <SelectItem key={state.name} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {!selectedState && (
            <Button 
              variant="outline" 
              onClick={loadMoreCities} 
              disabled={loading || markers.length >= getAllDistricts().length}
              className="w-full sm:w-auto"
            >
              Load More Cities
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] relative">
          <SimpleMap
            center={center || { lat: 22.5726, lng: 78.9629 }} // Center of India
            markers={filteredMarkers.map(marker => ({
              ...marker,
              name: `${marker.name} (AQI: ${marker.aqi})`,
              className: getAirQualityColor(marker.aqi || 0)
            }))}
            onLocationSelect={onLocationSelect}
            className="h-full"
            mapHeight="500px"
            showAirQuality={true}
            animateLocations={false} // Disable animation for performance with many markers
          />
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-center mt-2">Loading air quality data...</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-white border-t flex flex-wrap gap-3 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-airquality-good"></div>
            <span className="text-xs">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-airquality-moderate"></div>
            <span className="text-xs">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs">Unhealthy for Sensitive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-airquality-bad"></div>
            <span className="text-xs">Unhealthy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-xs">Very Unhealthy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-airquality-hazardous"></div>
            <span className="text-xs">Hazardous</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutionMap;
