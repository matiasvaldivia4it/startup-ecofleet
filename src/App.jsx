import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import LandingPage from './pages/LandingPage';
import DriverRegistration from './pages/DriverRegistration';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import CustomerPortal from './pages/CustomerPortal';
import ApiDocs from './pages/ApiDocs';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/registro-conductor" element={<DriverRegistration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/customer" element={<CustomerPortal />} />
          <Route path="/api-docs" element={<ApiDocs />} />
        </Routes>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
