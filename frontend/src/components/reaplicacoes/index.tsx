'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import { listarAplicacoesVencendo, AplicacaoVencendoResponse } from '@/services/reaplicacoesApi';
import ErrorModal from '@/components/modals/errorModal';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  ToggleGroup, ToggleBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  FormGrid, AlertBanner, AlertBannerIcon, AlertBannerText,
  EmptyState,
  CardsGrid, ReapCard, ReapCardHeader, ReapAvatar, ReapPatientName, ReapPatientSub,
  ReapCardBody, ReapRow, ReapLabel, ReapValue, ReapDaysTag, ReapCardFooter,
  CardsContainer, TableContainer,
  PaginationWrapper, PaginationInfo, PaginationControls,
  PageButton, PageEllipsis, PaginationArrow,
} from './styles';

interface Reap {
  id: number;
  paciente: string;
  initials: string;
  procedimento: string;
  ultimaData: string;
  proximaData: string | null;
  profissional: string;
}

function mapAplicacao(a: AplicacaoVencendoResponse): Reap {
  const words = a.pacienteNome.trim().split(' ');
  const initials = ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase();
  const [y, m, d] = a.dataAplicacao.split('-');
  return {
    id: a.id,
    paciente: a.pacienteNome,
    initials,
    procedimento: a.produtoNome,
    ultimaData: `${d}/${m}/${y}`,
    proximaData: a.dataProximaAplicacao,
    profissional: '—',
  };
}

const procedureOptions = [
  { value: 'botox',            label: 'Botox Facial'         },
  { value: 'preenchimento',    label: 'Preenchimento Labial'  },
  { value: 'bioestimulador',   label: 'Bioestimulador'        },
  { value: 'fio-pdo',          label: 'Fio de PDO'            },
  { value: 'microagulhamento', label: 'Microagulhamento'      },
  { value: 'toxina',           label: 'Toxina Botulínica'     },
];

const filterStatus     = ['Todos', 'Urgente', 'Esta semana', 'Este mês'];
const filterProcedures = ['Todos', 'Botox', 'Preenchimento', 'Bioestimulador', 'Fio PDO', 'Microagulhamento'];
const avatarColors     = ['#BBA188', '#a8906f', '#1b1b1b', '#8a7560', '#EBD5B0'];

