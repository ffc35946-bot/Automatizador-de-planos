
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Modal from './Modal';
import { IntegrationPlatform, type Integration, type SaasConfig, type User } from '../types';
import { INITIAL_INTEGRATIONS, WEBHOOK_URL } from '../constants';
import { Copy, Check, Plus, Trash2, ArrowRightLeft, Play, Loader2, LayoutGrid, HelpCircle, Globe } from 'lucide-react';

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

  useEffect(() => {
    const session = localStorage.getItem('saas_active_session');
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
      
      const savedIntegrationsStr = localStorage.getItem(`integrations_${userData.email}`);
      const savedConfig = localStorage.getItem(`config_${userData.email}`);
      const savedMappings = localStorage.getItem(`mappings_${userData.email}`);

      // Lógica crucial: Sempre usa INITIAL_INTEGRATIONS para garantir que nada suma.
      // Apenas atualiza o status 'connected' a partir do que estiver salvo.
      if (savedIntegrationsStr) {
          const saved: Integration[] = JSON.parse(savedIntegrationsStr);
          const merged = INITIAL_INTEGRATIONS.map(initial => {
              const savedItem = saved.find(s => s.platform === initial.platform);
              return savedItem ? { ...initial, connected: savedItem.connected } : initial;
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
    setIsModalOpen(true);
  };

  const handleToggleConnection = () => {
    if (selectedIntegration) {
      const updated = integrations.map(int => 
        int.platform === selectedIntegration.platform ? { ...int, connected: !int.connected } : int
      );
      setIntegrations(updated);
      saveToStorage('integrations', updated);
      setIsModalOpen(false);
    }
  };

  const handleSaveAll = () => {
    saveToStorage('config', saasConfig);
    saveToStorage('mappings', planMappings);
    alert("Configurações salvas!");
  };

  const runTestIntegration = async () => {
    if (!saasConfig.endpoint) return;
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
        const isSuccess = Math.random() > 0.3;
        setIsTesting(false);
        setTestResult({ success: isSuccess, message: isSuccess ? "Conexão OK!" : "Erro de Endpoint" });
    }, 1200);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black text-white tracking-tight">Canais</h2>
           <p className="text-sm text-text-secondary mt-1 font-medium">Configure onde suas vendas acontecem.</p>
        </div>
        <button 
          onClick={onHelpClick}
          className="bg-yellow-500/10 text-yellow-500 px-5 py-3 rounded-2xl border border-yellow-500/20 font-black uppercase tracking-widest transition-all hover:bg-yellow-500/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <HelpCircle size={20} />
          <span className="text-[11px]">Guia de Ajuda</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <Card title="1. Checkouts Disponíveis" className="bg-card/40">
            <div className="grid grid-cols-1 gap-4">
              {integrations.map((int) => (
                <div key={int.platform} className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-[1.5rem] bg-background/60 border border-white/5 group hover:border-primary/40 transition-all gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-xl shrink-0 overflow-hidden border border-white/20">
                      <img 
                        src={int.logo} 
                        alt={int.platform} 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/2165/2165004.png';
                        }}
                      />
                    </div>
                    <div>
                      <span className="font-black text-white text-base block tracking-tight">{int.platform}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className={`w-2 h-2 rounded-full ${int.connected ? 'bg-secondary' : 'bg-gray-600'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${int.connected ? 'text-secondary' : 'text-gray-500'}`}>
                          {int.connected ? 'Conectado' : 'Desativado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleConnectClick(int)} 
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                      int.connected ? 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20' : 'bg-primary text-white hover:bg-indigo-500 shadow-primary/20'
                    }`}
                  >
                    {int.connected ? 'Ajustes' : 'Configurar'}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="2. Seu Endpoint (SaaS)" className="bg-card/40">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">URL da sua API</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={saasConfig.endpoint} 
                    onChange={(e) => setSaasConfig({...saasConfig, endpoint: e.target.value})} 
                    className="w-full bg-background border border-white/10 rounded-xl px-5 py-4 text-xs text-white focus:ring-2 focus:ring-primary outline-none transition-all pr-12 font-medium" 
                    placeholder="https://seu-saas.com/api/webhooks" 
                  />
                  <Globe className="absolute right-4 top-4 text-gray-600" size={18} />
                </div>
              </div>
              <button 
                onClick={runTestIntegration} 
                disabled={isTesting || !saasConfig.endpoint} 
                className="w-full flex items-center justify-center gap-3 bg-sidebar border border-border/50 rounded-xl py-4 text-[11px] font-black text-white hover:bg-card transition-all uppercase tracking-widest shadow-inner active:scale-[0.98]"
              >
                {isTesting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} className="text-primary" />}
                Testar Conexão
              </button>
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
                <p className="text-[10px] mt-2 normal-case">Converta IDs de checkout em nomes de planos internos.</p>
              </div>
            ) : (
              planMappings.map((m) => (
                <div key={m.id} className="flex flex-col sm:flex-row items-center gap-3 bg-background/50 p-4 rounded-2xl border border-white/5 group relative">
                  <div className="w-full sm:flex-1 space-y-1">
                    <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest ml-1">ID Checkout</span>
                    <input type="text" value={m.checkoutId} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, checkoutId: e.target.value} : x))} className="w-full bg-background border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-700 focus:border-primary/40 outline-none transition-all" placeholder="Ex: prod_99" />
                  </div>
                  <div className="hidden sm:block mt-5">
                    <ArrowRightLeft size={16} className="text-primary/40" />
                  </div>
                  <div className="w-full sm:flex-1 space-y-1">
                    <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest ml-1">Nome no SaaS</span>
                    <input type="text" value={m.saasPlan} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, saasPlan: e.target.value} : x))} className="w-full bg-background border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-700 focus:border-primary/40 outline-none transition-all" placeholder="Ex: Plano VIP" />
                  </div>
                  <button onClick={() => setPlanMappings(planMappings.filter(x => x.id !== m.id))} className="absolute -top-2 -right-2 sm:static bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all p-2 rounded-lg border border-red-500/20"><Trash2 size={16} /></button>
                </div>
              ))
            )}
            <button onClick={() => setPlanMappings([...planMappings, {id: Date.now(), checkoutId: '', saasPlan: ''}])} className="w-full py-5 border-2 border-dashed border-white/5 rounded-[1.5rem] text-text-secondary hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-3 group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-widest">Adicionar Nova Regra</span>
            </button>
          </div>
          <button onClick={handleSaveAll} className="w-full bg-primary hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 transition-all uppercase tracking-[0.2em] text-xs active:scale-[0.98]">
            Salvar Configurações
          </button>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Conectar ${selectedIntegration?.platform}`}>
        <div className="space-y-6">
          <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-3">
            <h4 className="text-xs font-black text-primary uppercase tracking-widest">Instruções</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Copie a URL abaixo e cole no campo <strong>URL de Webhook</strong> da sua conta {selectedIntegration?.platform}. Ative o evento de "Compra Aprovada".
            </p>
          </div>
          
          <div className="space-y-2">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Seu Link Exclusivo</span>
            <div className="flex items-center gap-3 bg-background p-5 rounded-2xl border border-white/10 shadow-inner">
              <code className="flex-1 text-[11px] font-mono text-primary truncate">{WEBHOOK_URL}</code>
              <button onClick={handleCopy} className="p-3 bg-white/5 hover:bg-primary/10 rounded-xl transition-all shrink-0 border border-white/5">
                {copied ? <Check size={18} className="text-secondary" /> : <Copy size={18} className="text-gray-400" />}
              </button>
            </div>
          </div>

          <button 
            onClick={handleToggleConnection} 
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl ${
              selectedIntegration?.connected ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-primary text-white hover:bg-indigo-500'
            }`}
          >
            {selectedIntegration?.connected ? 'Desativar Este Canal' : 'Ativar Agora'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;
