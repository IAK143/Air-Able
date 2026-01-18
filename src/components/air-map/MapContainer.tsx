
import { Location } from '@/types';
import { Card } from '@/components/ui/card';
import SimpleMap from '@/components/SimpleMap';
import { motion } from 'framer-motion';

interface MapContainerProps {
  currentLocation: Location | null;
  onLocationSelect: (location: Location) => void;
}

const MapContainer = ({ currentLocation, onLocationSelect }: MapContainerProps) => {
  return (
    <Card className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      <motion.div 
        className="h-80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SimpleMap 
          center={currentLocation || undefined}
          markers={currentLocation ? [currentLocation] : []}
          onLocationSelect={onLocationSelect}
          className="h-full"
          mapHeight="320px"
          animateLocations={true}
        />
      </motion.div>
    </Card>
  );
};

export default MapContainer;
