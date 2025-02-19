import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router';
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
import AuthLayer from './auth/authLayer';
import LogOut from './pages/LogOut';

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

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><LoginForm /></AnimatedPage>} />

        {/* Wrap NavigationDrawer only around necessary routes */}
        <Route element={<AuthLayer />} >
          <Route element={<NavigationDrawer />}>
            <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="/peers" element={<AnimatedPage><Peers /></AnimatedPage>} />
            <Route path="/peers/:id" element={<AnimatedPage><PeerDetails /></AnimatedPage>} />
            <Route path="/users" element={<AnimatedPage><Users /></AnimatedPage>} />
            <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
            <Route path="/help" element={<AnimatedPage><Help /></AnimatedPage>} />
            <Route path="/logout" element={<AnimatedPage><LogOut /></AnimatedPage>} />
          </Route>
        </Route>

        <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </AnimatePresence >
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
