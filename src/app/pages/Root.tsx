import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Building2, Users, FileText, DollarSign, Menu, X, ChevronRight, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

/* ──────────────────────────────────────────
 * Sidebar — Ailos Light
 * Background: azul-100 (#E1EBF0) com gradiente sutil
 * Nav ativo:  fundo branco + borda esq. azul-500 + sombra
 * Nav hover:  azul-50 (#F0F5F7)
 * Width:      280px
 * ────────────────────────────────────────── */
const SIDEBAR_BG     = 'linear-gradient(180deg, #E1EBF0 0%, #EEF4F7 100%)';
const SIDEBAR_BORDER = '#D2E2E8';   // azul-200
const NAV_INACTIVE   = '#474747';   // cinza-700
const NAV_HOVER_BG   = '#F0F5F7';  // azul-50
const NAV_HOVER_TEXT = '#124A65';  // azul-600
const NAV_ACTIVE_BG  = '#FFFFFF';
const NAV_ACTIVE_TXT = '#124A65';  // azul-600
const NAV_ACTIVE_BDR = '#165C7D';  // azul-500
const LOGO_COLOR     = '#165C7D';  // azul-500
const SECTION_COLOR  = '#5F92A9';  // azul-400

const navigation = [
  { name: 'Dashboard',     href: '/',            icon: LayoutDashboard },
  { name: 'Gestão de Bens',href: '/gestao-bens', icon: Building2       },
  { name: 'Inquilinos',    href: '/inquilinos',   icon: Users            },
  { name: 'Contratos',     href: '/contratos',    icon: FileText         },
  { name: 'Financeiro',    href: '/financeiro',   icon: DollarSign       },
];

function NavItem({
  item,
  active,
  onClick,
}: {
  item: { name: string; href: string; icon: React.ElementType };
  active: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={item.href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150"
      style={{
        background:  active ? NAV_ACTIVE_BG  : hovered ? NAV_HOVER_BG  : 'transparent',
        color:       active ? NAV_ACTIVE_TXT : hovered ? NAV_HOVER_TEXT : NAV_INACTIVE,
        borderLeft:  active ? `3px solid ${NAV_ACTIVE_BDR}` : '3px solid transparent',
        paddingLeft: active ? 13 : 16,
        paddingRight: 16,
        boxShadow:   active ? '0 2px 4px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
      <span className="flex-1">{item.name}</span>
      {active && <ChevronRight style={{ width: 14, height: 14, opacity: 0.5 }} />}
    </Link>
  );
}

export default function Root() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      {/* Logo */}
      <div className="flex items-center px-6 py-6" style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
        <span className="font-bold text-xl tracking-tight" style={{ color: LOGO_COLOR }}>
          Gestão de Bens
        </span>
      </div>

      {/* Rótulo */}
      <div className="px-6 pt-5 pb-2">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: SECTION_COLOR }}>
          Menu principal
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 pb-4">
        {navigation.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            active={isActive(item.href)}
            onClick={onNav}
          />
        ))}
      </nav>

      {/* Rodapé */}
      <div className="px-3 py-4" style={{ borderTop: `1px solid ${SIDEBAR_BORDER}` }}>
        <NavItem item={{ name: 'Configurações', href: '/configuracoes', icon: Settings }} active={false} onClick={onNav} />
        <NavItem item={{ name: 'Sair',          href: '/login',         icon: LogOut   }} active={false} onClick={onNav} />
        <p className="text-xs mt-3 px-4" style={{ color: '#8E8E8E' }}>© 2026 Ailos</p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* ── Sidebar Desktop (280px) ── */}
      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col overflow-y-auto"
        style={{ width: 280, background: SIDEBAR_BG, borderRight: `1px solid ${SIDEBAR_BORDER}` }}
      >
        <SidebarContent />
      </aside>

      {/* ── Header Mobile ── */}
      <header
        className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between px-4"
        style={{ background: '#FFFFFF', borderBottom: `1px solid ${SIDEBAR_BORDER}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <span className="font-bold" style={{ color: LOGO_COLOR }}>Gestão de Bens</span>
        <button
          type="button"
          className="p-2 rounded-lg"
          style={{ color: NAV_INACTIVE }}
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* ── Menu Mobile ── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(3px)' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 flex flex-col shadow-xl overflow-y-auto"
            style={{ width: 280, background: SIDEBAR_BG, borderRight: `1px solid ${SIDEBAR_BORDER}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}
            >
              <span className="font-bold text-lg" style={{ color: LOGO_COLOR }}>Gestão de Bens</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg"
                style={{ color: NAV_INACTIVE }}
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNav={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Conteúdo Principal ── */}
      <div className="lg:pl-[280px]">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
