import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavigationDrawer from './components/NavigationDrawer';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import PeerDetails from './pages/PeerDetails';
import Peers from './pages/Peers';
import Settings from './pages/Settings';

function App() {

  return (
    <Router>
      <NavigationDrawer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/peers" element={<Peers />} />
        <Route path="/peers/:publicKey" element={<PeerDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;
