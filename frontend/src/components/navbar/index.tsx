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
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
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
} from './styles';

const navItems = [
  // ── Core ──
  { label: 'Dashboard',        href: '/dashboard',          icon: LayoutDashboard },
  { label: 'Agenda',           href: '/agenda',             icon: CalendarDays    },
  { label: 'Pacientes',        href: '/patients',           icon: Users           },
  // ── Clínico ──
  { label: 'Histórico Pac.',   href: '/historico-paciente', icon: ClipboardList   },
  { label: 'Fotos Clínicas',   href: '/fotos',              icon: Camera          },
  { label: 'Reaplicações',     href: '/reaplicacoes',       icon: RefreshCcw      },
  { label: 'Procedimentos',    href: '/procedures',         icon: Syringe         },
  { label: 'Consentimento',    href: '/consentimento',      icon: FileText        },
  // ── Operacional ──
  { label: 'Lotes ANVISA',     href: '/lotes',              icon: FlaskConical    },
  { label: 'Estoque',          href: '/estoque',            icon: Package         },
  { label: 'Financeiro',       href: '/finance',            icon: DollarSign      },
  { label: 'Comissões',        href: '/comissoes',          icon: BadgeDollarSign },
  { label: 'Relatórios',       href: '/reports',            icon: BarChart3       },
  { label: 'Configurações',    href: '/settings',           icon: Settings        },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const navbarRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !collapsed &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [collapsed]);

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
            <GreetingText>Olá, {user?.name ?? 'Administrador'}</GreetingText>
          </TopSection>

          <LogoCollapsed $collapsed={collapsed}>
            <Image
              src="/logocjl.png"
              alt="Logo"
              width={180}
              height={180}
              style={{ objectFit: 'contain', display: 'block' }}
            />
          </LogoCollapsed>

          <DividerTop $collapsed={collapsed} />

          <Nav $collapsed={collapsed}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const selected = pathname === item.href;
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  $selected={selected}
                  $collapsed={collapsed}
                >
                  <NavLinkIcon $selected={selected}>
                    <Icon size={18} />
                  </NavLinkIcon>
                  <NavLinkText $selected={selected} $collapsed={collapsed}>
                    {item.label}
                  </NavLinkText>
                  <NavTooltip>{item.label}</NavTooltip>
                </NavLink>
              );
            })}
          </Nav>
        </div>

        <div style={{ width: '100%' }}>
          <LogoutDivider $collapsed={collapsed} />
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