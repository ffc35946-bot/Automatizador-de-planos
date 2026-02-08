
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { LogStatus, SubscriptionStatus, type LogEntry, type User } from '../types';
import { TrendingUp, Users, XCircle, RefreshCw, Rocket, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const loadLogs = (email: string) => {
    const userLogs = localStorage.getItem(`logs_${email}`);
    if (userLogs) {
      setLogs(JSON.parse(userLogs).map((l: any) => ({ 
        ...l, 
        timestamp: new Date(l.timestamp),
        expiryDate: l.expiryDate ? new Date(l.expiryDate) : undefined
      })));
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('saas_active_session');
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
      loadLogs(userData.email);
    }
    const interval = setInterval(() => {
        if (session) {
            const userData = JSON.parse(session);
            loadLogs(userData.email);
        }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Lógica Funcional: Calcula o estado atual de cada usuário único
  const now = new Date();
  const userAccessState = logs.reduce((acc, log) => {
    const email = log.userEmail;
    // Se não temos registro deste e-mail ou este log é mais recente
    if (!acc[email] || log.timestamp > acc[email].timestamp) {
      acc[email] = log;
    }
    return acc;
  }, {} as Record<string, LogEntry>);

  // Fix: Explicitly type uniqueUsers as LogEntry[] to resolve 'unknown' property access errors
  const uniqueUsers: LogEntry[] = Object.values(userAccessState);
  
  // Um usuário está ativo se o último status for Active/Canceled E não expirou por data
  const currentActiveUsers = uniqueUsers.filter(log => {
    const hasValidStatus = log.subStatus === SubscriptionStatus.Active || log.subStatus === SubscriptionStatus.Canceled;
    const isNotExpired = !log.expiryDate || log.expiryDate > now;
    return hasValidStatus && isNotExpired;
  }).length;

  const totalChurnedUsers = uniqueUsers.filter(log => {
    const isExpiredStatus = log.subStatus === SubscriptionStatus.Expired;
    const isDateExpired = log.expiryDate && log.expiryDate < now;
    const isCanceledAndExpired = log.subStatus === SubscriptionStatus.Canceled && log.expiryDate && log.expiryDate < now;
    return isExpiredStatus || isDateExpired || isCanceledAndExpired;
  }).length;

  const churnRate = uniqueUsers.length > 0 ? ((totalChurnedUsers / uniqueUsers.length) * 100).toFixed(1) : '0';

  const chartData = [...logs]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map(log => ({
      name: log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      active: log.subStatus === SubscriptionStatus.Active ? 1 : 0,
      churn: (log.subStatus === SubscriptionStatus.Canceled || log.subStatus === SubscriptionStatus.Expired) ? 1 : 0,
    }))
    .reduce((acc, current) => {
        const last = acc[acc.length - 1];
        if(last && last.name === current.name) {
            last.active += current.active;
            last.churn += current.churn;
        } else {
            acc.push(current);
        }
        return acc;
    }, [] as {name: string; active: number; churn: number}[]);

  if (logs.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-2xl">
          <Rocket size={48} className="text-primary animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Escutando Webhooks...</h2>
        <p className="text-text-secondary max-w-md leading-relaxed mb-8">
          Sua infraestrutura de <strong>ativação e bloqueio</strong> de e-mails está pronta. O sistema saberá exatamente quando cortar o acesso.
        </p>
        <div className="p-4 bg-sidebar/50 border border-white/5 rounded-2xl flex items-center gap-4 text-left max-w-lg">
           <div className="p-3 bg-secondary/10 rounded-xl"><ShieldCheck size={20} className="text-secondary" /></div>
           <div><p className="text-xs font-bold text-white">Lógica de Recorrência Ativa</p><p className="text-[10px] text-text-secondary">Assinaturas vencidas perdem acesso ao SaaS automaticamente.</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Monitor de Retenção</h2>
          <p className="text-text-secondary mt-1 font-medium text-sm">Visão em tempo real de quem tem acesso agora.</p>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 bg-secondary/10 border border-secondary/20 rounded-full">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Analítico Funcional</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-card/50 p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:border-primary/30 transition-all">
          <UserCheck size={20} className="text-primary mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{currentActiveUsers}</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Usuários com Acesso</p>
        </div>
        <div className="bg-card/50 p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:border-red-500/30 transition-all">
          <AlertTriangle size={20} className="text-red-500 mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{totalChurnedUsers}</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Acessos Revogados</p>
        </div>
        <div className="bg-card/50 p-5 md:p-6 rounded-[2rem] border border-border shadow-xl">
          <RefreshCw size={20} className="text-yellow-400 mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{churnRate}%</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Churn Rate (Real)</p>
        </div>
        <div className="bg-card/50 p-5 md:p-6 rounded-[2rem] border border-border shadow-xl">
          <TrendingUp size={20} className="text-secondary mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{uniqueUsers.length}</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Total Clientes Únicos</p>
        </div>
      </div>

      <div className="bg-card/30 rounded-[2.5rem] border border-border shadow-2xl p-6 md:p-8">
        <h3 className="text-xl font-black text-white mb-8">Saúde das Assinaturas</h3>
        <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px' }} />
                    <Area type="monotone" dataKey="active" stroke="#6366f1" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} />
                    <Area type="monotone" dataKey="churn" stroke="#ef4444" fillOpacity={1} fill="url(#colorChurn)" strokeWidth={3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;