import { useState, useEffect } from "react";
import { Location, SavedRoute } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, RotateCw, View, Map as MapIcon, Route as RouteIcon, AlertCircle, Sparkles } from "lucide-react";
import { calculateTotalDistance } from "@/utils/routeUtils";
import { fetchAirQuality, estimateRouteAQI, geocodeLocation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { getNearbyPlaces, getLocationDetails, calculateTomTomRoute } from "@/utils/tomtomUtils";
import CitiesSelect from "./CitiesSelect";
import LocationSearch from "../LocationSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from "../Map";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RouteFormProps {
  onRoutesCalculated: (
    routes: (Omit<SavedRoute, "id"> & { duration?: number })[],
    selectedRouteIndex: number
  ) => void;
  initialStart?: Location;
  disabled?: boolean;
}

const RouteForm: React.FC<RouteFormProps> = ({ onRoutesCalculated, initialStart, disabled = false }) => {
  const [routeName, setRouteName] = useState<string>("");
  const [startLocation, setStartLocation] = useState<Location | undefined>(initialStart);
  const [endLocation, setEndLocation] = useState<Location | undefined>(undefined);
  const [suggestedCities, setSuggestedCities] = useState<Location[]>([]);
  const [candidateRoutes, setCandidateRoutes] = useState<Array<Omit<SavedRoute, "id"> & {duration?: number}>>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [routeDurations, setRouteDurations] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadNearbyPlaces = async () => {
      if (!initialStart) return;
      
      try {
        console.log("Loading nearby places for", initialStart);
        const places = await getNearbyPlaces(initialStart.lat, initialStart.lng);
        setSuggestedCities(places);
      } catch (error) {
        console.error("Error loading nearby places:", error);
      }
    };
    
    loadNearbyPlaces();
  }, [initialStart]);
  
  useEffect(() => {
    const ensureLocationName = async () => {
      if (startLocation && (!startLocation.name || startLocation.name.includes("Location at"))) {
        try {
          console.log("Getting details for start location:", startLocation);
          const locationDetails = await getLocationDetails(startLocation.lat, startLocation.lng);
          if (locationDetails && locationDetails.name) {
            setStartLocation({
              ...startLocation,
              name: locationDetails.name,
              address: locationDetails.address
            });
          }
        } catch (error) {
          console.error("Error getting location name:", error);
        }
      }
    };
    
    ensureLocationName();
  }, [startLocation]);
  
  const canFindRoute = (): boolean => {
    return !!startLocation && !!endLocation && !disabled;
  };

  const findCleanestRoutes = async () => {
    if (!canFindRoute()) {
      toast({
        title: "Missing Locations",
        description: "Please select both start and end locations.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let start = startLocation!;
      let end = endLocation!;

      if (!start.name || start.name.includes("Location at")) {
        const startDetails = await getLocationDetails(start.lat, start.lng);
        if (startDetails) {
          start = {
            ...start,
            name: startDetails.name || start.name,
            address: startDetails.address
          };
        }
      }

      if (!end.name || end.name.includes("Location at")) {
        const endDetails = await getLocationDetails(end.lat, end.lng);
        if (endDetails) {
          end = {
            ...end,
            name: endDetails.name || end.name,
            address: endDetails.address
          };
        }
      }

      const allRoutes: Array<Omit<SavedRoute, "id"> & {duration?: number}> = [];

      const directAQI = await estimateRouteAQI(start, end, []);
      const directDistance = calculateTotalDistance(start, end, []);
      let durationDirect: number | undefined;
      try {
        const tomtomDirect = await calculateTomTomRoute(start, end, []);
        if (tomtomDirect && tomtomDirect.routes && tomtomDirect.routes[0]?.summary) {
          durationDirect = Math.round(tomtomDirect.routes[0].summary.travelTimeInSeconds / 60);
        }
      } catch {}
      const directRoute: Omit<SavedRoute, "id"> & {duration?: number} = {
        name: routeName
          ? `${routeName} (Direct)`
          : `Direct: ${start.name || 'Start'} to ${end.name || 'End'}`,
        startLocation: start,
        endLocation: end,
        waypoints: [],
        totalDistance: parseFloat(directDistance.toFixed(1)),
        estimatedAQI: directAQI,
        duration: durationDirect
      };

      const midLat = (start.lat + end.lat) / 2;
      const midLng = (start.lng + end.lng) / 2;
      const latOffset = (Math.random() - 0.5) * 0.15;
      const lngOffset = (Math.random() - 0.5) * 0.15;
      const waypointLocation = await getLocationDetails(midLat + latOffset, midLng + lngOffset);
      const waypoint: Location = waypointLocation || {
        lat: midLat + latOffset,
        lng: midLng + lngOffset,
        name: "Via point"
      };
      
      const viaAQI = await estimateRouteAQI(start, end, [waypoint]);
      const viaDistance = calculateTotalDistance(start, end, [waypoint]);
      let durationVia: number | undefined;
      try {
        const tomtomVia = await calculateTomTomRoute(start, end, [waypoint]);
        if (tomtomVia && tomtomVia.routes && tomtomVia.routes[0]?.summary) {
          durationVia = Math.round(tomtomVia.routes[0].summary.travelTimeInSeconds / 60);
        }
      } catch {}
      const viaRoute: Omit<SavedRoute, "id"> & {duration?: number} = {
        name: routeName
          ? `${routeName} (Via ${waypoint.name || "Waypoint"})`
          : `Via: ${start.name || 'Start'} to ${end.name || 'End'} via ${waypoint.name}`,
        startLocation: start,
        endLocation: end,
        waypoints: [waypoint],
        totalDistance: parseFloat(viaDistance.toFixed(1)),
        estimatedAQI: Math.min(5, viaAQI + 1),
        duration: durationVia,
      };

      const oneThirdLat = start.lat + (end.lat - start.lat) / 3;
      const oneThirdLng = start.lng + (end.lng - start.lng) / 3;
      const latOffset2 = (Math.random() - 0.5) * 0.08;
      const lngOffset2 = (Math.random() - 0.5) * 0.08;
      const waypoint2Location = await getLocationDetails(oneThirdLat + latOffset2, oneThirdLng + lngOffset2);
      const waypoint2: Location = waypoint2Location || {
        lat: oneThirdLat + latOffset2,
        lng: oneThirdLng + lngOffset2,
        name: "Alt. Via point"
      };
      
      const altViaAQI = await estimateRouteAQI(start, end, [waypoint2]);
      const altViaDistance = calculateTotalDistance(start, end, [waypoint2]);
      let durationAlt: number | undefined;
      try {
        const tomtomAlt = await calculateTomTomRoute(start, end, [waypoint2]);
        if (tomtomAlt && tomtomAlt.routes && tomtomAlt.routes[0]?.summary) {
          durationAlt = Math.round(tomtomAlt.routes[0].summary.travelTimeInSeconds / 60);
        }
      } catch {}
      const altViaRoute: Omit<SavedRoute, "id"> & {duration?: number} = {
        name: routeName
          ? `${routeName} (Via ${waypoint2.name || "Alt. Waypoint"})`
          : `Via: ${start.name || 'Start'} to ${end.name || 'End'} via ${waypoint2.name}`,
        startLocation: start,
        endLocation: end,
        waypoints: [waypoint2],
        totalDistance: parseFloat(altViaDistance.toFixed(1)),
        estimatedAQI: Math.min(5, (altViaAQI + 2)),
        duration: durationAlt,
      };

      allRoutes.push(directRoute);
      allRoutes.push(viaRoute);
      allRoutes.push(altViaRoute);

      let minAQI = Math.min(...allRoutes.map(r => r.estimatedAQI));
      let maxAQI = Math.max(...allRoutes.map(r => r.estimatedAQI));
      const bestIndex = allRoutes.findIndex(r => r.estimatedAQI === minAQI);
      let worstIndex = allRoutes.findIndex(r => r.estimatedAQI === maxAQI);
      let displayRoutes: Array<Omit<SavedRoute, "id"> & {duration?: number}> = [];
      if (bestIndex === worstIndex) {
        displayRoutes = [allRoutes[bestIndex]];
      } else {
        displayRoutes = [allRoutes[bestIndex], allRoutes[worstIndex]];
      }

      displayRoutes = allRoutes; // Show all candidates

      setCandidateRoutes(displayRoutes);
      setRouteDurations(displayRoutes.map(r => r.duration ?? 0));
      setSelectedRouteIndex(bestIndex);

      toast({
        title: "Routes Calculated",
        description: `Found ${allRoutes.length} candidate routes. Lowest AQI: ${minAQI}, Highest AQI: ${maxAQI}`,
      });

      onRoutesCalculated(displayRoutes, bestIndex);
    } catch (error) {
      console.error('Error finding route:', error);
      toast({
        title: "Error",
        description: "Failed to calculate routes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (candidateRoutes.length === 0) return;
    onRoutesCalculated(candidateRoutes, selectedRouteIndex);
  }, [selectedRouteIndex]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="lg:sticky lg:top-4 z-10 border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Find Clean Routes
                </CardTitle>
                <CardDescription className="mt-2">
                  {disabled ? (
                    <span className="text-destructive flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Insufficient credits to search for routes
                    </span>
                  ) : (
                    "Select start & end points for route discovery"
                  )}
                </CardDescription>
              </div>
              {!disabled && (
                <Badge variant="outline" className="bg-blue-50">
                  <RouteIcon className="h-3 w-3 mr-1" />
                  Ready to Search
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Start Location</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select your starting point</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CitiesSelect
                  value={startLocation}
                  onChange={setStartLocation}
                  placeholder="Select or search start city"
                  disabled={disabled}
                  className="border-2"
                />
                <AnimatePresence>
                  {startLocation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-muted-foreground bg-blue-50 p-2 rounded-md"
                    >
                      {startLocation.address || startLocation.name}
                      <div className="text-xs mt-1">
                        {startLocation.lat.toFixed(6)}, {startLocation.lng.toFixed(6)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <Separator className="my-4" />

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">End Location</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select your destination</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <CitiesSelect
                    value={endLocation}
                    onChange={setEndLocation}
                    placeholder="Select or search destination city"
                    disabled={disabled}
                    className="border-2"
                  />
                  <LocationSearch
                    onLocationSelect={setEndLocation}
                    placeholder="Search specific location"
                    buttonText="Find Location"
                    disabled={disabled}
                    className="border-2"
                  />
                </div>
                <AnimatePresence>
                  {endLocation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-muted-foreground bg-blue-50 p-2 rounded-md"
                    >
                      {endLocation.address || endLocation.name}
                      <div className="text-xs mt-1">
                        {endLocation.lat.toFixed(6)}, {endLocation.lng.toFixed(6)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <AnimatePresence>
              {suggestedCities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    Suggested Destinations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedCities.slice(0, 5).map((city, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-white hover:bg-blue-50 transition-colors"
                          onClick={() => setEndLocation(city)}
                        >
                          {city.name || "Nearby Location"}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-sm font-medium flex items-center gap-2">
                <span>Route Name</span>
                <Badge variant="outline" className="text-xs">Optional</Badge>
              </label>
              <Input
                placeholder="Enter a name for your route"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                disabled={disabled}
                className="border-2"
              />
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                onClick={findCleanestRoutes}
                disabled={!canFindRoute() || loading}
                className={`w-full transition-all duration-200 ${
                  disabled 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding routes...
                  </>
                ) : disabled ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Insufficient Credits
                  </>
                ) : (
                  <>
                    <RouteIcon className="mr-2 h-4 w-4" />
                    Find cleanest routes
                  </>
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col gap-6"
      >
        <Tabs defaultValue="map2d" className="">
          <TabsList>
            <TabsTrigger value="map2d">
              <MapIcon className="h-4 w-4 mr-1" /> 2D Map
            </TabsTrigger>
            <TabsTrigger value="roadview">
              <View className="h-4 w-4 mr-1" /> Road / 3D View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="map2d">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  Route Preview
                  <span className="text-xs bg-primary rounded text-white px-2 ml-3">
                    {candidateRoutes[selectedRouteIndex]?.name || 'N/A'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] rounded-b-lg overflow-hidden">
                  <Map
                    initialCenter={candidateRoutes[selectedRouteIndex]?.startLocation || startLocation}
                    markers={[
                      ...(candidateRoutes[selectedRouteIndex]?.startLocation ? [candidateRoutes[selectedRouteIndex].startLocation] : []),
                      ...(candidateRoutes[selectedRouteIndex]?.endLocation ? [candidateRoutes[selectedRouteIndex].endLocation] : []),
                      ...(candidateRoutes[selectedRouteIndex]?.waypoints || []),
                    ]}
                    showRoutes={true}
                    startLocation={candidateRoutes[selectedRouteIndex]?.startLocation}
                    endLocation={candidateRoutes[selectedRouteIndex]?.endLocation}
                    waypoints={candidateRoutes[selectedRouteIndex]?.waypoints || []}
                    className="w-full h-full"
                    mapHeight="400px"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="roadview">
            <Card>
              <CardHeader>
                <CardTitle>Road / 3D Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[400px] text-muted-foreground relative">
                {candidateRoutes[selectedRouteIndex] && candidateRoutes[selectedRouteIndex].startLocation && candidateRoutes[selectedRouteIndex].endLocation ? (
                  <iframe
                    title="Google StreetView"
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: 10 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/streetview?key=AIzaSyDrMHrimqV5AeG7K0LtwFdwcjKLFaFoZA0&location=${candidateRoutes[selectedRouteIndex].waypoints && candidateRoutes[selectedRouteIndex].waypoints.length > 0
                      ? `${candidateRoutes[selectedRouteIndex].waypoints[0].lat},${candidateRoutes[selectedRouteIndex].waypoints[0].lng}`
                      : `${candidateRoutes[selectedRouteIndex].startLocation.lat},${candidateRoutes[selectedRouteIndex].startLocation.lng}`}&heading=210&pitch=10&fov=80`}
                  />
                ) : (
                  <span className="text-center w-full">
                    <View className="mx-auto mb-2 h-10 w-10 text-gray-400" />
                    Road/3D Street View not available -<br />
                    (Mapbox/Google StreetView API connectivity required)<br />
                    <span className="text-xs italic">Contact admin to enable</span>
                  </span>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {candidateRoutes.length > 0 && (
          <div>
            <div className="mb-4 flex gap-2">
              <span className="text-base font-semibold">Routes:</span>
              <span className="bg-green-100 text-green-800 text-xs rounded px-2 py-1">
                Lowest AQI
              </span>
              {candidateRoutes.length > 1 && (
                <span className="bg-red-100 text-red-800 text-xs rounded px-2 py-1">
                  High AQI
                </span>
              )}
            </div>
            {candidateRoutes.map((route, idx) => (
              <button
                key={idx}
                className={`flex flex-col w-full p-3 rounded transition-all border-2
                  ${selectedRouteIndex === idx ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200'}
                  hover:border-blue-400 hover:bg-blue-50 mb-2`}
                onClick={() => setSelectedRouteIndex(idx)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{route.name}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs 
                    ${idx === 0 ? 'bg-green-500 text-white' : 'bg-red-400 text-white'}`}>
                    {idx === 0 ? 'Lowest AQI' : 'High AQI'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-2">
                  <span><b>Distance:</b> {route.totalDistance} km</span>
                  <span><b>AQI:</b> {route.estimatedAQI}</span>
                  <span><b>Time:</b> {route.duration ? `${route.duration} min` : 'N/A'}</span>
                  <span><b>From:</b> {route.startLocation.name || 'N/A'}</span>
                  <span><b>To:</b> {route.endLocation.name || 'N/A'}</span>
                </div>
                {route.waypoints && route.waypoints.length > 0 && (
                  <div className="text-xs mt-1 text-muted-foreground">
                    via {route.waypoints.map(w => w.name).join(', ')}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RouteForm;
