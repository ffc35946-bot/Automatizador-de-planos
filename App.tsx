
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
    // Verificar se existe sessão ativa
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
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Carregando...</div>;
  }

  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <div className="flex h-screen bg-background text-text-primary">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          onHelpClick={() => setIsHelpModalOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      <Modal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
        title="Guia de Configuração e Ajuda"
      >
        <Tutorial />
      </Modal>
    </>
  );
};

export default App;
