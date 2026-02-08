
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Integrations from './components/Integrations';
import Logs from './components/Logs';
import Settings from './components/Settings';
import Modal from './components/Modal';
import Tutorial from './components/Tutorial';
import type { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

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

  return (
    <>
      <div className="flex h-screen bg-background text-text-primary">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          onHelpClick={() => setIsHelpModalOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {renderContent()}
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
   