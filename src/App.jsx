import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AuthLayout from "./pages/Auth/AuthLayout.jsx";
import Navbar from "./components/ui/Navbar.jsx";
import NgoAuthLayout from "./pages/Auth/NgoAuth.Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useAuth } from "./providers/AuthProvider.jsx";

const App = () => {
    const { AuthState } = useAuth();
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/_auth/" element={AuthState.isAuthenticated ? <Navigate to="/app/dashboard" /> : <Outlet />}>
            <Route path="login" element={<AuthLayout type={"login"} />} />
            <Route path="register" element={<AuthLayout type={"register"} />} />
            <Route
              path="login/ngo"
              element={<NgoAuthLayout type={"login"} />}
            />
            <Route
              path="register/ngo"
              element={<NgoAuthLayout type={"register"} />}
            />
          </Route>
          <Route path="/app" element={AuthState.isAuthenticated ? <Outlet /> : <Navigate to="/_auth/login" />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<div className="flex justify-center w-full items-center min-h-screen">404 Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
