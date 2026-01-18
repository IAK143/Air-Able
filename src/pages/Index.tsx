
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const navigate = useNavigate();
  const { isOnboardingComplete } = useUser();

  useEffect(() => {
    // Immediately redirect to appropriate page
    if (isOnboardingComplete) {
      navigate('/', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  }, [isOnboardingComplete, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-green-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Air Route Guardian</h1>
        <p className="text-gray-600">Finding the cleanest routes for you...</p>
      </div>
    </div>
  );
};

export default Index;
