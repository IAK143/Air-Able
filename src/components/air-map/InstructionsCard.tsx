
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const InstructionsCard = () => {
  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle>How to use this map</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          • Tap anywhere on the map to check air quality in that area
        </p>
        <p className="text-sm">
          • The air quality index (AQI) uses a scale from 1 (Good) to 6 (Hazardous)
        </p>
        <p className="text-sm">
          • High PM2.5 and PM10 values indicate increased pollution particles in the air
        </p>
      </CardContent>
    </Card>
  );
};

export default InstructionsCard;
