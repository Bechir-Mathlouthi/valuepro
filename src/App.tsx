import React, { useState } from 'react';
import { Calculator, LineChart, Settings, Users } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analyses from './components/Analyses';
import Comparables from './components/Comparables';
import Parameters from './components/Parameters';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userName, setUserName] = useState('');

  const menuItems = [
    { icon: Calculator, label: 'Valorisation', href: '#valuation' },
    { icon: LineChart, label: 'Analyses', href: '#analysis' },
    { icon: Users, label: 'Comparables', href: '#comparables' },
    { icon: Settings, label: 'Paramètres', href: '#settings' },
  ];

  const handleLogin = (email: string, password: string) => {
    setIsLoggedIn(true);
    setUserName(email.split('@')[0]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    setUserName('');
  };

  const handleMenuClick = (href: string) => {
    const page = href.replace('#', '');
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'analysis':
        return <Analyses />;
      case 'comparables':
        return <Comparables />;
      case 'settings':
        return <Parameters />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={userName} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar menuItems={menuItems.map(item => ({
          ...item,
          onClick: () => handleMenuClick(item.href)
        }))} />
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;