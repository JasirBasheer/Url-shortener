import { ROUTES } from "@/constants";
import { SignInPage, SignUpPage } from "@/pages/auth";
import { Route, Routes } from "react-router-dom";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.AUTH.SIGN_IN} element={<SignInPage />} />
      <Route path={ROUTES.AUTH.SIGN_UP} element={<SignUpPage />} />
    </Routes>
  );
};

