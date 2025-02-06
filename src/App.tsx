import './App.css';

import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



import NavigationDrawer from './components/NavigationDrawer';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import Peers from './pages/Peers';
import Settings from './pages/Settings';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <NavigationDrawer />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/peers" element={<Peers />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;
