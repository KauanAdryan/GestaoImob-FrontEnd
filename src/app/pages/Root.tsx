import { Outlet, useNavigate, useLocation } from 'react-router';
import { Sun, Moon, Plus, ChevronDown, LogOut, LayoutDashboard, Building2, Users } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { authService } from '../../services/auth';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/dashboard',   label: 'Dashboard',      icon: LayoutDashboard },
    { href: '/gestao-bens', label: 'Gestão de Bens',  icon: Building2       },
    { href: '/clientes',    label: 'Clientes',        icon: Users           },
  ];

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const user = authService.getUser();

  const initials = user?.dsNome
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() ?? 'U';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 px-8"
      style={{
        background:   'var(--card)',
        borderBottom: '1px solid var(--border)',
        boxShadow:    '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Nome do sistema */}
      {/* Logo + separador + navegação */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--primary)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-base" style={{ color: 'var(--primary)' }}>
            Gestão de Bens
          </span>
        </div>

        {/* Separador vertical */}
        <div className="w-px h-6" style={{ background: 'var(--border)' }} />

        {/* Navegação */}
        <nav className="flex items-center gap-1">
          {navLinks.map(link => {
            const active = isActive(link.href);
            return (
              <button
                key={link.href}
                type="button"
                onClick={() => navigate(link.href)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-150"
                style={{
                  background: active ? 'var(--ailos-azul-50)' : 'transparent',
                  color:      active ? 'var(--primary)' : 'var(--ailos-cinza-600)',
                  fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2">

        {/* Cadastrar */}
        <button
          type="button"
          onClick={() => navigate('/gestao-bens/novo')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150"
          style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(22,92,125,0.25)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.opacity = '0.88';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <Plus className="w-4 h-4" />
          Cadastrar Imóvel
        </button>

        {/* Divisor */}
        <div className="w-px h-7 mx-1" style={{ background: 'var(--border)' }} />

        {/* Toggle tema */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className="p-2 rounded-xl transition-all duration-150"
          style={{ color: 'var(--ailos-cinza-600)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--ailos-cinza-600)';
          }}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Perfil */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(v => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-all duration-150"
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'var(--primary)' }}
            >
              {initials}
            </div>
            <span className="text-sm font-medium max-w-[140px] truncate" style={{ color: 'var(--foreground)' }}>
              {user?.dsNome ?? 'Usuário'}
            </span>
            <ChevronDown
              className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-150"
              style={{
                color: 'var(--ailos-cinza-500)',
                transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-xl border overflow-hidden"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', zIndex: 50 }}
            >
              <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: 'var(--primary)' }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                      {user?.dsNome ?? 'Usuário'}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {user?.dsEmail ?? ''}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                  style={{ color: 'var(--ailos-vermelho-500)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-vermelho-50)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <LogOut className="w-4 h-4" />
                  Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Root() {
  return (
    <div className="bg-background" style={{ minHeight: '100vh' }}>
      <Header />
      <main className="py-6 px-8">
        <Outlet />
      </main>
    </div>
  );
}
