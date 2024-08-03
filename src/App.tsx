import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './route/route';
import { useAuthStore } from './store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { logout } = useAuthStore();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/') {
      logout();
    }
  }, [location, logout]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <ProtectedRoute>
        <AppRoutes />
      </ProtectedRoute>
    </Router>
  );
};

export default App;