
import { SavedRoute } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAirQualityColor, getAirQualityLevel } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Check, Navigation } from "lucide-react";
import { formatLocation } from "@/utils/routeUtils";

interface RouteResultsProps {
  route: SavedRoute | Omit<SavedRoute, "id"> & {duration?: number};
  onSave: () => void;
}

const RouteResults: React.FC<RouteResultsProps> = ({ route, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cleanest Route Details</CardTitle>
        <CardDescription>
          Showing the best available route based on lowest AQI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Route</span>
            <span>{route.name}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">From</span>
              <span>{formatLocation(route.startLocation)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {route.startLocation.lat.toFixed(6)}, {route.startLocation.lng.toFixed(6)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">To</span>
              <span>{formatLocation(route.endLocation)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {route.endLocation.lat.toFixed(6)}, {route.endLocation.lng.toFixed(6)}
            </div>
          </div>
          {route.waypoints && route.waypoints.length > 0 && (
            <div>
              <span className="font-medium">Via</span>
              <ul className="mt-1 text-sm">
                {route.waypoints.map((waypoint, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{formatLocation(waypoint)}</span>
                    <span className="text-xs text-muted-foreground">
                      {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-medium">Distance</span>
            <span>{route.totalDistance} km</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Estimated Time</span>
            <span>
              {route.duration ? `${route.duration} min` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Air Quality</span>
            <span className={`px-2 py-1 rounded-full text-white text-xs ${getAirQualityColor(route.estimatedAQI)}`}>
              {getAirQualityLevel(route.estimatedAQI)} (AQI: {route.estimatedAQI})
            </span>
          </div>
        </div>
        <Button onClick={onSave} className="w-full" variant="default">
          <Check className="mr-2 h-4 w-4" />
          Save this route
        </Button>
      </CardContent>
    </Card>
  );
};

export default RouteResults;
