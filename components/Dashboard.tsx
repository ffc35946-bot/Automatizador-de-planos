
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MOCK_LOGS } from '../constants';
import { LogStatus } from '../types';
import { TrendingUp, CheckCircle, XCircle, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const totalActivations = MOCK_LOGS.length;
  const successfulActivations = MOCK_LOGS.filter(log => log.status === LogStatus.Success).length;
  const failedActivations = MOCK_LOGS.filter(log => log.status === LogStatus.Failed).length;
  const successRate = totalActivations > 0 ? ((successfulActivations / totalActivations) * 100).toFixed(1) : '0';

  const chartData = MOCK_LOGS
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Estatísticas</h2>
          <p className="text-text-secondary mt-1 font-medium text-sm md:text-base">Métricas de ativação em tempo real.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest w-fit">
          <Activity size={16} />
          <span>Servidor Ativo</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:border-primary/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/20 rounded-xl text-primary"><TrendingUp size={20} /></div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{totalActivations}</p>
          <p className="text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-widest">Vendas</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:border-secondary/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-secondary/20 rounded-xl text-secondary"><CheckCircle size={20} /></div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{successfulActivations}</p>
          <p className="text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-widest">Ativos</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-500/20 rounded-xl text-red-500"><XCircle size={20} /></div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{failedActivations}</p>
          <p className="text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-widest">Falhas</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-border shadow-xl hover:border-yellow-400/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-400/20 rounded-xl text-yellow-400"><Activity size={20} /></div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white mb-1">{successRate}%</p>
          <p className="text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-widest">Saúde</p>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-border shadow-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-xl font-black text-white">Gráfico de Performance</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                <div className="w-2 h-2 rounded-full bg-secondary"></div> Sucessos
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> Falhas
            </div>
          </div>
        </div>
        <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '12px' }} 
                        itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="success" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSuccess)" />
                    <Area type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorFailed)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
