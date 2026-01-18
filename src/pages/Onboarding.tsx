
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserProfile, Location } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import LocationSearch from '@/components/LocationSearch';
import Map from '@/components/Map';
import { ArrowRight, User, Wind, ThumbsUp, Home } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const OnboardingStep1 = ({ 
  userData, 
  updateUserData, 
  next 
}: { 
  userData: Partial<UserProfile>, 
  updateUserData: (data: Partial<UserProfile>) => void, 
  next: () => void 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="bg-primary/10 p-4 rounded-full">
          <User className="h-10 w-10 text-primary" />
        </div>
      </div>

      <CardHeader>
        <CardTitle>Welcome to Air Route Guardian!</CardTitle>
        <CardDescription>Let's set up your profile for personalized air quality alerts.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">What should we call you?</Label>
          <Input 
            id="name" 
            placeholder="Your name" 
            value={userData.name || ''} 
            onChange={(e) => updateUserData({ name: e.target.value })} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm">Your age (optional)</Label>
          <Input 
            id="age" 
            type="number" 
            placeholder="Your age" 
            value={userData.age || ''} 
            onChange={(e) => updateUserData({ age: Number(e.target.value) || undefined })} 
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={next} disabled={!userData.name}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </div>
  );
};

const OnboardingStep2 = ({ 
  userData, 
  updateUserData, 
  next 
}: { 
  userData: Partial<UserProfile>, 
  updateUserData: (data: Partial<UserProfile>) => void, 
  next: () => void 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="bg-primary/10 p-4 rounded-full">
          <Wind className="h-10 w-10 text-primary" />
        </div>
      </div>

      <CardHeader>
        <CardTitle>Health Information</CardTitle>
        <CardDescription>
          This helps us provide more personalized air quality recommendations.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="respiratory-issues">
            Do you have any respiratory issues?
            <p className="text-xs text-muted-foreground mt-1">
              (like asthma, COPD, or allergies)
            </p>
          </Label>
          <Switch 
            id="respiratory-issues" 
            checked={userData.hasRespiratoryIssues || false} 
            onCheckedChange={(checked) => updateUserData({ hasRespiratoryIssues: checked })} 
          />
        </div>
        
        <div className="space-y-3">
          <Label>Your sensitivity to air pollution</Label>
          <RadioGroup 
            defaultValue={userData.sensitivityLevel || 'medium'}
            onValueChange={(value) => updateUserData({ sensitivityLevel: value as 'low' | 'medium' | 'high' })}
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem 
                value="low" 
                id="low" 
                className="peer sr-only" 
              />
              <Label 
                htmlFor="low" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <ThumbsUp className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Low</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="medium" 
                id="medium" 
                className="peer sr-only" 
              />
              <Label 
                htmlFor="medium" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <ThumbsUp className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Medium</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="high" 
                id="high" 
                className="peer sr-only" 
              />
              <Label 
                htmlFor="high" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <ThumbsUp className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">High</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={next}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </div>
  );
};

const OnboardingStep3 = ({ 
  userData, 
  updateUserData, 
  finish 
}: { 
  userData: Partial<UserProfile>, 
  updateUserData: (data: Partial<UserProfile>) => void, 
  finish: () => void 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    updateUserData({ homeLocation: location });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="bg-primary/10 p-4 rounded-full">
          <Home className="h-10 w-10 text-primary" />
        </div>
      </div>

      <CardHeader>
        <CardTitle>Set Your Home Location</CardTitle>
        <CardDescription>
          This helps us show air quality near your home and find cleaner routes.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <LocationSearch 
          onLocationSelect={handleLocationSelect}
          placeholder="Enter your home address"
        />
        
        {selectedLocation && (
          <div className="mt-4 h-60">
            <Map 
              initialCenter={selectedLocation}
              markers={[selectedLocation]}
              showAirQuality={false}
              className="h-full"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={finish} 
          disabled={!selectedLocation}
        >
          Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          className="w-full text-sm" 
          onClick={finish}
        >
          Skip for now
        </Button>
      </CardFooter>
    </div>
  );
};

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserProfile>>({
    name: '',
    hasRespiratoryIssues: false,
    sensitivityLevel: 'medium',
  });
  const { updateUser, completeOnboarding } = useUser();
  const navigate = useNavigate();
  
  const updateUserData = (data: Partial<UserProfile>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const finishOnboarding = () => {
    updateUser(userData);
    completeOnboarding();
    toast({
      title: "Welcome to Air Route Guardian!",
      description: `Your profile has been set up, ${userData.name}!`,
    });
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-8 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="p-4">
          {step === 1 && (
            <OnboardingStep1 
              userData={userData} 
              updateUserData={updateUserData}
              next={nextStep}
            />
          )}
          
          {step === 2 && (
            <OnboardingStep2 
              userData={userData} 
              updateUserData={updateUserData}
              next={nextStep}
            />
          )}
          
          {step === 3 && (
            <OnboardingStep3 
              userData={userData} 
              updateUserData={updateUserData}
              finish={finishOnboarding}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
