
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
    <div className="max-w-none text-text-secondary space-y-10 pb-16 animate-fade-in">
      <style>{`
        .step-card { background: rgba(31, 41, 55, 0.5); border: 1px solid rgba(75, 85, 99, 0.4); border-radius: 1.5rem; padding: 1.5rem; transition: all 0.3s ease; }
        .step-card:hover { border-color: #4f46e5; transform: translateY(-2px); }
        .badge-step { background: #4f46e5; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; }
        .section-title { color: white; font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; }
        .check-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.875rem; }
      `}</style>
      
      {/* Introdução Amigável */}
      <section className="bg-gradient-to-r from-primary/20 to-transparent p-6 rounded-3xl border border-primary/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
            <HelpCircle className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-white text-xl font-black mb-2">Nunca fez isso antes? Sem problemas!</h2>
            <p className="text-sm leading-relaxed">
              Pense no nosso sistema como uma <strong>ponte inteligente</strong>. 
              De um lado está o lugar onde o cliente paga (Checkout). Do outro está o seu aplicativo (SaaS). 
              Nós apenas levamos a notícia da venda e mandamos o seu app liberar o acesso.
            </p>
          </div>
        </div>
      </section>

      {/* Checklist Anti-Erros */}
      <section className="bg-sidebar/50 border border-border p-6 rounded-2xl">
        <h3 className="text-white font-bold flex items-center gap-2 mb-4">
          <CheckCircle className="text-secondary" size={20} />
          Checklist para Funcionar de Primeira
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="check-item">
            <div className="mt-1 text-secondary"><Check size={16} strokeWidth={3} /></div>
            <p>O cliente deve usar o <strong>mesmo e-mail</strong> na compra e no seu app.</p>
          </div>
          <div className="check-item">
            <div className="mt-1 text-secondary"><Check size={16} strokeWidth={3} /></div>
            <p>Sua <strong>Chave de API</strong> deve ser igual nos dois sistemas.</p>
          </div>
          <div className="check-item">
            <div className="mt-1 text-secondary"><Check size={16} strokeWidth={3} /></div>
            <p>O <strong>Endpoint</strong> deve começar com <code>https://</code>.</p>
          </div>
          <div className="check-item">
            <div className="mt-1 text-secondary"><Check size={16} strokeWidth={3} /></div>
            <p>O <strong>Mapeamento</strong> deve ter os códigos exatos do checkout.</p>
          </div>
        </div>
      </section>

      {/* Passo 1: O Lado da Venda */}
      <section>
        <div className="section-title text-primary">
          <Smartphone />
          <span>Etapa 1: Na Plataforma de Venda</span>
        </div>
        <p className="text-sm mb-4">Siga estes cliques na sua plataforma (Kirvano, Cakto ou Kiwify):</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="step-card border-primary/20">
            <div className="badge-step mb-3 bg-primary">1</div>
            <p className="font-bold text-white mb-1">Webhooks</p>
            <p className="text-xs">Procure pelo menu "Ferramentas" ou "Configurações" e clique em <strong>Webhooks</strong>.</p>
          </div>
          <div className="step-card border-primary/20">
            <div className="badge-step mb-3 bg-primary">2</div>
            <p className="font-bold text-white mb-1">Nova URL</p>
            <p className="text-xs">Clique em "Adicionar" e cole a nossa <strong>URL de Webhook</strong> lá.</p>
          </div>
          <div className="step-card border-primary/20">
            <div className="badge-step mb-3 bg-primary">3</div>
            <p className="font-bold text-white mb-1">Venda Aprovada</p>
            <p className="text-xs">Marque para enviar o aviso sempre que uma <strong>venda for aprovada</strong>.</p>
          </div>
        </div>
      </section>

      {/* Passo 2: O Lado do seu Aplicativo */}
      <section>
        <div className="section-title text-secondary">
          <Database />
          <span>Etapa 2: No seu Aplicativo</span>
        </div>
        <div className="bg-card/40 rounded-3xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3 text-secondary bg-secondary/10 p-3 rounded-xl w-fit">
            <Zap size={18} />
            <span className="text-xs font-black uppercase tracking-wider">Instrução para a sua IA</span>
          </div>
          <p className="text-sm">
            Copie o texto abaixo e cole no chat do <strong>Lovable, Cursor ou ChatGPT</strong> para ele preparar o seu app para receber as vendas:
          </p>

          <div className="bg-black/60 rounded-2xl border border-white/5 overflow-hidden group">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
              <span className="text-[10px] font-bold uppercase text-text-secondary flex items-center gap-2">
                <Terminal size={12} /> Copie esta mensagem
              </span>
              <button 
                onClick={handleCopyPrompt}
                className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-white transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className="p-5 text-xs font-mono text-indigo-200 leading-relaxed italic">
              "{integrationPrompt}"
            </div>
          </div>
        </div>
      </section>

      {/* Como Testar */}
      <section className="bg-indigo-600/10 p-8 rounded-3xl border border-indigo-500/30 text-center">
        <div className="bg-indigo-500/20 p-4 rounded-full w-fit mx-auto mb-4">
          <Rocket className="text-indigo-400" size={32} />
        </div>
        <h3 className="text-white font-black text-xl mb-2">Pronto para o Teste Real?</h3>
        <p className="text-sm max-w-lg mx-auto mb-6">
          Antes de começar a vender, use o botão <strong>"Testar Integração"</strong> na aba anterior. 
          Se a luz ficar verde, parabéns! Você já pode automatizar suas vendas.
        </p>
      </section>

      {/* Erro comum de Iniciante */}
      <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl flex gap-4">
        <AlertTriangle className="text-amber-500 shrink-0" />
        <div>
          <h4 className="font-bold text-amber-500 mb-1">Dica de Ouro</h4>
          <p className="text-xs leading-relaxed">
            Muitos iniciantes esquecem do <strong>Mapeamento</strong>. Se o seu checkout envia o código "PROD-1", mas no seu app o plano se chama "Plano Mensal", você precisa avisar isso ao sistema na aba <strong>Integrações</strong>.
          </p>
        </div>
      </div>

      <footer className="text-center pt-4 border-t border-border/30">
        <p className="text-[10px] text-text-secondary flex items-center justify-center gap-2 uppercase tracking-widest font-bold">
          <CheckCircle size={12} className="text-secondary" />
          Configuração 100% Funcional e Segura
        </p>
      </footer>
    </div>
  );
};

export default Tutorial;
