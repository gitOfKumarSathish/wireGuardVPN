import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './auth/Home';
import NavigationDrawer from './components/NavigationDrawer';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import PeerDetails from './pages/PeerDetails';
import Peers from './pages/Peers';
import Settings from './pages/Settings';

function App() {

  return (
    <Router>
      <NavigationDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/peers" element={<Peers />} />
        <Route path="/peers/:publicKey" element={<PeerDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
