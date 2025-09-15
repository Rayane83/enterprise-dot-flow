import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Parametrage from "@/pages/Parametrage";
import Auth from "@/pages/Auth";
import Logs from "@/pages/Logs";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// SuperAdmin Only Route
function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!appUser?.is_superadmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/parametrage" element={
          <ProtectedRoute>
            <Parametrage />
          </ProtectedRoute>
        } />
        <Route path="/logs" element={
          <ProtectedRoute>
            <SuperAdminRoute>
              <Logs />
            </SuperAdminRoute>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;