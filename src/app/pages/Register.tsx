import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/auth';

export default function Register() {
  const [dsNome, setNome] = useState('');
  const [dsEmail, setEmail] = useState('');
  const [dsSenha, setPassword] = useState('');
  const [dsConfirmaSenha, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!dsNome || !dsEmail || !dsSenha || !dsConfirmaSenha) {
      setError('Preencha todos os campos.');
      return;
    }

    if (dsSenha !== dsConfirmaSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    if (dsSenha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await authService.register(dsNome, dsEmail, dsSenha);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#165C7D';
    e.target.style.boxShadow = '0 0 0 3px #E1EBF0';
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#E0E0E0';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Painel Esquerdo — Visual */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d3d54 0%, #165c7d 40%, #1a6e96 70%, #2183b2 100%)',
        }}
      >
        {/* Padrão geométrico de fundo */}
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexgrid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M28 4L52 18V46L28 60L4 46V18Z" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexgrid)" />
          </svg>
        </div>

        {/* Brilho decorativo */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #93c5fd, transparent 70%)' }}
        />
        <div
          className="absolute bottom-10 -left-24 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #bfdbfe, transparent 70%)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Gestão de Bens</span>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 space-y-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L24 6L42 18V42H30V30H18V42H6V18Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Crie sua conta<br />
              <span style={{ color: '#a8d4e6' }}>e comece agora.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xs" style={{ color: '#cce8f4' }}>
              Controle imóveis, contratos, inquilinos e financeiro em um só lugar.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Imóveis', value: '1.2k+' },
              { label: 'Contratos', value: '98%' },
              { label: 'Suporte', value: '24/7' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-4 text-center border border-white/10 backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <div className="text-white font-bold text-xl">{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: '#a8d4e6' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className="relative z-10">
          <p className="text-sm" style={{ color: '#a8d4e6' }}>© 2026 Gestão de Bens</p>
        </div>
      </div>

      {/* Painel Direito — Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#FAFAFA]">
        {/* Header mobile */}
        <div className="lg:hidden flex items-center gap-2 px-6 py-5 bg-white border-b border-gray-100">
          <span className="font-bold" style={{ color: '#165c7d' }}>Gestão de Bens</span>
        </div>

        {/* Formulário centrado */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">

            {/* Cabeçalho */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
                Criar conta
              </h2>
              <p className="text-base" style={{ color: '#6A6A6A' }}>
                Preencha os dados abaixo para se cadastrar.
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Nome */}
              <div className="space-y-2">
                <label className="text-sm font-semibold" style={{ color: '#474747' }} htmlFor="nome">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <User className="w-4 h-4" style={{ color: '#B2B2B2' }} />
                  </div>
                  <input
                    id="nome"
                    type="text"
                    autoComplete="name"
                    value={dsNome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm placeholder-gray-400 transition-all outline-none"
                    style={{ borderColor: '#E0E0E0', background: '#FFFFFF', color: '#1A1A1A' }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                </div>
              </div>

              {/* E-mail */}
              <div className="space-y-2">
                <label className="text-sm font-semibold" style={{ color: '#474747' }} htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Mail className="w-4 h-4" style={{ color: '#B2B2B2' }} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={dsEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm placeholder-gray-400 transition-all outline-none"
                    style={{ borderColor: '#E0E0E0', background: '#FFFFFF', color: '#1A1A1A' }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-sm font-semibold" style={{ color: '#474747' }} htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Lock className="w-4 h-4" style={{ color: '#B2B2B2' }} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={dsSenha}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm placeholder-gray-400 transition-all outline-none"
                    style={{ borderColor: '#E0E0E0', background: '#FFFFFF', color: '#1A1A1A' }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors"
                    style={{ color: '#B2B2B2' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <label className="text-sm font-semibold" style={{ color: '#474747' }} htmlFor="confirm-password">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Lock className="w-4 h-4" style={{ color: '#B2B2B2' }} />
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={dsConfirmaSenha}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm placeholder-gray-400 transition-all outline-none"
                    style={{ borderColor: '#E0E0E0', background: '#FFFFFF', color: '#1A1A1A' }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors"
                    style={{ color: '#B2B2B2' }}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div
                  className="flex items-start gap-2.5 rounded-xl px-4 py-3 border"
                  style={{ background: '#FFEEF0', borderColor: '#FFDDE0' }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#E63946' }} />
                  <p className="text-sm" style={{ color: '#CC2E39' }}>{error}</p>
                </div>
              )}

              {/* Sucesso */}
              {success && (
                <div
                  className="flex items-start gap-2.5 rounded-xl px-4 py-3 border"
                  style={{ background: '#EDFAF4', borderColor: '#C3EDD8' }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#1A7F4B' }} />
                  <p className="text-sm" style={{ color: '#1A7F4B' }}>Conta criada com sucesso! Redirecionando...</p>
                </div>
              )}

              {/* Botão Criar conta */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200"
                style={{
                  background: loading || success ? '#5F92A9' : '#165C7D',
                  cursor: loading || success ? 'not-allowed' : 'pointer',
                  boxShadow: loading || success ? 'none' : '0 4px 14px -3px rgba(22,92,125,0.45)',
                }}
                onMouseEnter={e => {
                  if (!loading && !success) {
                    (e.currentTarget as HTMLElement).style.background = '#124A65';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!loading && !success) {
                    (e.currentTarget as HTMLElement).style.background = '#165C7D';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar conta
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#E0E0E0' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 text-gray-400 bg-[#FAFAFA]">ou</span>
              </div>
            </div>

            {/* Voltar para login */}
            <div className="text-center">
              <p className="text-sm" style={{ color: '#6A6A6A' }}>
                Já tem uma conta?{' '}
                <a
                  href="/login"
                  className="font-semibold transition-colors"
                  style={{ color: '#165C7D' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#124A65')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#165C7D')}
                >
                  Entrar
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
