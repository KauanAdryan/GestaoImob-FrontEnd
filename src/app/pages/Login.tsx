import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Building2, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    // Simula autenticação
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);

    // Exemplo de erro de autenticação:
    if (password !== '123456') {
      setError('E-mail ou senha incorretos. Tente novamente.');
    } else {
      navigate('/gestao-bens');
    }
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
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Círculos decorativos */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #93c5fd, transparent)' }}
        />
        <div
          className="absolute bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #bfdbfe, transparent)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">GestãoImob</span>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 space-y-8">
          {/* Ícone de destaque */}
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
            <Building2 className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Gestão de imóveis<br />
              <span className="text-[#a8d4e6]">simplificada.</span>
            </h1>
            <p className="text-[#cce8f4] text-lg leading-relaxed max-w-xs">
              Controle imóveis, contratos, inquilinos e financeiro em um só lugar.
            </p>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Imóveis', value: '1.2k+' },
              { label: 'Contratos', value: '98%' },
              { label: 'Suporte', value: '24/7' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center"
              >
                <div className="text-white font-bold text-xl">{stat.value}</div>
                <div className="text-[#a8d4e6] text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className="relative z-10">
          <p className="text-[#a8d4e6] text-sm">© 2026 ProjetoSenac. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Painel Direito — Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gray-50">
        {/* Header mobile */}
        <div className="lg:hidden flex items-center gap-2 px-6 py-5 bg-white border-b border-gray-100">
          <Building2 className="w-6 h-6 text-[#165c7d]" />
          <span className="font-bold text-gray-900">GestãoImob</span>
        </div>

        {/* Formulário centrado */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">

            {/* Cabeçalho */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bem-vindo de volta</h2>
              <p className="text-gray-500 text-base">Entre com suas credenciais para continuar.</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo E-mail */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#165c7d] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#165c7d] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Lembrar-me e Esqueci a senha */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        rememberMe ? 'bg-[#165c7d] border-blue-600' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {rememberMe && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    Lembrar de mim
                  </span>
                </label>
                <a href="#" className="text-sm text-[#165c7d] hover:text-[#0f4460] font-medium transition-colors">
                  Esqueci a senha
                </a>
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Botão de Entrar */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 ${
                  loading
                    ? 'bg-[#5b9ab5] cursor-not-allowed'
                    : 'bg-[#165c7d] hover:bg-[#0f4460] active:scale-[0.98] shadow-sm hover:shadow-md'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-gray-50 text-gray-400">ou</span>
              </div>
            </div>

            {/* Solicitar Acesso */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Não tem uma conta?{' '}
                <a href="#" className="text-[#165c7d] hover:text-[#0f4460] font-semibold transition-colors">
                  Solicitar acesso
                </a>
              </p>
            </div>

            {/* Dica de credenciais para demo */}
            <div className="bg-[#eef7fb] border border-[#c2dfec] rounded-xl px-4 py-3">
              <p className="text-xs text-[#165c7d] font-medium mb-1">🔑 Credenciais de demonstração</p>
              <p className="text-xs text-[#165c7d]">E-mail: <span className="font-mono">admin@gestao.com</span></p>
              <p className="text-xs text-[#165c7d]">Senha: <span className="font-mono">123456</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}