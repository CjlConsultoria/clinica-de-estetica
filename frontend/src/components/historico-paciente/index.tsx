'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import {
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  PatientGrid, PatientCard, PatientCardHeader, PatientAvatar, PatientInfo,
  PatientName, PatientSub, PatientCardBody, TimelineWrap, TimelineItem,
  TimelineDot, TimelineContent, TimelineDate, TimelineTitle, TimelineDesc,
  TimelineTag, PatientCardFooter, DetailModal, DetailHeader, DetailAvatar,
  DetailName, DetailMeta, DetailMetaItem, DetailSection, DetailSectionTitle,
  FullTimeline, FullTimelineItem, FullDot, FullContent, FullDate,
  FullTitle, FullDesc, FullTags, FullTag, StatsRow, StatPill,
  EmptyState, FormGrid,
} from './styles';

const procedureOptions = [
  { value: 'botox', label: 'Botox Facial' },
  { value: 'preenchimento', label: 'Preenchimento Labial' },
  { value: 'bioestimulador', label: 'Bioestimulador' },
  { value: 'fio-pdo', label: 'Fio de PDO' },
  { value: 'microagulhamento', label: 'Microagulhamento' },
  { value: 'toxina', label: 'Toxina Botulínica' },
];

const filterOptions = ['Todos', 'Ativos', 'Inativos', 'Alto Valor'];