function diasRestantes(data: string | null): number {
  if (!data) return 9999;
  return Math.ceil((new Date(data).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function getUrgencia(dias: number): { label: string; color: string; bg: string } {
  if (dias < 0)   return { label: 'Atrasado',    color: '#c0392b', bg: '#fdecea' };
  if (dias <= 7)  return { label: 'Urgente',     color: '#c0392b', bg: '#fdecea' };
  if (dias <= 14) return { label: 'Esta semana', color: '#d68a00', bg: '#fff3cd' };
  if (dias <= 30) return { label: 'Este mês',    color: '#8a7560', bg: '#f0ebe4' };
  return                 { label: 'Programado',  color: '#666',    bg: '#f5f5f5' };
}

const CARDS_PER_PAGE = 6;
const TABLE_PER_PAGE = 10;

function getVisiblePages(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | '...')[] = [];
  const half = 2;
  let start = Math.max(2, currentPage - half);
  let end   = Math.min(totalPages - 1, currentPage + half);
  if (currentPage <= half + 1) end   = Math.min(totalPages - 1, 4);
  if (currentPage >= totalPages - half) start = Math.max(2, totalPages - 3);
  pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);
  return pages;
}

export default function Reaplicacoes() {
  const [reaplicacoes, setReaplicacoes] = useState<Reap[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [isErrorOpen,  setIsErrorOpen]  = useState(false);
  const [search,       setSearch]       = useState('');
  const [filterStat,   setFilterStat]   = useState('Todos');
  const [filterProc,   setFilterProc]   = useState('Todos');
  const [openDropStat, setOpenDropStat] = useState(false);
  const [openDropProc, setOpenDropProc] = useState(false);
  const [view,         setView]         = useState<'tabela' | 'cards'>('cards');
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [selected,     setSelected]     = useState<Reap | null>(null);
  const [currentPage,  setCurrentPage]  = useState(1);

  function showError(err: unknown, context: string) {
    setErrorMsg(getApiErrorMessage(err, context));
    setIsErrorOpen(true);
  }

  useEffect(() => {
    listarAplicacoesVencendo(60)
      .then(list => setReaplicacoes(list.map(mapAplicacao)))
      .catch(err => showError(err, 'carregar reaplicações'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reaplicacoes.filter(r => {
    const matchSearch = r.paciente.toLowerCase().includes(search.toLowerCase()) || r.procedimento.toLowerCase().includes(search.toLowerCase());
    const dias        = diasRestantes(r.proximaData);
    const matchStat   =
      filterStat === 'Todos'        ||
      (filterStat === 'Urgente'     && dias <= 7)               ||
      (filterStat === 'Esta semana' && dias > 7  && dias <= 14) ||
      (filterStat === 'Este mês'    && dias > 14 && dias <= 30);
    const matchProc = filterProc === 'Todos' || r.procedimento.toLowerCase().includes(filterProc.toLowerCase());
    return matchSearch && matchStat && matchProc;
  });

  /* paginação cards */
  const totalPagesCards   = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePageCards     = Math.min(currentPage, totalPagesCards);
  const startIdxCards     = (safePageCards - 1) * CARDS_PER_PAGE;
  const paginatedCards    = filtered.slice(startIdxCards, startIdxCards + CARDS_PER_PAGE);
  const visiblePagesCards = getVisiblePages(safePageCards, totalPagesCards);

  /* paginação tabela */
  const totalPagesTable   = Math.max(1, Math.ceil(filtered.length / TABLE_PER_PAGE));
  const safePageTable     = Math.min(currentPage, totalPagesTable);
  const startIdxTable     = (safePageTable - 1) * TABLE_PER_PAGE;
  const paginatedTable    = filtered.slice(startIdxTable, startIdxTable + TABLE_PER_PAGE);
  const visiblePagesTable = getVisiblePages(safePageTable, totalPagesTable);

  const urgentes   = reaplicacoes.filter(r => diasRestantes(r.proximaData) <= 7).length;
  const estaSemana = reaplicacoes.filter(r => { const d = diasRestantes(r.proximaData); return d > 7  && d <= 14; }).length;
  const esteMes    = reaplicacoes.filter(r => { const d = diasRestantes(r.proximaData); return d > 14 && d <= 30; }).length;

  function handleSearchChange(v: string) { setSearch(v);      setCurrentPage(1); }
  function handleFilterStat(v: string)   { setFilterStat(v);  setCurrentPage(1); setOpenDropStat(false); }
  function handleFilterProc(v: string)   { setFilterProc(v);  setCurrentPage(1); setOpenDropProc(false); }
  function handleClearFilters()          { setFilterStat('Todos'); setFilterProc('Todos'); setCurrentPage(1); }

  return (
    <Container>
      <Header>
        <Title>Alertas de Reaplicação</Title>
      </Header>

      {urgentes > 0 && (
        <AlertBanner>
          <AlertBannerIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </AlertBannerIcon>
          <AlertBannerText>
            <strong>{urgentes} {urgentes === 1 ? 'paciente' : 'pacientes'}</strong> com reaplicação vencida ou urgente — entre em contato para reagendar.
          </AlertBannerText>
        </AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Urgentes (≤ 7 dias)" value={loading ? 0 : urgentes} color="#e74c3c" trend={{ value: 'Contatar hoje!', positive: false }}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        />
        <StatCard label="Esta semana (8–14d)" value={loading ? 0 : estaSemana} color="#d4a84b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard label="Este mês (15–30d)" value={loading ? 0 : esteMes} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
        />
        <StatCard label="Total Pendentes" value={loading ? 0 : reaplicacoes.length} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled
            placeholder="Buscar paciente ou procedimento..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
          />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropStat(!openDropStat); setOpenDropProc(false); }}>
              <span>{filterStat}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropStat && (
              <DropdownList>
                {filterStatus.map(s => (
                  <DropdownItem key={s} $active={filterStat === s} onClick={() => handleFilterStat(s)}>{s}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropProc(!openDropProc); setOpenDropStat(false); }}>
              <span>{filterProc}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropProc && (
              <DropdownList>
                {filterProcedures.map(p => (
                  <DropdownItem key={p} $active={filterProc === p} onClick={() => handleFilterProc(p)}>{p}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          {(filterStat !== 'Todos' || filterProc !== 'Todos') && (
            <ClearFilterBtn onClick={handleClearFilters}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
          <ToggleGroup>
            <ToggleBtn $active={view === 'cards'} onClick={() => { setView('cards'); setCurrentPage(1); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </ToggleBtn>
            <ToggleBtn $active={view === 'tabela'} onClick={() => { setView('tabela'); setCurrentPage(1); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            </ToggleBtn>
          </ToggleGroup>
        </FilterRow>
      </Controls>

      {view === 'cards' ? (
        <CardsContainer>
          <div style={{ padding: 20, flex: 1, overflow: 'hidden' }}>
            {loading ? (
              <EmptyState><h3>Carregando reaplicações...</h3></EmptyState>
            ) : filtered.length === 0 ? (
              <EmptyState>
                <h3>Nenhuma reaplicação encontrada</h3>
                <p>Tente ajustar os filtros ou a busca.</p>
              </EmptyState>
            ) : (
              <CardsGrid>
                {paginatedCards.map((r, i) => {
                  const dias = diasRestantes(r.proximaData);
                  const urg  = getUrgencia(dias);
                  return (
                    <ReapCard key={r.id} $urgente={dias <= 7}>
                      <ReapCardHeader>
                        <ReapAvatar $color={avatarColors[i % avatarColors.length]}>{r.initials}</ReapAvatar>
                        <div style={{ flex: 1 }}>
                          <ReapPatientName>{r.paciente}</ReapPatientName>
                          <ReapPatientSub>{r.procedimento}</ReapPatientSub>
                        </div>
                        <ReapDaysTag $color={urg.color} $bg={urg.bg}>
                          {r.proximaData === null ? '—' : dias < 0 ? `${Math.abs(dias)}d atrasado` : `${dias}d`}
                        </ReapDaysTag>
                      </ReapCardHeader>
                      <ReapCardBody>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#bbb', marginBottom: 12 }}>
                          <span>Última: {r.ultimaData}</span>
                          <span>Próxima: {r.proximaData ? r.proximaData.split('-').reverse().join('/') : '—'}</span>
                        </div>
                        <ReapRow><ReapLabel>Profissional</ReapLabel><ReapValue>{r.profissional}</ReapValue></ReapRow>
                        <ReapRow>
                          <ReapLabel>Status</ReapLabel>
                          <ReapValue><Badge $bg={urg.bg} $color={urg.color}>{urg.label}</Badge></ReapValue>
                        </ReapRow>
                      </ReapCardBody>
                      <ReapCardFooter>
                        <Button variant="outline" size="sm" onClick={() => { setSelected(r); setIsModalOpen(true); }}>Agendar</Button>
                      </ReapCardFooter>
                    </ReapCard>
                  );
                })}
              </CardsGrid>
            )}
          </div>

          <PaginationWrapper>
            <PaginationInfo>
              {filtered.length === 0
                ? 'Nenhum registro'
                : `Mostrando ${safePageCards} de ${totalPagesCards}`
              }
            </PaginationInfo>
            <PaginationControls>
              <PaginationArrow onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePageCards <= 1} aria-label="Página anterior">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </PaginationArrow>
              {visiblePagesCards.map((page, idx) =>
                page === '...' ? (
                  <PageEllipsis key={`ellipsis-${idx}`}>…</PageEllipsis>
                ) : (
                  <PageButton key={page} $active={page === safePageCards} onClick={() => setCurrentPage(page as number)} aria-label={`Página ${page}`}>
                    {page}
                  </PageButton>
                )
              )}
              <PaginationArrow onClick={() => setCurrentPage(p => Math.min(totalPagesCards, p + 1))} disabled={safePageCards >= totalPagesCards} aria-label="Próxima página">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </PaginationArrow>
            </PaginationControls>
          </PaginationWrapper>
        </CardsContainer>
      ) : (
        <TableContainer>
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th $width="22%">Paciente</Th>
                  <Th $width="20%">Procedimento</Th>
                  <Th $width="13%">Última Sessão</Th>
                  <Th $width="13%">Próxima Data</Th>
                  <Th $width="8%">Dias Rest.</Th>
                  <Th $width="14%">Profissional</Th>
                  <Th $width="10%">Status</Th>
                </tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <tr><Td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Carregando reaplicações...</Td></tr>
                ) : filtered.length === 0 ? (
                  <tr><Td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhuma reaplicação encontrada.</Td></tr>
                ) : paginatedTable.map(r => {
                  const dias = diasRestantes(r.proximaData);
                  const urg  = getUrgencia(dias);
                  return (
                    <Tr key={r.id}>
                      <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{r.paciente}</Td>
                      <Td><Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{r.procedimento}</Badge></Td>
                      <Td style={{ color: '#888' }}>{r.ultimaData}</Td>
                      <Td style={{ fontWeight: 600, color: dias <= 7 ? '#c0392b' : '#1a1a1a' }}>{r.proximaData ? r.proximaData.split('-').reverse().join('/') : '—'}</Td>
                      <Td><span style={{ fontWeight: 700, color: urg.color }}>{r.proximaData === null ? '—' : dias < 0 ? `${Math.abs(dias)}d atrás` : `${dias}d`}</span></Td>
                      <Td>{r.profissional}</Td>
                      <Td><Badge $bg={urg.bg} $color={urg.color}>{urg.label}</Badge></Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableWrapper>

          <PaginationWrapper>
            <PaginationInfo>
              {filtered.length === 0
                ? 'Nenhum registro'
                : `Mostrando ${safePageTable} de ${totalPagesTable}`
              }
            </PaginationInfo>
            <PaginationControls>
              <PaginationArrow onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePageTable <= 1} aria-label="Página anterior">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </PaginationArrow>
              {visiblePagesTable.map((page, idx) =>
                page === '...' ? (
                  <PageEllipsis key={`ellipsis-${idx}`}>…</PageEllipsis>
                ) : (
                  <PageButton key={page} $active={page === safePageTable} onClick={() => setCurrentPage(page as number)} aria-label={`Página ${page}`}>
                    {page}
                  </PageButton>
                )
              )}
              <PaginationArrow onClick={() => setCurrentPage(p => Math.min(totalPagesTable, p + 1))} disabled={safePageTable >= totalPagesTable} aria-label="Próxima página">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </PaginationArrow>
            </PaginationControls>
          </PaginationWrapper>
        </TableContainer>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Agendar Reaplicação — ${selected?.paciente}`}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirmar</Button>
          </>
        }
      >
        <FormGrid>
          <div style={{ gridColumn: 'span 2', padding: '12px 16px', background: '#fdf9f5', borderRadius: 10, border: '1px solid #f0ebe4', fontSize: '0.88rem', color: '#666' }}>
            <strong style={{ color: '#1a1a1a' }}>{selected?.paciente}</strong> — {selected?.procedimento}<br />
            Última aplicação: <strong>{selected?.ultimaData}</strong>
          </div>
          <Input label="Data da Reaplicação" type="date" />
          <Input label="Horário" type="time" />
          <Select label="Procedimento" options={procedureOptions} placeholder={selected?.procedimento || 'Selecione...'} />
          <Input label="Profissional" defaultValue={selected?.profissional} />
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Observações" placeholder="Informações adicionais..." />
          </div>
        </FormGrid>
      </Modal>
      <ErrorModal
        isOpen={isErrorOpen}
        message={errorMsg}
        onClose={() => setIsErrorOpen(false)}
      />
    </Container>
  );
}
