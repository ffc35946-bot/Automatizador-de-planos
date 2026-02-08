
import React, { useState, useEffect } from 'react';
import { MOCK_LOGS, WEBHOOK_URL } from '../constants';
import type { LogEntry } from '../types';
import { LogStatus } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import ClockIcon from './icons/ClockIcon';

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
    const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);

    useEffect(() => {
        const interval = setInterval(() => {
            const newLog: LogEntry = {
                id: `log${Date.now()}`,
                timestamp: new Date(),
                platform: MOCK_LOGS[0].platform,
                userEmail: `user${Math.floor(Math.random()*1000)}@example.com`,
                plan: Math.random() > 0.5 ? 'Plano Pro' : 'Plano Básico',
                status: LogStatus.Processing
            };
            setLogs(prev => [newLog, ...prev]);

            setTimeout(() => {
                setLogs(prev => prev.map(l => l.id === newLog.id ? {...l, status: Math.random() > 0.2 ? LogStatus.Success : LogStatus.Failed, error: l.status === LogStatus.Failed ? 'Timeout' : undefined } : l));
            }, 3000);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-white">Registros</h2>
        <div className="bg-card p-3 rounded-2xl border border-border flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-[11px] font-bold text-text-secondary uppercase tracking-tight truncate">
                Webhook: <code className="text-primary font-mono lowercase">...{WEBHOOK_URL.slice(-12)}</code>
             </p>
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-sidebar/50">
                <tr>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Status</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Cliente</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Produto</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest">Origem</th>
                <th className="p-6 text-[11px] font-black text-text-secondary uppercase tracking-widest text-right">Hora</th>
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
