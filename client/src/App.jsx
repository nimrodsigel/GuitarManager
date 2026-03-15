import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Collection from './pages/Collection';
import GuitarDetail from './pages/GuitarDetail';
import Wishlist from './pages/Wishlist';
import Offers from './pages/Offers';
import SharedCollection from './pages/SharedCollection';
import About from './pages/About';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <Navbar />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public guest route — no navbar */}
        <Route path="/share/:token" element={<SharedCollection />} />

        {/* Owner routes — with navbar */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/collection" element={<Layout><Collection /></Layout>} />
        <Route path="/guitar/:id" element={<Layout><GuitarDetail /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        <Route path="/offers" element={<Layout><Offers /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
