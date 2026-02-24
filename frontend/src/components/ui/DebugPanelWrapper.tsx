'use client';

import { useState } from 'react';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { useCurrentUser } from '@/components/ui/hooks/useCurrentUser';
import { MOCK_USERS, MOCK_COMPANIES, ROLE_LABELS, ROLE_COLORS, Permission, ROLE_PERMISSIONS } from '@/types/auth';

// ─── Mapa cargo→role (igual ao do profissionais/index.tsx) ────────────────────
const CARGO_TO_ROLE: Record<string, 'tecnico' | 'recepcionista' | 'gerente' | 'financeiro'> = {
  esteticista:    'tecnico',
  biomedico:      'tecnico',
  enfermeiro:     'tecnico',
  dermatologista: 'tecnico',
  fisioterapeuta: 'tecnico',
  recepcionista:  'recepcionista',
  gerente:        'gerente',
  financeiro:     'financeiro',
};

const PERM_LABEL: Record<string, string> = {
  'dashboard.read':          'Ver dashboard',
  'profissionais.read':      'Ver profissionais',
  'profissionais.create':    'Cadastrar profissionais',
  'profissionais.edit':      'Editar profissionais',
  'profissionais.delete':    'Excluir profissionais',
  'agenda.read':             'Ver agenda',
  'agenda.read_own':         'Ver própria agenda',
  'agenda.create':           'Criar agendamentos',
  'agenda.edit':             'Editar agendamentos',
  'agenda.delete':           'Excluir agendamentos',
  'pacientes.read':          'Ver todos pacientes',
  'pacientes.read_own':      'Ver próprios pacientes',
  'pacientes.create':        'Cadastrar pacientes',
  'pacientes.edit':          'Editar pacientes',
  'pacientes.delete':        'Excluir pacientes',
  'prontuario.read':         'Ver prontuários',
  'prontuario.read_own':     'Ver próprio prontuário',
  'prontuario.create':       'Criar prontuários',
  'prontuario.edit':         'Editar prontuários',
  'historico.read':          'Ver histórico geral',
  'historico.read_own':      'Ver próprio histórico',
  'fotos.read':              'Ver fotos',
  'fotos.read_own':          'Ver próprias fotos',
  'fotos.create':            'Adicionar fotos',
  'reaplicacoes.read':       'Ver reaplicações',
  'reaplicacoes.read_own':   'Ver próprias reaplicações',
  'reaplicacoes.create':     'Criar reaplicações',
  'procedimentos.read':      'Ver procedimentos',
  'procedimentos.create':    'Criar procedimentos',
  'procedimentos.edit':      'Editar procedimentos',
  'consentimento.read':      'Ver consentimentos',
  'consentimento.read_own':  'Ver próprios consentimentos',
  'consentimento.create':    'Criar consentimentos',
  'financeiro.read':         'Ver financeiro',
  'financeiro.create':       'Lançar entradas',
  'financeiro.edit':         'Editar lançamentos',
  'financeiro.delete':       'Excluir lançamentos',
  'comissoes.read':          'Ver comissões',
  'comissoes.read_own':      'Ver próprias comissões',
  'comissoes.edit':          'Editar comissões',
  'estoque.read':            'Ver estoque',
  'estoque.create':          'Adicionar ao estoque',
  'estoque.edit':            'Editar estoque',
  'lotes.read':              'Ver lotes',
  'lotes.create':            'Criar lotes',
  'lotes.edit':              'Editar lotes',
  'relatorios.operacional':  'Relatório operacional',
  'relatorios.financeiro':   'Relatório financeiro',
  'relatorios.completo':     'Relatório completo',
  'configuracoes.read':      'Ver configurações',
  'configuracoes.edit':      'Editar configurações',
};

// Todos os grupos de permissão para exibição
const PERM_GROUPS: { label: string; perms: Permission[] }[] = [
  { label: 'Dashboard',     perms: ['dashboard.read'] },
  { label: 'Profissionais', perms: ['profissionais.read', 'profissionais.create', 'profissionais.edit', 'profissionais.delete'] },
  { label: 'Agenda',        perms: ['agenda.read', 'agenda.read_own', 'agenda.create', 'agenda.edit', 'agenda.delete'] },
  { label: 'Pacientes',     perms: ['pacientes.read', 'pacientes.read_own', 'pacientes.create', 'pacientes.edit', 'pacientes.delete'] },
  { label: 'Prontuário',    perms: ['prontuario.read', 'prontuario.read_own', 'prontuario.create', 'prontuario.edit'] },
  { label: 'Histórico',     perms: ['historico.read', 'historico.read_own'] },
  { label: 'Fotos',         perms: ['fotos.read', 'fotos.read_own', 'fotos.create'] },
  { label: 'Reaplicações',  perms: ['reaplicacoes.read', 'reaplicacoes.read_own', 'reaplicacoes.create'] },
  { label: 'Procedimentos', perms: ['procedimentos.read', 'procedimentos.create', 'procedimentos.edit'] },
  { label: 'Consentimento', perms: ['consentimento.read', 'consentimento.read_own', 'consentimento.create'] },
  { label: 'Financeiro',    perms: ['financeiro.read', 'financeiro.create', 'financeiro.edit', 'financeiro.delete'] },
  { label: 'Comissões',     perms: ['comissoes.read', 'comissoes.read_own', 'comissoes.edit'] },
  { label: 'Estoque',       perms: ['estoque.read', 'estoque.create', 'estoque.edit'] },
  { label: 'Lotes',         perms: ['lotes.read', 'lotes.create', 'lotes.edit'] },
  { label: 'Relatórios',    perms: ['relatorios.operacional', 'relatorios.financeiro', 'relatorios.completo'] },
  { label: 'Configurações', perms: ['configuracoes.read', 'configuracoes.edit'] },
];

