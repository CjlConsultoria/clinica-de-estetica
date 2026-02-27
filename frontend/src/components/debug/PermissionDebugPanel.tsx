'use client';

/**
 * PAINEL DE DEBUG MULTI-TENANT
 *
 * 1. Copie para: src/components/debug/PermissionDebugPanel.tsx
 * 2. No layout.tsx, dentro de <AuthProvider>:
 *
 *    {process.env.NODE_ENV === 'development' && <PermissionDebugPanel />}
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  MOCK_USERS,
  MOCK_COMPANIES,
  ROLE_PERMISSIONS,
  ROLE_LABELS,
  ROLE_COLORS,
  type Role,
  type Permission,
  type CurrentUser,
} from '@/types/auth';

// ─── helpers ────────────────────────────────────────────────────────────────

function hasPermission(role: Role, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes('*') || perms.includes(permission);
}

type AccessLevel = 'full' | 'partial' | 'own_only' | 'none';

function getAccessLevel(role: Role, permissions: Permission[]): AccessLevel {
  const hasAny     = permissions.some(p => hasPermission(role, p));
  const hasAll     = permissions.every(p => hasPermission(role, p));
  const hasOwnOnly = permissions.some(p => p.includes('_own') && hasPermission(role, p));
  const hasGlobal  = permissions.some(p => !p.includes('_own') && hasPermission(role, p));
  if (!hasAny)                  return 'none';
  if (hasAll)                   return 'full';
  if (hasOwnOnly && !hasGlobal) return 'own_only';
  return 'partial';
}

const BADGE_CONFIG: Record<AccessLevel, { bg: string; color: string; border: string; label: string }> = {
  full:     { bg: '#d4edda', color: '#155724', border: '#c3e6cb', label: '✓ Total'   },
  partial:  { bg: '#fff3cd', color: '#856404', border: '#ffeeba', label: '~ Parcial' },
  own_only: { bg: '#cce5ff', color: '#004085', border: '#b8daff', label: '◎ Próprio' },
  none:     { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb', label: '✕ Nenhum'  },
};

const PERMISSION_GROUPS: Record<string, Permission[]> = {
  'Dashboard':     ['dashboard.read'],
  'Profissionais': ['profissionais.read','profissionais.create','profissionais.edit','profissionais.delete'],
  'Agenda':        ['agenda.read','agenda.read_own','agenda.create','agenda.edit','agenda.delete'],
  'Pacientes':     ['pacientes.read','pacientes.read_own','pacientes.create','pacientes.edit','pacientes.delete'],
  'Prontuário':    ['prontuario.read','prontuario.read_own','prontuario.create','prontuario.edit'],
  'Histórico':     ['historico.read','historico.read_own'],
  'Fotos':         ['fotos.read','fotos.read_own','fotos.create'],
  'Reaplicações':  ['reaplicacoes.read','reaplicacoes.read_own','reaplicacoes.create'],
  'Procedimentos': ['procedimentos.read','procedimentos.create','procedimentos.edit'],
  'Consentimento': ['consentimento.read','consentimento.read_own','consentimento.create'],
  'Financeiro':    ['financeiro.read','financeiro.create','financeiro.edit','financeiro.delete'],
  'Comissões':     ['comissoes.read','comissoes.read_own','comissoes.edit'],
  'Estoque':       ['estoque.read','estoque.create','estoque.edit'],
  'Lotes':         ['lotes.read','lotes.create','lotes.edit'],
  'Relatórios':    ['relatorios.operacional','relatorios.financeiro','relatorios.completo'],
  'Configurações': ['configuracoes.read','configuracoes.edit'],
};

const roles = Object.keys(ROLE_PERMISSIONS) as Role[];

function Avatar({ user, size = 36 }: { user: CurrentUser; size?: number }) {
  const initials = user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const roleColor = ROLE_COLORS[user.role].color; // ← CORRIGIDO
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: ROLE_COLORS[user.role].bg,       // ← CORRIGIDO
      border: `2px solid ${roleColor}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 800, color: roleColor,
    }}>
      {initials}
    </div>
  );
}

// ─── componente principal ────────────────────────────────────────────────────

export default function PermissionDebugPanel() {
  const { currentUser, switchUser } = useAuth();

  const [isOpen,   setIsOpen]   = useState(false);
  const [tab,      setTab]      = useState<'perfis' | 'matrix' | 'busca'>('perfis');
  const [search,   setSearch]   = useState('');
  const [copied,   setCopied]   = useState<string | null>(null);
  const [filterCo, setFilterCo] = useState('all');

  const allPerms      = Object.values(PERMISSION_GROUPS).flat();
  const filteredPerms = search
    ? allPerms.filter(p => p.toLowerCase().includes(search.toLowerCase()))
    : allPerms;

  // agrupa usuários por empresa para exibição
  const globalUsers = MOCK_USERS.filter(u => u.companyId === null);
  const companiesWithUsers = [
    // grupo "Sistema" para usuários globais
    ...(globalUsers.length > 0 && filterCo === 'all'
      ? [{ id: '__global__', name: 'Sistema', paymentStatus: 'ativo' as const, users: globalUsers }]
      : []),
    // empresas reais
    ...MOCK_COMPANIES
      .filter(co => filterCo === 'all' || filterCo === co.id)
      .map(co => ({
        ...co,
        users: MOCK_USERS.filter(u => u.companyId === co.id),
      }))
      .filter(co => co.users.length > 0),
  ];

  function handleSwitch(user: CurrentUser) {
    switchUser(user.id);
    setIsOpen(false);
  }

  function copyPerms(role: Role) {
    navigator.clipboard.writeText(ROLE_PERMISSIONS[role].join('\n'));
    setCopied(role);
    setTimeout(() => setCopied(null), 2000);
  }

  // ─── botão flutuante ───────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
      }}>
        {currentUser && (
          <div style={{
            background: '#1b1b1b',
            border: `1px solid ${ROLE_COLORS[currentUser.role].color}44`, // ← CORRIGIDO
            borderRadius: 8, padding: '6px 12px',
            fontFamily: 'monospace', fontSize: 11, color: '#aaa',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: ROLE_COLORS[currentUser.role].color,           // ← CORRIGIDO
              boxShadow: `0 0 6px ${ROLE_COLORS[currentUser.role].color}`, // ← CORRIGIDO
            }} />
            <span style={{ color: '#ddd' }}>{currentUser.name}</span>
            <span style={{
              background: ROLE_COLORS[currentUser.role].bg,              // ← CORRIGIDO
              color: ROLE_COLORS[currentUser.role].color,                // ← CORRIGIDO
              borderRadius: 4, padding: '1px 7px', fontSize: 9, fontWeight: 800,
            }}>
              {ROLE_LABELS[currentUser.role]}
            </span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: '#1b1b1b', color: '#EBD5B0',
            border: '1px solid #EBD5B055', borderRadius: 8,
            padding: '10px 16px', fontFamily: 'monospace',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span>🔐</span>
          <span>Debug Multi-tenant</span>
        </button>
      </div>
    );
  }

  // ─── painel aberto ────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#111', border: '1px solid #222', borderRadius: 14,
        width: '100%', maxWidth: 1080, maxHeight: '88vh',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'monospace', color: '#ddd',
        boxShadow: '0 32px 100px rgba(0,0,0,0.9)',
        overflow: 'hidden',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid #1e1e1e',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, background: '#0d0d0d',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {currentUser && <Avatar user={currentUser} size={40} />}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#555' }}>Logado como</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: currentUser ? ROLE_COLORS[currentUser.role].color : '#aaa' }}> {/* ← CORRIGIDO */}
                  {currentUser?.name ?? '—'}
                </span>
                {currentUser && (
                  <span style={{
                    background: ROLE_COLORS[currentUser.role].color + '25', // ← CORRIGIDO
                    color: ROLE_COLORS[currentUser.role].color,             // ← CORRIGIDO
                    border: `1px solid ${ROLE_COLORS[currentUser.role].color}44`, // ← CORRIGIDO
                    borderRadius: 20, padding: '2px 10px', fontSize: 10, fontWeight: 800,
                  }}>
                    {ROLE_LABELS[currentUser.role]}
                  </span>
                )}
                {currentUser?.companyId === null && (
                  <span style={{
                    background: '#252500', color: '#EBD5B0',
                    border: '1px solid #EBD5B033',
                    borderRadius: 20, padding: '2px 10px', fontSize: 10,
                  }}>
                    Todas as empresas
                  </span>
                )}
              </div>
              <div style={{ fontSize: 10, color: '#3a3a3a', marginTop: 3 }}>
                {MOCK_COMPANIES.length} empresas · {MOCK_USERS.length} usuários · {roles.length} perfis
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none', border: '1px solid #2a2a2a', color: '#555',
              borderRadius: 6, padding: '6px 14px', cursor: 'pointer',
              fontSize: 12, fontFamily: 'monospace',
            }}
          >
            ✕ Fechar
          </button>
        </div>

        {/* ── Tabs + filtro empresa ── */}
        <div style={{
          display: 'flex', gap: 4, padding: '10px 20px',
          borderBottom: '1px solid #1a1a1a', flexShrink: 0,
          alignItems: 'center', background: '#0f0f0f',
        }}>
          {(['perfis', 'matrix', 'busca'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? '#EBD5B0' : '#1a1a1a',
              color: tab === t ? '#111' : '#555',
              border: tab === t ? 'none' : '1px solid #222',
              borderRadius: 6, padding: '6px 16px',
              cursor: 'pointer', fontSize: 11, fontWeight: 700,
              fontFamily: 'monospace', transition: 'all 0.15s',
            }}>
              {t === 'perfis' ? '👤 Trocar Perfil' : t === 'matrix' ? '📊 Matriz' : '🔍 Buscar Permissão'}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: '#3a3a3a' }}>Empresa:</span>
            <select
              value={filterCo}
              onChange={e => setFilterCo(e.target.value)}
              style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#777',
                borderRadius: 6, padding: '4px 10px', fontSize: 11, fontFamily: 'monospace',
              }}
            >
              <option value="all">Todas</option>
              {MOCK_COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* ── Conteúdo ── */}
        <div style={{ overflow: 'auto', flex: 1, padding: '16px 20px' }}>

          {/* ══ TROCAR PERFIL ═══════════════════════════════════════════════════ */}
          {tab === 'perfis' && (
            <div>
              <p style={{ fontSize: 11, color: '#3a3a3a', margin: '0 0 18px' }}>
                Clique em um card para entrar nesse perfil. O menu lateral e as permissões mudam instantaneamente.
              </p>

              {companiesWithUsers.map(company => (
                <div key={company.id} style={{ marginBottom: 28 }}>

                  {/* título da empresa */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ height: 1, flex: 0.05, background: '#222' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: '#444', fontWeight: 700, letterSpacing: 1 }}>
                        {company.id === '__global__' ? '🌐 SISTEMA' : `🏢 ${company.name.toUpperCase()}`}
                      </span>
                      {company.id !== '__global__' && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, borderRadius: 20, padding: '2px 7px',
                          background: company.paymentStatus === 'ativo' ? '#0f2a0f' : '#2a0f0f',
                          color: company.paymentStatus === 'ativo' ? '#6ecb6e' : '#cb6e6e',
                          border: `1px solid ${company.paymentStatus === 'ativo' ? '#1a4a1a' : '#4a1a1a'}`,
                        }}>
                          {company.paymentStatus.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div style={{ height: 1, flex: 1, background: '#1e1e1e' }} />
                  </div>

                  {/* grid de cards */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(268px, 1fr))',
                    gap: 10,
                  }}>
                    {company.users.map((u: CurrentUser) => {
                      const isActive  = currentUser?.id === u.id;
                      const perms     = ROLE_PERMISSIONS[u.role];
                      const isAll     = perms.includes('*');
                      const roleColor = ROLE_COLORS[u.role].color; // ← CORRIGIDO

                      return (
                        <button
                          key={u.id}
                          onClick={() => handleSwitch(u)}
                          style={{
                            textAlign: 'left', cursor: 'pointer',
                            background: isActive ? roleColor + '10' : '#131313',
                            border: isActive ? `2px solid ${roleColor}` : '1px solid #1e1e1e',
                            borderRadius: 10, padding: '14px 16px',
                            transition: 'border-color 0.15s, background 0.15s',
                            position: 'relative',
                          }}
                        >
                          {/* badge ATIVO */}
                          {isActive && (
                            <div style={{
                              position: 'absolute', top: 10, right: 10,
                              background: roleColor, color: '#000',
                              borderRadius: 20, padding: '2px 8px',
                              fontSize: 9, fontWeight: 900, letterSpacing: 0.5,
                            }}>
                              ● ATIVO
                            </div>
                          )}

                          {/* avatar + nome */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <Avatar user={u} size={38} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{
                                fontSize: 13, fontWeight: 700, color: '#eee',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                paddingRight: isActive ? 60 : 0,
                              }}>
                                {u.name}
                              </div>
                              <div style={{ fontSize: 10, color: '#444', marginTop: 1 }}>{u.email}</div>
                            </div>
                          </div>

                          {/* role + cargo */}
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                            <span style={{
                              background: roleColor + '20',
                              color: roleColor,
                              border: `1px solid ${roleColor}33`,
                              borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700,
                            }}>
                              {ROLE_LABELS[u.role]}
                            </span>
                            {u.cargo !== u.role && (
                              <span style={{
                                background: '#1e1e1e', color: '#555',
                                borderRadius: 20, padding: '2px 9px', fontSize: 10,
                              }}>
                                {u.cargo}
                              </span>
                            )}
                          </div>

                          {/* mini mapa de módulos */}
                          {isAll ? (
                            <div style={{
                              fontSize: 10, color: '#6ecb6e', fontWeight: 700,
                              background: '#0f2a0f', borderRadius: 6,
                              padding: '5px 10px', border: '1px solid #1a4a1a',
                            }}>
                              ✓ Acesso total ao sistema (*)
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                              {Object.entries(PERMISSION_GROUPS).map(([group, gPerms]) => {
                                const lvl = getAccessLevel(u.role, gPerms);
                                if (lvl === 'none') return null;
                                const b = BADGE_CONFIG[lvl];
                                return (
                                  <span key={group} style={{
                                    background: b.bg, color: b.color,
                                    borderRadius: 3, padding: '2px 5px',
                                    fontSize: 9, fontWeight: 700,
                                  }}>
                                    {group}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ MATRIZ ══════════════════════════════════════════════════════════ */}
          {tab === 'matrix' && (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={{
                      textAlign: 'left', padding: '8px 12px', color: '#444',
                      fontWeight: 400, width: 150,
                      position: 'sticky', left: 0, background: '#111',
                    }}>
                      Módulo
                    </th>
                    {roles.map(r => {
                      const isCurrent = currentUser?.role === r;
                      const roleColor = ROLE_COLORS[r].color; // ← CORRIGIDO
                      return (
                        <th key={r} style={{ padding: '8px', textAlign: 'center', minWidth: 100 }}>
                          <div style={{
                            color: roleColor, fontWeight: 700, fontSize: 10,
                            padding: '3px 8px', borderRadius: 4,
                            background: isCurrent ? roleColor + '30' : roleColor + '15',
                            border: isCurrent ? `1px solid ${roleColor}55` : 'none',
                            display: 'inline-block',
                          }}>
                            {isCurrent ? '▶ ' : ''}{ROLE_LABELS[r]}
                          </div>
                          <div style={{ marginTop: 5 }}>
                            <button
                              onClick={() => copyPerms(r)}
                              style={{
                                background: 'none', border: '1px solid #252525',
                                color: copied === r ? '#6ecb6e' : '#3a3a3a',
                                borderRadius: 4, padding: '2px 8px',
                                cursor: 'pointer', fontSize: 9, fontFamily: 'monospace',
                              }}
                            >
                              {copied === r ? '✓ Copiado' : '⎘ Copiar'}
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => (
                    <tr key={group} style={{ borderTop: '1px solid #1a1a1a' }}>
                      <td style={{
                        padding: '9px 12px', color: '#bbb', fontWeight: 700,
                        fontSize: 11, background: '#111', position: 'sticky', left: 0,
                      }}>
                        {group}
                        <div style={{ fontWeight: 400, color: '#333', fontSize: 9, marginTop: 1 }}>
                          {perms.length} perm.
                        </div>
                      </td>
                      {roles.map(r => {
                        const lvl       = getAccessLevel(r, perms);
                        const b         = BADGE_CONFIG[lvl];
                        const isCurrent = currentUser?.role === r;
                        return (
                          <td key={r} style={{
                            padding: '9px 8px', textAlign: 'center',
                            background: isCurrent ? '#1a1a1a' : 'transparent',
                          }}>
                            <span style={{
                              background: b.bg, color: b.color,
                              border: `1px solid ${b.border}`,
                              borderRadius: 20, padding: '2px 9px',
                              fontSize: 9, fontWeight: 700,
                            }}>
                              {b.label}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: 16, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {(Object.entries(BADGE_CONFIG) as [AccessLevel, typeof BADGE_CONFIG[AccessLevel]][]).map(([lvl, b]) => (
                  <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      background: b.bg, color: b.color, border: `1px solid ${b.border}`,
                      borderRadius: 20, padding: '2px 8px', fontSize: 9, fontWeight: 700,
                    }}>
                      {b.label}
                    </span>
                    <span style={{ fontSize: 10, color: '#444' }}>
                      {lvl === 'full' ? 'Acesso total' : lvl === 'partial' ? 'Parcial' : lvl === 'own_only' ? 'Só os próprios' : 'Sem acesso'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══ BUSCA ═══════════════════════════════════════════════════════════ */}
          {tab === 'busca' && (
            <>
              <input
                type="text"
                placeholder="Buscar permissão... ex: financeiro, agenda.read, prontuario"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRadius: 8, padding: '10px 16px',
                  color: '#ddd', fontSize: 12, fontFamily: 'monospace',
                  outline: 'none', marginBottom: 14,
                }}
              />
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: '#3a3a3a', fontWeight: 400 }}>
                      Permissão
                    </th>
                    {roles.map(r => {
                      const isCurrent = currentUser?.role === r;
                      return (
                        <th key={r} style={{ padding: '8px', textAlign: 'center' }}>
                          <span style={{
                            color: isCurrent ? ROLE_COLORS[r].color : '#2a2a2a', // ← CORRIGIDO
                            fontWeight: 700, fontSize: 10,
                          }}>
                            {isCurrent ? '▶ ' : ''}{ROLE_LABELS[r]}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredPerms.map(perm => (
                    <tr key={perm} style={{ borderBottom: '1px solid #161616' }}>
                      <td style={{ padding: '7px 12px', color: '#777', fontSize: 11 }}>
                        {perm}
                      </td>
                      {roles.map(r => {
                        const granted   = hasPermission(r, perm);
                        const isCurrent = currentUser?.role === r;
                        return (
                          <td key={r} style={{
                            padding: '7px 8px', textAlign: 'center',
                            background: isCurrent ? '#1a1a1a' : 'transparent',
                          }}>
                            <span style={{
                              fontSize: 15, fontWeight: 700,
                              color: granted
                                ? (isCurrent ? '#6ecb6e' : '#255225')
                                : (isCurrent ? '#522525' : '#1e1e1e'),
                            }}>
                              {granted ? '✓' : '✕'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPerms.length === 0 && (
                <div style={{ textAlign: 'center', color: '#333', padding: 40, fontSize: 12 }}>
                  Nenhuma permissão encontrada para &quot;{search}&quot;
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}