const mockPatients = [
  {
    id: 1,
    name: 'Ana Beatriz Costa',
    phone: '(11) 99872-3141',
    email: 'ana@email.com',
    birthdate: '1990-03-14',
    since: 'Mar 2023',
    status: 'ativo',
    totalSpent: 8400,
    totalSessions: 12,
    lastVisit: '18/02/2025',
    nextVisit: '18/05/2025',
    observations: 'Paciente VIP. Alergia a lidocaína em pomada. Prefere horários matinais.',
    history: [
      { id: 1, date: '18/02/2025', procedure: 'Botox Facial', units: '40U', value: 980, professional: 'Maria Oliveira', lote: 'BTX-2025-003', status: 'realizado' },
      { id: 2, date: '18/11/2024', procedure: 'Botox Facial', units: '40U', value: 980, professional: 'Maria Oliveira', lote: 'BTX-2024-087', status: 'realizado' },
      { id: 3, date: '15/08/2024', procedure: 'Preenchimento Labial', units: '1ml', value: 1200, professional: 'Clara Andrade', lote: 'PRE-2024-042', status: 'realizado' },
      { id: 4, date: '10/05/2024', procedure: 'Bioestimulador', units: '1 frasco', value: 1800, professional: 'Maria Oliveira', lote: 'BIO-2024-011', status: 'realizado' },
      { id: 5, date: '20/02/2024', procedure: 'Botox Facial', units: '40U', value: 980, professional: 'Maria Oliveira', lote: 'BTX-2024-015', status: 'realizado' },
    ],
  },
  {
    id: 2,
    name: 'Carla Mendonça',
    phone: '(11) 97654-2211',
    email: 'carla@email.com',
    birthdate: '1985-07-22',
    since: 'Jun 2023',
    status: 'ativo',
    totalSpent: 4500,
    totalSessions: 6,
    lastVisit: '15/02/2025',
    nextVisit: '15/05/2025',
    observations: 'Tende a apresentar hematomas. Usar técnica retrógrada.',
    history: [
      { id: 1, date: '15/02/2025', procedure: 'Preenchimento Labial', units: '1ml', value: 1200, professional: 'Maria Oliveira', lote: 'PRE-2025-007', status: 'realizado' },
      { id: 2, date: '20/09/2024', procedure: 'Botox Facial', units: '30U', value: 750, professional: 'Beatriz Santos', lote: 'BTX-2024-062', status: 'realizado' },
      { id: 3, date: '10/04/2024', procedure: 'Preenchimento Labial', units: '1ml', value: 1200, professional: 'Maria Oliveira', lote: 'PRE-2024-029', status: 'realizado' },
    ],
  },
  {
    id: 3,
    name: 'Fernanda Lima',
    phone: '(11) 98877-5544',
    email: 'fernanda@email.com',
    birthdate: '1992-11-08',
    since: 'Jan 2024',
    status: 'ativo',
    totalSpent: 3600,
    totalSessions: 4,
    lastVisit: '10/02/2025',
    nextVisit: null,
    observations: '',
    history: [
      { id: 1, date: '10/02/2025', procedure: 'Bioestimulador', units: '1 frasco', value: 1800, professional: 'Clara Andrade', lote: 'BIO-2025-003', status: 'realizado' },
      { id: 2, date: '10/08/2024', procedure: 'Bioestimulador', units: '1 frasco', value: 1800, professional: 'Clara Andrade', lote: 'BIO-2024-049', status: 'realizado' },
    ],
  },
  {
    id: 4,
    name: 'Marina Souza',
    phone: '(21) 99123-7788',
    email: 'marina@email.com',
    birthdate: '1988-04-30',
    since: 'Set 2022',
    status: 'ativo',
    totalSpent: 12800,
    totalSessions: 18,
    lastVisit: '05/01/2025',
    nextVisit: '05/04/2025',
    observations: 'Paciente antiga. Protocolo personalizado de manutenção trimestral.',
    history: [
      { id: 1, date: '05/01/2025', procedure: 'Fio de PDO', units: '10 fios', value: 2500, professional: 'Beatriz Santos', lote: 'FIO-2025-001', status: 'realizado' },
      { id: 2, date: '05/10/2024', procedure: 'Botox Facial', units: '50U', value: 1200, professional: 'Maria Oliveira', lote: 'BTX-2024-081', status: 'realizado' },
      { id: 3, date: '05/07/2024', procedure: 'Preenchimento Labial', units: '2ml', value: 2400, professional: 'Clara Andrade', lote: 'PRE-2024-055', status: 'realizado' },
    ],
  },
  {
    id: 5,
    name: 'Juliana Rocha',
    phone: '(11) 91234-5678',
    email: 'juliana@email.com',
    birthdate: '1995-09-15',
    since: 'Nov 2024',
    status: 'ativo',
    totalSpent: 980,
    totalSessions: 1,
    lastVisit: '10/01/2025',
    nextVisit: '10/04/2025',
    observations: 'Primeira sessão. Orientada sobre protocolo inicial.',
    history: [
      { id: 1, date: '10/01/2025', procedure: 'Toxina Botulínica', units: '20U', value: 980, professional: 'Maria Oliveira', lote: 'BTX-2025-001', status: 'realizado' },
    ],
  },
  {
    id: 6,
    name: 'Patrícia Alves',
    phone: '(11) 97788-1122',
    email: 'patricia@email.com',
    birthdate: '1978-12-01',
    since: 'Dez 2022',
    status: 'inativo',
    totalSpent: 5600,
    totalSessions: 7,
    lastVisit: '20/12/2024',
    nextVisit: null,
    observations: 'Última sessão foi de microagulhamento. Sem retorno agendado.',
    history: [
      { id: 1, date: '20/12/2024', procedure: 'Microagulhamento', units: '1 sessão', value: 800, professional: 'Beatriz Santos', lote: 'MIC-2024-019', status: 'realizado' },
      { id: 2, date: '20/09/2024', procedure: 'Microagulhamento', units: '1 sessão', value: 800, professional: 'Beatriz Santos', lote: 'MIC-2024-010', status: 'realizado' },
    ],
  },
];

