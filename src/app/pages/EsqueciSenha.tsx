import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth';

type Step = 'email' | 'codigo' | 'senha';

const inputStyle = { borderColor: '#E0E0E0', background: '#FFFFFF', color: '#1A1A1A' };
const focusBorder = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = '#165C7D';
  e.target.style.boxShadow = '0 0 0 3px #E1EBF0';
};
const blurBorder = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = '#E0E0E0';
  e.target.style.boxShadow = 'none';
};

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);

  const handleEnviarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Informe seu e-mail.'); return; }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setStep('codigo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar o código.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!codigo) { setError('Informe o código recebido por e-mail.'); return; }
    setLoading(true);
    try {
      await authService.verifyResetCode(email, codigo);
      setStep('senha');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!novaSenha || !confirmarSenha) { setError('Preencha os dois campos de senha.'); return; }
    if (novaSenha.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }
    if (novaSenha !== confirmarSenha) { setError('As senhas não coincidem.'); return; }
    setLoading(true);
    try {
      await authService.resetPassword(email, codigo, novaSenha);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  const handleReenviarCodigo = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível reenviar o código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Painel Esquerdo */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d3d54 0%, #165c7d 40%, #1a6e96 70%, #2183b2 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexgrid2" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M28 4L52 18V46L28 60L4 46V18Z" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexgrid2)" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <KeyRound className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Gestão de Bens</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Recupere o<br /><span style={{ color: '#a8d4e6' }}>acesso à sua conta.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xs" style={{ color: '#cce8f4' }}>
            Vamos enviar um código de verificação para o seu e-mail.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-sm" style={{ color: '#a8d4e6' }}>© 2026 Gestão de Bens</p>
        </div>
      </div>

      {/* Painel Direito */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#FAFAFA]">
        <div className="lg:hidden flex items-center gap-2 px-6 py-5 bg-white border-b border-gray-100">
          <span className="font-bold text-gray-900" style={{ color: '#165c7d' }}>Gestão de Bens</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">

            <div className="space-y-2">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium mb-2" style={{ color: '#165C7D' }}>
                <ArrowLeft className="w-4 h-4" /> Voltar para login
              </Link>
              <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
                {step === 'email' && 'Esqueceu sua senha?'}
                {step === 'codigo' && 'Verifique seu e-mail'}
                {step === 'senha' && 'Crie uma nova senha'}
              </h2>
              <p className="text-base" style={{ color: '#6A6A6A' }}>
                {step === 'email' && 'Informe seu e-mail para receber um código de verificação.'}
                {step === 'codigo' && <>Enviamos um código de 6 dígitos para <strong>{email}</strong>.</>}
                {step === 'senha' && 'Escolha uma nova senha para sua conta.'}
              </p>
            </div>

            {step === 'email' && (
              <form onSubmit={handleEnviarCodigo} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold" style={{ color: '#474747' }} htmlFor="email">E-mail</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Mail className="w-4 h-4" style={{ color: '#B2B2B2' }} />
                    </div>
                    <input
                      id="email" type="email" autoComplete="email" value={email}
                      onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm placeholder-gray-400 transition-all outline-none"
                      style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}
                    />
                  </div>
                </div>

                {error && <ErrorBox message={error} />}

                <SubmitButton loading={loading} label="Enviar código" loadingLabel="Enviando..." />
              </form>
            )}

            {step === 'codigo' && (
              <form onSubmit={handleVerificarCodigo} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold" style={{ color: '#474747' }} htmlFor="codigo">Código de verificação</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <KeyRound className="w-4 h-4" style={{ color: '#B2B2B2' }} />
                    </div>
                    <input
                      id="codigo" type="text" inputMode="numeric" maxLength={6} value={codigo}
                      onChange={e => setCodigo(e.target.value.replace(/\D/g, ''))} placeholder="000000"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm tracking-widest placeholder-gray-400 transition-all outline-none"
                      style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}
                    />
                  </div>
                </div>

                {error && <ErrorBox message={error} />}

                <SubmitButton loading={loading} label="Verificar código" loadingLabel="Verificando..." />

                <button
                  type="button" onClick={handleReenviarCodigo} disabled={loading}
                  className="w-full text-center text-sm font-medium"
                  style={{ color: '#165C7D' }}
                >
                  Reenviar código
                </button>
              </form>
            )}

            {step === 'senha' && (
              <form onSubmit={handleRedefinirSenha} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold" style={{ color: '#474747' }} htmlFor="novaSenha">Nova senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Lock className="w-4 h-4" style={{ color: '#B2B2B2' }} />
                    </div>
                    <input
                      id="novaSenha" type={showSenha ? 'text' : 'password'} autoComplete="new-password"
                      value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm placeholder-gray-400 transition-all outline-none"
                      style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}
                    />
                    <button type="button" onClick={() => setShowSenha(v => !v)} tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5" style={{ color: '#B2B2B2' }}>
                      {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold" style={{ color: '#474747' }} htmlFor="confirmarSenha">Confirmar nova senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Lock className="w-4 h-4" style={{ color: '#B2B2B2' }} />
                    </div>
                    <input
                      id="confirmarSenha" type={showSenha ? 'text' : 'password'} autoComplete="new-password"
                      value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm placeholder-gray-400 transition-all outline-none"
                      style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}
                    />
                  </div>
                </div>

                {error && <ErrorBox message={error} />}

                <SubmitButton loading={loading} label="Redefinir senha" loadingLabel="Salvando..." />
              </form>
            )}

            {/* Indicador de etapas */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {(['email', 'codigo', 'senha'] as Step[]).map(s => (
                <div key={s} className="h-1.5 rounded-full transition-all"
                  style={{ width: s === step ? 28 : 8, background: s === step ? '#165C7D' : '#E0E0E0' }} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 border" style={{ background: '#FFEEF0', borderColor: '#FFDDE0' }}>
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#E63946' }} />
      <p className="text-sm" style={{ color: '#CC2E39' }}>{message}</p>
    </div>
  );
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit" disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200"
      style={{
        background: loading ? '#5F92A9' : '#165C7D',
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: loading ? 'none' : '0 4px 14px -3px rgba(22,92,125,0.45)',
      }}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {loadingLabel}
        </>
      ) : (
        <>
          {label} <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
