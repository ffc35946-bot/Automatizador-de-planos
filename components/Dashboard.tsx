
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from './Card';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Painel de Controle</h2>
          <p className="text-text-secondary mt-1">Acompanhe a saúde das suas automações em tempo real.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2 text-primary font-medium text-sm">
          <Activity size={16} />
          <span>Sistemas Operacionais</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-sidebar to-card p-6 rounded-2xl border border-border/50 shadow-xl group hover:border-primary/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><TrendingUp size={24} /></div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Volume</span>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{totalActivations}</p>
          <p className="text-text-secondary text-sm">Total de Vendas</p>
        </div>

        <div className="bg-gradient-to-br from-sidebar to-card p-6 rounded-2xl border border-border/50 shadow-xl group hover:border-secondary/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-secondary/20 rounded-lg text-secondary"><CheckCircle size={24} /></div>
            <span className="text-xs font-bold text-secondary tracking-widest uppercase">Ativos</span>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{successfulActivations}</p>
          <p className="text-text-secondary text-sm">Sucessos na API</p>
        </div>

        <div className="bg-gradient-to-br from-sidebar to-card p-6 rounded-2xl border border-border/50 shadow-xl group hover:border-red-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg text-red-500"><XCircle size={24} /></div>
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Falhas</span>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{failedActivations}</p>
          <p className="text-text-secondary text-sm">Contas Inexistentes</p>
        </div>

        <div className="bg-gradient-to-br from-sidebar to-card p-6 rounded-2xl border border-border/50 shadow-xl group hover:border-yellow-400/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400"><Activity size={24} /></div>
            <span className="text-xs font-bold text-yellow-400 tracking-widest uppercase">Saúde</span>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{successRate}%</p>
          <p className="text-text-secondary text-sm">Taxa de Conversão</p>
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Fluxo de Requisições</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full bg-secondary"></div> Sucesso</div>
            <div className="flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full bg-red-500"></div> Falha</div>
          </div>
        </div>
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '12px' }} />
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
