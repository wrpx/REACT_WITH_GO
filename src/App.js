// App.js
import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./route/route";
import useAuthStore from "./store/useAuthStore";

function ProtectedRoute({ children }) {
  const authStore = useAuthStore();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === "/") {
      authStore.logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, authStore.logout]);

  return children;
}

function App() {
  return (
    <Router>
      <ProtectedRoute>
        <AppRoutes />
      </ProtectedRoute>
    </Router>
  );
}

export default App;
