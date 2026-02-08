
import React, { useState, useEffect } from 'react';
import type { LogEntry, User } from '../types';
import { LogStatus } from '../types';
import { WEBHOOK_URL } from '../constants';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import ClockIcon from './icons/ClockIcon';
import { ListFilter, Search, Info, Database } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-black text-white">Registros</h2>
            <p className="text-text-secondary text-sm">Histórico detalhado de ativações.</p>
        </div>
        <div className="bg-card p-3 rounded-2xl border border-border flex items-center gap-3">
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
            <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-sidebar/50">
                <tr>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Status</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Cliente</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Produto</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Origem</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest text-right">Data/Hora</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6"><StatusBadge status={log.status} /></td>
                    <td className="p-6">
                        <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{log.userEmail}</div>
                    </td>
                    <td className="p-6 text-sm font-semibold text-text-secondary">{log.plan}</td>
                    <td className="p-6">
                         <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded-md text-gray-400 border border-white/5 uppercase">{log.platform}</span>
                    </td>
                    <td className="p-6 text-sm font-bold text-text-secondary text-right">{formatTime(log.timestamp)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;
