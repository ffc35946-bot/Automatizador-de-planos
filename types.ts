
export type Page = 'dashboard' | 'integrations' | 'logs' | 'settings';

export enum IntegrationPlatform {
  Kirvano = 'Kirvano',
  Cakto = 'Cakto',
  Kiwify = 'Kiwify',
  Custom = 'Webhook Personalizado'
}

export enum LogStatus {
  Success = 'Sucesso',
  Failed = 'Falha',
  Processing = 'Processando'
}

export interface Integration {
  platform: IntegrationPlatform;
  connected: boolean;
  logo: string;
  dashboardUrl?: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  platform: IntegrationPlatform;
  userEmail: string;
  plan: string;
  status: LogStatus;
  error?: string;
}

export interface SaasConfig {
    endpoint: string;
    apiKey: string;
}
