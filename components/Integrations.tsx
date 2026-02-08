
import React, { useState } from 'react';
import Card from './Card';
import Modal from './Modal';
import CheckCircleIcon from './icons/CheckCircleIcon';
import type { Integration, SaasConfig } from '../types';
import { IntegrationPlatform } from '../types';
import { INITIAL_INTEGRATIONS, WEBHOOK_URL } from '../constants';
import { Copy, Check, Plus, Trash2, AlertCircle, ArrowRightLeft, Link2, ExternalLink, Zap, Play, Loader2 } from 'lucide-react';

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [saasConfig, setSaasConfig] = useState<SaasConfig>({
      endpoint: 'https://seu-app.lovable.app/api/webhook-pay',
      apiKey: 'sk_live_********************'
  });
  const [urlError, setUrlError] = useState<string | null>(null);
  const [planMappings, setPlanMappings] = useState([
    { id: 1, checkoutId: 'prod_K123', saasPlan: 'Plano Pro' },
    { id: 2, checkoutId: 'prod_B456', saasPlan: 'Plano Básico' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  const validateUrl = (url: string) => {
    if (!url) return "A URL não pode estar vazia.";
    try {
      new URL(url);
      return null;
    } catch (e) {
      return "Por favor, insira uma URL válida (ex: https://app.com/api).";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSaasConfig(prev => ({ ...prev, endpoint: value }));
    setUrlError(validateUrl(value));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(WEBHOOK_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addMapping = () => {
    setPlanMappings([...planMappings, { id: Date.now(), checkoutId: '', saasPlan: '' }]);
  };

  const removeMapping = (id: number) => {
    setPlanMappings(planMappings.filter(m => m.id !== id));
  };

  const handleConnectClick = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsModalOpen(true);
  };

  const handleToggleConnection = () => {
    if (selectedIntegration) {
      setIntegrations(integrations.map(int => 
        int.platform === selectedIntegration.platform ? { ...int, connected: !int.connected } : int
      ));
      setIsModalOpen(false);
      setSelectedIntegration(null);
    }
  };

  const handleSave = () => {
    const error = validateUrl(saasConfig.endpoint);
    if (error) {
      setUrlError(error);
      return;
    }
    alert("Configurações salvas com sucesso!");
  };

  const runTestIntegration = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    // Simular chamada de API real para o SaaS do usuário
    setTimeout(() => {
        const isSuccess = Math.random() > 0.3;
        setIsTesting(false);
        setTestResult({
            success: isSuccess,
            message: isSuccess 
                ? "Conexão estabelecida! Seu SaaS respondeu com sucesso (200 OK)." 
                : "Falha na conexão. Verifique se o endpoint existe e se aceita requisições POST."
        });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-4xl font-extrabold text-white tracking-tight">Canais de Venda</h2>
           <p className="text-text-secondary mt-1">Conecte seus checkouts ao seu SaaS em minutos.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-card px-4 py-2 rounded-full border border-border shadow-lg">
           <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
           <p className="text-text-secondary text-sm font-medium">Sistemas Monitorados</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card title="1. Fontes de Pagamento" className="relative overflow-hidden bg-sidebar/30 backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Zap size={100} className="text-primary" /></div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              {integrations.map((int) => (
                <div 
                  key={int.platform} 
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group ${
                    int.platform === IntegrationPlatform.Custom 
                    ? 'bg-gradient-to-r from-sidebar/80 to-primary/5 border-primary/20 hover:border-primary/40' 
                    : 'bg-sidebar/50 border-border/40 hover:bg-sidebar hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center space-x-5">
                    <div className="relative bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center w-20 h-20 overflow-hidden group/logo transition-all hover:shadow-md hover:scale-[1.03] border border-gray-100/50">
                      {int.logo ? (
                        int.dashboardUrl ? (
                          <a 
                            href={int.dashboardUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            title={`Acesse o painel da ${int.platform}`}
                            className="w-full h-full flex items-center justify-center relative"
                          >
                            <img 
                              src={int.logo} 
                              alt={int.platform} 
                              className="max-h-full max-w-full object-contain block transform transition-transform duration-500 group-hover/logo:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black/[0.03] opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity">
                               <ExternalLink size={12} className="text-primary" />
                            </div>
                          </a>
                        ) : (
                          <img 
                            src={int.logo} 
                            alt={int.platform} 
                            className="max-h-full max-w-full object-contain block" 
                          />
                        )
                      ) : (
                        <div className="text-gray-400 font-bold text-[10px] uppercase tracking-tighter text-center">API<br/>Personalizada</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white block text-lg leading-tight tracking-tight">{int.platform}</span>
                        {int.connected && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-secondary uppercase tracking-widest font-black opacity-40">
                        {int.platform === IntegrationPlatform.Custom ? 'Integração Direta' : 'Gateway Externo'}
                      </span>
                    </div>
                  </div>
                  {int.connected ? (
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-[10px] font-black border border-secondary/20 tracking-tighter shadow-sm animate-fade-in">
                          <CheckCircleIcon className="w-3 h-3" /> CONECTADO
                        </div>
                        <button onClick={() => handleConnectClick(int)} className="text-[10px] text-text-secondary hover:text-white transition-colors underline decoration-dotted underline-offset-4 font-bold">Ver Configuração</button>
                    </div>
                  ) : (
                    <button onClick={() => handleConnectClick(int)} className="bg-primary hover:bg-indigo-500 text-white text-xs font-black py-2.5 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">Conectar</button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card title="2. Destino (Seu SaaS)" className="border-l-4 border-l-primary relative overflow-hidden bg-sidebar/30 backdrop-blur-sm">
             <div className="absolute top-4 right-6 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">Sincronização</div>
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Endpoint de Ativação (Lovable/Bubble/API)</label>
                    <div className="relative">
                      <input
                          type="text"
                          value={saasConfig.endpoint}
                          onChange={handleUrlChange}
                          className={`w-full bg-background/50 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all pr-10 ${urlError ? 'border-red-500' : 'border-border/50'}`}
                          placeholder="https://seu-app.lovable.app/api/ativar"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-text-secondary">
                        <Link2 size={18} />
                      </div>
                    </div>
                    {urlError && (
                      <div className="flex items-center space-x-1 mt-2 text-red-500 text-xs font-medium">
                        <AlertCircle size={14} />
                        <span>{urlError}</span>
                      </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Chave de Segurança (X-API-KEY)</label>
                    <input
                        type="password"
                        value={saasConfig.apiKey}
                        onChange={(e) => setSaasConfig(prev => ({...prev, apiKey: e.target.value}))}
                        className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                
                <div className="pt-4 border-t border-border/20">
                    <button 
                        onClick={runTestIntegration}
                        disabled={isTesting || !!urlError}
                        className="flex items-center justify-center gap-2 w-full bg-sidebar hover:bg-card text-text-primary border border-border/50 rounded-xl py-3.5 text-sm font-bold transition-all disabled:opacity-50 shadow-inner group"
                    >
                        {isTesting ? <Loader2 size={18} className="animate-spin text-primary" /> : <Play size={18} className="text-secondary group-hover:scale-110 transition-transform" />}
                        {isTesting ? "Testando Conexão..." : "Testar Conexão agora"}
                    </button>
                    {testResult && (
                        <div className={`mt-3 p-4 rounded-xl text-xs font-medium flex items-start gap-3 animate-slide-in shadow-lg ${testResult.success ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {testResult.success ? <CheckCircleIcon className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle size={20} className="mt-0.5 shrink-0" />}
                            <span className="leading-relaxed">{testResult.message}</span>
                        </div>
                    )}
                </div>
            </div>
          </Card>
        </div>

        <Card title="3. Mapeamento Inteligente" className="flex flex-col border-l-4 border-l-secondary bg-sidebar/30 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
          <p className="text-sm text-text-secondary mb-6 italic opacity-80 leading-relaxed">Defina as regras: qual código o checkout envia e qual plano seu SaaS deve liberar.</p>
          <div className="space-y-4 flex-grow overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            {planMappings.map((mapping) => (
              <div key={mapping.id} className="flex items-center space-x-3 bg-background/30 p-4 rounded-2xl border border-border/30 group animate-slide-in hover:border-secondary/30 transition-colors">
                <div className="flex-1">
                  <p className="text-[10px] text-primary font-bold uppercase mb-1.5 tracking-widest opacity-80">ID no Checkout</p>
                  <input 
                    type="text" 
                    placeholder="ex: prod_123" 
                    value={mapping.checkoutId}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      setPlanMappings(planMappings.map(m => m.id === mapping.id ? {...m, checkoutId: newVal} : m));
                    }}
                    className="w-full bg-background border border-border/50 rounded-xl px-3 py-2.5 text-xs focus:border-primary outline-none shadow-inner"
                  />
                </div>
                <div className="pt-5 text-text-secondary opacity-30 group-hover:opacity-100 transition-opacity">
                   <ArrowRightLeft size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-secondary font-bold uppercase mb-1.5 tracking-widest opacity-80">Nome no seu SaaS</p>
                  <input 
                    type="text" 
                    placeholder="ex: Plano VIP" 
                    value={mapping.saasPlan}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      setPlanMappings(planMappings.map(m => m.id === mapping.id ? {...m, saasPlan: newVal} : m));
                    }}
                    className="w-full bg-background border border-border/50 rounded-xl px-3 py-2.5 text-xs focus:border-secondary outline-none shadow-inner"
                  />
                </div>
                <div className="pt-5">
                  <button onClick={() => removeMapping(mapping.id)} className="text-red-500/40 hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addMapping} className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-border/30 p-5 rounded-2xl text-text-secondary hover:text-primary hover:border-primary/50 transition-all group bg-sidebar/20">
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
              <span className="text-sm font-bold">Adicionar Nova Regra</span>
            </button>
          </div>
          <div className="mt-8 pt-6 border-t border-border/20">
            <button 
              onClick={handleSave}
              disabled={!!urlError}
              className={`w-full font-black py-4.5 rounded-2xl shadow-xl transition-all active:scale-[0.98] ${!!urlError ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-secondary to-emerald-600 text-white hover:shadow-secondary/20 hover:brightness-110'}`}
            >
                Salvar Configurações
            </button>
          </div>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Configuração: ${selectedIntegration?.platform}`}>
        <div className="text-text-secondary space-y-6 py-2">
          <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 flex gap-4 animate-fade-in">
             <div className="p-2 bg-primary/10 rounded-lg shrink-0 h-fit">
                <AlertCircle className="text-primary" size={20} />
             </div>
             <div>
                <p className="text-sm font-bold text-white mb-1">Atenção!</p>
                <p className="text-xs leading-relaxed opacity-80">Você deve copiar a URL abaixo e colar nas configurações de Webhook da sua conta na {selectedIntegration?.platform}. Caso contrário, as vendas não serão enviadas para o sistema.</p>
             </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Sua URL Exclusiva</p>
            <div className="flex items-center space-x-3 bg-background p-4 rounded-xl border border-border/50 group shadow-inner">
                <input type="text" readOnly value={WEBHOOK_URL} className="flex-1 bg-transparent text-xs font-mono text-primary outline-none select-all overflow-hidden text-ellipsis" />
                <button onClick={handleCopy} className="bg-sidebar p-2.5 rounded-xl border border-border/50 hover:bg-card transition-all flex items-center gap-2 active:scale-95 shadow-sm">
                {copied ? <Check size={18} className="text-secondary" /> : <Copy size={18} className="text-primary" />}
                <span className="text-xs font-bold">{copied ? 'Pronto!' : 'Copiar'}</span>
                </button>
            </div>
          </div>
          <div className="flex justify-end pt-4 gap-4">
             <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold hover:bg-sidebar transition-all border border-transparent hover:border-border/50">Voltar</button>
             <button onClick={handleToggleConnection} className={`font-black px-8 py-3 rounded-xl shadow-lg transition-all active:scale-95 ${selectedIntegration?.connected ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-primary text-white shadow-primary/20'}`}>
                {selectedIntegration?.connected ? 'Desativar Canal' : 'Ativar Agora'}
             </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Integrations;
