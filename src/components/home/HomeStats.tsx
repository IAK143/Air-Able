
import { AirQualityData, Location, WeatherData } from '@/types';
import AirQualityIndicator from '@/components/AirQualityIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface HomeStatsProps {
  airQuality: AirQualityData | null;
  weather: WeatherData | null;
  loading: boolean;
}

const HomeStats = ({ airQuality, weather, loading }: HomeStatsProps) => {
  if (loading) return null;

  return (
    <>
      <AirQualityIndicator 
        data={airQuality} 
        isLoading={loading} 
      />
      
      {weather && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-medium">Weather</h3>
                <div className="flex items-center mt-1">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{Math.round(weather.temp)}°C</span>
                    <span className="text-sm capitalize text-muted-foreground">{weather.description}</span>
                  </div>
                </div>
              </div>
              
              <div className="h-14 w-14">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt="Weather icon" 
                  className="h-full w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Humidity</span>
                  <span className="font-medium">{weather.humidity}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Wind</span>
                  <span className="font-medium">{weather.windSpeed} m/s</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default HomeStats;
