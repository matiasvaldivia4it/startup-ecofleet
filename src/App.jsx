import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DriverRegistration from './pages/DriverRegistration';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import CustomerPortal from './pages/CustomerPortal';
import ApiDocs from './pages/ApiDocs';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/registro-conductor" element={<DriverRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/api-docs" element={<ApiDocs />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute>
                <CustomerPortal />
              </ProtectedRoute>
            }
          />
        </Routes>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
