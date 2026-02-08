
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { LogStatus, IntegrationPlatform, type LogEntry, type User } from '../types';
import { TrendingUp, CheckCircle, XCircle, Activity, LayoutDashboard, Rocket, Zap, Wand2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

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
  }, []);

  const simulateSale = () => {
    if (!user) return;
    setIsSimulating(true);
    
    setTimeout(() => {
      const platforms = [IntegrationPlatform.Kirvano, IntegrationPlatform.Cakto, IntegrationPlatform.Kiwify];
      const plans = ['Plano VIP Mensal', 'Master Anual', 'Micro-SaaS Lite', 'Pro Lifetime'];
      const errors = [
        '401 Unauthorized: API Key do destino inválida',
        '404 Not Found: E-mail do cliente não existe na sua base',
        '500 Server Error: Timeout na resposta do seu Endpoint',
        'Mapeamento incorreto: Código "prod_99" não encontrado'
      ];
      
      const isSuccess = Math.random() > 0.3;
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        userEmail: `cliente_${Math.floor(Math.random() * 1000)}@exemplo.com`,
        plan: plans[Math.floor(Math.random() * plans.length)],
        status: isSuccess ? LogStatus.Success : LogStatus.Failed,
        error: isSuccess ? undefined : errors[Math.floor(Math.random() * errors.length)]
      };

      const existingLogs = JSON.parse(localStorage.getItem(`logs_${user.email}`) || '[]');
      const updatedLogs = [newLog, ...existingLogs].slice(0, 50); // Mantém apenas os 50 mais recentes
      localStorage.setItem(`logs_${user.email}`, JSON.stringify(updatedLogs));
      
      setLogs(updatedLogs.map(l => ({ ...l, timestamp: new Date(l.timestamp) })));
      setIsSimulating(false);
    }, 800);
  };

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
          Seu painel está pronto, mas ainda não recebemos nenhuma venda. Você pode configurar uma integração real ou simular agora para ver como funciona.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
           <button 
             onClick={simulateSale}
             disabled={isSimulating}
             className="flex-1 bg-primary hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
           >
             {isSimulating ? <Activity className="animate-spin" size={16} /> : <Zap size={16} />}
             Simular Primeira Venda
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Olá, {user?.name?.split(' ')[0]}</h2>
          <p className="text-text-secondary mt-1 font-medium text-sm">Resumo operacional das últimas 24h.</p>
        </div>
        <button 
          onClick={simulateSale}
          disabled={isSimulating}
          className="bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 px-6 py-3 rounded-2xl flex items-center justify-center gap-3 text-secondary font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
        >
          {isSimulating ? <Activity size={16} className="animate-spin" /> : <Wand2 size={16} />}
          <span>Simular Venda</span>
        </button>
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
          <Activity size={20} className="text-yellow-400 mb-4" />
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
