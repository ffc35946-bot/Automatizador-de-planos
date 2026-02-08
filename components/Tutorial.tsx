
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
    <div className="space-y-6 md:space-y-8 animate-fade-in max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
      {/* Header Mobile Otimizado */}
      <section className="bg-gradient-to-br from-primary/20 to-transparent p-4 md:p-6 rounded-[1.5rem] border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
                <HelpCircle className="text-white" size={18} />
            </div>
            <h2 className="text-white text-base md:text-lg font-black uppercase tracking-tight">Guia Rápido</h2>
        </div>
        <p className="text-[11px] md:text-sm text-text-secondary leading-relaxed font-medium">
            Conectamos seu checkout ao seu app. O pagamento ocorre lá, a liberação ocorre aqui.
        </p>
      </section>

      {/* Grid de Passos - Adaptável para Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lado Checkout */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest px-1">
                <Smartphone size={16} />
                <span>Passo 1: No Checkout</span>
            </div>
            <div className="space-y-2">
                {[
                    'Crie um novo Webhook nas configurações.',
                    'Cole a nossa URL (da aba Canais).',
                    'Selecione o evento "Venda Aprovada".'
                ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-card/50 border border-white/5 rounded-xl">
                        <span className="w-5 h-5 flex items-center justify-center bg-primary text-white text-[10px] font-black rounded-full shrink-0 mt-0.5">{i+1}</span>
                        <p className="text-[11px] text-text-secondary font-medium leading-tight">{text}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Lado SaaS */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest px-1">
                <Database size={16} />
                <span>Passo 2: No seu App</span>
            </div>
            <div className="bg-card/50 border border-white/5 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-secondary">
                        <Zap size={14} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">IA Prompt</span>
                    </div>
                    <button 
                        onClick={handleCopyPrompt}
                        className="text-[10px] font-black text-secondary hover:text-white transition-all uppercase tracking-widest flex items-center gap-1"
                    >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 overflow-x-auto">
                    <code className="text-[10px] font-mono text-indigo-300/80 leading-relaxed whitespace-pre block min-w-[300px]">
                        {integrationPrompt}
                    </code>
                </div>
                <p className="text-[10px] text-text-secondary italic text-center opacity-60">Copie e cole no chat da sua IA favorita.</p>
            </div>
        </section>
      </div>

      {/* Dica de Mapeamento */}
      <section className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
        <div className="flex items-start gap-3">
            <Zap className="text-amber-500 shrink-0" size={16} />
            <div>
                <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-1">Dica de Ouro</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed">
                    Sempre use o <strong>Mapeamento de Planos</strong> se o nome do produto no checkout for diferente do nome no seu banco de dados.
                </p>
            </div>
        </div>
      </section>

      {/* Footer Mobile */}
      <div className="text-center pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full">
            <CheckCircle size={12} className="text-secondary" />
            <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">Configuração Segura</span>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
