'use client';

import { useState, useEffect } from 'react';
import { useRoleRedirect } from '@/components/ui/hooks/useRoleRedirect';
import { listarTickets, SuporteTicketAPI } from '@/services/suporteService';
import { listarEmpresas, EmpresaAPI } from '@/services/empresaService';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import {
  Container, Header, Title, Subtitle,
  StatsRow, StatBox, StatBoxValue, StatBoxLabel,
  Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  Btn,
  DetailPanel, DetailHeader, DetailClose, DetailTitle, DetailSub,
  DetailSection, DetailSectionTitle,
  InfoRow, InfoLabel, InfoValue,
  LogList, LogItem, LogDot, LogText, LogTime,
  ImpersonateBar, ImpersonateText, ImpersonateBtn,
  EmptyState,
  TicketCard, TicketHeader, TicketTitle, TicketMeta, TicketBody,
  TicketBadge,
  TabRow, TabBtn,
} from './styles';

interface Empresa {
  id: string;
  nome: string;
  plano: string;
  status: 'ativo' | 'suspenso' | 'trial';
  adminNome: string;
  adminEmail: string;
  usuarios: number;
  ultimoAcesso: string;
  dataCadastro: string;
  mrr: number;
}

interface Ticket {
  id: number;
  empresaId: string;
  empresaNome: string;
  assunto: string;
  status: 'aberto' | 'em_andamento' | 'resolvido';
  prioridade: 'alta' | 'media' | 'baixa';
  data: string;
  descricao: string;
}


const LOGS_POR_EMPRESA: Record<string, { acao: string; tempo: string; tipo: string }[]> = {
  e1: [
    { acao: 'Usuário "juliana@bellavita.com" fez login',      tempo: 'Hoje, 09:14',    tipo: 'info'    },
    { acao: 'Agendamento criado para Ana Beatriz Costa',       tempo: 'Hoje, 09:22',    tipo: 'success' },
    { acao: 'Relatório de comissões exportado',                tempo: 'Ontem, 17:45',   tipo: 'info'    },
    { acao: 'Produto "Toxina Botulínica" com estoque baixo',   tempo: 'Ontem, 10:10',   tipo: 'warning' },
    { acao: 'Novo paciente cadastrado: Marina Souza',          tempo: '19/02/2025',     tipo: 'success' },
  ],
  e3: [
    { acao: 'Usuário "carlos@dermasaude.com" fez login',       tempo: 'Hoje, 11:02',    tipo: 'info'    },
    { acao: 'Lote #2024-BR-1122 cadastrado',                   tempo: 'Hoje, 10:30',    tipo: 'success' },
    { acao: 'Consentimento assinado por Patrícia Alves',       tempo: 'Ontem, 16:00',   tipo: 'success' },
    { acao: 'Fatura Enterprise gerada — R$ 749,00',            tempo: '15/02/2025',     tipo: 'info'    },
  ],
  e2: [
    { acao: 'Usuário "ana@studioana.com" fez login',           tempo: 'Ontem, 15:30',   tipo: 'info'    },
    { acao: 'Trial — 11 dias restantes',                       tempo: 'Ontem, 15:30',   tipo: 'warning' },
    { acao: 'Primeira agenda criada',                          tempo: '16/01/2025',     tipo: 'success' },
  ],
  e4: [
    { acao: 'Conta suspensa por inadimplência',                tempo: '06/01/2025',     tipo: 'danger'  },
    { acao: 'Último login antes da suspensão',                 tempo: '05/01/2025',     tipo: 'info'    },
  ],
  e5: [
    { acao: 'Usuário "fernanda@espacobeleza.com" fez login',   tempo: 'Ontem, 18:45',   tipo: 'info'    },
    { acao: 'Estoque atualizado — 12 produtos',                tempo: 'Ontem, 17:20',   tipo: 'success' },
  ],
};

const statusConfig = {
  ativo:    { bg: 'rgba(138,117,96,0.12)',  color: '#8a7560',  label: 'Ativo'    },
  trial:    { bg: 'rgba(59,130,246,0.1)',   color: '#3b82f6',  label: 'Trial'    },
  suspenso: { bg: 'rgba(231,76,60,0.12)',   color: '#e74c3c',  label: 'Suspenso' },
};

const planConfig = {
  Starter:    { bg: 'rgba(59,130,246,0.1)',   color: '#3b82f6' },
  Pro:        { bg: 'rgba(187,161,136,0.15)', color: '#8a7560' },
  Enterprise: { bg: 'rgba(27,27,27,0.08)',    color: '#1b1b1b' },
};