type Tab = 'perfil' | 'permissoes' | 'empresas';

// ─── Tipo mínimo do profissional que o debug precisa saber ────────────────────
// O array real vive no profissionais/index.tsx; o debug acessa via window.__profissionais__
declare global {
  interface Window {
    __profissionais__?: {
      email: string;
      cargo: string;
      customPermissions: Permission[] | null;
    }[];
  }
}

export default function PermissionDebugPanel() {
  const { isSuperAdmin, isCompanyAdmin, role, companyId, canAccessCompany } = usePermissions();
  const { currentUser, switchUser } = useCurrentUser();
  const [open, setOpen] = useState(true);
  const [tab,  setTab]  = useState<Tab>('perfil');

  const colors = role ? ROLE_COLORS[role] : { bg: '#333', color: '#aaa' };

  const usersPerCompany = MOCK_COMPANIES.map(company => ({
    company,
    users: MOCK_USERS.filter(u => u.companyId === company.id),
  }));
  const globalUsers = MOCK_USERS.filter(u => u.companyId === null);

  // ─── Busca o profissional correspondente ao currentUser pelo email ─────────
  const profData = currentUser?.email
    ? window.__profissionais__?.find(p => p.email === currentUser.email)
    : undefined;

  // Permissões efetivas do usuário logado:
  // Se ele tem customPermissions no cadastro → usa essas
  // Se não → usa as permissões padrão do role/cargo
  const effectivePerms: Permission[] | '*' = (() => {
    if (isSuperAdmin || isCompanyAdmin) return '*';
    if (profData?.customPermissions !== null && profData?.customPermissions !== undefined) {
      return profData.customPermissions;
    }
    if (role && ROLE_PERMISSIONS[role]) {
      return ROLE_PERMISSIONS[role] as Permission[];
    }
    return [];
  })();

  const hasCustom = profData?.customPermissions !== null && profData?.customPermissions !== undefined;

  function permAllowed(perm: Permission): boolean {
    if (effectivePerms === '*') return true;
    return effectivePerms.includes(perm);
  }

  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
      fontFamily: 'monospace', fontSize: 12, width: 320,
      borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
      overflow: 'hidden', border: '1px solid #2a2a2a',
    }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div onClick={() => setOpen(o => !o)} style={{
        background: '#141414', color: '#fff', padding: '9px 12px',
        cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span></span>
          <span style={{ fontWeight: 700, letterSpacing: 0.5 }}>Debug Multi-tenant</span>
        </div>
        <span style={{ fontSize: 10, opacity: 0.5 }}>{open ? '▼' : '▲'}</span>
      </div>

      {open && (
        <div style={{ background: '#0f0f0f', color: '#eee' }}>

          {/* ── Usuário atual ──────────────────────────────────── */}
          <div style={{
            padding: '8px 12px', background: '#1a1a1a',
            borderBottom: '1px solid #2a2a2a',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: colors.bg, color: colors.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13, flexShrink: 0,
              border: `2px solid ${colors.color}33`,
            }}>
              {currentUser?.name.split(' ').slice(0, 2).map(n => n[0]).join('') ?? '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name ?? '—'}
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 3, flexWrap: 'wrap' }}>
                <span style={{ background: colors.bg, color: colors.color, borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>
                  {role ? ROLE_LABELS[role] : '—'}
                </span>
                {hasCustom && (
                  <span style={{ background: '#2d1a00', color: '#c97a3a', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>
                    ✎ Perms. personalizadas
                  </span>
                )}
                {companyId ? (
                  <span style={{ background: '#1e2d1e', color: '#7ecb7e', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>
                    🏢 {MOCK_COMPANIES.find(c => c.id === companyId)?.name ?? companyId}
                  </span>
                ) : (
                  <span style={{ background: '#2d1e1e', color: '#cb7e7e', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>
                    Todas as empresas
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Tabs ───────────────────────────────────────────── */}
          <div style={{ display: 'flex', borderBottom: '1px solid #2a2a2a' }}>
            {(['perfil', 'permissoes', 'empresas'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '7px 0',
                background: tab === t ? '#1f1f1f' : 'transparent',
                color: tab === t ? '#fff' : '#555',
                border: 'none', borderBottom: tab === t ? '2px solid #BBA188' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'monospace', fontSize: 11,
                fontWeight: tab === t ? 700 : 400, textTransform: 'capitalize',
              }}>
                {t === 'perfil' && ' '}
                {t === 'permissoes' && ' '}
                {t === 'empresas' && ' '}
                {t}
              </button>
            ))}
          </div>

          {/* ── Conteúdo ───────────────────────────────────────── */}
          <div style={{ maxHeight: 400, overflowY: 'auto', padding: '10px 12px' }}>

            {/* TAB PERFIL */}
            {tab === 'perfil' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ color: '#555', fontSize: 10, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Global</div>
                {globalUsers.map(u => {
                  const uc = ROLE_COLORS[u.role];
                  const active = currentUser?.id === u.id;
                  return (
                    <div key={u.id} onClick={() => switchUser(u.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 8px', borderRadius: 8, cursor: 'pointer',
                      background: active ? '#1f2f1f' : '#181818',
                      border: `1px solid ${active ? '#7ecb7e' : '#2a2a2a'}`,
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: uc.bg, color: uc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {u.name.split(' ').slice(0,2).map(n=>n[0]).join('')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#fff', fontSize: 12 }}>{u.name}</div>
                        <div style={{ color: '#555', fontSize: 10 }}>{u.email}</div>
                      </div>
                      <span style={{ background: uc.bg, color: uc.color, borderRadius: 4, padding: '1px 5px', fontSize: 9, fontWeight: 700 }}>{ROLE_LABELS[u.role]}</span>
                      {active && <span style={{ color: '#7ecb7e', fontSize: 14 }}>●</span>}
                    </div>
                  );
                })}

                {usersPerCompany.map(({ company, users }) => (
                  <div key={company.id}>
                    <div style={{ color: '#555', fontSize: 10, margin: '8px 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>
                     {company.name}
                    </div>
                    {users.map(u => {
                      const uc = ROLE_COLORS[u.role];
                      const active = currentUser?.id === u.id;
                      // Verifica se este usuário tem perms customizadas no cadastro
                      const uProf = window.__profissionais__?.find(p => p.email === u.email);
                      const uHasCustom = uProf?.customPermissions !== null && uProf?.customPermissions !== undefined;
                      return (
                        <div key={u.id} onClick={() => switchUser(u.id)} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '6px 8px', borderRadius: 8, cursor: 'pointer',
                          background: active ? '#1f2f1f' : '#181818',
                          border: `1px solid ${active ? '#7ecb7e' : '#2a2a2a'}`,
                          marginBottom: 4,
                        }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: uc.bg, color: uc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            {u.name.split(' ').slice(0,2).map(n=>n[0]).join('')}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                              {u.name}
                              {uHasCustom && <span style={{ fontSize: 8, background: '#2d1a00', color: '#c97a3a', borderRadius: 3, padding: '1px 3px', fontWeight: 700 }}>✎</span>}
                            </div>
                            <div style={{ color: '#555', fontSize: 10 }}>{u.email}</div>
                          </div>
                          <span style={{ background: uc.bg, color: uc.color, borderRadius: 4, padding: '1px 5px', fontSize: 9, fontWeight: 700 }}>{ROLE_LABELS[u.role]}</span>
                          {active && <span style={{ color: '#7ecb7e', fontSize: 14 }}>●</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* TAB PERMISSÕES */}
            {tab === 'permissoes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

                {/* Badge de status */}
                {isSuperAdmin && (
                  <div style={{ padding: '6px 10px', background: '#1b1b1b', borderRadius: 8, border: '1px solid #BBA18844', color: '#BBA188', fontSize: 11, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
                    SUPER ADMIN — todas as permissões liberadas
                  </div>
                )}
                {isCompanyAdmin && (
                  <div style={{ padding: '6px 10px', background: '#1a2b1a', borderRadius: 8, border: '1px solid #7ecb7e44', color: '#7ecb7e', fontSize: 11, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
                    ADMIN DA EMPRESA — acesso total dentro de {MOCK_COMPANIES.find(c => c.id === companyId)?.name}
                  </div>
                )}
                {!isSuperAdmin && !isCompanyAdmin && hasCustom && (
                  <div style={{ padding: '6px 10px', background: '#2d1a00', borderRadius: 8, border: '1px solid #c97a3a44', color: '#c97a3a', fontSize: 11, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
                    Permissões personalizadas ativas
                  </div>
                )}
                {!isSuperAdmin && !isCompanyAdmin && !hasCustom && (
                  <div style={{ padding: '6px 10px', background: '#1a1a1a', borderRadius: 8, border: '1px solid #33333388', color: '#666', fontSize: 11, textAlign: 'center', marginBottom: 4 }}>
                    ● Permissões padrão do cargo
                  </div>
                )}

                {/* Grade de permissões agrupada */}
                {PERM_GROUPS.map(group => {
                  // Só mostra o grupo se tiver ao menos uma permissão ativa ou possível
                  const groupVisible = effectivePerms === '*' || group.perms.some(p =>
                    effectivePerms.includes(p) ||
                    (role && (ROLE_PERMISSIONS[role] as Permission[])?.includes(p))
                  );
                  if (!groupVisible) return null;

                  return (
                    <div key={group.label} style={{ border: '1px solid #222', borderRadius: 8, overflow: 'hidden' }}>
                      <div style={{ background: '#1a1a1a', padding: '4px 10px', fontSize: 9, fontWeight: 700, color: '#BBA188', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {group.label}
                      </div>
                      {group.perms.map(perm => {
                        const allowed = permAllowed(perm);
                        const isDefault = role && (ROLE_PERMISSIONS[role] as Permission[])?.includes(perm);
                        const isCustomOn  = hasCustom && allowed && !isDefault;
                        const isCustomOff = hasCustom && !allowed && isDefault;

                        return (
                          <div key={perm} style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '4px 10px',
                            background: isCustomOn ? 'rgba(106,191,105,0.07)' : isCustomOff ? 'rgba(220,80,80,0.05)' : 'transparent',
                            borderBottom: '1px solid #1a1a1a',
                          }}>
                            <span style={{
                              width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                              background: allowed ? (isCustomOn ? '#6abf69' : '#BBA188') : '#2a2a2a',
                              border: `1px solid ${allowed ? (isCustomOn ? '#6abf69' : '#BBA188') : '#444'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {allowed && (
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              )}
                            </span>
                            <span style={{
                              fontSize: 10, flex: 1,
                              color: allowed ? '#ccc' : '#3a3a3a',
                              textDecoration: isCustomOff ? 'line-through' : 'none',
                            }}>
                              {PERM_LABEL[perm] ?? perm}
                            </span>
                            {isCustomOn && (
                              <span style={{ fontSize: 8, background: '#1a2d1a', color: '#6abf69', borderRadius: 3, padding: '1px 4px', fontWeight: 700, flexShrink: 0 }}>+EXTRA</span>
                            )}
                            {isCustomOff && (
                              <span style={{ fontSize: 8, background: '#2d1a1a', color: '#e74c3c', borderRadius: 3, padding: '1px 4px', fontWeight: 700, flexShrink: 0 }}>REM.</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB EMPRESAS */}
            {tab === 'empresas' && (
              <div>
                <div style={{ color: '#555', fontSize: 10, marginBottom: 8, lineHeight: 1.5 }}>
                  Simula quais empresas o usuário atual consegue acessar.
                </div>
                {MOCK_COMPANIES.map(company => {
                  const acesso = canAccessCompany(company.id);
                  return (
                    <div key={company.id} style={{
                      padding: '10px 12px', borderRadius: 8, marginBottom: 8,
                      background: acesso ? 'rgba(106,191,105,0.08)' : 'rgba(220,80,80,0.06)',
                      border: `1px solid ${acesso ? '#6abf6933' : '#e74c3c33'}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#fff', fontWeight: 700 }}>🏢 {company.name}</span>
                        <span style={{ fontWeight: 700, fontSize: 11, color: acesso ? '#6abf69' : '#e74c3c', background: acesso ? 'rgba(106,191,105,0.15)' : 'rgba(220,80,80,0.15)', padding: '2px 8px', borderRadius: 4 }}>
                          {acesso ? '✓ Acesso' : '✗ Bloqueado'}
                        </span>
                      </div>
                      <div style={{ color: '#555', fontSize: 10, marginTop: 4 }}>ID: {company.id}</div>
                      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {MOCK_USERS.filter(u => u.companyId === company.id).map(u => (
                          <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: acesso ? '#888' : '#3a3a3a', padding: '2px 4px' }}>
                            <span>{u.name}</span>
                            <span style={{ color: ROLE_COLORS[u.role].color }}>{ROLE_LABELS[u.role]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div style={{ color: '#333', fontSize: 10, textAlign: 'center', marginTop: 4 }}>
                  Super Admin vê todas · Company Admin vê só a sua
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: '6px 12px', borderTop: '1px solid #1a1a1a', color: '#333', fontSize: 9, textAlign: 'center' }}>
            Remova este painel antes de ir para produção
          </div>
        </div>
      )}
    </div>
  );
}