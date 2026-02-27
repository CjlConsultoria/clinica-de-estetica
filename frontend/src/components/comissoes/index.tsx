'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { useCurrentUser } from '@/components/ui/hooks/useCurrentUser';
import AccessDenied from '@/components/ui/AccessDenied';
import { listarComissoes, pagarComissao, type ComissaoResponse } from '@/services/comissoesApi';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  EmptyState, ProfCard, ProfGrid, ProfAvatar, ProfName, ProfRole, ProfStats,
  ProfStat, ProfStatLabel, ProfStatValue, ProgressBar, ProgressFill,
} from './styles';

interface ComissaoItem {
  id: number;
  date: string;
  professional: string;
  professionalId: number;
  procedure: string;
  patient: string;
  value: number;
  percentual: number;
  comissao: number;
  status: string;
}

interface ProfCard {
  id: number;
  name: string;
  role: string;
  avatar: string;
  color: string;
  sessoes: number;
  receita: number;
  comissao: number;
  percentual: number;
}

const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const statusColors: Record<string, { bg: string; color: string }> = {
  PAGO:     { bg: '#f0ebe4', color: '#8a7560' },
  PENDENTE: { bg: '#fff3cd', color: '#856404' },
  pago:     { bg: '#f0ebe4', color: '#8a7560' },
  pendente: { bg: '#fff3cd', color: '#856404' },
};
const avatarColors = ['#BBA188', '#EBD5B0', '#1b1b1b', '#a8906f', '#8a7560'];

function mapComissao(c: ComissaoResponse): ComissaoItem {
  const date = c.criadoEm
    ? new Date(c.criadoEm).toLocaleDateString('pt-BR')
    : '—';
  return {
    id:             c.id,
    date,
    professional:   c.usuarioNome ?? '—',
    professionalId: c.usuarioId,
    procedure:      c.procedimento ?? '—',
    patient:        c.pacienteNome ?? '—',
    value:          c.valorBase,
    percentual:     c.percentual,
    comissao:       c.valorComissao,
    status:         c.status,
  };
}

function buildProfCards(items: ComissaoItem[]): ProfCard[] {
  const map = new Map<string, ProfCard>();
  items.forEach((c, idx) => {
    if (!map.has(c.professional)) {
      const initials = c.professional.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
      map.set(c.professional, {
        id:         c.professionalId,
        name:       c.professional,
        role:       'Profissional',
        avatar:     initials,
        color:      avatarColors[map.size % avatarColors.length],
        sessoes:    0,
        receita:    0,
        comissao:   0,
        percentual: c.percentual,
      });
    }
    const p = map.get(c.professional)!;
    p.sessoes++;
    p.receita  += c.value;
    p.comissao += c.comissao;
  });
  return Array.from(map.values());
}

const ITEMS_PER_PAGE   = 10;
const TABLE_MIN_HEIGHT = 540;