const procedureColors: Record<string, string> = {
  'Botox Facial': '#BBA188',
  'Preenchimento Labial': '#EBD5B0',
  'Bioestimulador': '#1b1b1b',
  'Fio de PDO': '#a8906f',
  'Microagulhamento': '#8a7560',
  'Toxina Botulínica': '#BBA188',
};

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function getAge(birthdate: string) {
  const diff = Date.now() - new Date(birthdate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

type Patient = typeof mockPatients[0];

export default function HistoricoPaciente() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);

  const filtered = mockPatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'Todos' ||
      (filter === 'Ativos' && p.status === 'ativo') ||
      (filter === 'Inativos' && p.status === 'inativo') ||
      (filter === 'Alto Valor' && p.totalSpent >= 5000);
    return matchSearch && matchFilter;
  });

  const totalPacientes = mockPatients.length;
  const ativos = mockPatients.filter(p => p.status === 'ativo').length;
  const totalSessoes = mockPatients.reduce((a, p) => a + p.totalSessions, 0);
  const totalReceita = mockPatients.reduce((a, p) => a + p.totalSpent, 0);

  function openDetail(p: Patient) {
    setSelected(p);
    setIsDetailOpen(true);
  }

  return (
    <Container>
      <Header>
        <Title>Histórico de Pacientes</Title>
        <Button
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={() => setIsNewOpen(true)}
        >
          Novo Paciente
        </Button>
      </Header>

      <StatsGrid>
        <StatCard
          label="Total de Pacientes"
          value={totalPacientes}
          color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard
          label="Pacientes Ativos"
          value={ativos}
          color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          trend={{ value: `${Math.round((ativos / totalPacientes) * 100)}% retorno`, positive: true }}
        />
        <StatCard
          label="Total de Sessões"
          value={totalSessoes}
          color="#a8906f"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
        />
        <StatCard
          label="Receita Total"
          value={`R$ ${totalReceita.toLocaleString('pt-BR')}`}
          color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          trend={{ value: '+R$ 6.800 vs mês', positive: true }}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled
            placeholder="Buscar por nome, telefone ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDropdown(!openDropdown)}>
              <span>{filter}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown && (
              <DropdownList>
                {filterOptions.map(f => (
                  <DropdownItem key={f} $active={filter === f} onClick={() => { setFilter(f); setOpenDropdown(false); }}>
                    {f}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          {filter !== 'Todos' && (
            <ClearFilterBtn onClick={() => setFilter('Todos')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      {filtered.length === 0 ? (
        <EmptyState>
          <h3>Nenhum paciente encontrado</h3>
          <p>Tente ajustar os filtros ou a busca.</p>
        </EmptyState>
      ) : (
        <PatientGrid>
          {filtered.map(patient => (
            <PatientCard key={patient.id} onClick={() => openDetail(patient)}>
              <PatientCardHeader>
                <PatientAvatar $color={patient.status === 'inativo' ? '#95a5a6' : '#BBA188'}>
                  {getInitials(patient.name)}
                </PatientAvatar>
                <PatientInfo>
                  <PatientName>{patient.name}</PatientName>
                  <PatientSub>{getAge(patient.birthdate)} anos · Cliente desde {patient.since}</PatientSub>
                  <StatsRow>
                    <StatPill $color="#BBA188">{patient.totalSessions} sessões</StatPill>
                    <StatPill $color="#8a7560">R$ {patient.totalSpent.toLocaleString('pt-BR')}</StatPill>
                    {patient.status === 'inativo' && <StatPill $color="#95a5a6">Inativo</StatPill>}
                  </StatsRow>
                </PatientInfo>
              </PatientCardHeader>

              <PatientCardBody>
                <div style={{ fontSize: '0.76rem', color: '#aaa', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Últimos procedimentos
                </div>
                <TimelineWrap>
                  {patient.history.slice(0, 3).map((h, i) => (
                    <TimelineItem key={i}>
                      <TimelineDot $color={procedureColors[h.procedure] || '#BBA188'} />
                      <TimelineContent>
                        <TimelineDate>{h.date}</TimelineDate>
                        <TimelineTitle>{h.procedure}</TimelineTitle>
                        <TimelineDesc>{h.units} · R$ {h.value.toLocaleString('pt-BR')} · {h.professional}</TimelineDesc>
                        <TimelineTag $color={procedureColors[h.procedure] || '#BBA188'}>{h.lote}</TimelineTag>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                  {patient.history.length > 3 && (
                    <div style={{ fontSize: '0.78rem', color: '#BBA188', paddingLeft: 24, fontWeight: 600 }}>
                      +{patient.history.length - 3} procedimento(s) anteriores
                    </div>
                  )}
                </TimelineWrap>
              </PatientCardBody>

              <PatientCardFooter>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                  <span style={{ fontWeight: 600, color: '#555' }}>Última visita:</span> {patient.lastVisit}
                </div>
                {patient.nextVisit ? (
                  <div style={{ fontSize: '0.8rem', color: '#BBA188', fontWeight: 600 }}>
                    Próxima: {patient.nextVisit}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: '#ccc' }}>Sem agendamento</div>
                )}
              </PatientCardFooter>
            </PatientCard>
          ))}
        </PatientGrid>
      )}

      {/* Modal: Detalhe completo do paciente */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Ficha do Paciente"
        size="lg"
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
            <Button
              variant="outline"
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
            >
              Editar Ficha
            </Button>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </div>
        }
      >
        {selected && (
          <DetailModal>
            <DetailHeader>
              <DetailAvatar $color="#BBA188">{getInitials(selected.name)}</DetailAvatar>
              <div>
                <DetailName>{selected.name}</DetailName>
                <DetailMeta>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.92 6.92l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 17z"/></svg>
                    {selected.phone}
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {selected.email}
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {getAge(selected.birthdate)} anos · Cliente desde {selected.since}
                  </DetailMetaItem>
                </DetailMeta>
                <StatsRow style={{ marginTop: 12 }}>
                  <StatPill $color="#BBA188">{selected.totalSessions} sessões</StatPill>
                  <StatPill $color="#8a7560">R$ {selected.totalSpent.toLocaleString('pt-BR')} gastos</StatPill>
                  {selected.nextVisit && <StatPill $color="#a8906f">Próx: {selected.nextVisit}</StatPill>}
                </StatsRow>
              </div>
            </DetailHeader>

            {selected.observations && (
              <div style={{ background: '#fdf9f5', borderRadius: 10, padding: '12px 16px', border: '1px solid #f0ebe4', fontSize: '0.85rem', color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
                <strong style={{ color: '#BBA188' }}>⚠ Observações: </strong>{selected.observations}
              </div>
            )}

            <DetailSection>
              <DetailSectionTitle>Histórico Completo de Procedimentos</DetailSectionTitle>
              <FullTimeline>
                {selected.history.map((h, i) => (
                  <FullTimelineItem key={i}>
                    <FullDot $color={procedureColors[h.procedure] || '#BBA188'} $first={i === 0} />
                    <FullContent>
                      <FullDate>{h.date}</FullDate>
                      <FullTitle>{h.procedure}</FullTitle>
                      <FullDesc>
                        <span>{h.units}</span>
                        <span>·</span>
                        <span style={{ fontWeight: 700, color: '#1a1a1a' }}>R$ {h.value.toLocaleString('pt-BR')}</span>
                        <span>·</span>
                        <span>{h.professional}</span>
                      </FullDesc>
                      <FullTags>
                        <FullTag $color={procedureColors[h.procedure] || '#BBA188'}>Lote: {h.lote}</FullTag>
                        <FullTag $color="#8a7560">Realizado</FullTag>
                      </FullTags>
                    </FullContent>
                  </FullTimelineItem>
                ))}
              </FullTimeline>
            </DetailSection>
          </DetailModal>
        )}
      </Modal>

      {/* Modal: Novo Paciente */}
      <Modal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        title="Novo Paciente"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewOpen(false)}>Cancelar</Button>
            <Button variant="primary">Cadastrar Paciente</Button>
          </>
        }
      >
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Nome Completo" placeholder="Nome completo da paciente..." />
          </div>
          <Input label="CPF" placeholder="000.000.000-00" />
          <Input label="Data de Nascimento" type="date" />
          <Input label="Telefone" placeholder="(00) 00000-0000" />
          <Input label="E-mail" type="email" placeholder="email@exemplo.com" />
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Observações / Alergias" placeholder="Alergias, preferências, observações importantes..." />
          </div>
        </FormGrid>
      </Modal>
    </Container>
  );
}