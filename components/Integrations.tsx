
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Modal from './Modal';
import { IntegrationPlatform, LogStatus, SubscriptionStatus, type Integration, type SaasConfig, type User, type LogEntry } from '../types';
import { INITIAL_INTEGRATIONS, WEBHOOK_URL } from '../constants';
import { Copy, Check, Plus, Trash2, ArrowRightLeft, Play, Loader2, LayoutGrid, HelpCircle, Globe, Lock, Send, RefreshCw, XOctagon, User as UserIcon, Sparkles } from 'lucide-react';

interface IntegrationsProps {
  onHelpClick?: () => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ onHelpClick }) => {
  const [user, setUser] = useState<User | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [saasConfig, setSaasConfig] = useState<SaasConfig>({ endpoint: '', apiKey: '' });
  const [planMappings, setPlanMappings] = useState<{id: number, checkoutId: string, saasPlan: string, isRecurring: boolean}[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const [testEmail, setTestEmail] = useState('cliente@exemplo.com');
  const [tempSecret, setTempSecret] = useState('');
  const [tempToken, setTempToken] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('saas_active_session');
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
      
      const savedIntegrationsStr = localStorage.getItem(`integrations_${userData.email}`);
      const savedConfig = localStorage.getItem(`config_${userData.email}`);
      const savedMappings = localStorage.getItem(`mappings_${userData.email}`);

      if (savedIntegrationsStr) {
          const saved: Integration[] = JSON.parse(savedIntegrationsStr);
          const merged = INITIAL_INTEGRATIONS.map(initial => {
              const savedItem = saved.find(s => s.platform === initial.platform);
              return { 
                  ...initial, 
                  connected: savedItem ? savedItem.connected : false,
                  webhookSecret: savedItem?.webhookSecret || '',
                  apiToken: savedItem?.apiToken || ''
              };
          });
          setIntegrations(merged);
      }

      setSaasConfig(savedConfig ? JSON.parse(savedConfig) : { endpoint: '', apiKey: '' });
      setPlanMappings(savedMappings ? JSON.parse(savedMappings) : []);
    }
  }, []);

  const saveToStorage = (type: 'integrations' | 'config' | 'mappings', data: any) => {
    if (!user) return;
    localStorage.setItem(`${type}_${user.email}`, JSON.stringify(data));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(WEBHOOK_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectClick = (integration: Integration) => {
    setSelectedIntegration(integration);
    setTempSecret(integration.webhookSecret || '');
    setTempToken(integration.apiToken || '');
    setIsModalOpen(true);
  };

  const handleSaveIntegrationSettings = () => {
    if (selectedIntegration) {
      const updated = integrations.map(int => 
        int.platform === selectedIntegration.platform 
          ? { ...int, connected: true, webhookSecret: tempSecret, apiToken: tempToken } 
          : int
      );
      setIntegrations(updated);
      saveToStorage('integrations', updated);
      setIsModalOpen(false);
    }
  };

  const handleSaveAll = () => {
    saveToStorage('config', saasConfig);
    saveToStorage('mappings', planMappings);
    alert("Configurações atualizadas!");
  };

  const simulateWebhookEvent = async (eventType: 'approved' | 'canceled' | 'expired') => {
    if (!saasConfig.endpoint) {
        alert("Configure seu Endpoint primeiro!");
        return;
    }
    
    setIsTesting(true);
    setTestResult(null);

    const mapping = planMappings[0] || { checkoutId: 'prod_default', saasPlan: 'VIP', isRecurring: true };

    const mockPayload = {
        event: eventType === 'approved' ? 'order_approved' : eventType === 'canceled' ? 'subscription_canceled' : 'subscription_expired',
        customer: { email: testEmail, name: "Usuário Teste" },
        product: { id: mapping.checkoutId, name: mapping.saasPlan },
        subscription: mapping.isRecurring ? {
            status: eventType === 'approved' ? 'active' : eventType,
            renews_at: eventType === 'approved' ? new Date(Date.now() + 30 * 86400000).toISOString() : null
        } : null
    };

    try {
        if (saasConfig.endpoint.startsWith('http')) {
            await fetch(saasConfig.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockPayload)
            });
        }
        
        setTimeout(() => {
            setIsTesting(false);
            setTestResult({ 
                success: true, 
                message: `Evento de ${eventType} processado!` 
            });

            if (user) {
                const newLog: LogEntry = {
                    id: `evt_${Date.now()}`,
                    timestamp: new Date(),
                    platform: selectedIntegration?.platform || IntegrationPlatform.Custom,
                    userEmail: testEmail,
                    plan: mapping.saasPlan,
                    status: LogStatus.Success,
                    subStatus: eventType === 'approved' ? SubscriptionStatus.Active : 
                               eventType === 'canceled' ? SubscriptionStatus.Canceled : SubscriptionStatus.Expired,
                    expiryDate: eventType === 'approved' ? new Date(Date.now() + 30 * 86400000) : undefined
                };
                
                if (eventType === 'expired') {
                    newLog.expiryDate = new Date(Date.now() - 3600000);
                }

                const currentLogs = JSON.parse(localStorage.getItem(`logs_${user.email}`) || '[]');
                localStorage.setItem(`logs_${user.email}`, JSON.stringify([newLog, ...currentLogs]));
            }
        }, 800);
    } catch (e) {
        setIsTesting(false);
        setTestResult({ success: false, message: "Erro ao conectar com seu SaaS." });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
           <h2 className="text-3xl font-black text-white tracking-tight">Gestão de Canais</h2>
           <p className="text-sm text-text-secondary mt-1 font-medium">Controle ativações e recorrências automaticamente.</p>
        </div>
        <button 
          onClick={onHelpClick} 
          className="relative group overflow-hidden bg-sidebar border border-white/5 px-8 py-3.5 rounded-2xl transition-all hover:border-primary/50 active:scale-95 flex items-center justify-center gap-3 shadow-2xl shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <HelpCircle size={18} className="text-primary group-hover:animate-bounce" />
          <span className="text-[11px] font-black uppercase tracking-widest text-white">Ajuda</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <Card title="1. Canais Ativos" className="bg-card/40">
            <div className="grid grid-cols-1 gap-4">
              {integrations.map((int) => (
                <div key={int.platform} className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-[1.5rem] bg-background/60 border border-white/5 group hover:border-primary/40 transition-all gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-0 shadow-xl overflow-hidden border border-gray-100">
                      <img 
                        src={int.logo} 
                        alt={int.platform} 
                        className={`w-full h-full ${int.platform === IntegrationPlatform.Kiwify ? 'object-contain p-4' : 'object-cover'}`}
                        onError={() => setImageErrors(prev => ({ ...prev, [int.platform]: true }))}
                      />
                    </div>
                    <div>
                      <span className="font-black text-white text-base block tracking-tight">{int.platform}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${int.connected ? 'text-secondary' : 'text-gray-500'}`}>
                        {int.connected ? 'Operacional' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleConnectClick(int)} className={`w-full sm:w-auto px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg ${int.connected ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-primary text-white'}`}>
                    {int.connected ? 'Ajustes' : 'Conectar'}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="2. Simulador de Ciclo de Vida" className="bg-card/40">
            <div className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block ml-1">Usuário para Teste</label>
                  <div className="relative">
                    <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="w-full bg-background border border-white/10 rounded-xl px-5 py-4 text-xs text-white outline-none pr-12 font-medium" placeholder="cliente@exemplo.com" />
                    <UserIcon className="absolute right-4 top-4 text-gray-600" size={18} />
                  </div>
                </div>

                <div className="relative">
                   <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block ml-1">URL da API do seu SaaS</label>
                   <div className="relative">
                    <input type="text" value={saasConfig.endpoint} onChange={(e) => setSaasConfig({...saasConfig, endpoint: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-5 py-4 text-xs text-white outline-none pr-12 font-medium" placeholder="https://seu-saas.com/api/webhook" />
                    <Globe className="absolute right-4 top-4 text-gray-600" size={18} />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => simulateWebhookEvent('approved')} disabled={isTesting} className="flex flex-col items-center justify-center gap-2 bg-secondary/10 border border-secondary/20 rounded-xl py-4 text-[9px] font-black text-secondary hover:bg-secondary/20 transition-all uppercase tracking-tighter">
                  <Check size={16} /> Aprovar
                </button>
                <button onClick={() => simulateWebhookEvent('canceled')} disabled={isTesting} className="flex flex-col items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl py-4 text-[9px] font-black text-yellow-500 hover:bg-yellow-500/20 transition-all uppercase tracking-tighter">
                  <RefreshCw size={16} /> Cancelar
                </button>
                <button onClick={() => simulateWebhookEvent('expired')} disabled={isTesting} className="flex flex-col items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl py-4 text-[9px] font-black text-red-500 hover:bg-red-500/20 transition-all uppercase tracking-tighter">
                  <XOctagon size={16} /> Expirar
                </button>
              </div>

              {testResult && (
                <div className={`p-4 rounded-xl text-[11px] font-black border uppercase text-center animate-fade-in ${testResult.success ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {testResult.message}
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card title="3. Regras de Produto" className="bg-card/40 flex flex-col min-h-[500px]">
          <div className="flex-grow space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar mb-6">
            {planMappings.length === 0 ? (
                <div className="py-16 text-center opacity-20 flex flex-col items-center"><LayoutGrid size={48} className="mb-4" /><p className="text-[11px] font-black uppercase tracking-[0.3em]">Crie sua primeira regra</p></div>
            ) : (
              planMappings.map((m) => (
                <div key={m.id} className="bg-background/50 p-5 rounded-2xl border border-white/5 space-y-4 relative group">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-600 ml-1">ID Checkout</span>
                        <input type="text" value={m.checkoutId} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, checkoutId: e.target.value} : x))} className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none" placeholder="prod_abc" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-600 ml-1">ID no SaaS</span>
                        <input type="text" value={m.saasPlan} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, saasPlan: e.target.value} : x))} className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none" placeholder="gold_v1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Assinatura Mensal?</span>
                      <button 
                        onClick={() => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, isRecurring: !x.isRecurring} : x))}
                        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${m.isRecurring ? 'bg-secondary/20 text-secondary' : 'bg-gray-700 text-gray-400'}`}
                      >
                        {m.isRecurring ? 'Sim (Auto-Stop)' : 'Não (Vitalício)'}
                      </button>
                  </div>
                  <button onClick={() => setPlanMappings(planMappings.filter(x => x.id !== m.id))} className="absolute top-2 right-2 text-red-500/40 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))
            )}
            <button onClick={() => setPlanMappings([...planMappings, {id: Date.now(), checkoutId: '', saasPlan: '', isRecurring: true}])} className="w-full py-5 border-2 border-dashed border-white/5 rounded-[1.5rem] text-text-secondary hover:text-primary transition-all flex items-center justify-center gap-3">
              <Plus size={20} /> <span className="text-[11px] font-black uppercase">Adicionar Regra</span>
            </button>
          </div>
          <button onClick={handleSaveAll} className="w-full bg-primary text-white font-black py-5 rounded-2xl transition-all uppercase text-xs">Salvar Configurações</button>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Segurança ${selectedIntegration?.platform}`}>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">URL de Destino</span>
              <div className="flex items-center gap-3 bg-background p-4 rounded-xl border border-white/10">
                <code className="flex-1 text-[10px] font-mono text-primary truncate">{WEBHOOK_URL}</code>
                <button onClick={handleCopy} className="p-2 bg-white/5 rounded-lg">{copied ? <Check size={16} className="text-secondary" /> : <Copy size={16} />}</button>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Webhook Secret</span>
              <input type="password" value={tempSecret} onChange={(e) => setTempSecret(e.target.value)} placeholder="Chave secreta do checkout" className="w-full bg-background border border-white/10 rounded-xl px-4 py-4 text-xs text-white outline-none font-mono" />
            </div>
          </div>
          <button onClick={handleSaveIntegrationSettings} className="w-full py-5 rounded-2xl font-black uppercase text-[11px] bg-primary text-white hover:bg-indigo-500 transition-all">Salvar Canal</button>
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;