const ticketStatusConfig = {
  aberto:       { bg: 'rgba(231,76,60,0.1)',    color: '#e74c3c', label: 'Aberto'        },
  em_andamento: { bg: 'rgba(214,138,0,0.1)',    color: '#d68a00', label: 'Em andamento'  },
  resolvido:    { bg: 'rgba(138,117,96,0.12)',  color: '#8a7560', label: 'Resolvido'     },
};

const prioridadeConfig = {
  alta:  { color: '#e74c3c', label: 'Alta'  },
  media: { color: '#d68a00', label: 'Média' },
  baixa: { color: '#8a7560', label: 'Baixa' },
};

const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

export default function Suporte() {
  const allowed = useRoleRedirect({ superAdminOnly: true });

  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selected, setSelected]       = useState<Empresa | null>(null);
  const [impersonating, setImpersonating] = useState<Empresa | null>(null);
  const [confirmImp, setConfirmImp]   = useState<Empresa | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [sucessModal, setSucessModal] = useState<{ title: string; message: string } | null>(null);
  const [tab, setTab]                 = useState<'empresas' | 'tickets'>('empresas');
  const [ticketTab, setTicketTab]     = useState<'aberto' | 'em_andamento' | 'resolvido' | 'todos'>('todos');
  const [allTickets, setAllTickets]   = useState<Ticket[]>([]);
  const [empresas,   setEmpresas]     = useState<Empresa[]>([]);

  useEffect(() => {
    listarTickets().then((data: SuporteTicketAPI[]) => {
      const mapped: Ticket[] = data.map(t => {
        const rawStatus = (t.status || 'aberto').toLowerCase().replace(/\s+/g, '_');
        const status: 'aberto' | 'em_andamento' | 'resolvido' =
          rawStatus === 'resolvido' ? 'resolvido' :
          rawStatus === 'em_andamento' ? 'em_andamento' : 'aberto';
        const rawPrio = (t.prioridade || 'media').toLowerCase();
        const prioridade: 'alta' | 'media' | 'baixa' =
          rawPrio === 'alta' ? 'alta' : rawPrio === 'baixa' ? 'baixa' : 'media';
        return {
          id:          t.id,
          empresaId:   t.empresaId ? String(t.empresaId) : '—',
          empresaNome: t.empresaNome || t.nomeAutor || '—',
          assunto:     t.titulo,
          status,
          prioridade,
          data:        t.criadoEm ? new Date(t.criadoEm).toLocaleDateString('pt-BR') : '—',
          descricao:   t.descricao,
        };
      });
      if (mapped.length > 0) setAllTickets(mapped);
    }).catch(() => {});

    listarEmpresas().then((data: EmpresaAPI[]) => {
      const mapped: Empresa[] = data.map(e => ({
        id:           String(e.id),
        nome:         e.nome || '',
        plano:        e.plano || 'Starter',
        status:       (e.status === 'suspenso' ? 'suspenso' : e.ativo ? 'ativo' : 'trial') as 'ativo' | 'suspenso' | 'trial',
        adminNome:    e.adminNome || '',
        adminEmail:   e.adminEmail || '',
        usuarios:     e.usuarios || 0,
        ultimoAcesso: '—',
        dataCadastro: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : '—',
        mrr:          e.valor || 0,
      }));
      if (mapped.length > 0) setEmpresas(mapped);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!allowed) return null;

  const filtered = empresas.filter(e => {
    const matchSearch = e.nome.toLowerCase().includes(search.toLowerCase()) || e.adminEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Todos' || e.status === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const tickets = ticketTab === 'todos' ? allTickets : allTickets.filter(t => t.status === ticketTab);

  function toggle(name: string) {
    setOpenDropdown(p => p === name ? null : name);
  }

  function handleImpersonate(e: Empresa) {
    setConfirmImp(e);
  }

  function handleConfirmImpersonate() {
    if (!confirmImp) return;
    setImpersonating(confirmImp);
    setConfirmImp(null);
    setSucessModal({ title: 'Modo suporte ativo', message: `Você está visualizando o painel de "${confirmImp.nome}" como administrador de suporte. Qualquer ação será registrada no log de auditoria.` });
  }

  function handleExitImpersonate() {
    setConfirmExit(true);
  }

  function confirmExitImpersonate() {
    setImpersonating(null);
    setConfirmExit(false);
  }

  return (
    <Container>
      {impersonating && (
        <ImpersonateBar>
          <ImpersonateText>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Modo Suporte ativo — visualizando: <strong>{impersonating.nome}</strong>
          </ImpersonateText>
          <ImpersonateBtn onClick={handleExitImpersonate}>Sair do modo suporte</ImpersonateBtn>
        </ImpersonateBar>
      )}

      <Header>
        <div>
          <Title>Suporte & Impersonação</Title>
          <Subtitle>Acesse o painel de qualquer empresa para prestar suporte</Subtitle>
        </div>
      </Header>

      <StatsRow>
        <StatBox>
          <StatBoxValue>{empresas.filter(e => e.status === 'ativo').length}</StatBoxValue>
          <StatBoxLabel>Ativas</StatBoxLabel>
        </StatBox>
        <StatBox>
          <StatBoxValue>{empresas.filter(e => e.status === 'trial').length}</StatBoxValue>
          <StatBoxLabel>Em trial</StatBoxLabel>
        </StatBox>
        <StatBox $alert>
          <StatBoxValue>{empresas.filter(e => e.status === 'suspenso').length}</StatBoxValue>
          <StatBoxLabel>Suspensas</StatBoxLabel>
        </StatBox>
        <StatBox>
          <StatBoxValue>{allTickets.filter(t => t.status === 'aberto').length}</StatBoxValue>
          <StatBoxLabel>Tickets abertos</StatBoxLabel>
        </StatBox>
      </StatsRow>

      <TabRow>
        <TabBtn $active={tab === 'empresas'} onClick={() => setTab('empresas')}>Empresas</TabBtn>
        <TabBtn $active={tab === 'tickets'}  onClick={() => setTab('tickets')}>Tickets de Suporte</TabBtn>
      </TabRow>

      {tab === 'empresas' && (
        <>
          <Controls>
            <SearchBarWrapper>
              <SearchIconWrap>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </SearchIconWrap>
              <SearchInputStyled placeholder="Buscar empresa ou e-mail..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
            </SearchBarWrapper>
            <FilterRow>
              <DropdownWrapper>
                <DropdownBtn onClick={() => toggle('status')}>
                  {filterStatus}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </DropdownBtn>
                {openDropdown === 'status' && (
                  <DropdownList>
                    {['Todos', 'Ativo', 'Trial', 'Suspenso'].map(s => (
                      <DropdownItem key={s} $active={filterStatus === s} onClick={() => { setFilterStatus(s); toggle('status'); }}>
                        {s}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                )}
              </DropdownWrapper>
            </FilterRow>
          </Controls>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <TableWrapper>
                <Table>
                  <Thead>
                    <tr>
                      <Th>Empresa</Th>
                      <Th>Plano</Th>
                      <Th>Status</Th>
                      <Th>Último acesso</Th>
                      <Th>Ações</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {filtered.length === 0 ? (
                      <tr><Td colSpan={5} style={{ textAlign: 'center', color: '#bbb', padding: 32 }}>Nenhuma empresa encontrada</Td></tr>
                    ) : filtered.map(e => (
                      <Tr key={e.id} onClick={() => setSelected(e)} style={{ cursor: 'pointer', background: selected?.id === e.id ? 'rgba(187,161,136,0.05)' : undefined }}>
                        <Td>
                          <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.85rem' }}>{e.nome}</div>
                          <div style={{ fontSize: '0.72rem', color: '#aaa' }}>{e.adminEmail}</div>
                        </Td>
                        <Td>
                          <Badge $bg={planConfig[e.plano as keyof typeof planConfig].bg} $color={planConfig[e.plano as keyof typeof planConfig].color}>{e.plano}</Badge>
                        </Td>
                        <Td>
                          <Badge $bg={statusConfig[e.status].bg} $color={statusConfig[e.status].color}>{statusConfig[e.status].label}</Badge>
                        </Td>
                        <Td style={{ fontSize: '0.78rem', color: '#888' }}>{e.ultimoAcesso}</Td>
                        <Td>
                          <ActionGroup>
                            <IconBtn title="Ver detalhes" onClick={(ev: any) => { ev.stopPropagation(); setSelected(e); }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            </IconBtn>
                            <IconBtn title="Entrar como suporte" onClick={(ev: any) => { ev.stopPropagation(); handleImpersonate(e); }} style={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)' }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                            </IconBtn>
                          </ActionGroup>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableWrapper>
            </div>

            {selected && (
              <DetailPanel>
                <DetailHeader>
                  <div>
                    <DetailTitle>{selected.nome}</DetailTitle>
                    <DetailSub>{selected.adminEmail}</DetailSub>
                  </div>
                  <DetailClose onClick={() => setSelected(null)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </DetailClose>
                </DetailHeader>

                <DetailSection>
                  <DetailSectionTitle>Informações</DetailSectionTitle>
                  <InfoRow><InfoLabel>Plano</InfoLabel><InfoValue><Badge $bg={planConfig[selected.plano as keyof typeof planConfig].bg} $color={planConfig[selected.plano as keyof typeof planConfig].color}>{selected.plano}</Badge></InfoValue></InfoRow>
                  <InfoRow><InfoLabel>Status</InfoLabel><InfoValue><Badge $bg={statusConfig[selected.status].bg} $color={statusConfig[selected.status].color}>{statusConfig[selected.status].label}</Badge></InfoValue></InfoRow>
                  <InfoRow><InfoLabel>Administrador</InfoLabel><InfoValue>{selected.adminNome}</InfoValue></InfoRow>
                  <InfoRow><InfoLabel>Usuários</InfoLabel><InfoValue>{selected.usuarios}</InfoValue></InfoRow>
                  <InfoRow><InfoLabel>MRR</InfoLabel><InfoValue style={{ color: '#BBA188', fontWeight: 700 }}>{fmt(selected.mrr)}</InfoValue></InfoRow>
                  <InfoRow><InfoLabel>Cadastro</InfoLabel><InfoValue>{selected.dataCadastro}</InfoValue></InfoRow>
                  <InfoRow><InfoLabel>Último acesso</InfoLabel><InfoValue>{selected.ultimoAcesso}</InfoValue></InfoRow>
                </DetailSection>

                <DetailSection>
                  <DetailSectionTitle>Log de Atividades</DetailSectionTitle>
                  <LogList>
                    {(LOGS_POR_EMPRESA[selected.id] ?? []).map((log, i) => (
                      <LogItem key={i}>
                        <LogDot $tipo={log.tipo} />
                        <LogText>{log.acao}</LogText>
                        <LogTime>{log.tempo}</LogTime>
                      </LogItem>
                    ))}
                  </LogList>
                </DetailSection>

                <div style={{ padding: '0 20px 20px' }}>
                  <Btn $variant="primary" $full onClick={() => handleImpersonate(selected)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    Entrar como Suporte
                  </Btn>
                </div>
              </DetailPanel>
            )}
          </div>
        </>
      )}

      {tab === 'tickets' && (
        <>
          <TabRow style={{ marginBottom: 16 }}>
            {(['todos', 'aberto', 'em_andamento', 'resolvido'] as const).map(s => (
              <TabBtn key={s} $active={ticketTab === s} $small onClick={() => setTicketTab(s)}>
                {s === 'todos' ? 'Todos' : ticketStatusConfig[s].label}
              </TabBtn>
            ))}
          </TabRow>

          {tickets.length === 0 ? (
            <EmptyState>Nenhum ticket encontrado.</EmptyState>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tickets.map(t => (
                <TicketCard key={t.id}>
                  <TicketHeader>
                    <TicketTitle>{t.assunto}</TicketTitle>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <TicketBadge $color={prioridadeConfig[t.prioridade].color}>
                        {prioridadeConfig[t.prioridade].label}
                      </TicketBadge>
                      <Badge $bg={ticketStatusConfig[t.status].bg} $color={ticketStatusConfig[t.status].color}>
                        {ticketStatusConfig[t.status].label}
                      </Badge>
                    </div>
                  </TicketHeader>
                  <TicketMeta>{t.empresaNome} · {t.data}</TicketMeta>
                  <TicketBody>{t.descricao}</TicketBody>
                  <div style={{ marginTop: 14 }}>
                    <Btn $size="sm" onClick={() => {
                      const emp = empresas.find(e => e.id === t.empresaId);
                      if (emp) handleImpersonate(emp);
                    }}>
                      Entrar na empresa para suporte →
                    </Btn>
                  </div>
                </TicketCard>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!confirmImp}
        title="Entrar em modo suporte?"
        message={`Você irá acessar o painel de "${confirmImp?.nome}" com permissões de suporte. Esta ação será registrada no log de auditoria.`}
        confirmText="Entrar como Suporte"
        cancelText="Cancelar"
        onConfirm={handleConfirmImpersonate}
        onCancel={() => setConfirmImp(null)}
      />

      <ConfirmModal
        isOpen={confirmExit}
        title="Sair do modo suporte?"
        message="Você irá retornar ao painel do Super Admin. A sessão de suporte será encerrada."
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={confirmExitImpersonate}
        onCancel={() => setConfirmExit(false)}
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