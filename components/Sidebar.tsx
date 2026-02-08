
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
    <aside className="w-64 bg-sidebar p-4 flex-shrink-0 flex flex-col justify-between border-r border-border">
      <div>
        <div className="flex items-center space-x-3 mb-10 px-2">
            <LifeBuoy className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-text-primary">Plan Automator</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:bg-card hover:text-text-primary'
              }`}
            >
              {ICONS[item.id]}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-2">
        <button
            onClick={onHelpClick}
            className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-200 text-text-secondary hover:bg-card hover:text-text-primary"
        >
            <HelpCircle size={20} />
            <span>Ajuda</span>
        </button>
        <button
            onClick={onLogout}
            className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-500"
        >
            <LogOut size={20} />
            <span>Sair</span>
        </button>
        <div className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-tighter opacity-50">
            <p>&copy; 2026 Automatizador SaaS</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
