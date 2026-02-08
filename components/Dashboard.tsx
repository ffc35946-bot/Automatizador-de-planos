
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { LogStatus, type LogEntry, type User } from '../types';
import { TrendingUp, CheckCircle, XCircle, Activity, Rocket, Zap, ShieldCheck } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const loadLogs = (email: string) => {
    const userLogs = localStorage.getItem(`logs_${email}`);
    if (userLogs) {
      setLogs(JSON.parse(userLogs).map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) })));
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('saas_active_session');
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
      loadLogs(userData.email);
    }
    
    // Auto-refresh simulado para dar vida ao app
    const interval = setInterval(() => {
        if (session) {
            const userData = JSON.parse(session);
            loadLogs(userData.email);
        }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const totalActivations = logs.length;
  const successfulActivations = logs.filter(log => log.status === LogStatus.Success).length;
  const failedActivations = logs.filter(log => log.status === LogStatus.Failed).length;
  const successRate = totalActivations > 0 ? ((successfulActivations / totalActivations) * 100).toFixed(1) : '100';

  const chartData = [...logs]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map(log => ({
      name: log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      success: log.status === LogStatus.Success ? 1 : 0,
      failed: log.status === LogStatus.Failed ? 1 : 0,
    }))
    .reduce((acc, current) => {
        const last = acc[acc.length - 1];
        if(last && last.name === current.name) {
            last.success += current.success;
            last.failed += current.failed;
        } else {
            acc.push(current);
        }
        return acc;
    }, [] as {name: string; success: number; failed: number}[]);

  if (logs.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-2xl">
          <Rocket size={48} className="text-primary animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Tudo pronto para decolar, {user?.name?.split(' ')[0]}!</h2>
        <p className="text-text-secondary max-w-md leading-relaxed mb-8">
          Seu ecossistema está operando em <strong>Modo de Escuta</strong>. Conecte seu primeiro checkout e veja a mágica acontecer.
        </p>
        <div className="p-4 bg-sidebar/50 border border-white/5 rounded-2xl flex items-center gap-4 text-left max-w-lg">
           <div className="p-3 bg-secondary/10 rounded-xl">
              <ShieldCheck size={20} className="text-secondary" />
           </div>
           <div>
              <p className="text-xs font-bold text-white">Certificado de Autenticação Ativo</p>
              <p className="text-[10px] text-text-secondary">Seu webhook está protegido e aguardando tráfego SSL.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Status Operacional</h2>
          <p className="text-text-secondary mt-1 font-medium text-sm">Monitorando integrações em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 bg-secondary/10 border border-secondary/20 rounded-full shadow-lg shadow-secondary/5">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Sistemas Estáveis</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:scale-[1.02] transition-transform">
          <TrendingUp size={20} className="text-primary mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{totalActivations}</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Ativações Totais</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:scale-[1.02] transition-transform">
          <CheckCircle size={20} className="text-secondary mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{successfulActivations}</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Sucesso</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:scale-[1.02] transition-transform">
          <XCircle size={20} className="text-red-500 mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{failedActivations}</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Falhas</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:scale-[1.02] transition-transform">
          <Activity size={20} className="text-yellow-400 mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{successRate}%</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Taxa de Conversão</p>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-border shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white">Volume de Ativação</h3>
            <div className="flex gap-4">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-secondary"></div><span className="text-[9px] uppercase font-black text-gray-500 tracking-tighter">Sucesso</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[9px] uppercase font-black text-gray-500 tracking-tighter">Falha</span></div>
            </div>
        </div>
        <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', fontSize: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
                    <Area type="monotone" dataKey="success" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={3} />
                    <Area type="monotone" dataKey="failed" stroke="#ef4444" fillOpacity={1} fill="url(#colorFailed)" strokeWidth={3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
