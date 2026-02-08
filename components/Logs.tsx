
import React, { useState, useEffect } from 'react';
import { MOCK_LOGS, WEBHOOK_URL } from '../constants';
import type { LogEntry } from '../types';
import { LogStatus } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import ClockIcon from './icons/ClockIcon';

const StatusBadge: React.FC<{ status: LogStatus }> = ({ status }) => {
  const baseClasses = "flex items-center space-x-2 px-3 py-1 text-xs font-medium rounded-full";
  switch (status) {
    case LogStatus.Success:
      return <div className={`${baseClasses} bg-green-900 text-green-300`}><CheckCircleIcon className="w-4 h-4" /><span>{status}</span></div>;
    case LogStatus.Failed:
      return <div className={`${baseClasses} bg-red-900 text-red-300`}><XCircleIcon className="w-4 h-4" /><span>{status}</span></div>;
    case LogStatus.Processing:
      return <div className={`${baseClasses} bg-yellow-900 text-yellow-300`}><ClockIcon className="w-4 h-4" /><span>{status}</span></div>;
    default:
      return null;
  }
};

const Logs: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);

    useEffect(() => {
        // Simulate new logs appearing
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

            // Simulate status change
            setTimeout(() => {
                setLogs(prev => prev.map(l => l.id === newLog.id ? {...l, status: Math.random() > 0.2 ? LogStatus.Success : LogStatus.Failed, error: l.status === LogStatus.Failed ? 'Timeout do processador de pagamento' : undefined } : l));
            }, 3000);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-text-primary">Logs de Ativação</h2>
      
      <div className="bg-sidebar p-4 rounded-lg border border-border">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary flex-shrink-0" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm text-text-secondary">
            Sua URL de webhook única para todas as integrações é:
            <code className="bg-background text-primary px-2 py-1 rounded-md ml-2 font-mono text-xs break-all">
                {WEBHOOK_URL}
            </code>
            </p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-sidebar">
                <tr>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Status</th>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Usuário</th>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Plano</th>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Plataforma</th>
                <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider">Hora</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {logs.map((log) => (
                <tr key={log.id} className="hover:bg-sidebar/50">
                    <td className="p-4"><StatusBadge status={log.status} /></td>
                    <td className="p-4 text-sm text-text-primary">{log.userEmail}</td>
                    <td className="p-4 text-sm text-text-secondary">{log.plan}</td>
                    <td className="p-4 text-sm text-text-secondary">{log.platform}</td>
                    <td className="p-4 text-sm text-text-secondary">{formatTime(log.timestamp)}</td>
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
   