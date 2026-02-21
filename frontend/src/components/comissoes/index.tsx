'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  EmptyState, ProfCard, ProfGrid, ProfAvatar, ProfName, ProfRole, ProfStats,
  ProfStat, ProfStatLabel, ProfStatValue, ProgressBar, ProgressFill,
} from './styles';

const filterMonths = ['Todos', 'Fevereiro 2025', 'Janeiro 2025', 'Dezembro 2024'];
const filterProfs  = ['Todos', 'Maria Oliveira', 'Clara Andrade', 'Beatriz Santos'];

const mockProfessionals = [
  { id: 1, name: 'Maria Oliveira', role: 'Esteticista Sênior', avatar: 'MO', color: '#BBA188', sessoes: 12, receita: 14400, comissao: 2880,  percentual: 20, meta: 12000 },
  { id: 2, name: 'Clara Andrade',  role: 'Biomédica Esteta',   avatar: 'CA', color: '#EBD5B0', sessoes: 26, receita: 31200, comissao: 5200,  percentual: 20, meta: 8000  },
  { id: 3, name: 'Beatriz Santos', role: 'Esteticista',        avatar: 'BS', color: '#1b1b1b', sessoes: 21, receita: 24500, comissao: 6125,  percentual: 25, meta: 6000  },
];

const mockComissoes = [
  { id: 1,  date: '18/02/2025', professional: 'Maria Oliveira', procedure: 'Botox Facial',        patient: 'Ana Costa',   value: 720,  percentual: 20, comissao: 144,  status: 'pago'     },
  { id: 2,  date: '18/02/2025', professional: 'Clara Andrade',  procedure: 'Preenchimento Labial', patient: 'Carla M.',    value: 1200, percentual: 20, comissao: 240,  status: 'pendente' },
  { id: 3,  date: '16/02/2025', professional: 'Beatriz Santos', procedure: 'Bioestimulador',       patient: 'Fernanda L.', value: 2500, percentual: 25, comissao: 625,  status: 'pago'     },
  { id: 4,  date: '14/02/2025', professional: 'Maria Oliveira', procedure: 'Microagulhamento',     patient: 'Patrícia A.', value: 450,  percentual: 20, comissao: 90,   status: 'pago'     },
  { id: 5,  date: '13/02/2025', professional: 'Clara Andrade',  procedure: 'Fio PDO',              patient: 'Marina S.',   value: 1800, percentual: 20, comissao: 360,  status: 'pendente' },
  { id: 6,  date: '10/02/2025', professional: 'Beatriz Santos', procedure: 'Toxina Botulínica',    patient: 'Juliana R.',  value: 600,  percentual: 25, comissao: 150,  status: 'pago'     },
  { id: 7,  date: '18/02/2025', professional: 'Maria Oliveira', procedure: 'Botox Facial',        patient: 'Ana Costa',   value: 720,  percentual: 20, comissao: 144,  status: 'pago'     },
  { id: 8,  date: '18/02/2025', professional: 'Clara Andrade',  procedure: 'Preenchimento Labial', patient: 'Carla M.',    value: 1200, percentual: 20, comissao: 240,  status: 'pendente' },
  { id: 9,  date: '16/02/2025', professional: 'Beatriz Santos', procedure: 'Bioestimulador',       patient: 'Fernanda L.', value: 2500, percentual: 25, comissao: 625,  status: 'pago'     },
  { id: 10, date: '14/02/2025', professional: 'Maria Oliveira', procedure: 'Microagulhamento',     patient: 'Patrícia A.', value: 450,  percentual: 20, comissao: 90,   status: 'pago'     },
  { id: 11, date: '13/02/2025', professional: 'Clara Andrade',  procedure: 'Fio PDO',              patient: 'Marina S.',   value: 1800, percentual: 20, comissao: 360,  status: 'pendente' },
  { id: 12, date: '10/02/2025', professional: 'Beatriz Santos', procedure: 'Toxina Botulínica',    patient: 'Juliana R.',  value: 600,  percentual: 25, comissao: 150,  status: 'pago'     },
];

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusColors: Record<string, { bg: string; color: string }> = {
  pago:     { bg: '#f0ebe4', color: '#8a7560' },
  pendente: { bg: '#fff3cd', color: '#856404' },
};

const avatarColors = ['#BBA188', '#EBD5B0', '#1b1b1b'];

