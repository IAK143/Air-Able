
import { SavedRoute } from "@/types";
import { getAirQualityColor, getAirQualityLevel } from "@/services/api";
import { formatLocation } from "@/utils/routeUtils";
import { BadgeCheck, TrendingUp } from "lucide-react";

interface RouteComparisonTableProps {
  routes: (SavedRoute | (Omit<SavedRoute, "id"> & { duration?: number }))[];
  selectedIndex: number;
}

const RouteComparisonTable: React.FC<RouteComparisonTableProps> = ({ routes, selectedIndex }) => {
  if (!routes || routes.length <= 1) return null;
  
  const minAQI = Math.min(...routes.map(r => r.estimatedAQI));
  const maxAQI = Math.max(...routes.map(r => r.estimatedAQI));
  
  // Check if all routes have the same AQI value
  const allSameAQI = minAQI === maxAQI;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2">Route Comparison</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Route</th>
              <th className="px-4 py-2">Distance</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Air Quality</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, idx) => (
              <tr
                key={idx}
                className={`
                  ${idx === selectedIndex ? "bg-green-50 font-semibold" : ""}
                `}
              >
                <td className="px-4 py-2">{route.name}</td>
                <td className="px-4 py-2">{route.totalDistance} km</td>
                <td className="px-4 py-2">
                  {route.duration ? `${route.duration} min` : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs ${getAirQualityColor(route.estimatedAQI)} mr-2`}
                  >
                    {getAirQualityLevel(route.estimatedAQI)} (AQI: {route.estimatedAQI})
                  </span>
                  {!allSameAQI && route.estimatedAQI === minAQI && (
                    <span title="Lowest AQI">
                      <BadgeCheck className="inline-block h-4 w-4 text-green-500 ml-1" />
                    </span>
                  )}
                  {!allSameAQI && route.estimatedAQI === maxAQI && (
                    <span title="Highest AQI">
                      <TrendingUp className="inline-block h-4 w-4 text-red-500 ml-1" />
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">{formatLocation(route.startLocation)}</td>
                <td className="px-4 py-2">{formatLocation(route.endLocation)}</td>
                <td className="px-4 py-2">
                  {route.waypoints && route.waypoints.length > 0
                    ? `Via ${route.waypoints.map(w => w.name).join(", ")}`
                    : "Direct"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {!allSameAQI && (
          <>
            <BadgeCheck className="inline-block h-4 w-4 text-green-500 mr-1" /> Lowest AQI
            <TrendingUp className="inline-block h-4 w-4 text-red-500 ml-6 mr-1" /> Highest AQI
          </>
        )}
      </div>
    </div>
  );
};

export default RouteComparisonTable;
