'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import StatCard from '@/components/ui/statcard';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  EmptyState, ProfCard, ProfGrid, ProfAvatar, ProfName, ProfRole, ProfStats,
  ProfStat, ProfStatLabel, ProfStatValue, ProgressBar, ProgressFill,
} from './styles';

const filterMonths = ['Todos', 'Fevereiro 2025', 'Janeiro 2025', 'Dezembro 2024'];
const filterProfs = ['Todos', 'Maria Oliveira', 'Clara Andrade', 'Beatriz Santos'];

const mockProfessionals = [
  { id: 1, name: 'Maria Oliveira', role: 'Esteticista Sênior', avatar: 'MO', color: '#BBA188', sessoes: 48, receita: 58400, comissao: 11680, percentual: 20, meta: 12000 },
  { id: 2, name: 'Clara Andrade', role: 'Biomédica Esteta', avatar: 'CA', color: '#EBD5B0', sessoes: 32, receita: 38900, comissao: 7780, percentual: 20, meta: 8000 },
  { id: 3, name: 'Beatriz Santos', role: 'Esteticista', avatar: 'BS', color: '#1b1b1b', sessoes: 21, receita: 24500, comissao: 6125, percentual: 25, meta: 6000 },
];

const mockComissoes = [
  { id: 1, date: '18/02/2025', professional: 'Maria Oliveira', procedure: 'Botox Facial', patient: 'Ana Costa', value: 800, percentual: 20, comissao: 160, status: 'pago' },
  { id: 2, date: '18/02/2025', professional: 'Clara Andrade', procedure: 'Preenchimento Labial', patient: 'Carla M.', value: 1200, percentual: 20, comissao: 240, status: 'pendente' },
  { id: 3, date: '16/02/2025', professional: 'Maria Oliveira', procedure: 'Bioestimulador', patient: 'Fernanda L.', value: 2500, percentual: 20, comissao: 500, status: 'pago' },
  { id: 4, date: '14/02/2025', professional: 'Beatriz Santos', procedure: 'Microagulhamento', patient: 'Patrícia A.', value: 450, percentual: 25, comissao: 112.5, status: 'pago' },
  { id: 5, date: '13/02/2025', professional: 'Clara Andrade', procedure: 'Fio PDO', patient: 'Marina S.', value: 1800, percentual: 20, comissao: 360, status: 'pendente' },
  { id: 6, date: '10/02/2025', professional: 'Maria Oliveira', procedure: 'Toxina Botulínica', patient: 'Juliana R.', value: 600, percentual: 20, comissao: 120, status: 'pago' },
];

const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const statusColors: Record<string, { bg: string; color: string }> = {
  pago: { bg: '#f0ebe4', color: '#8a7560' },
  pendente: { bg: '#fff3cd', color: '#856404' },
};
const avatarColors = ['#BBA188', '#EBD5B0', '#1b1b1b'];

export default function Comissoes() {
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('Todos');
  const [filterProf, setFilterProf] = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const totalComissoes = mockComissoes.reduce((a, c) => a + c.comissao, 0);
  const totalPago = mockComissoes.filter(c => c.status === 'pago').reduce((a, c) => a + c.comissao, 0);
  const totalPendente = mockComissoes.filter(c => c.status === 'pendente').reduce((a, c) => a + c.comissao, 0);

  const filtered = mockComissoes.filter(c => {
    const matchSearch = c.professional.toLowerCase().includes(search.toLowerCase()) || c.procedure.toLowerCase().includes(search.toLowerCase()) || c.patient.toLowerCase().includes(search.toLowerCase());
    const matchProf = filterProf === 'Todos' || c.professional === filterProf;
    return matchSearch && matchProf;
  });

  const toggle = (name: string) => setOpenDropdown(prev => prev === name ? null : name);

  return (
    <Container>
      <Header>
        <Title>Comissões</Title>
        <Button variant="primary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}>
          Exportar Relatório
        </Button>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Comissões" value={`R$ ${fmt(totalComissoes)}`} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <StatCard label="Pagas" value={`R$ ${fmt(totalPago)}`} color="#8a7560" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Pendentes" value={`R$ ${fmt(totalPendente)}`} color="#d4a84b" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard label="Profissionais" value={mockProfessionals.length} color="#1b1b1b" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
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
                <ProgressFill $width={Math.min(100, (prof.comissao / prof.meta) * 100)} $color={prof.color} />
              </ProgressBar>
            </div>
          </ProfCard>
        ))}
      </ProfGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por profissional, procedimento..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => toggle('prof')}>
              <span>{filterProf}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown === 'prof' && (
              <DropdownList>
                {filterProfs.map(p => <DropdownItem key={p} $active={filterProf === p} onClick={() => { setFilterProf(p); toggle('prof'); }}>{p}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => toggle('month')}>
              <span>{filterMonth}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown === 'month' && (
              <DropdownList>
                {filterMonths.map(m => <DropdownItem key={m} $active={filterMonth === m} onClick={() => { setFilterMonth(m); toggle('month'); }}>{m}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          {(filterProf !== 'Todos' || filterMonth !== 'Todos') && (
            <ClearFilterBtn onClick={() => { setFilterProf('Todos'); setFilterMonth('Todos'); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <TableWrapper>
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
              {filtered.map((c) => (
                <Tr key={c.id}>
                  <Td style={{ color: '#888', fontSize: '0.82rem' }}>{c.date}</Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${avatarColors[mockProfessionals.findIndex(p => p.name === c.professional) % 3]}22`, color: avatarColors[mockProfessionals.findIndex(p => p.name === c.professional) % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700 }}>
                        {c.professional.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>{c.professional}</span>
                    </div>
                  </Td>
                  <Td style={{ fontSize: '0.86rem' }}>{c.procedure}</Td>
                  <Td style={{ fontSize: '0.84rem', color: '#666' }}>{c.patient}</Td>
                  <Td style={{ fontWeight: 600 }}>R$ {fmt(c.value)}</Td>
                  <Td><Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{c.percentual}%</Badge></Td>
                  <Td style={{ fontWeight: 700, color: '#BBA188' }}>R$ {fmt(c.comissao)}</Td>
                  <Td><Badge $bg={statusColors[c.status].bg} $color={statusColors[c.status].color}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
      </div>
    </Container>
  );
}
