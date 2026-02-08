
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Integrations from './components/Integrations';
import Logs from './components/Logs';
import Settings from './components/Settings';
import Modal from './components/Modal';
import Tutorial from './components/Tutorial';
import Auth from './components/Auth';
import type { Page, User } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('saas_active_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('saas_active_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('saas_active_session');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'integrations':
        return <Integrations />;
      case 'logs':
        return <Logs />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-primary font-bold tracking-widest text-xs uppercase">Carregando Ecossistema</span>
      </div>
    );
  }

  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <div className="flex h-screen bg-background text-text-primary overflow-hidden">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          onHelpClick={() => setIsHelpModalOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar md:pb-8 pb-24 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto pt-6 md:pt-10">
            {renderContent()}
          </div>
        </main>
      </div>
      <Modal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
        title="Manual do Proprietário"
      >
        <Tutorial />
      </Modal>
    </>
  );
};

export default App;
