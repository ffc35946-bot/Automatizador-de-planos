
import React, { useState } from 'react';
import { 
  Smartphone, 
  Mail, 
  Copy, 
  Check, 
  Terminal, 
  Database, 
  Rocket, 
  CheckCircle,
  HelpCircle,
  Zap,
  ChevronRight
} from 'lucide-react';

const Tutorial: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  const integrationPrompt = `Eu preciso criar uma funcionalidade de "recebimento de vendas" no meu aplicativo.
Por favor, crie um endpoint (um endereço de rede) chamado "/api/webhook-pay".

REGRAS:
1. Receba e-mail e nome do plano.
2. Procure no banco de dados.
3. Se existir: mude o plano e responda "Sucesso".
4. Se não existir: responda "E-mail não encontrado".`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(integrationPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      {/* Header Mobile Otimizado */}
      <section className="bg-gradient-to-br from-primary/20 to-transparent p-5 rounded-[1.5rem] border border-primary/20">
        <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
                <HelpCircle className="text-white" size={18} />
            </div>
            <h2 className="text-white text-base md:text-lg font-black uppercase tracking-tight">Central de Ajuda</h2>
        </div>
        <p className="text-[12px] md:text-sm text-text-secondary leading-relaxed font-medium">
            Siga os passos abaixo para conectar seu checkout ao seu aplicativo SaaS em menos de 5 minutos.
        </p>
      </section>

      {/* Grid de Passos - Adaptável para Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lado Checkout */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest px-1">
                <Smartphone size={16} />
                <span>Passo 1: No Checkout</span>
            </div>
            <div className="space-y-3">
                <div className="p-4 bg-card/50 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-primary text-white text-[10px] font-black rounded-full">1</span>
                        <p className="text-sm font-bold text-white">Configurar Webhook</p>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed ml-8">
                        Vá em Configurações &gt; Webhooks no seu checkout e clique em "Adicionar nova URL".
                    </p>
                </div>
                <div className="p-4 bg-card/50 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-primary text-white text-[10px] font-black rounded-full">2</span>
                        <p className="text-sm font-bold text-white">Colar Endereço</p>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed ml-8">
                        Copie a URL que geramos para você na aba "Canais" e cole no campo de destino do webhook.
                    </p>
                </div>
            </div>
        </section>

        {/* Lado SaaS */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest px-1">
                <Database size={16} />
                <span>Passo 2: No seu App</span>
            </div>
            <div className="bg-card/50 border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-secondary">
                        <Zap size={14} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Prompt para IA</span>
                    </div>
                    <button 
                        onClick={handleCopyPrompt}
                        className="text-[10px] font-black text-secondary hover:text-white transition-all uppercase tracking-widest flex items-center gap-1.5"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
                <div className="bg-black/60 p-4 rounded-xl border border-white/10 overflow-x-auto shadow-inner">
                    <code className="text-[10px] md:text-[11px] font-mono text-indigo-300/90 leading-relaxed whitespace-pre block min-w-[280px]">
                        {integrationPrompt}
                    </code>
                </div>
                <div className="p-3 bg-secondary/5 border border-secondary/10 rounded-xl">
                    <p className="text-[10px] text-secondary font-medium text-center">
                        Envie este prompt para o ChatGPT ou Claude para gerar o código do seu servidor automaticamente.
                    </p>
                </div>
            </div>
        </section>
      </div>

      {/* Dica de Mapeamento */}
      <section className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
        <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
            <Zap className="text-amber-500" size={20} />
        </div>
        <div>
            <h4 className="text-[12px] font-black text-amber-500 uppercase tracking-widest mb-1">Mapeamento de Planos</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
                Se o nome do produto no checkout (ex: "ID_99") for diferente do seu banco de dados (ex: "Plano Pro"), use a aba "Canais" para criar uma regra de conversão.
            </p>
        </div>
      </section>

      {/* Footer Mobile */}
      <div className="text-center pb-6">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-sidebar border border-border rounded-full shadow-lg">
            <CheckCircle size={14} className="text-secondary" />
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Configuração Concluída</span>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
