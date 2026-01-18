import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route as RouterRoute, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";

// Pages
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const { isOnboardingComplete } = useUser();

  if (!isOnboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const RequireNoOnboarding = ({ children }: { children: React.ReactNode }) => {
  const { isOnboardingComplete } = useUser();

  if (isOnboardingComplete) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isOnboardingComplete } = useUser();

  return (
    <>
      <Routes>
        <RouterRoute
          path="/onboarding"
          element={
            <RequireNoOnboarding>
              <Onboarding />
            </RequireNoOnboarding>
          }
        />
        <RouterRoute
          path="/"
          element={
            <RequireOnboarding>
              <Home />
            </RequireOnboarding>
          }
        />
        <RouterRoute path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
