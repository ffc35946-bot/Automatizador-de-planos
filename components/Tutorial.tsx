
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
  ChevronRight,
  ShieldAlert,
  Clock,
  RefreshCw,
  Code
} from 'lucide-react';

const Tutorial: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  
  const basicPrompt = `Implemente uma API de Webhook em Node/Python que:
1. Receba o e-mail em 'data.customer.email'.
2. Verifique se 'event' é 'order_approved'.
3. Atualize o banco de dados do meu SaaS para 'plano_ativo = true' para este e-mail.`;

  const recurringPrompt = `Ajuste meu backend para lidar com expiração de assinaturas:
1. Ao receber o evento 'subscription_canceled', mantenha o acesso ativo, mas salve a data de expiração.
2. Ao receber o evento 'subscription_expired', mude o status do usuário para 'bloqueado' imediatamente.
3. Use o campo 'data.customer.email' para identificar quem deve perder o acesso.`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
      {/* Header com Estilo Glass */}
      <section className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6 rounded-[2rem] border border-primary/20 shadow-xl">
        <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/30">
                <Zap className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white text-lg font-black uppercase tracking-tight">Guia de Integração</h2>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Configuração em 3 minutos</p>
            </div>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed font-medium mt-4">
            Copie os comandos abaixo e cole na sua IA de desenvolvimento (Lovable, Cursor ou ChatGPT) para gerar o código do seu SaaS.
        </p>
      </section>

      {/* Passo 1: Webhook */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-black text-[11px] uppercase tracking-widest px-1">
            <Smartphone size={16} />
            <span>Passo 1: Configuração no Checkout</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
            <div className="p-5 bg-card/30 border border-white/5 rounded-2xl flex gap-4">
                <div className="w-8 h-8 shrink-0 bg-sidebar border border-white/10 rounded-xl flex items-center justify-center text-xs font-black text-white">01</div>
                <div>
                    <h4 className="text-sm font-bold text-white mb-1">Eventos Necessários</h4>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                        No seu checkout, selecione: <span className="text-white font-bold">Compra Aprovada, Assinatura Cancelada e Assinatura Expirada</span>.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Passo 2: Lógica SaaS com Prompts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-secondary font-black text-[11px] uppercase tracking-widest px-1">
            <Code size={16} />
            <span>Passo 2: Instruções para sua IA</span>
        </div>
        
        {/* Card de Prompt para Venda Única */}
        <div className="bg-card/50 border border-white/5 rounded-[2rem] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                    <CheckCircle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ativação de Venda</span>
                </div>
                <button 
                    onClick={() => handleCopy(basicPrompt, 'basic')}
                    className="text-[10px] font-black text-primary hover:text-white transition-all uppercase tracking-widest flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg"
                >
                    {copied === 'basic' ? <Check size={12} /> : <Copy size={12} />}
                    {copied === 'basic' ? 'Copiado' : 'Copiar'}
                </button>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto shadow-inner">
                <code className="text-[10px] font-mono text-indigo-300 leading-relaxed whitespace-pre block">
                    {basicPrompt}
                </code>
            </div>
        </div>

        {/* Card de Prompt para Recorrência */}
        <div className="bg-card/50 border border-white/5 rounded-[2rem] p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-secondary/10 rounded-bl-2xl">
                <RefreshCw size={12} className="text-secondary animate-spin-slow" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-secondary">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Lógica de Recorrência</span>
                </div>
                <button 
                    onClick={() => handleCopy(recurringPrompt, 'recurring')}
                    className="text-[10px] font-black text-secondary hover:text-white transition-all uppercase tracking-widest flex items-center gap-1.5 bg-secondary/10 px-3 py-1.5 rounded-lg"
                >
                    {copied === 'recurring' ? <Check size={12} /> : <Copy size={12} />}
                    {copied === 'recurring' ? 'Copiado' : 'Copiar'}
                </button>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto shadow-inner">
                <code className="text-[10px] font-mono text-emerald-300 leading-relaxed whitespace-pre block">
                    {recurringPrompt}
                </code>
            </div>
            <div className="p-3 bg-secondary/5 border border-secondary/10 rounded-xl">
                <p className="text-[9px] text-secondary font-bold text-center uppercase tracking-tighter">
                    Copie este prompt e cole no seu gerador de código para implementar o "Auto-Stop".
                </p>
            </div>
        </div>
      </div>

      {/* Dica de Segurança */}
      <section className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
            <ShieldAlert className="text-red-500" size={20} />
        </div>
        <div>
            <h4 className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-1">Atenção à Segurança</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
                Valide sempre o <span className="text-white font-bold">Webhook Secret</span> para evitar que acessos falsos sejam criados no seu banco de dados.
            </p>
        </div>
      </section>

      {/* Footer Mobile */}
      <div className="text-center pb-8">
        <button onClick={() => window.location.hash = 'integrations'} className="inline-flex items-center gap-3 px-8 py-3 bg-primary text-white rounded-full shadow-lg shadow-primary/20 text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
            <CheckCircle size={16} />
            Configurar Canais
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
