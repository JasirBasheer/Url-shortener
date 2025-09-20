import { ROUTES } from "@/constants";
import { DashboardPage, ProfilePage } from "@/pages/user";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Route, Routes } from "react-router-dom";

export const UserRoutes = () => {
  return (
    <Routes>
      <Route 
        path={ROUTES.USER.DASHBOARD} 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.USER.PROFILE} 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

