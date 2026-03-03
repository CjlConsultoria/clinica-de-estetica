'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRoleRedirect } from '@/components/ui/hooks/useRoleRedirect';
import { listarNotificacoes, marcarComoLida as marcarComoLidaAPI, marcarTodasComoLidas, limparLidas, NotificacaoAPI } from '@/services/notificacaoService';
import Button from '@/components/ui/button';
import SucessModal from '@/components/modals/sucessModal';
import ConfirmModal from '@/components/modals/confirmModal';
import { useNotificacoesContext } from '@/contexts/NotificacoesContext';

import {
  Container, Header, Title, Subtitle, HeaderActions,
  StatsRow, StatBox, StatBoxValue, StatBoxLabel,
  TabRow, TabBtn,
  Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  DropdownWrapper, DropdownBtn, DropdownList, DropdownItem,
  NotifList, NotifCard, NotifCardInner, NotifIconWrap, NotifContent,
  NotifHeader, NotifTitle, NotifMeta, NotifBody, NotifTime, UnreadDot,
  Badge, BadgeNova, BadgeEmpresa,
  ActionBtn,
  DetailOverlay, DetailPanel, DetailHeader, DetailTitle, DetailClose,
  DetailBody, DetailSection, DetailSectionTitle, InfoRow, InfoLabel, InfoValue,
  DetailFooter,
  EmptyState, EmptyIcon,
} from './styles';

export type NotifTipo =
  | 'ticket'
  | 'pagamento'
  | 'sistema'
  | 'empresa'
  | 'seguranca'
  | 'relatorio';

export type NotifPrioridade = 'alta' | 'media' | 'baixa';

export interface Notificacao {
  id: number;
  tipo: NotifTipo;
  prioridade: NotifPrioridade;
  titulo: string;
  descricao: string;
  empresaId: string | null;
  empresaNome: string | null;
  data: string;
  dataISO: string;
  lida: boolean;
  acao?: string;
  meta?: Record<string, string>;
}

