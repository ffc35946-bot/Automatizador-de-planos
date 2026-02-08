
import React from 'react';
import { NAV_ITEMS } from '../constants';
import type { Page } from '../types';
import {
    BarChart,
    Cog,
    LifeBuoy,
    List,
    Blocks,
    HelpCircle,
    LogOut
} from 'lucide-react';


interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onHelpClick: () => void;
  onLogout: () => void;
}

const ICONS: Record<Page, React.ReactNode> = {
    dashboard: <BarChart size={20} />,
    integrations: <Blocks size={20} />,
    logs: <List size={20} />,
    settings: <Cog size={20} />,
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onHelpClick, onLogout }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-sidebar p-4 flex-shrink-0 flex-col justify-between border-r border-border">
        <div>
          <div className="flex items-center space-x-3 mb-10 px-2 mt-4">
              <LifeBuoy className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-black text-text-primary tracking-tight">Plan Automator</h1>
          </div>
          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-left text-sm font-semibold transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'text-text-secondary hover:bg-card hover:text-text-primary'
                }`}
              >
                {ICONS[item.id]}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-2 mb-4">
          <button
              onClick={onHelpClick}
              className="flex w-full items-center space-x-3 px-4 py-3 rounded-2xl text-left text-sm font-semibold transition-all duration-300 text-text-secondary hover:bg-card hover:text-text-primary"
          >
              <HelpCircle size={20} />
              <span>Documentação</span>
          </button>
          <button
              onClick={onLogout}
              className="flex w-full items-center space-x-3 px-4 py-3 rounded-2xl text-left text-sm font-semibold transition-all duration-300 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
          >
              <LogOut size={20} />
              <span>Sair do App</span>
          </button>
          <div className="text-center text-[10px] text-gray-600 mt-6 uppercase tracking-widest font-bold opacity-50">
              <p>&copy; 2026 Automator Pro</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Agora com botão de Ajuda */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 px-1 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between h-20">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center flex-1 gap-1 transition-all ${
                currentPage === item.id ? 'text-primary scale-110' : 'text-text-secondary'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${currentPage === item.id ? 'bg-primary/10' : ''}`}>
                {ICONS[item.id]}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
          
          {/* Botão de Ajuda Mobile */}
          <button
            onClick={onHelpClick}
            className="flex flex-col items-center justify-center flex-1 gap-1 text-yellow-500/80"
          >
            <div className="p-2">
                <HelpCircle size={20} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Ajuda</span>
          </button>

          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center flex-1 gap-1 text-red-500/50"
          >
            <div className="p-2">
                <LogOut size={20} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Sair</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
