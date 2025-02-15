import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './auth/Home';
import NavigationDrawer from './components/NavigationDrawer';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import PeerDetails from './pages/PeerDetails';
import Peers from './pages/Peers';
import Settings from './pages/Settings';
import LoginForm from './auth/Login';
import { Users } from './pages/Users';

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeInOut' } }
};

const AnimatedPage = ({ children }: { children: React.ReactNode; }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

// Authentication Check Function
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null; // Modify this with your auth logic
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode; }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Prevent access to login if already authenticated */}
        <Route
          path="/auth/login"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <AnimatedPage><LoginForm /></AnimatedPage>}
        />

        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />

        {/* Protected Routes - Only accessible if authenticated */}
        <Route element={<ProtectedRoute><NavigationDrawer /></ProtectedRoute>}>
          <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
          <Route path="/peers" element={<AnimatedPage><Peers /></AnimatedPage>} />
          <Route path="/peers/:id" element={<AnimatedPage><PeerDetails /></AnimatedPage>} />
          <Route path="/users" element={<AnimatedPage><Users /></AnimatedPage>} />
          <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
          <Route path="/help" element={<AnimatedPage><Help /></AnimatedPage>} />
        </Route>

        {/* Catch-all 404 route */}
        <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
