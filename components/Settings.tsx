
import React, { useState, useEffect } from 'react';
import Card from './Card';
import { User as UserIcon, Phone, Mail, Lock, ShieldCheck, Save, CheckCircle, Bell, Laptop, AlertTriangle, ArrowLeft, Trash2, RefreshCcw } from 'lucide-react';
import type { User } from '../types';

const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Estados para exclusão de dados
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('saas_active_session');
    if (session) {
      const userData = JSON.parse(session);
      setUser(userData);
      setName(userData.name || '');
      setPhone(userData.phone || '');
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);

    const updatedUser = { ...user, name, phone };
    
    const allUsers = JSON.parse(localStorage.getItem('saas_users') || '[]');
    const updatedUsersList = allUsers.map((u: User) => u.email === user.email ? updatedUser : u);
    localStorage.setItem('saas_users', JSON.stringify(updatedUsersList));
    
    localStorage.setItem('saas_active_session', JSON.stringify(updatedUser));
    setUser(updatedUser);

    setTimeout(() => {
      setIsSaving(false);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    }, 800);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (currentPassword !== user.password) {
      setMessage({ type: 'error', text: 'Senha atual incorreta.' });
      return;
    }

    const updatedUser = { ...user, password: newPassword };
    const allUsers = JSON.parse(localStorage.getItem('saas_users') || '[]');
    const updatedUsersList = allUsers.map((u: User) => u.email === user.email ? updatedUser : u);
    localStorage.setItem('saas_users', JSON.stringify(updatedUsersList));
    localStorage.setItem('saas_active_session', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    setCurrentPassword('');
    setNewPassword('');
    setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
  };

  const executeDataReset = () => {
    if (!user || deleteInput.toUpperCase() !== 'EXCLUIR') return;

    // Remove APENAS dados operacionais vinculados ao e-mail do usuário
    localStorage.removeItem(`logs_${user.email}`);
    localStorage.removeItem(`integrations_${user.email}`);
    localStorage.removeItem(`config_${user.email}`);
    localStorage.removeItem(`mappings_${user.email}`);

    // Feedback visual de sucesso
    setMessage({ type: 'success', text: 'Dados operacionais removidos. Sua conta permanece ativa.' });
    setShowDeleteConfirmation(false);
    setDeleteInput('');
    
    // Força um pequeno delay para o usuário ver o feedback antes de qualquer recarregamento opcional
    setTimeout(() => {
       window.location.hash = 'dashboard'; // Opcional: redireciona visualmente
    }, 1500);
  };

  if (showDeleteConfirmation) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-fade-in p-4">
        <div className="w-full max-w-lg bg-card border border-red-500/30 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Trash2 size={40} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Limpar Meus Dados?</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Sua conta <strong>continuará ativa</strong>, mas todos os seus Logs de vendas, configurações de integração e mapeamentos de planos serão apagados permanentemente.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary">
              Confirme digitando <span className="text-red-500">EXCLUIR</span> abaixo:
            </label>
            <input 
              type="text" 
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Digite EXCLUIR para confirmar"
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-4 text-center text-sm font-black text-white focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              onClick={() => { setShowDeleteConfirmation(false); setDeleteInput(''); }}
              className="flex items-center justify-center gap-2 py-4 px-6 bg-sidebar border border-border rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-card transition-all"
            >
              <ArrowLeft size={16} /> Voltar
            </button>
            <button 
              disabled={deleteInput.toUpperCase() !== 'EXCLUIR'}
              onClick={executeDataReset}
              className={`py-4 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                deleteInput.toUpperCase() === 'EXCLUIR' 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                  : 'bg-red-500/10 text-red-500/30 cursor-not-allowed border border-red-500/10'
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Configurações</h2>
        <p className="text-sm text-text-secondary mt-1">Gerencie sua identidade e preferências de segurança.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-slide-down ${message.type === 'success' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <ShieldCheck size={20} />}
          <span className="text-sm font-bold">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6 md:space-y-8">
          <Card title="Dados do Perfil" className="bg-card/40 border-border/50">
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500"><UserIcon size={18} /></div>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-xl pl-11 py-3 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5 opacity-60">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">E-mail (Permanente)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500"><Mail size={18} /></div>
                  <input type="text" readOnly value={user?.email || ''} className="w-full bg-background/30 border border-white/5 rounded-xl pl-11 py-3 text-sm text-gray-500 outline-none cursor-not-allowed" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">WhatsApp</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500"><Phone size={18} /></div>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-background/50 border border-white/10 rounded-xl pl-11 py-3 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-primary hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                {isSaving ? "Atualizando..." : "Salvar Alterações"}
                <Save size={18} />
              </button>
            </form>
          </Card>

          <Card title="Preferências" className="bg-card/40 border-border/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-background/30 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-primary" />
                  <span className="text-xs font-semibold text-white">Notificações de Venda</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-4 bg-background/30 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Laptop size={18} className="text-secondary" />
                  <span className="text-xs font-semibold text-white">Interface Compacta</span>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-secondary cursor-pointer" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6 md:space-y-8">
          <Card title="Segurança" className="bg-card/40 border-border/50">
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Senha Atual</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500"><Lock size={18} /></div>
                  <input 
                    type="password" 
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-xl pl-11 py-3 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Nova Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500"><ShieldCheck size={18} /></div>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-xl pl-11 py-3 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-sidebar border border-border/50 hover:bg-card text-white font-bold py-3.5 rounded-xl transition-all text-sm">
                Redefinir Senha
              </button>
            </form>
          </Card>

          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] space-y-4">
             <div className="flex items-center gap-3 text-red-400">
               <AlertTriangle size={20} />
               <h3 className="font-black text-xs uppercase tracking-wider">Zona Sensível</h3>
             </div>
             <p className="text-[11px] text-red-400/70 leading-relaxed font-medium">Esta opção limpa todo o histórico de operações (logs e conexões) sem afetar seu login.</p>
             <button 
              onClick={() => setShowDeleteConfirmation(true)}
              className="w-full py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
             >
                <RefreshCcw size={14} />
                Resetar Dados Operacionais
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
