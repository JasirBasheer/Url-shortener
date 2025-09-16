import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/root";
import { AuthRoutes, UserRoutes } from "./routes";
import { ROOT_ROUTES } from "./constants";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path={`/${ROOT_ROUTES.AUTH}/*`} element={<AuthRoutes />} />
      <Route path={`/${ROOT_ROUTES.USER}/*`} element={<UserRoutes />} />
    </Routes>
  );
}

export default App;
