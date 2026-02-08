
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Modal from './Modal';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { IntegrationPlatform, type Integration, type SaasConfig, type User } from '../types';
import { INITIAL_INTEGRATIONS, WEBHOOK_URL } from '../constants';
import { Copy, Check, Plus, Trash2, AlertCircle, ArrowRightLeft, Link2, ExternalLink, Zap, Play, Loader2, LayoutGrid, HelpCircle } from 'lucide-react';

interface IntegrationsProps {
  onHelpClick?: () => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ onHelpClick }) => {
  const [user, setUser] = useState<User | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [saasConfig, setSaasConfig] = useState<SaasConfig>({ endpoint: '', apiKey: '' });
  const [planMappings, setPlanMappings] = useState<{id: number, checkoutId: string, saasPlan: string}[]>([]);
  
  const [urlError, setUrlError] = useState<string | null>(null);
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
    alert("Configurações salvas com sucesso!");
  };

  const runTestIntegration = async () => {
    if (!saasConfig.endpoint) return;
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
        const isSuccess = Math.random() > 0.3;
        setIsTesting(false);
        setTestResult({ success: isSuccess, message: isSuccess ? "Conexão Estabelecida!" : "Falha ao contatar servidor SaaS." });
    }, 1500);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div className="flex-1">
           <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Canais</h2>
           <p className="text-sm text-text-secondary mt-1">Conecte seus checkouts ao seu sistema.</p>
        </div>
        {onHelpClick && (
          <button 
            onClick={onHelpClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 text-yellow-500 rounded-xl border border-yellow-500/20 font-black uppercase tracking-widest text-[10px] md:text-xs transition-all hover:bg-yellow-500/20 active:scale-95 shadow-lg shadow-yellow-500/5"
          >
            <HelpCircle size={18} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">Como Configurar?</span>
            <span className="sm:hidden">Ajuda</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6 md:space-y-8">
          <Card title="1. Plataformas de Venda" className="bg-card/40 border-border/50">
            <div className="grid grid-cols-1 gap-3">
              {integrations.map((int) => (
                <div key={int.platform} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-background/40 border border-white/5 group hover:border-primary/30 transition-all gap-4">
                  <div className="flex items-center gap-4 min-w-0 w-full">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white p-2 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                      <img src={int.logo} alt={int.platform} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-white block text-sm">{int.platform}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${int.connected ? 'text-secondary' : 'text-gray-500'}`}>
                        {int.connected ? 'Conectado' : 'Desativado'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleConnectClick(int)} 
                    className={`w-full sm:w-28 md:w-32 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shrink-0 ${
                      int.connected ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-primary text-white shadow-lg shadow-primary/20'
                    }`}
                  >
                    {int.connected ? 'Ajustar' : 'Conectar'}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="2. Endpoint de Destino" className="bg-card/40 border-border/50">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">URL de Ativação do SaaS</label>
                <div className="relative">
                  <input type="text" value={saasConfig.endpoint} onChange={(e) => setSaasConfig({...saasConfig, endpoint: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="https://api.seusaas.com/activate" />
                  <Link2 className="absolute right-4 top-3.5 text-gray-500" size={18} />
                </div>
              </div>
              <button onClick={runTestIntegration} disabled={isTesting || !saasConfig.endpoint} className="w-full flex items-center justify-center gap-2 bg-sidebar border border-border/50 rounded-xl py-3.5 text-xs font-bold text-white hover:bg-card transition-all uppercase tracking-widest">
                {isTesting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                Disparar Teste
              </button>
              {testResult && (
                <div className={`p-3 rounded-xl text-xs font-bold border animate-slide-down ${testResult.success ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {testResult.message}
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card title="3. Mapeamento de Planos" className="bg-card/40 border-border/50 flex flex-col">
          <div className="flex-grow space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {planMappings.length === 0 ? (
              <div className="py-12 text-center opacity-30">
                <LayoutGrid size={48} className="mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Nenhuma regra ativa</p>
              </div>
            ) : (
              planMappings.map((m) => (
                <div key={m.id} className="flex items-center gap-2 bg-background/30 p-3 rounded-xl border border-white/5 group">
                  <input type="text" value={m.checkoutId} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, checkoutId: e.target.value} : x))} className="flex-1 bg-background border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-gray-600" placeholder="ID no Checkout" />
                  <ArrowRightLeft size={14} className="text-gray-600 shrink-0" />
                  <input type="text" value={m.saasPlan} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, saasPlan: e.target.value} : x))} className="flex-1 bg-background border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-gray-600" placeholder="Nome no SaaS" />
                  <button onClick={() => setPlanMappings(planMappings.filter(x => x.id !== m.id))} className="text-red-500/30 hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                </div>
              ))
            )}
            <button onClick={() => setPlanMappings([...planMappings, {id: Date.now(), checkoutId: '', saasPlan: ''}])} className="w-full py-5 border-2 border-dashed border-white/10 rounded-2xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all flex flex-col items-center justify-center gap-2">
              <Plus size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Nova Regra</span>
            </button>
          </div>
          <button onClick={handleSaveAll} className="w-full mt-6 bg-primary hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-xl transition-all uppercase tracking-widest text-sm">
            Salvar Configuração
          </button>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedIntegration?.platform || 'Integração'}>
        <div className="space-y-6">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs text-white/80 leading-relaxed font-medium">
            Copie a URL abaixo e cole no campo de <strong className="text-primary">URL de Webhook</strong> nas configurações da {selectedIntegration?.platform}.
          </div>
          <div className="flex items-center gap-3 bg-background p-4 rounded-xl border border-white/10 shadow-inner">
            <code className="flex-1 text-[10px] font-mono text-primary truncate tracking-tight">{WEBHOOK_URL}</code>
            <button onClick={handleCopy} className="p-2.5 hover:bg-white/5 rounded-lg transition-all shrink-0">
              {copied ? <Check size={20} className="text-secondary" /> : <Copy size={20} className="text-gray-400" />}
            </button>
          </div>
          <button 
            onClick={handleToggleConnection} 
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
              selectedIntegration?.connected ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-primary text-white shadow-lg'
            }`}
          >
            {selectedIntegration?.connected ? 'Remover Conexão' : 'Ativar Agora'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;
