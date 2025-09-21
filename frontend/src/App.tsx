import { Route, Routes, Navigate } from "react-router-dom";
import { RedirectPage } from "./pages/root";
import { AuthRoutes, UserRoutes } from "./routes";
import { ROOT_ROUTES } from "./constants";
import { DashboardPage } from "./pages/user";
import { useAuth } from "./features/auth/hooks/useAuth";
import { AuthProvider } from "./features/auth/provider/AuthProvider";

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? <DashboardPage /> : <Navigate to="/auth/sign-in" replace />
        } 
      />
      <Route path="/r/:shortCode" element={<RedirectPage />} />
      <Route path={`/${ROOT_ROUTES.AUTH}/*`} element={<AuthRoutes />} />
      <Route 
        path={`/${ROOT_ROUTES.USER}/*`} 
        element={
          isAuthenticated ? <UserRoutes /> : <Navigate to="/auth/sign-in" replace />
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
