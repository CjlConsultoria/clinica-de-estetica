'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '@/components/ui/button';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge,
  EmptyState, ProfCard, ProfGrid, ProfAvatar, ProfName, ProfRole, ProfStats,
  ProfStat, ProfStatLabel, ProfStatValue, ProgressBar, ProgressFill,
} from './styles';
import { comissoesService, type Comissao } from '@/services/comissoes.service';

interface ProfSummary {
  id: number; name: string; sessoes: number;
  receita: number; comissao: number; percentual: number;
}

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusColors: Record<string, { bg: string; color: string }> = {
  PAGO:     { bg: '#f0ebe4', color: '#8a7560' },
  PENDENTE: { bg: '#fff3cd', color: '#856404' },
};

const avatarColors = ['#BBA188', '#EBD5B0', '#1b1b1b', '#8a7560', '#a8906f', '#c9a882'];

function getBarColor(ratio: number): string {
  if (ratio < 0.5) return '#F09696';
  if (ratio < 0.75) return '#F0C38C';
  return '#96D2A0';
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

const ITEMS_PER_PAGE = 10;
const TABLE_MIN_HEIGHT = 540;

export default function Comissoes() {
  const [comissoes,    setComissoes]    = useState<Comissao[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filterProf,   setFilterProf]   = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [exporting,    setExporting]    = useState(false);
  const [currentPage,  setCurrentPage]  = useState(1);

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      const data = await comissoesService.listarTodas();
      setComissoes(data);
    } catch (err) {
      console.error('Erro ao carregar comissões:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  const profCards = useMemo<ProfSummary[]>(() => {
    const map = new Map<number, ProfSummary>();
    comissoes.forEach(c => {
      if (!map.has(c.usuarioId)) {
        map.set(c.usuarioId, {
          id: c.usuarioId,
          name: c.usuarioNome ?? `Profissional ${c.usuarioId}`,
          sessoes: 0, receita: 0, comissao: 0,
          percentual: Number(c.percentual),
        });
      }
      const prof = map.get(c.usuarioId)!;
      prof.sessoes  += 1;
      prof.receita  += Number(c.valorBase);
      prof.comissao += Number(c.valorComissao);
    });
    return Array.from(map.values()).sort((a, b) => b.comissao - a.comissao);
  }, [comissoes]);

  const totalComissoes = comissoes.reduce((a, c) => a + Number(c.valorComissao), 0);
  const totalPago      = comissoes.filter(c => c.status === 'PAGO').reduce((a, c) => a + Number(c.valorComissao), 0);
  const totalPendente  = comissoes.filter(c => c.status === 'PENDENTE').reduce((a, c) => a + Number(c.valorComissao), 0);

  const profNames = useMemo(() => ['Todos', ...profCards.map(p => p.name)], [profCards]);

  const filtered = useMemo(() => comissoes.filter(c => {
    const matchSearch = (
      (c.usuarioNome ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (c.procedimento ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (c.pacienteNome ?? '').toLowerCase().includes(search.toLowerCase())
    );
    const matchProf   = filterProf === 'Todos' || c.usuarioNome === filterProf;
    const matchStatus = filterStatus === 'Todos' || c.status === filterStatus;
    return matchSearch && matchProf && matchStatus;
  }), [comissoes, search, filterProf, filterStatus]);

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const startIndex    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggle = (name: string) =>
    setOpenDropdown(prev => (prev === name ? null : name));

  const handleExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setExporting(true);
    let objectUrl: string | null = null;
    try {
      const response = await fetch('/api/relatorios/comissoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professionals: profCards, comissoes: filtered }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { details?: string }).details ?? 'Erro ao gerar PDF');
      }
      const blob  = await response.blob();
      objectUrl   = URL.createObjectURL(blob);
      const link  = document.createElement('a');
      link.href   = objectUrl;
      link.download = 'relatorio-comissoes.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao exportar:', err);
      alert('Não foi possível gerar o relatório. Tente novamente.');
    } finally {
      setExporting(false);
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl!), 1000);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Comissões</Title>

        <Button
          type="button"
          variant="primary"
          onClick={handleExport}
          disabled={exporting}
          icon={
            exporting ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )
          }
        >
          {exporting ? 'Gerando PDF...' : 'Exportar Relatório'}
        </Button>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Comissões" value={`R$ ${fmt(totalComissoes)}`} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard label="Pagas" value={`R$ ${fmt(totalPago)}`} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="Pendentes" value={`R$ ${fmt(totalPendente)}`} color="#d4a84b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard label="Profissionais" value={profCards.length} color="#1b1b1b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
      </StatsGrid>

      {!loading && profCards.length > 0 && (
        <ProfGrid>
          {profCards.map((prof, i) => {
            const color = avatarColors[i % avatarColors.length];
            const ratio = prof.receita > 0 ? prof.comissao / prof.receita : 0;
            return (
              <ProfCard key={prof.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <ProfAvatar $color={color}>{getInitials(prof.name)}</ProfAvatar>
                  <div>
                    <ProfName>{prof.name}</ProfName>
                    <ProfRole>{prof.percentual}% de comissão</ProfRole>
                  </div>
                </div>
                <ProfStats>
                  <ProfStat>
                    <ProfStatLabel>Registros</ProfStatLabel>
                    <ProfStatValue>{prof.sessoes}</ProfStatValue>
                  </ProfStat>
                  <ProfStat>
                    <ProfStatLabel>Receita Base</ProfStatLabel>
                    <ProfStatValue>R$ {(prof.receita / 1000).toFixed(1)}k</ProfStatValue>
                  </ProfStat>
                  <ProfStat>
                    <ProfStatLabel>Comissão Total</ProfStatLabel>
                    <ProfStatValue $highlight>R$ {fmt(prof.comissao)}</ProfStatValue>
                  </ProfStat>
                </ProfStats>
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.78rem', color: '#888' }}>
                    <span>% sobre receita</span>
                    <span>{Math.round(ratio * 100)}%</span>
                  </div>
                  <ProgressBar>
                    <ProgressFill $width={Math.min(100, ratio * 100)} $color={getBarColor(ratio)} />
                  </ProgressBar>
                </div>
              </ProfCard>
            );
          })}
        </ProfGrid>
      )}

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </SearchIconWrap>
          <SearchInputStyled
            placeholder="Buscar por profissional, procedimento ou paciente..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn type="button" onClick={() => toggle('prof')}>
              <span>{filterProf}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown === 'prof' && (
              <DropdownList>
                {profNames.map(p => (
                  <DropdownItem key={p} $active={filterProf === p}
                    onClick={() => { setFilterProf(p); toggle('prof'); setCurrentPage(1); }}>
                    {p}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          <DropdownWrapper>
            <DropdownBtn type="button" onClick={() => toggle('status')}>
              <span>{filterStatus === 'Todos' ? 'Status' : filterStatus === 'PAGO' ? 'Pago' : 'Pendente'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown === 'status' && (
              <DropdownList>
                {['Todos', 'PAGO', 'PENDENTE'].map(s => (
                  <DropdownItem key={s} $active={filterStatus === s}
                    onClick={() => { setFilterStatus(s); toggle('status'); setCurrentPage(1); }}>
                    {s === 'Todos' ? 'Todos' : s === 'PAGO' ? 'Pago' : 'Pendente'}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          {(filterProf !== 'Todos' || filterStatus !== 'Todos') && (
            <ClearFilterBtn type="button" onClick={() => { setFilterProf('Todos'); setFilterStatus('Todos'); setCurrentPage(1); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <Table>
            <Thead>
              <tr>
                <Th $width="11%">Data</Th>
                <Th $width="18%">Profissional</Th>
                <Th $width="20%">Procedimento</Th>
                <Th $width="14%">Paciente</Th>
                <Th $width="11%">Valor Base</Th>
                <Th $width="7%">%</Th>
                <Th $width="11%">Comissão</Th>
                <Th $width="8%">Status</Th>
              </tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr><td colSpan={8}><EmptyState><p>Carregando comissões...</p></EmptyState></td></tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState>
                      <h3>Nenhuma comissão encontrada</h3>
                      <p>Ajuste os filtros ou o termo de busca.</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : paginatedData.map((c, idx) => {
                const profIdx = profCards.findIndex(p => p.id === c.usuarioId);
                const color   = avatarColors[(profIdx >= 0 ? profIdx : idx) % avatarColors.length];
                const sc      = statusColors[c.status] ?? { bg: '#f5f5f5', color: '#888' };
                const dataFmt = c.criadoEm ? new Date(c.criadoEm).toLocaleDateString('pt-BR') : '—';
                return (
                  <Tr key={c.id}>
                    <Td style={{ color: '#888' }}>{dataFmt}</Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: `${color}22`, color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.68rem', fontWeight: 700, flexShrink: 0,
                        }}>
                          {getInitials(c.usuarioNome ?? '?')}
                        </div>
                        <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{c.usuarioNome}</span>
                      </div>
                    </Td>
                    <Td>{c.procedimento ?? '—'}</Td>
                    <Td style={{ color: '#666' }}>{c.pacienteNome ?? '—'}</Td>
                    <Td style={{ fontWeight: 600 }}>R$ {fmt(Number(c.valorBase))}</Td>
                    <Td>
                      <Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{Number(c.percentual).toFixed(0)}%</Badge>
                    </Td>
                    <Td style={{ fontWeight: 700, color: sc.color }}>R$ {fmt(Number(c.valorComissao))}</Td>
                    <Td>
                      <Badge $bg={sc.bg} $color={sc.color}>
                        {c.status === 'PAGO' ? 'Pago' : 'Pendente'}
                      </Badge>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination
          currentPage={safePage}
          totalItems={totalFiltered}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  );
}
