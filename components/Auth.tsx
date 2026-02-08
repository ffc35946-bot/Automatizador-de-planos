
import React, { useState, useEffect } from 'react';
import { Mail, Phone, Lock, UserPlus, LogIn, AlertCircle, CheckCircle2, LifeBuoy } from 'lucide-react';
import type { User } from '../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Simulação de banco de dados local
  const getUsers = (): User[] => {
    const users = localStorage.getItem('saas_users');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (user: User) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('saas_users', JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const users = getUsers();

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setSuccess('Login realizado com sucesso!');
        setTimeout(() => onLoginSuccess(user), 1000);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else {
      // Cadastro
      if (!email || !phone || !password) {
        setError('Por favor, preencha todos os campos.');
        return;
      }

      const emailExists = users.some(u => u.email === email);
      if (emailExists) {
        setError('Esta conta já existe. Tente fazer login.');
        return;
      }

      const newUser: User = { email, phone, password };
      saveUser(newUser);
      setSuccess('Conta criada com sucesso!');
      setTimeout(() => {
        setIsLogin(true);
        setSuccess(null);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <LifeBuoy className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Automatizador SaaS
          </h1>
          <p className="text-text-secondary mt-2">
            {isLogin ? 'Bem-vindo de volta!' : 'Comece a automatizar suas vendas hoje.'}
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 animate-shake">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 size={20} />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 px-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="animate-slide-down">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 px-1">WhatsApp / Telefone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    required={!isLogin}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 px-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {isLogin ? (
                <>
                  <LogIn size={20} />
                  <span>Entrar no Painel</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Criar Minha Conta</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccess(null);
                }}
                className="ml-2 text-primary font-bold hover:underline underline-offset-4"
              >
                {isLogin ? 'Cadastre-se' : 'Faça Login'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-500 mt-8 uppercase tracking-widest font-medium opacity-50">
          &copy; 2026 Automatizador de Planos SaaS • Seguro & Encriptado
        </p>
      </div>
    </div>
  );
};

export default Auth;
