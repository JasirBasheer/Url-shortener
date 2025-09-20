import { Route, Routes } from "react-router-dom";
import { Landing, RedirectPage } from "./pages/root";
import { AuthRoutes, UserRoutes } from "./routes";
import { ROOT_ROUTES } from "./constants";
import { AuthProvider } from "./features/auth/hooks/useAuth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/:shortCode" element={<RedirectPage />} />
        <Route path={`/${ROOT_ROUTES.AUTH}/*`} element={<AuthRoutes />} />
        <Route path={`/${ROOT_ROUTES.USER}/*`} element={<UserRoutes />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