export default function Comissoes() {
  const { can, isSuperAdmin } = usePermissions();
  const { currentUser } = useCurrentUser();

  const [comissoes,    setComissoes]    = useState<ComissaoItem[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filterProf,   setFilterProf]   = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [exporting,    setExporting]    = useState(false);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const hasAccess = isSuperAdmin || can('comissoes.read') || can('comissoes.read_own');
  if (!hasAccess) return <AccessDenied />;

  const isOwnOnly = !isSuperAdmin && can('comissoes.read_own') && !can('comissoes.read');
  const ownName   = currentUser?.name ?? '';

  useEffect(() => {
    listarComissoes()
      .then(list => setComissoes(list.map(mapComissao)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const baseData = isOwnOnly
    ? comissoes.filter(c => c.professional === ownName)
    : comissoes;

  const profCards = buildProfCards(baseData);

  // Build dynamic filter options from loaded data
  const filterProfs = ['Todos', ...Array.from(new Set(baseData.map(c => c.professional)))];

  const totalComissoes = baseData.reduce((a, c) => a + c.comissao, 0);
  const totalPago      = baseData.filter(c => c.status === 'PAGO' || c.status === 'pago').reduce((a, c) => a + c.comissao, 0);
  const totalPendente  = baseData.filter(c => c.status === 'PENDENTE' || c.status === 'pendente').reduce((a, c) => a + c.comissao, 0);

  const filtered = baseData.filter(c => {
    const matchSearch = c.professional.toLowerCase().includes(search.toLowerCase()) || c.procedure.toLowerCase().includes(search.toLowerCase()) || c.patient.toLowerCase().includes(search.toLowerCase());
    const matchProf   = filterProf === 'Todos' || c.professional === filterProf;
    return matchSearch && matchProf;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const paginatedData = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const toggle = (name: string) => setOpenDropdown(prev => prev === name ? null : name);

  const handleExportClick   = () => setShowConfirmModal(true);
  const handleSuccessClose  = () => setShowSuccessModal(false);
  const handleCancelExport  = () => setShowCancelModal(false);

  const handleConfirmExport = async () => {
    setShowConfirmModal(false);
    let objectUrl: string | null = null;
    try {
      setExporting(true);
      const response = await fetch('/api/relatorios/comissoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comissoes: baseData, professionals: profCards, professional: filterProf }) });
      if (!response.ok) throw new Error('Falha ao gerar PDF');
      const blob = await response.blob();
      objectUrl  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = objectUrl; a.download = 'relatorio-comissoes.pdf'; a.click();
      setShowSuccessModal(true);
    } catch (err) { console.error('Erro ao exportar:', err); alert('Não foi possível gerar o relatório. Tente novamente.'); }
    finally { setExporting(false); if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl!), 1000); }
  };

  async function handlePagarComissao(id: number) {
    if (!confirm('Confirmar pagamento desta comissão?')) return;
    try {
      await pagarComissao(id);
      setComissoes(prev => prev.map(c => c.id === id ? { ...c, status: 'PAGO' } : c));
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <Container>
      <Header>
        <Title>{isOwnOnly ? 'Minhas Comissões' : 'Comissões'}</Title>
        <Button type="button" variant="primary" onClick={handleExportClick} disabled={exporting}
          icon={exporting
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          }
        >
          {exporting ? 'Gerando PDF...' : 'Exportar Relatório'}
        </Button>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Comissões" value={loading ? '...' : `R$ ${fmt(totalComissoes)}`} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <StatCard label="Pagas"              value={loading ? '...' : `R$ ${fmt(totalPago)}`}      color="#8a7560" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Pendentes"          value={loading ? '...' : `R$ ${fmt(totalPendente)}`}  color="#d4a84b" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard label="Profissionais"      value={loading ? '...' : profCards.length}            color="#1b1b1b" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
      </StatsGrid>

      {!loading && profCards.length > 0 && (
        <ProfGrid>
          {profCards.map((prof, idx) => (
            <ProfCard key={prof.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <ProfAvatar $color={avatarColors[idx % avatarColors.length]}>{prof.avatar}</ProfAvatar>
                <div><ProfName>{prof.name}</ProfName><ProfRole>{prof.role}</ProfRole></div>
              </div>
              <ProfStats>
                <ProfStat><ProfStatLabel>Sessões</ProfStatLabel><ProfStatValue>{prof.sessoes}</ProfStatValue></ProfStat>
                <ProfStat><ProfStatLabel>Receita Gerada</ProfStatLabel><ProfStatValue>R$ {(prof.receita / 1000).toFixed(1)}k</ProfStatValue></ProfStat>
                <ProfStat><ProfStatLabel>Comissão ({prof.percentual}%)</ProfStatLabel><ProfStatValue $highlight>R$ {(prof.comissao / 1000).toFixed(1)}k</ProfStatValue></ProfStat>
              </ProfStats>
            </ProfCard>
          ))}
        </ProfGrid>
      )}

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por profissional, procedimento..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </SearchBarWrapper>
        <FilterRow>
          {!isOwnOnly && (
            <DropdownWrapper>
              <DropdownBtn type="button" onClick={() => toggle('prof')}><span>{filterProf}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
              {openDropdown === 'prof' && (<DropdownList>{filterProfs.map(p => (<DropdownItem key={p} $active={filterProf === p} onClick={() => { setFilterProf(p); toggle('prof'); setCurrentPage(1); }}>{p}</DropdownItem>))}</DropdownList>)}
            </DropdownWrapper>
          )}
          {(filterProf !== 'Todos') && (<ClearFilterBtn type="button" onClick={() => { setFilterProf('Todos'); setCurrentPage(1); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <Table>
            <Thead>
              <tr>
                <Th $width="11%">Data</Th>
                {!isOwnOnly && <Th $width="18%">Profissional</Th>}
                <Th $width={isOwnOnly ? '26%' : '20%'}>Procedimento</Th>
                <Th $width="14%">Paciente</Th>
                <Th $width="11%">Valor Proc.</Th>
                <Th $width="7%">%</Th>
                <Th $width="11%">Comissão</Th>
                <Th $width="8%">Status</Th>
                {(isSuperAdmin || can('financeiro.create')) && <Th $width="8%">Ações</Th>}
              </tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr><td colSpan={isOwnOnly ? 7 : 9}><EmptyState><p>Carregando comissões...</p></EmptyState></td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><td colSpan={isOwnOnly ? 7 : 9}><EmptyState><h3>Nenhuma comissão encontrada</h3><p>Ajuste os filtros ou o termo de busca.</p></EmptyState></td></tr>
              ) : paginatedData.map((c, idx) => {
                const profIdx = profCards.findIndex(p => p.name === c.professional);
                const statusKey = c.status as string;
                const sc = statusColors[statusKey] ?? { bg: '#f5f5f5', color: '#888' };
                const isPendente = c.status === 'PENDENTE' || c.status === 'pendente';
                return (
                  <Tr key={c.id}>
                    <Td style={{ color: '#888' }}>{c.date}</Td>
                    {!isOwnOnly && (
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${avatarColors[(profIdx >= 0 ? profIdx : idx) % avatarColors.length]}22`, color: avatarColors[(profIdx >= 0 ? profIdx : idx) % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, flexShrink: 0 }}>
                            {c.professional.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{c.professional}</span>
                        </div>
                      </Td>
                    )}
                    <Td>{c.procedure}</Td>
                    <Td style={{ color: '#666' }}>{c.patient}</Td>
                    <Td style={{ fontWeight: 600 }}>R$ {fmt(c.value)}</Td>
                    <Td><Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{c.percentual}%</Badge></Td>
                    <Td style={{ fontWeight: 700, color: '#BBA188' }}>R$ {fmt(c.comissao)}</Td>
                    <Td><Badge $bg={sc.bg} $color={sc.color}>{isPendente ? 'Pendente' : 'Pago'}</Badge></Td>
                    {(isSuperAdmin || can('financeiro.create')) && (
                      <Td>
                        <ActionGroup>
                          {isPendente && (
                            <IconBtn title="Pagar comissão" onClick={() => handlePagarComissao(c.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                            </IconBtn>
                          )}
                        </ActionGroup>
                      </Td>
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>

      <CancelModal isOpen={showCancelModal} title="Cancelar exportação?" message="Tem certeza que deseja cancelar a exportação do relatório?" onConfirm={handleCancelExport} onCancel={() => setShowCancelModal(false)} />
      <ConfirmModal isOpen={showConfirmModal} title="Exportar relatório?" message={`Deseja exportar o relatório de comissões${filterProf !== 'Todos' ? ` de ${filterProf}` : ''}?`} confirmText="Exportar" cancelText="Cancelar" onConfirm={handleConfirmExport} onCancel={() => setShowConfirmModal(false)} />
      <SucessModal isOpen={showSuccessModal} title="Sucesso!" message="Relatório de comissões exportado com sucesso!" onClose={handleSuccessClose} buttonText="Continuar" />
    </Container>
  );
}
