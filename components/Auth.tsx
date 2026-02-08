
import React, { useState } from 'react';
import { Mail, Phone, Lock, UserPlus, LogIn, AlertCircle, CheckCircle2, LifeBuoy, Zap, ShieldCheck, User as UserIcon } from 'lucide-react';
import type { User } from '../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getUsers = (): User[] => {
    const users = localStorage.getItem('saas_users');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (user: User) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('saas_users', JSON.stringify(users));
    
    // Inicializa dados vazios específicos para este usuário
    localStorage.setItem(`logs_${user.email}`, JSON.stringify([]));
    localStorage.setItem(`integrations_${user.email}`, JSON.stringify([]));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const users = getUsers();

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setSuccess('Acesso concedido. Bem-vindo!');
        setTimeout(() => onLoginSuccess(user), 800);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else {
      if (!name || !email || !phone || !password) {
        setError('Todos os campos são obrigatórios.');
        return;
      }
      if (phone.length !== 11) {
        setError('Telefone inválido (use DDD + Número).');
        return;
      }
      if (users.some(u => u.email === email)) {
        setError('Este e-mail já está em uso.');
        return;
      }
      
      const newUser = { name, email, phone, password };
      saveUser(newUser);
      setSuccess('Conta criada com sucesso!');
      setTimeout(() => setIsLogin(true), 1200);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px] animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-xl mb-6 ring-1 ring-primary/20 shadow-inner">
            <LifeBuoy className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Plan Automator</h1>
          <p className="text-text-secondary font-medium text-sm">A solução definitiva para ativação de micro-SaaS</p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-shake text-sm font-semibold">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1.5 animate-slide-down">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5 animate-slide-down">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1">WhatsApp</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-background/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
                    placeholder="11999999999"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              {isLogin ? <span>Entrar Agora</span> : <span>Criar Minha Conta</span>}
              {isLogin ? <LogIn size={20} /> : <Zap size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              {isLogin ? "Não tem uma conta? " : "Já possui acesso? "}
              <span className="text-primary font-bold">{isLogin ? "Cadastre-se" : "Login"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
