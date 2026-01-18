
import { Card, CardContent } from "@/components/ui/card";
import { AirQualityData } from "@/types";
import { getAirQualityLevel, getAirQualityColor, getAirQualityTextColor } from "@/services/api";
import { Wind, Droplets, AlertCircle } from "lucide-react";

interface AirQualityIndicatorProps {
  data: AirQualityData | null;
  isLoading?: boolean;
  className?: string;
}

const AirQualityIndicator = ({ 
  data, 
  isLoading = false,
  className = ""
}: AirQualityIndicatorProps) => {
  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="flex flex-col space-y-4 p-4 animate-pulse">
          <div className="h-6 w-3/4 bg-muted rounded"></div>
          <div className="h-12 w-1/2 bg-muted rounded"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="flex space-x-4">
            <div className="h-8 w-1/3 bg-muted rounded"></div>
            <div className="h-8 w-1/3 bg-muted rounded"></div>
            <div className="h-8 w-1/3 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={`${className}`}>
        <CardContent className="flex items-center justify-center p-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
            <p className="text-muted-foreground">Air quality data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const aqiLevel = getAirQualityLevel(data.aqi);
  const aqiColor = getAirQualityColor(data.aqi);
  const aqiTextColor = getAirQualityTextColor(data.aqi);
  const isPoor = data.aqi >= 3;

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Air Quality</h3>
            <span className="text-xs text-muted-foreground">
              {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`text-4xl font-bold ${aqiTextColor}`}>
              {data.aqi}
            </div>
            <div className="flex flex-col">
              <span className={`font-semibold ${aqiTextColor}`}>{aqiLevel}</span>
              <span className="text-xs text-muted-foreground">AQI Level</span>
            </div>
          </div>
          
          <div className={`mt-2 h-2 w-full rounded-full bg-gray-200`}>
            <div 
              className={`h-2 rounded-full ${aqiColor}`} 
              style={{ width: `${data.aqi * 20}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="flex items-center space-x-2 border rounded-md p-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">PM2.5</span>
                <span className="font-medium">{data.pm25.toFixed(1)} μg/m³</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-2">
              <Wind className="h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">PM10</span>
                <span className="font-medium">{data.pm10.toFixed(1)} μg/m³</span>
              </div>
            </div>
          </div>
          
          {isPoor && (
            <div className="mt-2 text-sm bg-red-50 text-red-800 p-2 rounded-md border border-red-100">
              <p className="font-medium">Health Warning</p>
              <p className="text-xs">Air quality is poor. Consider limiting outdoor activities.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityIndicator;
