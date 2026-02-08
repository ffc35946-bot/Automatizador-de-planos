
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { LogStatus, type LogEntry, type User } from '../types';
import { TrendingUp, CheckCircle, XCircle, Activity, LayoutDashboard, Rocket } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('saas_active_session');
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
      const userLogs = localStorage.getItem(`logs_${userData.email}`);
      if (userLogs) {
        setLogs(JSON.parse(userLogs).map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) })));
      }
    }
  }, []);

  const totalActivations = logs.length;
  const successfulActivations = logs.filter(log => log.status === LogStatus.Success).length;
  const failedActivations = logs.filter(log => log.status === LogStatus.Failed).length;
  const successRate = totalActivations > 0 ? ((successfulActivations / totalActivations) * 100).toFixed(1) : '0';

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
        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 ring-1 ring-primary/20">
          <Rocket size={48} className="text-primary animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Bem-vindo, {user?.name?.split(' ')[0]}!</h2>
        <p className="text-text-secondary max-w-md leading-relaxed mb-8">
          Seu painel está pronto, mas ainda não recebemos nenhuma venda. Conecte um checkout na aba <strong>Integrações</strong> para começar.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
           <div className="bg-card/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">1</div>
              <span className="text-xs font-bold text-white text-left">Configure seu Endpoint SaaS</span>
           </div>
           <div className="bg-card/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">2</div>
              <span className="text-xs font-bold text-white text-left">Conecte o Webhook no Checkout</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Olá, {user?.name?.split(' ')[0]}</h2>
          <p className="text-text-secondary mt-1 font-medium text-sm">Resumo operacional das últimas 24h.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest w-fit">
          <Activity size={16} />
          <span>Monitoramento Ativo</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl">
          <TrendingUp size={20} className="text-primary mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{totalActivations}</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Vendas Totais</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl">
          <CheckCircle size={20} className="text-secondary mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{successfulActivations}</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Ativados</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl">
          <XCircle size={20} className="text-red-500 mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{failedActivations}</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Erros</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl">
          <LayoutDashboard size={20} className="text-yellow-400 mb-4" />
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{successRate}%</p>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Taxa de Sucesso</p>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-border shadow-2xl p-6 md:p-8">
        <h3 className="text-xl font-black text-white mb-8">Performance do Funil</h3>
        <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="success" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
                    <Area type="monotone" dataKey="failed" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
