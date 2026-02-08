
import type { Page, Integration, LogEntry } from './types';
import { IntegrationPlatform, LogStatus } from './types';

export const WEBHOOK_URL = 'https://api.plan-automator.com/v1/webhook/a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6';

export const NAV_ITEMS: { id: Page; label: string; }[] = [
  { id: 'dashboard', label: 'Painel' },
  { id: 'integrations', label: 'Conexões' },
  { id: 'logs', label: 'Registros' },
  { id: 'settings', label: 'Perfil' },
];

export const INITIAL_INTEGRATIONS: Integration[] = [
    { 
      platform: IntegrationPlatform.Kirvano, 
      connected: false, 
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvIm9qIAIt6fZg-_JxglhK2D2mK2hfczDq6w&s',
      dashboardUrl: 'https://app.kirvano.com/'
    },
    { 
      platform: IntegrationPlatform.Cakto, 
      connected: false, 
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiNlBzvtT8-pKAV47unulv2hiy3XLsUjvzuA&s',
      dashboardUrl: 'https://cakto.com.br/'
    },
    { 
      platform: IntegrationPlatform.Kiwify, 
      connected: false, 
      logo: 'https://img.utdstc.com/icon/46e/545/46e5453d5e2196628fd94c2100f7d559caaa8a498438a1d002cc91cefe62317b:200',
      dashboardUrl: 'https://dashboard.kiwify.com.br/'
    },
    { 
      platform: IntegrationPlatform.Custom, 
      connected: false, 
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMu81VSrcmKaAkXeeREL0jsICRlyXRveHf3Q&s' 
    },
];

// Banco de dados de logs inicializado como vazio
export const MOCK_LOGS: LogEntry[] = [];
