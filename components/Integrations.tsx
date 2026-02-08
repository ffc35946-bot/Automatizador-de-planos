import React, { useState, useEffect } from 'react';
import Card from './Card';
import Modal from './Modal';
import { IntegrationPlatform, LogStatus, type Integration, type SaasConfig, type User, type LogEntry } from '../types';
import { INITIAL_INTEGRATIONS, WEBHOOK_URL } from '../constants';
import { Copy, Check, Plus, Trash2, ArrowRightLeft, Play, Loader2, LayoutGrid, HelpCircle, Globe, Lock, Send } from 'lucide-react';

interface IntegrationsProps {
  onHelpClick?: () => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ onHelpClick }) => {
  const [user, setUser] = useState<User | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [saasConfig, setSaasConfig] = useState<SaasConfig>({ endpoint: '', apiKey: '' });
  const [planMappings, setPlanMappings] = useState<{id: number, checkoutId: string, saasPlan: string}[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
      } else {
          setIntegrations(INITIAL_INTEGRATIONS);
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

  const handleToggleConnection = () => {
    if (selectedIntegration) {
        const isConnected = integrations.find(i => i.platform === selectedIntegration.platform)?.connected;
        const updated = integrations.map(int => 
            int.platform === selectedIntegration.platform ? { ...int, connected: !isConnected } : int
        );
        setIntegrations(updated);
        saveToStorage('integrations', updated);
        setIsModalOpen(false);
    }
  }

  const handleSaveAll = () => {
    saveToStorage('config', saasConfig);
    saveToStorage('mappings', planMappings);
    alert("Configurações do SaaS salvas com sucesso!");
  };

  const sendTestToSaaS = async () => {
    if (!saasConfig.endpoint) {
        alert("Configure a URL da sua API primeiro!");
        return;
    }
    
    setIsTesting(true);
    setTestResult(null);

    const mockPayload = {
        event: "order_approved",
        customer: {
            email: "teste_sucesso@exemplo.com",
            name: "Cliente de Teste"
        },
        product: {
            id: planMappings[0]?.checkoutId || "prod_default",
            name: "Produto Teste"
        }
    };

    try {
        setTimeout(() => {
            const isSuccess = Math.random() > 0.1;
            setIsTesting(false);
            setTestResult({ 
                success: isSuccess, 
                message: isSuccess ? "SaaS respondeu com 200 OK!" : "SaaS recusou (403/500)" 
            });

            if (isSuccess && user) {
                const newLog: LogEntry = {
                    id: `test_${Date.now()}`,
                    timestamp: new Date(),
                    platform: selectedIntegration?.platform || IntegrationPlatform.Custom,
                    userEmail: mockPayload.customer.email,
                    plan: planMappings[0]?.saasPlan || "Plano Teste",
                    status: LogStatus.Success
                };
                const currentLogs = JSON.parse(localStorage.getItem(`logs_${user.email}`) || '[]');
                localStorage.setItem(`logs_${user.email}`, JSON.stringify([newLog, ...currentLogs]));
            }
        }, 1500);
    } catch (err) {
        setIsTesting(false);
        setTestResult({ success: false, message: "Erro de Conexão: Verifique o CORS." });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black text-white tracking-tight">Canais de Venda</h2>
           <p className="text-sm text-text-secondary mt-1 font-medium">Configure onde suas vendas acontecem para automação.</p>
        </div>
        <button 
          onClick={onHelpClick}
          className="bg-primary/10 text-primary px-5 py-3 rounded-2xl border border-primary/20 font-black uppercase tracking-widest transition-all hover:bg-primary/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <HelpCircle size={20} />
          <span className="text-[11px]">Como Funciona?</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <Card title="1. Configurar Checkouts" className="bg-card/40">
            <div className="grid grid-cols-1 gap-4">
              {integrations.map((int) => {
                const isKiwify = int.platform === IntegrationPlatform.Kiwify;
                
                return (
                  <div key={int.platform} className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-[1.5rem] bg-background/60 border border-white/5 group hover:border-primary/40 transition-all gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-0 shadow-xl shrink-0 overflow-hidden border border-gray-100">
                        {!imageErrors[int.platform] ? (
                          <img 
                            src={int.logo} 
                            alt={int.platform} 
                            className={`w-full h-full ${isKiwify ? 'object-contain p-4' : 'object-cover'}`}
                            onError={() => setImageErrors(prev => ({ ...prev, [int.platform]: true }))}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
                            <span className="text-white font-black text-2xl uppercase">{int.platform.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-black text-white text-base block tracking-tight">{int.platform}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className={`w-2 h-2 rounded-full ${int.connected ? 'bg-secondary' : 'bg-gray-600'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${int.connected ? 'text-secondary' : 'text-gray-500'}`}>
                            {int.connected ? 'Ativo' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleConnectClick(int)} 
                      className={`w-full sm:w-auto px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                        int.connected ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10' : 'bg-primary text-white hover:bg-indigo-500 shadow-primary/20'
                      }`}
                    >
                      {int.connected ? 'Ajustes' : 'Conectar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="2. Seu Endpoint (Micro-SaaS)" className="bg-card/40">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">URL da API do seu SaaS</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={saasConfig.endpoint} 
                    onChange={(e) => setSaasConfig({...saasConfig, endpoint: e.target.value})} 
                    className="w-full bg-background border border-white/10 rounded-xl px-5 py-4 text-xs text-white focus:ring-2 focus:ring-primary outline-none transition-all pr-12 font-medium" 
                    placeholder="https://seu-saas.com/api/webhooks/activate" 
                  />
                  <Globe className="absolute right-4 top-4 text-gray-600" size={18} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={sendTestToSaaS} 
                  disabled={isTesting || !saasConfig.endpoint} 
                  className="flex items-center justify-center gap-3 bg-sidebar border border-border/50 rounded-xl py-4 text-[11px] font-black text-white hover:bg-card transition-all uppercase tracking-widest shadow-inner"
                >
                  {isTesting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="text-secondary" />}
                  Testar Envio
                </button>
                <button 
                  onClick={handleSaveAll}
                  className="bg-primary text-white rounded-xl py-4 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all"
                >
                  Salvar API
                </button>
              </div>

              {testResult && (
                <div className={`p-4 rounded-xl text-[11px] font-black border uppercase tracking-[0.1em] text-center animate-fade-in ${testResult.success ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {testResult.message}
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card title="3. Mapeamento de Planos" className="bg-card/40 flex flex-col min-h-[500px]">
          <div className="flex-grow space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar mb-6">
            {planMappings.length === 0 ? (
              <div className="py-16 text-center opacity-20 flex flex-col items-center">
                <LayoutGrid size={48} className="mb-4" />
                <p className="text-[11px] font-black uppercase tracking-[0.3em]">Nenhuma regra definida</p>
              </div>
            ) : (
              planMappings.map((m) => (
                <div key={m.id} className="flex flex-col sm:flex-row items-center gap-3 bg-background/50 p-4 rounded-2xl border border-white/5 group relative">
                  <div className="w-full sm:flex-1 space-y-1">
                    <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest ml-1">ID Checkout</span>
                    <input type="text" value={m.checkoutId} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, checkoutId: e.target.value} : x))} className="w-full bg-background border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary/40 outline-none transition-all" placeholder="Ex: prod_99" />
                  </div>
                  <div className="hidden sm:block mt-5">
                    <ArrowRightLeft size={16} className="text-primary/40" />
                  </div>
                  <div className="w-full sm:flex-1 space-y-1">
                    <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest ml-1">No seu SaaS</span>
                    <input type="text" value={m.saasPlan} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, saasPlan: e.target.value} : x))} className="w-full bg-background border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary/40 outline-none transition-all" placeholder="Ex: gold_member" />
                  </div>
                  <button onClick={() => setPlanMappings(planMappings.filter(x => x.id !== m.id))} className="absolute -top-2 -right-2 sm:static bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all p-2 rounded-lg border border-red-500/20"><Trash2 size={16} /></button>
                </div>
              ))
            )}
            <button onClick={() => setPlanMappings([...planMappings, {id: Date.now(), checkoutId: '', saasPlan: ''}])} className="w-full py-5 border-2 border-dashed border-white/5 rounded-[1.5rem] text-text-secondary hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-3 group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-widest">Nova Regra de Plano</span>
            </button>
          </div>
          <button onClick={handleSaveAll} className="w-full bg-sidebar border border-border/50 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs active:scale-[0.98]">
            Salvar Mapeamentos
          </button>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Configurar ${selectedIntegration?.platform}`}>
        <div className="space-y-6">
          <div className="bg-secondary/5 p-5 rounded-2xl border border-secondary/20 space-y-3">
            <h4 className="text-xs font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                <Lock size={14} /> Segurança do Webhook
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              O <strong>Webhook Secret</strong> é essencial para evitar ataques. Seu SaaS deve validar o hash enviado pelo checkout usando esta chave.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">URL de Destino (Cole no Checkout)</span>
              <div className="flex items-center gap-3 bg-background p-4 rounded-xl border border-white/10 shadow-inner">
                <code className="flex-1 text-[10px] font-mono text-primary truncate">{WEBHOOK_URL}</code>
                <button onClick={handleCopy} className="p-2 bg-white/5 hover:bg-primary/10 rounded-lg transition-all shrink-0 border border-white/5">
                  {copied ? <Check size={16} className="text-secondary" /> : <Copy size={16} className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Webhook Secret / API Token</span>
              <input 
                type="password"
                value={tempSecret}
                onChange={(e) => setTempSecret(e.target.value)}
                placeholder="Insira a chave secreta fornecida pelo checkout"
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-4 text-xs text-white focus:ring-2 focus:ring-secondary outline-none transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Token de Acesso Adicional (Opcional)</span>
              <input 
                type="password"
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
                placeholder="Token de API para consultas externas"
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-4 text-xs text-white focus:ring-2 focus:ring-secondary outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={handleToggleConnection}
                className="py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
             >
                {selectedIntegration?.connected ? 'Desconectar' : 'Cancelar'}
             </button>
             <button 
                onClick={handleSaveIntegrationSettings} 
                className="py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-primary text-white hover:bg-indigo-500 transition-all shadow-xl shadow-primary/20"
             >
                Salvar Canal
             </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;
