
import React, { useState } from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  Mail, 
  Copy, 
  Check, 
  Terminal, 
  Key, 
  Database, 
  Rocket, 
  ArrowRight, 
  AlertTriangle,
  Lightbulb,
  Zap,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const Tutorial: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  const integrationPrompt = `Eu preciso criar uma funcionalidade de "recebimento de vendas" no meu aplicativo.
Por favor, crie um endpoint (um endereço de rede) chamado "/api/webhook-pay".

REGRAS QUE ELE DEVE SEGUIR:
1. Ele vai receber um e-mail e o nome de um plano.
2. Ele deve procurar no meu banco de dados se existe um usuário com esse e-mail.
3. Se o usuário EXISTIR: mude o plano dele para o nome que foi recebido e responda "Sucesso".
4. Se o usuário NÃO EXISTIR: responda com o erro "E-mail não encontrado".

Estou usando este código para integrar com um automatizador de checkout.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(integrationPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-none text-text-secondary space-y-8 md:space-y-10 pb-10 md:pb-16 animate-fade-in">
      <style>{`
        .step-card { 
          background: rgba(31, 41, 55, 0.5); 
          border: 1px solid rgba(75, 85, 99, 0.4); 
          border-radius: 1.25rem; 
          padding: 1.25rem; 
          transition: all 0.3s ease; 
        }
        @media (min-width: 768px) {
          .step-card { padding: 1.5rem; border-radius: 1.5rem; }
        }
        .step-card:hover { border-color: #4f46e5; transform: translateY(-2px); }
        .badge-step { background: #4f46e5; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; }
        @media (min-width: 768px) {
          .badge-step { width: 28px; height: 28px; font-size: 14px; }
        }
        .section-title { color: white; font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
        @media (min-width: 768px) {
          .section-title { font-size: 1.5rem; margin-bottom: 1.5rem; }
        }
        .check-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.8rem; }
        @media (min-width: 768px) {
          .check-item { font-size: 0.875rem; }
        }
      `}</style>
      
      {/* Introdução Amigável */}
      <section className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-5 md:p-6 rounded-[2rem] border border-primary/20">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20 shrink-0">
            <HelpCircle className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-white text-lg md:text-xl font-black mb-2">Manual Rápido de Configuração</h2>
            <p className="text-xs md:text-sm leading-relaxed opacity-90">
              Pense no nosso sistema como uma <strong>ponte inteligente</strong>. 
              De um lado está o lugar onde o cliente paga (Checkout). Do outro está o seu aplicativo (SaaS). 
              Nós apenas levamos a notícia da venda e mandamos o seu app liberar o acesso.
            </p>
          </div>
        </div>
      </section>

      {/* Checklist Anti-Erros */}
      <section className="bg-sidebar/50 border border-border p-5 md:p-6 rounded-2xl">
        <h3 className="text-white text-sm md:text-base font-bold flex items-center gap-2 mb-4">
          <CheckCircle className="text-secondary" size={20} />
          Para Funcionar de Primeira:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="check-item">
            <div className="mt-1 text-secondary shrink-0"><Check size={14} strokeWidth={3} /></div>
            <p>E-mail da compra deve ser igual ao e-mail do seu app.</p>
          </div>
          <div className="check-item">
            <div className="mt-1 text-secondary shrink-0"><Check size={14} strokeWidth={3} /></div>
            <p>Sua <strong>Chave de API</strong> deve ser idêntica nos dois lados.</p>
          </div>
          <div className="check-item">
            <div className="mt-1 text-secondary shrink-0"><Check size={14} strokeWidth={3} /></div>
            <p>Use sempre <code>https://</code> no seu Endpoint.</p>
          </div>
          <div className="check-item">
            <div className="mt-1 text-secondary shrink-0"><Check size={14} strokeWidth={3} /></div>
            <p>Mapeie os códigos exatos dos planos do checkout.</p>
          </div>
        </div>
      </section>

      {/* Passo 1: O Lado da Venda */}
      <section>
        <div className="section-title text-primary">
          <Smartphone size={24} />
          <span>Etapa 1: No Checkout</span>
        </div>
        <p className="text-xs md:text-sm mb-4">Acesse sua plataforma (Kirvano, Cakto ou Kiwify):</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          <div className="step-card">
            <div className="badge-step mb-3">1</div>
            <p className="font-bold text-white mb-1 text-sm">Configurar Webhook</p>
            <p className="text-[11px] leading-relaxed">Vá em Configurações > Webhooks e clique em adicionar nova URL.</p>
          </div>
          <div className="step-card">
            <div className="badge-step mb-3">2</div>
            <p className="font-bold text-white mb-1 text-sm">Inserir nossa URL</p>
            <p className="text-[11px] leading-relaxed">Cole o endereço que fornecemos na aba de Integrações.</p>
          </div>
          <div className="step-card">
            <div className="badge-step mb-3">3</div>
            <p className="font-bold text-white mb-1 text-sm">Escolher Evento</p>
            <p className="text-[11px] leading-relaxed">Marque apenas o evento de <strong>Venda Aprovada</strong>.</p>
          </div>
        </div>
      </section>

      {/* Passo 2: O Lado do seu Aplicativo */}
      <section>
        <div className="section-title text-secondary">
          <Database size={24} />
          <span>Etapa 2: No seu SaaS</span>
        </div>
        <div className="bg-card/40 rounded-2xl md:rounded-3xl border border-border p-5 md:p-6 space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 text-secondary bg-secondary/10 p-2 md:p-3 rounded-lg md:rounded-xl w-fit">
            <Zap size={16} />
            <span className="text-[9px] md:text-xs font-black uppercase tracking-wider">Apoio de IA</span>
          </div>
          <p className="text-xs md:text-sm leading-relaxed">
            Copie o texto abaixo e cole no chat do <strong>Lovable, Cursor ou ChatGPT</strong> para ele preparar o seu código automaticamente:
          </p>

          <div className="bg-black/60 rounded-xl md:rounded-2xl border border-white/5 overflow-hidden group">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
              <span className="text-[9px] font-bold uppercase text-text-secondary flex items-center gap-2">
                <Terminal size={12} /> Prompt Estruturado
              </span>
              <button 
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-secondary hover:text-white transition-all active:scale-95"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className="p-4 md:p-5 text-[10px] md:text-xs font-mono text-indigo-200/80 leading-relaxed italic select-all">
              "{integrationPrompt}"
            </div>
          </div>
        </div>
      </section>

      {/* Como Testar */}
      <section className="bg-indigo-600/10 p-6 md:p-8 rounded-[2rem] border border-indigo-500/20 text-center">
        <div className="bg-indigo-500/20 p-3 md:p-4 rounded-full w-fit mx-auto mb-4">
          <Rocket className="text-indigo-400" size={28} />
        </div>
        <h3 className="text-white font-black text-lg md:text-xl mb-2">Pronto para o Teste?</h3>
        <p className="text-xs md:text-sm max-w-lg mx-auto mb-6 opacity-80">
          Use o botão <strong>"Disparar Teste"</strong> na aba Canais. 
          Se receber o status de sucesso, você já pode começar a vender no automático!
        </p>
      </section>

      {/* Erro comum de Iniciante */}
      <div className="bg-amber-500/5 border border-amber-500/20 p-4 md:p-6 rounded-2xl flex gap-3 md:gap-4 items-center">
        <AlertTriangle className="text-amber-500 shrink-0" size={20} />
        <div>
          <h4 className="font-bold text-amber-500 text-xs md:text-sm mb-0.5">Aviso Importante</h4>
          <p className="text-[10px] md:text-xs leading-relaxed opacity-80">
            Não esqueça do <strong>Mapeamento</strong>. Se o checkout envia "prod-123" e seu app chama de "vip", cadastre essa regra no painel.
          </p>
        </div>
      </div>

      <footer className="text-center pt-6 border-t border-border/20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/5 rounded-full border border-secondary/10">
          <CheckCircle size={10} className="text-secondary" />
          <span className="text-[9px] text-text-secondary uppercase tracking-widest font-black">Configuração Validada</span>
        </div>
      </footer>
    </div>
  );
};

export default Tutorial;
