import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Collection from './pages/Collection';
import GuitarDetail from './pages/GuitarDetail';
import Wishlist from './pages/Wishlist';
import Offers from './pages/Offers';
import SharedCollection from './pages/SharedCollection';
import About from './pages/About';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <Navbar />
      {children}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/share/:token" element={<SharedCollection />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/collection" element={<ProtectedRoute><Layout><Collection /></Layout></ProtectedRoute>} />
      <Route path="/guitar/:id" element={<ProtectedRoute><Layout><GuitarDetail /></Layout></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Layout><Wishlist /></Layout></ProtectedRoute>} />
      <Route path="/offers" element={<ProtectedRoute><Layout><Offers /></Layout></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><Layout><About /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