function TipoIcon({ tipo }: { tipo: NotifTipo }) {
  const props = {
    width:             16,
    height:            16,
    viewBox:           '0 0 24 24',
    fill:              'none',
    stroke:            'currentColor',
    strokeWidth:       1.8,
    strokeLinecap:     'round' as const,
    strokeLinejoin:    'round' as const,
  };

  if (tipo === 'ticket') return (
    <svg {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9"  y1="10" x2="9"  y2="10" strokeWidth={2.5}/>
      <line x1="12" y1="10" x2="12" y2="10" strokeWidth={2.5}/>
      <line x1="15" y1="10" x2="15" y2="10" strokeWidth={2.5}/>
    </svg>
  );

  if (tipo === 'pagamento') return (
    <svg {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );

  if (tipo === 'sistema') return (
    <svg {...props}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );

  if (tipo === 'empresa') return (
    <svg {...props}>
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <line x1="2"  y1="9"  x2="22" y2="9"/>
      <line x1="8"  y1="9"  x2="8"  y2="21"/>
      <line x1="16" y1="9"  x2="16" y2="21"/>
      <line x1="2"  y1="15" x2="8"  y2="15"/>
    </svg>
  );

  if (tipo === 'seguranca') return (
    <svg {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  return (
    <svg {...props}>
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
      <line x1="2"  y1="20" x2="22" y2="20"/>
    </svg>
  );
}


const TIPO_CONFIG: Record<NotifTipo, { label: string; bg: string; color: string }> = {
  ticket:    { label: 'Suporte',   bg: 'rgba(231,76,60,0.08)',   color: '#e74c3c' },
  pagamento: { label: 'Pagamento', bg: 'rgba(46,204,113,0.08)',  color: '#27ae60' },
  sistema:   { label: 'Sistema',   bg: 'rgba(52,152,219,0.08)',  color: '#2980b9' },
  empresa:   { label: 'Empresa',   bg: 'rgba(187,161,136,0.12)', color: '#8a7560' },
  seguranca: { label: 'Segurança', bg: 'rgba(192,57,43,0.08)',   color: '#c0392b' },
  relatorio: { label: 'Relatório', bg: 'rgba(52,73,94,0.08)',    color: '#2c3e50' },
};

const PRIORIDADE_CONFIG: Record<NotifPrioridade, { label: string; bg: string; color: string }> = {
  alta:  { label: 'Alta',  bg: 'rgba(231,76,60,0.1)',   color: '#e74c3c' },
  media: { label: 'Média', bg: 'rgba(214,138,0,0.1)',   color: '#d68a00' },
  baixa: { label: 'Baixa', bg: 'rgba(138,117,96,0.12)', color: '#8a7560' },
};


type TabTipo = 'todas' | NotifTipo;

const TAB_OPTIONS: { key: TabTipo; label: string }[] = [
  { key: 'todas',     label: 'Todas'     },
  { key: 'ticket',    label: 'Suporte'   },
  { key: 'pagamento', label: 'Pagamento' },
  { key: 'empresa',   label: 'Empresa'   },
  { key: 'seguranca', label: 'Segurança' },
  { key: 'sistema',   label: 'Sistema'   },
  { key: 'relatorio', label: 'Relatório' },
];

export default function Notificacoes() {
  const allowed = useRoleRedirect({ superAdminOnly: true });
  const { setUnreadCount } = useNotificacoesContext();

  const [notifs,              setNotifs]             = useState<Notificacao[]>([]);
  const [tabTipo,             setTabTipo]            = useState<TabTipo>('todas');
  const [tabLida,             setTabLida]            = useState<'todas' | 'nao_lidas' | 'lidas'>('todas');
  const [search,              setSearch]             = useState('');
  const [filterPrioridade,    setFilterPrioridade]   = useState<NotifPrioridade | 'todas'>('todas');
  const [openDropdown,        setOpenDropdown]       = useState(false);
  const [selected,            setSelected]           = useState<Notificacao | null>(null);
  const [confirmMarcarTodas,  setConfirmMarcarTodas] = useState(false);
  const [confirmLimpar,       setConfirmLimpar]      = useState(false);
  const [sucessModal,         setSucessModal]        = useState<{ title: string; message: string } | null>(null);

  // Sempre que notifs mudar, sincroniza o contador global do navbar
  useEffect(() => {
    const count = notifs.filter(n => !n.lida).length;
    setUnreadCount(count);
  }, [notifs, setUnreadCount]);

  useEffect(() => {
    listarNotificacoes().then((data: NotificacaoAPI[]) => {
      const mapped: Notificacao[] = data.map(n => ({
        id: n.id,
        tipo: (n.tipo || 'sistema') as NotifTipo,
        prioridade: (n.prioridade || 'media') as NotifPrioridade,
        titulo: n.titulo,
        descricao: n.descricao || '',
        empresaId: n.empresaId ? String(n.empresaId) : null,
        empresaNome: n.empresaNome || null,
        data: n.criadoEm ? new Date(n.criadoEm).toLocaleDateString('pt-BR') : '—',
        dataISO: n.criadoEm || new Date().toISOString(),
        lida: n.lida ?? false,
      }));
      setNotifs(mapped);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!allowed) return null;

  const totalNaoLidas   = notifs.filter(n => !n.lida).length;
  const totalAlta       = notifs.filter(n => n.prioridade === 'alta' && !n.lida).length;
  const totalHoje       = notifs.filter(n => n.data.startsWith('Hoje')).length;
  const totalTickets    = notifs.filter(n => n.tipo === 'ticket' && !n.lida).length;
  const totalPagamentos = notifs.filter(n => n.tipo === 'pagamento').length;

  const filtradas = useMemo(() => {
    return notifs.filter(n => {
      if (tabTipo !== 'todas' && n.tipo !== tabTipo)              return false;
      if (tabLida === 'nao_lidas' && n.lida)                      return false;
      if (tabLida === 'lidas'     && !n.lida)                     return false;
      if (filterPrioridade !== 'todas' && n.prioridade !== filterPrioridade) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !n.titulo.toLowerCase().includes(q) &&
          !n.descricao.toLowerCase().includes(q) &&
          !(n.empresaNome ?? '').toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [notifs, tabTipo, tabLida, filterPrioridade, search]);

  function marcarLida(id: number) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    if (selected?.id === id) setSelected(p => p ? { ...p, lida: true } : p);
    marcarComoLidaAPI(id).catch(() => {});
  }

  function marcarNaoLida(id: number) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: false } : n));
    if (selected?.id === id) setSelected(p => p ? { ...p, lida: false } : p);
  }

  function handleMarcarTodasLidas() {
    setNotifs(prev => prev.map(n => ({ ...n, lida: true })));
    setConfirmMarcarTodas(false);
    setSucessModal({ title: 'Tudo marcado como lido', message: 'Todas as notificações foram marcadas como lidas.' });
    marcarTodasComoLidas().catch(() => {});
  }

  function handleLimparLidas() {
    setNotifs(prev => prev.filter(n => !n.lida));
    setConfirmLimpar(false);
    if (selected?.lida) setSelected(null);
    setSucessModal({ title: 'Notificações limpas', message: 'Todas as notificações lidas foram removidas.' });
    limparLidas().catch(() => {});
  }

  function abrirDetalhe(n: Notificacao) {
    setSelected(n);
    if (!n.lida) marcarLida(n.id);
  }

  return (
    <Container onClick={() => setOpenDropdown(false)}>
      <Header>
        <div>
          <Title>Notificações</Title>
          <Subtitle>Central de alertas e eventos do sistema</Subtitle>
        </div>
        <HeaderActions>
          {totalNaoLidas > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmMarcarTodas(true)}
              icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              }
            >
              Marcar todas como lidas
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmLimpar(true)}
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            }
          >
            Limpar lidas
          </Button>
        </HeaderActions>
      </Header>

      <StatsRow>
        <StatBox $color="#e74c3c">
          <StatBoxValue>{totalNaoLidas}</StatBoxValue>
          <StatBoxLabel>Não lidas</StatBoxLabel>
        </StatBox>
        <StatBox $color="#e74c3c">
          <StatBoxValue>{totalAlta}</StatBoxValue>
          <StatBoxLabel>Alta prioridade</StatBoxLabel>
        </StatBox>
        <StatBox $color="#BBA188">
          <StatBoxValue>{totalHoje}</StatBoxValue>
          <StatBoxLabel>Hoje</StatBoxLabel>
        </StatBox>
        <StatBox $color="#e74c3c">
          <StatBoxValue>{totalTickets}</StatBoxValue>
          <StatBoxLabel>Tickets abertos</StatBoxLabel>
        </StatBox>
        <StatBox $color="#27ae60">
          <StatBoxValue>{totalPagamentos}</StatBoxValue>
          <StatBoxLabel>Pagamentos</StatBoxLabel>
        </StatBox>
      </StatsRow>

      <TabRow>
        {TAB_OPTIONS.map(opt => {
          const unread = opt.key === 'todas'
            ? 0
            : notifs.filter(n => n.tipo === opt.key && !n.lida).length;
          return (
            <TabBtn
              key={opt.key}
              $active={tabTipo === opt.key}
              $small
              onClick={() => setTabTipo(opt.key)}
            >
              {opt.label}
              {unread > 0 && (
                <span style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  minWidth:       15,
                  height:         15,
                  borderRadius:   8,
                  background:     tabTipo === opt.key ? 'rgba(255,255,255,0.35)' : '#e74c3c',
                  color:          'white',
                  fontSize:       '0.55rem',
                  fontWeight:     800,
                  marginLeft:     5,
                  padding:        '0 3px',
                  lineHeight:     1,
                  letterSpacing:  '-0.2px',
                }}>
                  {unread}
                </span>
              )}
            </TabBtn>
          );
        })}
      </TabRow>

      <TabRow style={{ marginBottom: 16 }}>
        {([
          { key: 'todas',     label: 'Todas'                         },
          { key: 'nao_lidas', label: `Não lidas (${totalNaoLidas})`  },
          { key: 'lidas',     label: 'Lidas'                         },
        ] as const).map(opt => (
          <TabBtn
            key={opt.key}
            $active={tabLida === opt.key}
            $small
            onClick={() => setTabLida(opt.key)}
          >
            {opt.label}
          </TabBtn>
        ))}
      </TabRow>

      <Controls onClick={e => e.stopPropagation()}>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </SearchIconWrap>
          <SearchInputStyled
            placeholder="Buscar notificação ou empresa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchBarWrapper>

        <DropdownWrapper>
          <DropdownBtn onClick={() => setOpenDropdown(p => !p)}>
            Prioridade: {filterPrioridade === 'todas' ? 'Todas' : PRIORIDADE_CONFIG[filterPrioridade].label}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </DropdownBtn>
          {openDropdown && (
            <DropdownList>
              <DropdownItem $active={filterPrioridade === 'todas'} onClick={() => { setFilterPrioridade('todas'); setOpenDropdown(false); }}>
                Todas
              </DropdownItem>
              {(['alta', 'media', 'baixa'] as NotifPrioridade[]).map(p => (
                <DropdownItem
                  key={p}
                  $active={filterPrioridade === p}
                  onClick={() => { setFilterPrioridade(p); setOpenDropdown(false); }}
                >
                  {PRIORIDADE_CONFIG[p].label}
                </DropdownItem>
              ))}
            </DropdownList>
          )}
        </DropdownWrapper>

        <span style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 500 }}>
          {filtradas.length} notificaç{filtradas.length !== 1 ? 'ões' : 'ão'}
        </span>
      </Controls>

      {filtradas.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </EmptyIcon>
          <div style={{ fontWeight: 700, color: '#888' }}>Nenhuma notificação encontrada</div>
          <div>Tente ajustar os filtros ou aguarde novos eventos do sistema.</div>
        </EmptyState>
      ) : (
        <NotifList>
          {filtradas.map(n => {
            const tc = TIPO_CONFIG[n.tipo];
            const pc = PRIORIDADE_CONFIG[n.prioridade];
            return (
              <NotifCard
                key={n.id}
                $lida={n.lida}
                onClick={() => abrirDetalhe(n)}
              >
                <NotifCardInner>
                  {!n.lida && <UnreadDot style={{ position: 'absolute', top: 18, right: 22 }} />}
                  <NotifIconWrap $bg={tc.bg} $color={tc.color}>
                    <TipoIcon tipo={n.tipo} />
                  </NotifIconWrap>

                  <NotifContent>
                    <NotifHeader>
                      <NotifTitle $lida={n.lida}>{n.titulo}</NotifTitle>
                      <NotifTime>{n.data}</NotifTime>
                    </NotifHeader>
                    <NotifMeta>
                      <Badge $bg={tc.bg} $color={tc.color}>{tc.label}</Badge>
                      <Badge $bg={pc.bg} $color={pc.color}>{pc.label}</Badge>
                      {!n.lida && <BadgeNova>Nova</BadgeNova>}
                      {n.empresaNome && <BadgeEmpresa>{n.empresaNome}</BadgeEmpresa>}
                    </NotifMeta>
                    <NotifBody $lida={n.lida}>{n.descricao}</NotifBody>
                  </NotifContent>
                </NotifCardInner>

                <div
                  style={{ padding: '0 22px 14px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}
                  onClick={e => e.stopPropagation()}
                >
                  {n.lida ? (
                    <ActionBtn onClick={() => marcarNaoLida(n.id)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8"  x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      Marcar não lida
                    </ActionBtn>
                  ) : (
                    <ActionBtn onClick={() => marcarLida(n.id)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      Marcar lida
                    </ActionBtn>
                  )}
                  <ActionBtn onClick={() => abrirDetalhe(n)}>
                    Ver detalhes →
                  </ActionBtn>
                </div>
              </NotifCard>
            );
          })}
        </NotifList>
      )}

      {selected && (
        <>
          <DetailOverlay onClick={() => setSelected(null)} />
          <DetailPanel onClick={e => e.stopPropagation()}>
            <DetailHeader>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{
                    width:           32,
                    height:          32,
                    borderRadius:    9,
                    background:      TIPO_CONFIG[selected.tipo].bg,
                    border:          `1.5px solid ${TIPO_CONFIG[selected.tipo].color}22`,
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    color:           TIPO_CONFIG[selected.tipo].color,
                    flexShrink:      0,
                  }}>
                    <TipoIcon tipo={selected.tipo} />
                  </div>
                  <Badge $bg={TIPO_CONFIG[selected.tipo].bg} $color={TIPO_CONFIG[selected.tipo].color}>
                    {TIPO_CONFIG[selected.tipo].label}
                  </Badge>
                  <Badge $bg={PRIORIDADE_CONFIG[selected.prioridade].bg} $color={PRIORIDADE_CONFIG[selected.prioridade].color}>
                    {PRIORIDADE_CONFIG[selected.prioridade].label}
                  </Badge>
                </div>
                <DetailTitle>{selected.titulo}</DetailTitle>
                <div style={{ fontSize: '0.74rem', color: '#bbb', marginTop: 4 }}>{selected.data}</div>
              </div>
              <DetailClose onClick={() => setSelected(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </DetailClose>
            </DetailHeader>

            <DetailBody>
              <DetailSection>
                <DetailSectionTitle>Descrição</DetailSectionTitle>
                <p style={{ fontSize: '0.84rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
                  {selected.descricao}
                </p>
              </DetailSection>

              {selected.empresaNome && (
                <DetailSection>
                  <DetailSectionTitle>Empresa</DetailSectionTitle>
                  <InfoRow>
                    <InfoLabel>Nome</InfoLabel>
                    <InfoValue>{selected.empresaNome}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>ID</InfoLabel>
                    <InfoValue style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: '#aaa' }}>
                      {selected.empresaId}
                    </InfoValue>
                  </InfoRow>
                </DetailSection>
              )}

              {selected.meta && Object.keys(selected.meta).length > 0 && (
                <DetailSection>
                  <DetailSectionTitle>Detalhes</DetailSectionTitle>
                  {Object.entries(selected.meta).map(([key, val]) => (
                    <InfoRow key={key}>
                      <InfoLabel>{key}</InfoLabel>
                      <InfoValue>{val}</InfoValue>
                    </InfoRow>
                  ))}
                </DetailSection>
              )}

              <DetailSection>
                <DetailSectionTitle>Status</DetailSectionTitle>
                <InfoRow>
                  <InfoLabel>Lida</InfoLabel>
                  <InfoValue>
                    <Badge
                      $bg={selected.lida ? 'rgba(138,117,96,0.1)' : 'rgba(231,76,60,0.1)'}
                      $color={selected.lida ? '#8a7560' : '#e74c3c'}
                    >
                      {selected.lida ? 'Sim' : 'Não'}
                    </Badge>
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Data/hora</InfoLabel>
                  <InfoValue>{selected.data}</InfoValue>
                </InfoRow>
              </DetailSection>
            </DetailBody>

            <DetailFooter>
              {selected.lida ? (
                <Button type="button" variant="outline" size="sm" onClick={() => marcarNaoLida(selected.id)}>
                  Marcar como não lida
                </Button>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => marcarLida(selected.id)}>
                  Marcar como lida
                </Button>
              )}
              {selected.acao && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setSucessModal({ title: 'Ação iniciada', message: `Redirecionando para: ${selected.acao}` })}
                >
                  {selected.acao} →
                </Button>
              )}
            </DetailFooter>
          </DetailPanel>
        </>
      )}

      <ConfirmModal
        isOpen={confirmMarcarTodas}
        title="Marcar todas como lidas?"
        message="Todas as notificações não lidas serão marcadas como lidas."
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleMarcarTodasLidas}
        onCancel={() => setConfirmMarcarTodas(false)}
      />
      <ConfirmModal
        isOpen={confirmLimpar}
        title="Limpar notificações lidas?"
        message="Todas as notificações já lidas serão removidas permanentemente da lista."
        confirmText="Limpar"
        cancelText="Cancelar"
        onConfirm={handleLimparLidas}
        onCancel={() => setConfirmLimpar(false)}
      />
      <SucessModal
        isOpen={!!sucessModal}
        title={sucessModal?.title ?? ''}
        message={sucessModal?.message ?? ''}
        onClose={() => setSucessModal(null)}
      />
    </Container>
  );
}