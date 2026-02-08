
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Modal from './Modal';
import { IntegrationPlatform, type Integration, type SaasConfig, type User } from '../types';
import { INITIAL_INTEGRATIONS, WEBHOOK_URL } from '../constants';
import { Copy, Check, Plus, Trash2, ArrowRightLeft, Link2, Play, Loader2, LayoutGrid, HelpCircle, Globe } from 'lucide-react';

interface IntegrationsProps {
  onHelpClick?: () => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ onHelpClick }) => {
  const [user, setUser] = useState<User | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
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
      
      const savedIntegrations = localStorage.getItem(`integrations_${userData.email}`);
      const savedConfig = localStorage.getItem(`config_${userData.email}`);
      const savedMappings = localStorage.getItem(`mappings_${userData.email}`);

      // Garante que se não houver integrações salvas, use as iniciais (com logos)
      setIntegrations(savedIntegrations ? JSON.parse(savedIntegrations) : INITIAL_INTEGRATIONS);
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
      <div className="flex items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black text-white tracking-tight">Canais</h2>
           <p className="text-sm text-text-secondary mt-1 font-medium">Conecte seus checkouts ao seu sistema.</p>
        </div>
        <button 
          onClick={onHelpClick}
          className="bg-yellow-500/10 text-yellow-500 p-3 md:px-5 md:py-3 rounded-2xl border border-yellow-500/20 font-black uppercase tracking-widest transition-all hover:bg-yellow-500/20 active:scale-95 flex items-center gap-2"
        >
          <HelpCircle size={20} />
          <span className="hidden md:inline text-[11px]">Ajuda</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <Card title="1. Checkouts Disponíveis" className="bg-card/40">
            <div className="grid grid-cols-1 gap-3">
              {integrations.map((int) => (
                <div key={int.platform} className="flex items-center justify-between p-4 rounded-2xl bg-background/60 border border-white/5 group hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-4">
                    {/* Container da Logo - Branco para contraste */}
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner shrink-0 overflow-hidden border border-white/20">
                      <img 
                        src={int.logo} 
                        alt={int.platform} 
                        className="max-h-full max-w-full object-contain filter"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/2165/2165004.png';
                        }}
                      />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">{int.platform}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${int.connected ? 'bg-secondary' : 'bg-gray-600'}`}></div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${int.connected ? 'text-secondary' : 'text-gray-500'}`}>
                          {int.connected ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleConnectClick(int)} 
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      int.connected ? 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-indigo-500'
                    }`}
                  >
                    {int.connected ? 'Gerenciar' : 'Conectar'}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="2. Seu Endpoint (SaaS)" className="bg-card/40">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">URL de Ativação</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={saasConfig.endpoint} 
                    onChange={(e) => setSaasConfig({...saasConfig, endpoint: e.target.value})} 
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:ring-2 focus:ring-primary outline-none transition-all pr-12" 
                    placeholder="https://seu-saas.com/api/activate" 
                  />
                  <Globe className="absolute right-4 top-3.5 text-gray-500" size={18} />
                </div>
              </div>
              <button 
                onClick={runTestIntegration} 
                disabled={isTesting || !saasConfig.endpoint} 
                className="w-full flex items-center justify-center gap-2 bg-sidebar border border-border/50 rounded-xl py-3.5 text-[11px] font-black text-white hover:bg-card transition-all uppercase tracking-widest"
              >
                {isTesting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                Testar Endpoint
              </button>
              {testResult && (
                <div className={`p-4 rounded-xl text-[10px] font-black border uppercase tracking-widest animate-slide-down ${testResult.success ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {testResult.message}
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card title="3. Regras de Conversão" className="bg-card/40 h-full flex flex-col">
          <div className="flex-grow space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar mb-6">
            {planMappings.length === 0 ? (
              <div className="py-12 text-center opacity-20">
                <LayoutGrid size={40} className="mx-auto mb-3" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sem regras</p>
              </div>
            ) : (
              planMappings.map((m) => (
                <div key={m.id} className="flex items-center gap-2 bg-background/50 p-3 rounded-xl border border-white/5">
                  <input type="text" value={m.checkoutId} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, checkoutId: e.target.value} : x))} className="flex-1 bg-background border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-700" placeholder="ID Checkout" />
                  <ArrowRightLeft size={12} className="text-gray-600" />
                  <input type="text" value={m.saasPlan} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, saasPlan: e.target.value} : x))} className="flex-1 bg-background border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-700" placeholder="Plano SaaS" />
                  <button onClick={() => setPlanMappings(planMappings.filter(x => x.id !== m.id))} className="text-red-500/40 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                </div>
              ))
            )}
            <button onClick={() => setPlanMappings([...planMappings, {id: Date.now(), checkoutId: '', saasPlan: ''}])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2">
              <Plus size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Nova Regra</span>
            </button>
          </div>
          <button onClick={handleSaveAll} className="w-full bg-primary hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-xl transition-all uppercase tracking-widest text-xs">
            Salvar Tudo
          </button>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedIntegration?.platform || 'Plataforma'}>
        <div className="space-y-6">
          <p className="text-xs text-text-secondary leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
            Copie a URL abaixo e cole no campo <strong>URL de Webhook</strong> da sua conta {selectedIntegration?.platform}.
          </p>
          <div className="flex items-center gap-3 bg-background p-4 rounded-2xl border border-white/10">
            <code className="flex-1 text-[10px] font-mono text-primary truncate">{WEBHOOK_URL}</code>
            <button onClick={handleCopy} className="p-2 hover:bg-white/5 rounded-lg transition-all shrink-0">
              {copied ? <Check size={18} className="text-secondary" /> : <Copy size={18} className="text-gray-400" />}
            </button>
          </div>
          <button 
            onClick={handleToggleConnection} 
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
              selectedIntegration?.connected ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-primary text-white'
            }`}
          >
            {selectedIntegration?.connected ? 'Desativar Canal' : 'Ativar Agora'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;
