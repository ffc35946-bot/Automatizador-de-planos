
import React, { useState, useEffect } from 'react';
import type { LogEntry, User } from '../types';
import { LogStatus } from '../types';
import { WEBHOOK_URL } from '../constants';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import ClockIcon from './icons/ClockIcon';
import Modal from './Modal';
import { ListFilter, Search, Info, Database, Sparkles, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import { getTroubleshootingSteps } from '../services/geminiService';

const StatusBadge: React.FC<{ status: LogStatus }> = ({ status }) => {
  const baseClasses = "flex items-center space-x-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm";
  switch (status) {
    case LogStatus.Success:
      return <div className={`${baseClasses} bg-green-500/10 text-green-400 border-green-500/20`}><CheckCircleIcon className="w-3 h-3" /><span>{status}</span></div>;
    case LogStatus.Failed:
      return <div className={`${baseClasses} bg-red-500/10 text-red-400 border-red-500/20`}><XCircleIcon className="w-3 h-3" /><span>{status}</span></div>;
    case LogStatus.Processing:
      return <div className={`${baseClasses} bg-yellow-500/10 text-yellow-400 border-yellow-500/20`}><ClockIcon className="w-3 h-3" /><span>{status}</span></div>;
    default:
      return null;
  }
};

const Logs: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [user, setUser] = useState<User | null>(null);
    
    // Estados para Diagnóstico de IA
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('saas_active_session');
        if (session) {
            const userData = JSON.parse(session);
            setUser(userData);
            const savedLogs = localStorage.getItem(`logs_${userData.email}`);
            if (savedLogs) {
                setLogs(JSON.parse(savedLogs).map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) })));
            }
        }
    }, []);

    const handleTroubleshoot = async (log: LogEntry) => {
        setSelectedLog(log);
        setIsAiModalOpen(true);
        setIsAiLoading(true);
        setAiResponse(null);
        
        try {
            const result = await getTroubleshootingSteps(log);
            setAiResponse(result);
        } catch (err) {
            setAiResponse("Falha ao gerar diagnóstico. Verifique sua conexão.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleCopySolution = () => {
        if (!aiResponse) return;
        navigator.clipboard.writeText(aiResponse);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    if (logs.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                <div className="w-20 h-20 bg-card border border-border rounded-[2rem] flex items-center justify-center mb-6 shadow-xl">
                    <Database size={32} className="text-gray-500" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Sem registros ainda</h2>
                <p className="text-text-secondary max-w-sm text-sm leading-relaxed mb-8">
                    As tentativas de ativação aparecerão aqui em tempo real assim que seu webhook receber as primeiras vendas.
                </p>
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-start gap-4 text-left max-w-md">
                    <Info className="text-primary shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-text-secondary leading-relaxed">
                        <strong className="text-primary">Dica:</strong> Certifique-se de que a URL do Webhook está configurada corretamente na sua plataforma de checkout.
                    </p>
                </div>
            </div>
        );
    }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-black text-white">Registros</h2>
            <p className="text-text-secondary text-sm">Histórico detalhado de ativações.</p>
        </div>
        <div className="bg-card p-3 rounded-2xl border border-border flex items-center gap-3 shadow-lg">
             <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Search className="h-4 w-4 text-primary" />
             </div>
             <p className="text-[11px] font-bold text-text-secondary uppercase tracking-tight truncate">
                Monitorando: <code className="text-primary font-mono lowercase">...{WEBHOOK_URL.slice(-12)}</code>
             </p>
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-sidebar/50">
                <tr>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Status</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Cliente</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Produto</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Origem</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Data/Hora</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest text-right">Ação</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6"><StatusBadge status={log.status} /></td>
                    <td className="p-6">
                        <div className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate max-w-[180px]">{log.userEmail}</div>
                    </td>
                    <td className="p-6 text-sm font-semibold text-text-secondary truncate max-w-[150px]">{log.plan}</td>
                    <td className="p-6">
                         <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded-md text-gray-400 border border-white/5 uppercase">{log.platform}</span>
                    </td>
                    <td className="p-6 text-sm font-bold text-text-secondary">{formatTime(log.timestamp)}</td>
                    <td className="p-6 text-right">
                        {log.status === LogStatus.Failed ? (
                            <button 
                                onClick={() => handleTroubleshoot(log)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95 group/btn shadow-lg shadow-indigo-500/5"
                            >
                                <Sparkles size={14} className="group-hover/btn:animate-pulse" />
                                Solucionar
                            </button>
                        ) : (
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest mr-4">Concluído</span>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* Modal de Inteligência Artificial */}
      <Modal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        title="Assistente de Diagnóstico IA"
      >
        <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle className="text-red-500" size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">Erro Detectado</h4>
                    <p className="text-xs text-red-400 font-mono mt-0.5 line-clamp-1 italic">"{selectedLog?.error}"</p>
                </div>
            </div>

            <div className="relative min-h-[300px] bg-background/50 border border-white/10 rounded-[2rem] p-6 md:p-8 overflow-y-auto max-h-[60vh] custom-scrollbar shadow-inner">
                {isAiLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={24} />
                        </div>
                        <p className="text-xs font-black text-primary uppercase tracking-[0.3em] animate-pulse">Analisando Tráfego...</p>
                    </div>
                ) : (
                    <div className="markdown-content text-sm text-text-secondary">
                        {aiResponse ? (
                            <div dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br/>').replace(/## (.*)/g, '<h3 class="text-white font-black text-lg mt-4 mb-2">$1</h3>').replace(/\*\*(.*)\*\*/g, '<strong class="text-primary font-bold">$1</strong>') }} />
                        ) : (
                            <p>Erro inesperado ao gerar solução.</p>
                        )}
                    </div>
                )}
            </div>

            {!isAiLoading && (
                <div className="flex gap-3">
                    <button 
                        onClick={handleCopySolution}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-sidebar border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest text-white hover:bg-card transition-all"
                    >
                        {copied ? <Check size={16} className="text-secondary" /> : <Copy size={16} />}
                        {copied ? 'Copiado para o Suporte' : 'Copiar Diagnóstico'}
                    </button>
                    <button 
                        onClick={() => setIsAiModalOpen(false)}
                        className="px-8 py-4 bg-primary text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-indigo-500 transition-all"
                    >
                        Entendi
                    </button>
                </div>
            )}
        </div>
      </Modal>
    </div>
  );
};

export default Logs;
