'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, Users, Syringe, Package,
  DollarSign, BadgeDollarSign, BarChart3, Settings, LogOut,
  Menu, Camera, FileText, FlaskConical, RefreshCcw,
  ClipboardList, Stethoscope, ScrollText,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { useCurrentUser } from '@/components/ui/hooks/useCurrentUser';
import { ROLE_LABELS, ROLE_COLORS, Permission } from '@/types/auth';
import MockLoginScreen from '@/components/auth/MockLoginScreen';
import {
  NavbarContainer,
  LogoButton,
  TopSection,
  TitleText,
  GreetingText,
  DividerTop,
  Nav,
  NavLink,
  NavLinkIcon,
  NavLinkText,
  NavTooltip,
  LogoutButton,
  LogoutDivider,
  LogoutText,
  MobileMenuButton,
  Overlay,
  CollapseButton,
  LogoCollapsed,
  SectionDividerWrap,
  SectionDividerLine,
  SectionDividerLabel,
} from './styles';

const navSections = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard',      href: '/dashboard',          icon: LayoutDashboard, permission: 'dashboard.read'        as Permission, permissionAlt: null },
      { label: 'Agenda',         href: '/agenda',             icon: CalendarDays,    permission: 'agenda.read'            as Permission, permissionAlt: 'agenda.read_own'        as Permission },
      { label: 'Pacientes',      href: '/patients',           icon: Users,           permission: 'pacientes.read'         as Permission, permissionAlt: 'pacientes.read_own'     as Permission },
    ],
  },
  {
    label: 'Clínico',
    items: [
      { label: 'Histórico Pac.', href: '/historico-paciente', icon: ClipboardList,   permission: 'historico.read'         as Permission, permissionAlt: 'historico.read_own'     as Permission },
      { label: 'Fotos Clínicas', href: '/fotos',              icon: Camera,          permission: 'fotos.read'             as Permission, permissionAlt: 'fotos.read_own'         as Permission },
      { label: 'Reaplicações',   href: '/reaplicacoes',       icon: RefreshCcw,      permission: 'reaplicacoes.read'      as Permission, permissionAlt: 'reaplicacoes.read_own'  as Permission },
      { label: 'Procedimentos',  href: '/procedures',         icon: Syringe,         permission: 'procedimentos.read'     as Permission, permissionAlt: null },
      { label: 'Consentimento',  href: '/consentimento',      icon: FileText,        permission: 'consentimento.read'     as Permission, permissionAlt: 'consentimento.read_own' as Permission },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Profissionais',  href: '/profissionais',      icon: Stethoscope,     permission: 'profissionais.read'    as Permission, permissionAlt: null },
      { label: 'Lotes ANVISA',   href: '/lotes',              icon: FlaskConical,    permission: 'lotes.read'            as Permission, permissionAlt: null },
      { label: 'Estoque',        href: '/estoque',            icon: Package,         permission: 'estoque.read'          as Permission, permissionAlt: null },
      { label: 'Financeiro',     href: '/finance',            icon: DollarSign,      permission: 'financeiro.read'       as Permission, permissionAlt: null },
      { label: 'Comissões',      href: '/comissoes',          icon: BadgeDollarSign, permission: 'comissoes.read'        as Permission, permissionAlt: 'comissoes.read_own'     as Permission },
      { label: 'Relatórios',     href: '/reports',            icon: BarChart3,       permission: 'relatorios.financeiro' as Permission, permissionAlt: null },
      { label: 'Termos de Uso',  href: '/termos',             icon: ScrollText,      permission: 'configuracoes.read'    as Permission, permissionAlt: null },
      { label: 'Configurações',  href: '/settings',           icon: Settings,        permission: 'configuracoes.read'    as Permission, permissionAlt: null },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { can, isSuperAdmin } = usePermissions();
  const { currentUser } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!collapsed && navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [collapsed]);

  const canSeeItem = (permission: Permission, permissionAlt: Permission | null) => {
    if (isSuperAdmin) return true;
    if (can(permission)) return true;
    if (permissionAlt && can(permissionAlt)) return true;
    return false;
  };

  const filteredSections = navSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => canSeeItem(item.permission, item.permissionAlt)),
    }))
    .filter(section => section.items.length > 0);

  const roleKey    = currentUser?.role;
  const roleColors = roleKey ? ROLE_COLORS[roleKey] : null;
  const roleLabel  = roleKey ? ROLE_LABELS[roleKey] : 'perfil';

  return (
    <>
      <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
        <Menu size={24} />
      </MobileMenuButton>

      {isOpen && <Overlay onClick={() => setIsOpen(false)} />}

      <NavbarContainer ref={navbarRef} $isOpen={isOpen} $collapsed={collapsed}>
        <div style={{ width: '100%' }}>
          <CollapseButton
            $collapsed={collapsed}
            onClick={() => setCollapsed((prev) => !prev)}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line x1="3"  y1="6"  x2="14" y2="6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3"  y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3"  y1="16" x2="14" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="16,8 19,11 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line x1="8"  y1="6"  x2="19" y2="6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8"  y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8"  y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="6,8 3,11 6,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            )}
          </CollapseButton>

          <TopSection $collapsed={collapsed}>
            <TitleText>Clínica Estética</TitleText>
            <GreetingText>Olá, {currentUser?.name ?? 'Administrador'}</GreetingText>
          </TopSection>

          <LogoCollapsed $collapsed={collapsed}>
            <Image src="/logocjl.png" alt="Logo" width={160} height={160} style={{ objectFit: 'contain', display: 'block' }} />
          </LogoCollapsed>

          <DividerTop $collapsed={collapsed} />

          <Nav $collapsed={collapsed}>
            {filteredSections.map((section, sectionIndex) => (
              <div key={section.label} style={{ width: '100%' }}>
                <SectionDividerWrap $collapsed={collapsed} $first={sectionIndex === 0}>
                  <SectionDividerLine $collapsed={collapsed} />
                  <SectionDividerLabel $collapsed={collapsed}>{section.label}</SectionDividerLabel>
                  <SectionDividerLine $collapsed={collapsed} />
                </SectionDividerWrap>

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const selected = pathname === item.href;
                  return (
                    <NavLink key={item.href} href={item.href} onClick={() => setIsOpen(false)} $selected={selected} $collapsed={collapsed}>
                      <NavLinkIcon $selected={selected}><Icon size={18} /></NavLinkIcon>
                      <NavLinkText $selected={selected} $collapsed={collapsed}>{item.label}</NavLinkText>
                      <NavTooltip>{item.label}</NavTooltip>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </Nav>
        </div>

        <div style={{ width: '100%' }}>
          <LogoutDivider $collapsed={collapsed} />

          <SectionDividerWrap $collapsed={collapsed} $isBottom>
            <SectionDividerLine $collapsed={collapsed} />
            <SectionDividerLabel $collapsed={collapsed}>Perfil</SectionDividerLabel>
            <SectionDividerLine $collapsed={collapsed} />
          </SectionDividerWrap>

          <LogoutButton type="button" onClick={() => setShowSwitcher(true)} $collapsed={collapsed}>
            <div style={{
              width: 18, height: 18, borderRadius: 5,
              background: roleColors?.bg ?? '#2a2a2a',
              color: roleColors?.color ?? '#95A5A6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.55rem', fontWeight: 700, flexShrink: 0, marginLeft: '23px',
            }}>
              {currentUser?.name?.split(' ').slice(0, 2).map(n => n[0]).join('') ?? '?'}
            </div>
            <LogoutText $collapsed={collapsed} style={{ color: roleColors?.color ?? '#95A5A6' }}>{roleLabel}</LogoutText>
            <NavTooltip>Trocar perfil ({roleLabel})</NavTooltip>
          </LogoutButton>

          <LogoutDivider $collapsed={collapsed} />

          <SectionDividerWrap $collapsed={collapsed} $isBottom>
            <SectionDividerLine $collapsed={collapsed} />
            <SectionDividerLabel $collapsed={collapsed}>Sessão</SectionDividerLabel>
            <SectionDividerLine $collapsed={collapsed} />
          </SectionDividerWrap>

          <LogoutButton type="button" onClick={handleLogout} $collapsed={collapsed}>
            <LogOut size={18} />
            <LogoutText $collapsed={collapsed}>Sair da conta</LogoutText>
            <NavTooltip>Sair da conta</NavTooltip>
          </LogoutButton>
        </div>
      </NavbarContainer>

      {showSwitcher && <MockLoginScreen onClose={() => setShowSwitcher(false)} />}
    </>
  );
}
