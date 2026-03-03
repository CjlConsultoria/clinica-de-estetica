'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Syringe,
  Package,
  DollarSign,
  BadgeDollarSign,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Camera,
  FileText,
  FlaskConical,
  RefreshCcw,
  ClipboardList,
  Stethoscope,
  ScrollText,
  Building2,
  CreditCard,
  HeadphonesIcon,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { Permission } from '@/types/auth';
import { useNotificacoesContext } from '@/contexts/NotificacoesContext';
import { useComunicadosContext } from '@/contexts/ComunicadosContext';

import {
  NavbarContainer,
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

function IconMegafone({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13"/>
      <path d="M22 2L15 22l-4-9-9-4 20-7z"/>
    </svg>
  );
}

function IconSino({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function BadgeCount({ count, collapsed, isMobile = false }: {
  count:     number;
  collapsed: boolean;
  isMobile?: boolean;
}) {
  if (!count) return null;
  const label = count > 9 ? '9+' : String(count);

  if (collapsed && !isMobile) {
    return (
      <span
        style={{
          position:       'absolute',
          top:            -3,
          right:          10,
          minWidth:       14,
          height:         14,
          borderRadius:   7,
          background:     '#e74c3c',
          color:          'white',
          fontSize:       '0.52rem',
          fontWeight:     800,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '0 3px',
          lineHeight:     1,
          letterSpacing:  '-0.2px',
          boxShadow:      '0 0 0 1.5px #1b1b1b',
          boxSizing:      'border-box' as const,
          pointerEvents:  'none',
          zIndex:         2,
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      style={{
        minWidth:       16,
        height:         16,
        borderRadius:   8,
        background:     '#e74c3c',
        color:          'white',
        fontSize:       '0.58rem',
        fontWeight:     800,
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '0 4px',
        flexShrink:     0,
        letterSpacing:  '-0.2px',
        lineHeight:     1,
        marginLeft:     6,
      }}
    >
      {label}
    </span>
  );
}

// superAdmin usa notifUnread; empresa usa comunicadosUnread
const superAdminSections = (notifUnread: number) => [
  {
    label: 'Visão Geral',
    items: [
      { label: 'Dashboard',    href: '/dashboard-admin', Icon: LayoutDashboard, badge: 0 },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Empresas',       href: '/empresas',       Icon: Building2,    badge: 0 },
      { label: 'Profissionais',  href: '/profissionais',  Icon: Stethoscope,  badge: 0 },
      { label: 'Financeiro',     href: '/finance',        Icon: CreditCard,   badge: 0 },
    ],
  },
  {
    label: 'Operação',
    items: [
      { label: 'Suporte',       href: '/suporte',      Icon: HeadphonesIcon, badge: 0           },
      { label: 'Comunicados',   href: '/comunicados',  Icon: IconMegafone,   badge: 0           },
      { label: 'Notificações',  href: '/notificacoes', Icon: IconSino,       badge: notifUnread },
      { label: 'Configurações', href: '/settings',     Icon: Settings,       badge: 0           },
    ],
  },
];

// navSections é uma factory para poder injetar o badge de comunicados dinamicamente
const buildNavSections = (comunicadosUnread: number) => [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard, permission: 'dashboard.read' as Permission, permissionAlt: null,                              badge: 0 },
      { label: 'Agenda',    href: '/agenda',    Icon: CalendarDays,    permission: 'agenda.read'    as Permission, permissionAlt: 'agenda.read_own'    as Permission, badge: 0 },
      { label: 'Pacientes', href: '/patients',  Icon: Users,           permission: 'pacientes.read' as Permission, permissionAlt: 'pacientes.read_own' as Permission, badge: 0 },
    ],
  },
  {
    label: 'Clínico',
    items: [
      { label: 'Histórico Pac.', href: '/historico-paciente', Icon: ClipboardList, permission: 'historico.read'     as Permission, permissionAlt: 'historico.read_own'     as Permission, badge: 0 },
      { label: 'Fotos Clínicas', href: '/fotos',              Icon: Camera,        permission: 'fotos.read'         as Permission, permissionAlt: 'fotos.read_own'         as Permission, badge: 0 },
      { label: 'Reaplicações',   href: '/reaplicacoes',       Icon: RefreshCcw,    permission: 'reaplicacoes.read'  as Permission, permissionAlt: 'reaplicacoes.read_own'  as Permission, badge: 0 },
      { label: 'Procedimentos',  href: '/procedures',         Icon: Syringe,       permission: 'procedimentos.read' as Permission, permissionAlt: null,                                    badge: 0 },
      { label: 'Consentimento',  href: '/consentimento',      Icon: FileText,      permission: 'consentimento.read' as Permission, permissionAlt: 'consentimento.read_own' as Permission, badge: 0 },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Profissionais', href: '/profissionais', Icon: Stethoscope,     permission: 'profissionais.read'    as Permission, permissionAlt: null,                              badge: 0 },
      { label: 'Lotes ANVISA',  href: '/lotes',         Icon: FlaskConical,    permission: 'lotes.read'            as Permission, permissionAlt: null,                              badge: 0 },
      { label: 'Estoque',       href: '/estoque',       Icon: Package,         permission: 'estoque.read'          as Permission, permissionAlt: null,                              badge: 0 },
      { label: 'Financeiro',    href: '/finance',       Icon: DollarSign,      permission: 'financeiro.read'       as Permission, permissionAlt: null,                              badge: 0 },
      { label: 'Comissões',     href: '/comissoes',     Icon: BadgeDollarSign, permission: 'comissoes.read'        as Permission, permissionAlt: 'comissoes.read_own' as Permission, badge: 0 },
      { label: 'Relatórios',    href: '/reports',       Icon: BarChart3,       permission: 'relatorios.financeiro' as Permission, permissionAlt: null,                              badge: 0 },
      { label: 'Termos de Uso', href: '/termos',        Icon: ScrollText,      permission: 'configuracoes.read'    as Permission, permissionAlt: null,                              badge: 0 },
      { label: 'Configurações', href: '/settings',      Icon: Settings,        permission: 'configuracoes.read'    as Permission, permissionAlt: null,                              badge: 0 },
    ],
  },
  {
    label: 'Ajuda',
    items: [
      { label: 'Suporte',     href: '/suporte-empresa',                 Icon: HeadphonesIcon, permission: 'suporte.read'     as Permission, permissionAlt: null, badge: 0                  },
      { label: 'Comunicados', href: '/comunicados/comunicados-empresa', Icon: IconMegafone,   permission: 'comunicados.read' as Permission, permissionAlt: null, badge: comunicadosUnread  },
    ],
  },
];

export default function Navbar() {
  const pathname              = usePathname();
  const router                = useRouter();
  const { user, logout }      = useAuth();
  const { can, isSuperAdmin } = usePermissions();
  const { unreadCount }       = useNotificacoesContext();
  const { unreadComunicados } = useComunicadosContext();

  const [isOpen,    setIsOpen]    = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile,  setIsMobile]  = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleLogout = () => { logout(); router.push('/login'); };

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

  const sectionsToRender = isSuperAdmin
    ? superAdminSections(unreadCount)
    : buildNavSections(unreadComunicados)
        .map(section => ({
          ...section,
          items: section.items.filter(item =>
            canSeeItem(item.permission, item.permissionAlt)
          ),
        }))
        .filter(section => section.items.length > 0);

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
            onClick={() => setCollapsed(prev => !prev)}
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
            <TitleText>{isSuperAdmin ? 'Admin Sistema' : 'Clínica Estética'}</TitleText>
            <GreetingText>Olá, {user?.name ?? 'Administrador'}</GreetingText>
          </TopSection>

          <LogoCollapsed $collapsed={collapsed}>
            <Image
              src="/logocjl.png"
              alt="Logo"
              width={160}
              height={160}
              style={{ objectFit: 'contain', display: 'block' }}
            />
          </LogoCollapsed>

          <DividerTop $collapsed={collapsed} />

          <Nav $collapsed={collapsed}>
            {sectionsToRender.map((section, sectionIndex) => (
              <div key={section.label} style={{ width: '100%' }}>
                <SectionDividerWrap $collapsed={collapsed} $first={sectionIndex === 0}>
                  <SectionDividerLine $collapsed={collapsed} />
                  <SectionDividerLabel $collapsed={collapsed}>{section.label}</SectionDividerLabel>
                  <SectionDividerLine $collapsed={collapsed} />
                </SectionDividerWrap>

                {section.items.map(item => {
                  const { Icon, label, href } = item;
                  const badge    = (item as any).badge as number ?? 0;
                  const selected = pathname === href;

                  return (
                    <NavLink
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      $selected={selected}
                      $collapsed={collapsed}
                    >
                      <NavLinkIcon
                        $selected={selected}
                        style={{ position: 'relative', flexShrink: 0 }}
                      >
                        <Icon size={18} />
                        {badge > 0 && collapsed && !isMobile && (
                          <BadgeCount count={badge} collapsed={true} isMobile={false} />
                        )}
                      </NavLinkIcon>
                      <NavLinkText
                        $selected={selected}
                        $collapsed={collapsed}
                        style={{
                          display:        'flex',
                          alignItems:     'center',
                          justifyContent: 'flex-start',
                          width:          '100%',
                        }}
                      >
                        <span>{label}</span>
                        {badge > 0 && (!collapsed || isMobile) && (
                          <BadgeCount count={badge} collapsed={false} isMobile={isMobile} />
                        )}
                      </NavLinkText>
                      <NavTooltip>
                        {label}
                        {badge > 0 ? ` · ${badge} não lido${badge !== 1 ? 's' : ''}` : ''}
                      </NavTooltip>
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
    </>
  );
}