
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Modal from './Modal';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { IntegrationPlatform, type Integration, type SaasConfig, type User } from '../types';
import { INITIAL_INTEGRATIONS, WEBHOOK_URL } from '../constants';
import { Copy, Check, Plus, Trash2, AlertCircle, ArrowRightLeft, Link2, ExternalLink, Zap, Play, Loader2, LayoutGrid } from 'lucide-react';

const Integrations: React.FC = () => {
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
      
      // Carregar dados específicos do usuário ou usar padrões se for novo
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

  const validateUrl = (url: string) => {
    if (!url) return null;
    try { new URL(url); return null; } catch { return "Insira uma URL válida."; }
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
    alert("Todas as configurações foram salvas!");
  };

  const runTestIntegration = async () => {
    if (!saasConfig.endpoint) return;
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
        const isSuccess = Math.random() > 0.3;
        setIsTesting(false);
        setTestResult({ success: isSuccess, message: isSuccess ? "Conexão OK!" : "Erro na API do seu SaaS." });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-4xl font-black text-white tracking-tight">Conexões</h2>
           <p className="text-text-secondary mt-1">Configure como o dinheiro vira acesso.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card title="1. Canais de Venda" className="bg-card/40 border-border/50">
            <div className="grid grid-cols-1 gap-3">
              {integrations.map((int) => (
                <div key={int.platform} className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-white/5 group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white p-2 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                      <img src={int.logo} alt={int.platform} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">{int.platform}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${int.connected ? 'text-secondary' : 'text-gray-500'}`}>
                        {int.connected ? 'Ativo' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleConnectClick(int)} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${int.connected ? 'bg-secondary/10 text-secondary' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                    {int.connected ? 'Configurar' : 'Conectar'}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="2. Seu Endpoint" className="bg-card/40 border-border/50">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">URL de Ativação</label>
                <div className="relative">
                  <input type="text" value={saasConfig.endpoint} onChange={(e) => setSaasConfig({...saasConfig, endpoint: e.target.value})} className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="https://..." />
                  <Link2 className="absolute right-4 top-3.5 text-gray-500" size={18} />
                </div>
              </div>
              <button onClick={runTestIntegration} disabled={isTesting || !saasConfig.endpoint} className="w-full flex items-center justify-center gap-2 bg-sidebar border border-border/50 rounded-xl py-3 text-sm font-bold text-white hover:bg-card transition-all">
                {isTesting ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                Testar Conexão
              </button>
              {testResult && (
                <div className={`p-3 rounded-xl text-xs font-bold border ${testResult.success ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {testResult.message}
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card title="3. Mapeamento de Planos" className="bg-card/40 border-border/50 flex flex-col">
          <div className="flex-grow space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {planMappings.length === 0 ? (
              <div className="py-10 text-center opacity-40">
                <LayoutGrid size={40} className="mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest">Nenhuma regra definida</p>
              </div>
            ) : (
              planMappings.map((m) => (
                <div key={m.id} className="flex items-center gap-2 bg-background/30 p-3 rounded-xl border border-white/5">
                  <input type="text" value={m.checkoutId} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, checkoutId: e.target.value} : x))} className="flex-1 bg-background border border-white/5 rounded-lg px-3 py-2 text-xs text-white" placeholder="Checkout ID" />
                  <ArrowRightLeft size={14} className="text-gray-600" />
                  <input type="text" value={m.saasPlan} onChange={(e) => setPlanMappings(planMappings.map(x => x.id === m.id ? {...x, saasPlan: e.target.value} : x))} className="flex-1 bg-background border border-white/5 rounded-lg px-3 py-2 text-xs text-white" placeholder="Plano SaaS" />
                  <button onClick={() => setPlanMappings(planMappings.filter(x => x.id !== m.id))} className="text-red-500/50 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                </div>
              ))
            )}
            <button onClick={() => setPlanMappings([...planMappings, {id: Date.now(), checkoutId: '', saasPlan: ''}])} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-text-secondary hover:text-primary transition-all flex items-center justify-center gap-2">
              <Plus size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Nova Regra</span>
            </button>
          </div>
          <button onClick={handleSaveAll} className="w-full mt-6 bg-primary hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl transition-all">
            Salvar Tudo
          </button>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedIntegration?.platform || ''}>
        <div className="space-y-6">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs text-white/80 leading-relaxed">
            Copie a URL abaixo e cole nas configurações de Webhook da {selectedIntegration?.platform}.
          </div>
          <div className="flex items-center gap-3 bg-background p-4 rounded-xl border border-white/10">
            <code className="flex-1 text-[10px] text-primary truncate">{WEBHOOK_URL}</code>
            <button onClick={handleCopy} className="p-2 hover:bg-white/5 rounded-lg transition-all">{copied ? <Check size={18} className="text-secondary" /> : <Copy size={18} className="text-gray-400" />}</button>
          </div>
          <button onClick={handleToggleConnection} className={`w-full py-3.5 rounded-xl font-bold transition-all ${selectedIntegration?.connected ? 'bg-red-500/10 text-red-500' : 'bg-primary text-white'}`}>
            {selectedIntegration?.connected ? 'Desativar Integração' : 'Confirmar Ativação'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;
