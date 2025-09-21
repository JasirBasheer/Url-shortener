import { ROUTES } from "@/constants";
import { SignInPage, SignUpPage } from "@/pages/auth";
import { PublicRoute } from "@/features/auth/components/PublicRoute";
import { Route, Routes } from "react-router-dom";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route 
        path={ROUTES.AUTH.SIGN_IN} 
        element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        } 
      />
      <Route 
        path={ROUTES.AUTH.SIGN_UP} 
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        } 
      />
    </Routes>
  );
};

