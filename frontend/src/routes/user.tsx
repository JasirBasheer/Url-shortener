import { ROUTES } from "@/constants";
import { SignInPage, SignUpPage } from "@/pages/auth";
import { Route, Routes } from "react-router-dom";

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.USER.DASHBOARD} element={<SignInPage />} />
      <Route path={ROUTES.USER.PROFILE} element={<SignUpPage />} />
    </Routes>
  );
};