function getBarColor(comissao: number, meta: number): string {
  const pct = (comissao / meta) * 100;
  if (pct < 50) return '#F09696';
  if (pct < 75) return '#F0C38C';
  return '#96D2A0';
}

const ITEMS_PER_PAGE = 10;
const TABLE_MIN_HEIGHT = 540;

export default function Comissoes() {
  const [search,       setSearch]       = useState('');
  const [filterMonth,  setFilterMonth]  = useState('Todos');
  const [filterProf,   setFilterProf]   = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [exporting,    setExporting]    = useState(false);
  const [currentPage,  setCurrentPage]  = useState(1);

  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const totalComissoes = mockComissoes.reduce((a, c) => a + c.comissao, 0);
  const totalPago      = mockComissoes.filter(c => c.status === 'pago').reduce((a, c) => a + c.comissao, 0);
  const totalPendente  = mockComissoes.filter(c => c.status === 'pendente').reduce((a, c) => a + c.comissao, 0);

  const filtered = mockComissoes.filter(c => {
    const matchSearch = (
      c.professional.toLowerCase().includes(search.toLowerCase()) ||
      c.procedure.toLowerCase().includes(search.toLowerCase())    ||
      c.patient.toLowerCase().includes(search.toLowerCase())
    );
    const matchProf = filterProf === 'Todos' || c.professional === filterProf;
    return matchSearch && matchProf;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const startIndex    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggle = (name: string) =>
    setOpenDropdown(prev => (prev === name ? null : name));

  const handleExportClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmExport = async () => {
    setShowConfirmModal(false);
    setExporting(true);
    let objectUrl: string | null = null;

    try {
      const response = await fetch('/api/relatorios/comissoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionals: mockProfessionals,
          comissoes:     filtered,
          month:         filterMonth === 'Todos' ? 'Fevereiro 2025' : filterMonth,
          filterProf,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as any).details ?? 'Erro ao gerar PDF');
      }

      const blob  = await response.blob();
      objectUrl   = URL.createObjectURL(blob);
      const month = filterMonth === 'Todos' ? 'fevereiro-2025' : filterMonth.replace(/\s/g, '-').toLowerCase();

      const link    = document.createElement('a');
      link.href     = objectUrl;
      link.download = `relatorio-comissoes-${month}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShowSuccessModal(true);
    } catch (err) {
      console.error('Erro ao exportar:', err);
      alert('Não foi possível gerar o relatório. Tente novamente.');
    } finally {
      setExporting(false);
      if (objectUrl) {
        setTimeout(() => URL.revokeObjectURL(objectUrl!), 1000);
      }
    }
  };

  const handleCancelExport = () => {
    setShowCancelModal(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <Container>
      <Header>
        <Title>Comissões</Title>

        <Button
          type="button"
          variant="primary"
          onClick={handleExportClick}
          disabled={exporting}
          icon={
            exporting ? (
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ animation: 'spin 1s linear infinite' }}
              >
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

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </Header>

      <StatsGrid>
        <StatCard
          label="Total de Comissões"
          value={`R$ ${fmt(totalComissoes)}`}
          color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard
          label="Pagas"
          value={`R$ ${fmt(totalPago)}`}
          color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard
          label="Pendentes"
          value={`R$ ${fmt(totalPendente)}`}
          color="#d4a84b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard
          label="Profissionais"
          value={mockProfessionals.length}
          color="#1b1b1b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
      </StatsGrid>

      <ProfGrid>
        {mockProfessionals.map((prof) => (
          <ProfCard key={prof.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <ProfAvatar $color={prof.color}>{prof.avatar}</ProfAvatar>
              <div>
                <ProfName>{prof.name}</ProfName>
                <ProfRole>{prof.role}</ProfRole>
              </div>
            </div>
            <ProfStats>
              <ProfStat>
                <ProfStatLabel>Sessões</ProfStatLabel>
                <ProfStatValue>{prof.sessoes}</ProfStatValue>
              </ProfStat>
              <ProfStat>
                <ProfStatLabel>Receita Gerada</ProfStatLabel>
                <ProfStatValue>R$ {(prof.receita / 1000).toFixed(1)}k</ProfStatValue>
              </ProfStat>
              <ProfStat>
                <ProfStatLabel>Comissão ({prof.percentual}%)</ProfStatLabel>
                <ProfStatValue $highlight>R$ {(prof.comissao / 1000).toFixed(1)}k</ProfStatValue>
              </ProfStat>
            </ProfStats>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.78rem', color: '#888' }}>
                <span>Meta mensal</span>
                <span>{Math.min(100, Math.round((prof.comissao / prof.meta) * 100))}%</span>
              </div>
              <ProgressBar>
                <ProgressFill
                  $width={Math.min(100, (prof.comissao / prof.meta) * 100)}
                  $color={getBarColor(prof.comissao, prof.meta)}
                />
              </ProgressBar>
            </div>
          </ProfCard>
        ))}
      </ProfGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </SearchIconWrap>
          <SearchInputStyled
            placeholder="Buscar por profissional, procedimento..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn type="button" onClick={() => toggle('prof')}>
              <span>{filterProf}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </DropdownBtn>
            {openDropdown === 'prof' && (
              <DropdownList>
                {filterProfs.map(p => (
                  <DropdownItem
                    key={p}
                    $active={filterProf === p}
                    onClick={() => { setFilterProf(p); toggle('prof'); setCurrentPage(1); }}
                  >
                    {p}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          <DropdownWrapper>
            <DropdownBtn type="button" onClick={() => toggle('month')}>
              <span>{filterMonth}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </DropdownBtn>
            {openDropdown === 'month' && (
              <DropdownList>
                {filterMonths.map(m => (
                  <DropdownItem
                    key={m}
                    $active={filterMonth === m}
                    onClick={() => { setFilterMonth(m); toggle('month'); setCurrentPage(1); }}
                  >
                    {m}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          {(filterProf !== 'Todos' || filterMonth !== 'Todos') && (
            <ClearFilterBtn type="button" onClick={() => { setFilterProf('Todos'); setFilterMonth('Todos'); setCurrentPage(1); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
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
                <Th $width="11%">Valor Proc.</Th>
                <Th $width="7%">%</Th>
                <Th $width="11%">Comissão</Th>
                <Th $width="8%">Status</Th>
              </tr>
            </Thead>
            <Tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState>
                      <h3>Nenhuma comissão encontrada</h3>
                      <p>Ajuste os filtros ou o termo de busca.</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : paginatedData.map((c) => {
                const profIndex = mockProfessionals.findIndex(p => p.name === c.professional);
                const prof      = mockProfessionals[profIndex];
                const barColor  = prof ? getBarColor(prof.comissao, prof.meta) : '#BBA188';
                return (
                  <Tr key={c.id}>
                    <Td style={{ color: '#888' }}>{c.date}</Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: `${avatarColors[profIndex % 3]}22`,
                          color: avatarColors[profIndex % 3],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          {c.professional.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <span style={{ fontWeight: 600, color: '#1a1a1a' }}>
                          {c.professional}
                        </span>
                      </div>
                    </Td>
                    <Td>{c.procedure}</Td>
                    <Td style={{ color: '#666' }}>{c.patient}</Td>
                    <Td style={{ fontWeight: 600 }}>R$ {fmt(c.value)}</Td>
                    <Td>
                      <Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{c.percentual}%</Badge>
                    </Td>
                    <Td style={{ fontWeight: 700, color: barColor }}>R$ {fmt(c.comissao)}</Td>
                    <Td>
                      <Badge $bg={statusColors[c.status].bg} $color={statusColors[c.status].color}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
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

      <CancelModal
        isOpen={showCancelModal}
        title="Cancelar exportação?"
        message="Tem certeza que deseja cancelar a exportação do relatório?"
        onConfirm={handleCancelExport}
        onCancel={() => setShowCancelModal(false)}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Exportar relatório?"
        message={`Deseja exportar o relatório de comissões${filterMonth !== 'Todos' ? ` de ${filterMonth}` : ''}${filterProf !== 'Todos' ? ` de ${filterProf}` : ''}?`}
        confirmText="Exportar"
        cancelText="Cancelar"
        onConfirm={handleConfirmExport}
        onCancel={() => setShowConfirmModal(false)}
      />

      <SucessModal
        isOpen={showSuccessModal}
        title="Sucesso!"
        message="Relatório de comissões exportado com sucesso!"
        onClose={handleSuccessClose}
        buttonText="Continuar"
      />
    </Container>
  );
}