
import { AirQualityData } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface HomeAlertProps {
  airQuality: AirQualityData | null;
}

const HomeAlert = ({ airQuality }: HomeAlertProps) => {
  if (!airQuality || airQuality.aqi < 3) return null;

  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800">Air Quality Alert</h3>
            <p className="text-sm text-amber-700 mt-1">
              The air quality in your area is currently poor. Consider limiting outdoor activities
              or using a mask when going outside.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeAlert;
