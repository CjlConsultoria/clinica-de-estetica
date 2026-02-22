'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import StatCard from '@/components/ui/statcard';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import {
  Container, Header, Title, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, PatientGrid, PatientCard, PatientCardHeader, PatientAvatar, PatientInfo,
  PatientName, PatientSub, PatientCardBody, TimelineWrap, TimelineItem,
  TimelineDot, TimelineContent, TimelineDate, TimelineTitle, TimelineDesc,
  TimelineTag, PatientCardFooter, DetailModal, DetailHeader, DetailAvatar,
  DetailName, DetailMeta, DetailMetaItem, DetailSection, DetailSectionTitle,
  FullTimeline, FullTimelineItem, FullDot, FullContent, FullDate,
  FullTitle, FullDesc, FullTags, FullTag, StatsRow, StatPill,
  EmptyState, FormGrid,
} from './styles';
import { pacientesService } from '@/services/pacientes.service';
import { agendamentosService, type Agendamento } from '@/services/agendamentos.service';
import { financeiroService, type Lancamento } from '@/services/financeiro.service';

type NovoPacienteField =
  | 'nome' | 'cpf' | 'nascimento' | 'telefone' | 'email';

interface NovoPacienteForm {
  nome: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  email: string;
  observacoes: string;
}

const FORM_INITIAL: NovoPacienteForm = {
  nome: '', cpf: '', nascimento: '', telefone: '', email: '', observacoes: '',
};

const VALIDATION_FIELDS = [
  { key: 'nome'       as NovoPacienteField, validate: (v: string) => !v.trim() ? 'Nome completo é obrigatório' : null },
  { key: 'cpf'        as NovoPacienteField, validate: (v: string) => !v.trim() ? 'CPF é obrigatório' : null },
  { key: 'nascimento' as NovoPacienteField, validate: (v: string) => !v ? 'Data de nascimento é obrigatória' : null },
  { key: 'telefone'   as NovoPacienteField, validate: (v: string) => !v.trim() ? 'Telefone é obrigatório' : null },
  { key: 'email'      as NovoPacienteField, validate: (v: string) => !v.trim() ? 'E-mail é obrigatório' : null },
];

const filterOptions = ['Todos', 'Ativos', 'Inativos', 'Alto Valor'];

interface HistoryItem {
  id: number;
  date: string;
  procedure: string;
  units: string;
  value: number;
  professional: string;
  lote: string;
  status: string;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthdate: string;
  since: string;
  status: string;
  totalSpent: number;
  totalSessions: number;
  lastVisit: string;
  nextVisit: string | null;
  observations: string;
  history: HistoryItem[];
}

const procedureColors: Record<string, string> = {
  'Botox Facial':         '#BBA188',
  'Preenchimento Labial': '#EBD5B0',
  'Bioestimulador':       '#1b1b1b',
  'Fio de PDO':           '#a8906f',
  'Microagulhamento':     '#8a7560',
  'Toxina Botulínica':    '#BBA188',
};

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function getAge(birthdate: string) {
  if (!birthdate) return 0;
  const diff = Date.now() - new Date(birthdate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR');
}

function formatSince(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

function buildPatients(
  pacientes: Awaited<ReturnType<typeof pacientesService.listarTodos>>,
  agendamentos: Agendamento[],
  lancamentos: Lancamento[],
): Patient[] {
  const now = new Date();

  return pacientes.map(p => {
    const ags = agendamentos.filter(a => a.pacienteId === p.id);
    const lcs = lancamentos.filter(l => l.pacienteId === p.id);

    const realizados = ags.filter(a => a.status === 'REALIZADO');
    const futuros    = ags.filter(a =>
      (a.status === 'AGENDADO' || a.status === 'CONFIRMADO') &&
      new Date(a.dataHora) > now
    ).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());

    const totalSpent  = lcs
      .filter(l => l.status === 'PAGO')
      .reduce((sum, l) => sum + (l.valorLiquido ?? l.valor ?? 0), 0);

    const lastVisitAg = realizados
      .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())[0];

    // Monta history a partir de agendamentos ordenados do mais recente
    const history: HistoryItem[] = ags
      .slice()
      .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
      .map(a => {
        const lancamento = lcs.find(l => l.agendamentoId === a.id);
        return {
          id:           a.id,
          date:         formatDate(a.dataHora),
          procedure:    a.tipoConsulta ?? a.procedimento ?? 'Consulta',
          units:        '—',
          value:        lancamento?.valorLiquido ?? lancamento?.valor ?? 0,
          professional: a.medicoNome ?? '—',
          lote:         '—',
          status:       a.status?.toLowerCase() ?? 'agendado',
        };
      });

    return {
      id:             p.id,
      name:           p.nome,
      phone:          p.telefone ?? p.celular ?? '',
      email:          p.email,
      birthdate:      p.dataNascimento ?? '',
      since:          formatSince(p.criadoEm ?? ''),
      status:         p.ativo ? 'ativo' : 'inativo',
      totalSpent,
      totalSessions:  realizados.length,
      lastVisit:      lastVisitAg ? formatDate(lastVisitAg.dataHora) : '—',
      nextVisit:      futuros[0] ? formatDate(futuros[0].dataHora) : null,
      observations:   p.observacoes ?? '',
      history,
    };
  });
}

export default function HistoricoPaciente() {
  const [patients,     setPatients]     = useState<Patient[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [loadError,    setLoadError]    = useState<string | null>(null);
  const [search,       setSearch]       = useState('');
  const [filter,       setFilter]       = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selected,     setSelected]     = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen,    setIsNewOpen]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [exporting,    setExporting]    = useState(false);
  const [form,         setForm]         = useState<NovoPacienteForm>(FORM_INITIAL);

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<NovoPacienteField>(VALIDATION_FIELDS);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const [pacientes, agendamentos, lancamentosPage] = await Promise.all([
        pacientesService.listarTodos(200),
        agendamentosService.listarTodos(500),
        financeiroService.listar(0, 500),
      ]);
      const lancamentos = lancamentosPage.content ?? [];
      setPatients(buildPatients(pacientes, agendamentos, lancamentos));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const filtered = patients.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'Todos'     ||
      (filter === 'Ativos'     && p.status === 'ativo')   ||
      (filter === 'Inativos'   && p.status === 'inativo') ||
      (filter === 'Alto Valor' && p.totalSpent >= 5000);
    return matchSearch && matchFilter;
  });

  const totalPacientes = patients.length;
  const ativos         = patients.filter(p => p.status === 'ativo').length;
  const totalSessoes   = patients.reduce((a, p) => a + p.totalSessions, 0);
  const totalReceita   = patients.reduce((a, p) => a + p.totalSpent, 0);

  function handleChange(field: keyof NovoPacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as NovoPacienteField);
  }

  function handleMaskedChange(field: keyof NovoPacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as NovoPacienteField);
  }

  function handleDateChange(field: 'nascimento', raw: string) {
    if (!raw) { handleChange(field, ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleChange(field, `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function handleCloseNew() {
    setForm(FORM_INITIAL);
    clearAll();
    setIsNewOpen(false);
  }

  async function handleSaveNew() {
    const isValid = validate({
      nome:       form.nome,
      cpf:        form.cpf,
      nascimento: form.nascimento,
      telefone:   form.telefone,
      email:      form.email,
    });
    if (!isValid) return;
    setSaving(true);
    try {
      await pacientesService.criar({
        nome:           form.nome,
        email:          form.email,
        telefone:       form.telefone,
        cpf:            form.cpf,
        dataNascimento: form.nascimento || undefined,
        observacoes:    form.observacoes || undefined,
      });
      await carregar();
      handleCloseNew();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao cadastrar paciente');
    } finally {
      setSaving(false);
    }
  }

  function openDetail(p: Patient) {
    setSelected(p);
    setIsDetailOpen(true);
  }

  const handleExportFicha = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selected) return;
    setExporting(true);
    let objectUrl: string | null = null;
    try {
      const response = await fetch('/api/relatorios/ficha-paciente', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ patient: selected }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as any).details ?? 'Erro ao gerar PDF');
      }
      const blob    = await response.blob();
      objectUrl     = URL.createObjectURL(blob);
      const name    = selected.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      const link         = document.createElement('a');
      link.href          = objectUrl;
      link.download      = `ficha-${name}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao exportar ficha:', err);
      alert('Não foi possível gerar a ficha. Tente novamente.');
    } finally {
      setExporting(false);
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl!), 1000);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Histórico de Pacientes</Title>
        <Button
          type="button"
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={() => setIsNewOpen(true)}
        >
          Novo Paciente
        </Button>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Pacientes" value={totalPacientes} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard label="Pacientes Ativos" value={ativos} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          trend={totalPacientes > 0 ? { value: `${Math.round((ativos / totalPacientes) * 100)}% retorno`, positive: true } : undefined}
        />
        <StatCard label="Total de Sessões" value={totalSessoes} color="#a8906f"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
        />
        <StatCard label="Receita Total" value={`R$ ${totalReceita.toLocaleString('pt-BR')}`} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por nome, telefone ou e-mail..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn type="button" onClick={() => setOpenDropdown(!openDropdown)}>
              <span>{filter}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown && (
              <DropdownList>
                {filterOptions.map(f => (
                  <DropdownItem key={f} $active={filter === f} onClick={() => { setFilter(f); setOpenDropdown(false); }}>{f}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          {filter !== 'Todos' && (
            <ClearFilterBtn type="button" onClick={() => setFilter('Todos')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      {loading ? (
        <EmptyState><h3>Carregando pacientes...</h3><p>Buscando dados do servidor.</p></EmptyState>
      ) : loadError ? (
        <EmptyState>
          <h3>Erro ao carregar dados</h3>
          <p>{loadError}</p>
          <Button type="button" variant="outline" onClick={carregar} style={{ marginTop: 12 }}>Tentar novamente</Button>
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState><h3>Nenhum paciente encontrado</h3><p>Tente ajustar os filtros ou a busca.</p></EmptyState>
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
                  <PatientSub>
                    {patient.birthdate ? `${getAge(patient.birthdate)} anos · ` : ''}
                    Cliente desde {patient.since}
                  </PatientSub>
                  <StatsRow>
                    <StatPill $color="#BBA188">{patient.totalSessions} sessões</StatPill>
                    <StatPill $color="#8a7560">R$ {patient.totalSpent.toLocaleString('pt-BR')}</StatPill>
                    {patient.status === 'inativo' && <StatPill $color="#95a5a6">Inativo</StatPill>}
                  </StatsRow>
                </PatientInfo>
              </PatientCardHeader>
              <PatientCardBody>
                <div style={{ fontSize: '0.76rem', color: '#aaa', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Últimos procedimentos</div>
                {patient.history.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: '#ccc', padding: '8px 0' }}>Sem agendamentos registrados</div>
                ) : (
                  <TimelineWrap>
                    {patient.history.slice(0, 3).map((h, i) => (
                      <TimelineItem key={i}>
                        <TimelineDot $color={procedureColors[h.procedure] || '#BBA188'} />
                        <TimelineContent>
                          <TimelineDate>{h.date}</TimelineDate>
                          <TimelineTitle>{h.procedure}</TimelineTitle>
                          <TimelineDesc>
                            {h.value > 0 ? `R$ ${h.value.toLocaleString('pt-BR')} · ` : ''}{h.professional}
                          </TimelineDesc>
                          {h.lote !== '—' && <TimelineTag $color={procedureColors[h.procedure] || '#BBA188'}>{h.lote}</TimelineTag>}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                    {patient.history.length > 3 && (
                      <div style={{ fontSize: '0.78rem', color: '#BBA188', paddingLeft: 24, fontWeight: 600 }}>
                        +{patient.history.length - 3} procedimento(s) anteriores
                      </div>
                    )}
                  </TimelineWrap>
                )}
              </PatientCardBody>
              <PatientCardFooter>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                  <span style={{ fontWeight: 600, color: '#555' }}>Última visita:</span> {patient.lastVisit}
                </div>
                {patient.nextVisit
                  ? <div style={{ fontSize: '0.8rem', color: '#BBA188', fontWeight: 600 }}>Próxima: {patient.nextVisit}</div>
                  : <div style={{ fontSize: '0.78rem', color: '#ccc' }}>Sem agendamento</div>
                }
              </PatientCardFooter>
            </PatientCard>
          ))}
        </PatientGrid>
      )}

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Ficha do Paciente"
        size="lg"
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button type="button" variant="outline" icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}>Editar Ficha</Button>
              <Button type="button" variant="primary" onClick={handleExportFicha} disabled={exporting}
                icon={exporting
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
              >{exporting ? 'Gerando PDF...' : 'Exportar Ficha'}</Button>
            </div>
            <Button type="button" variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </div>
        }
      >
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        {selected && (
          <DetailModal>
            <DetailHeader>
              <DetailAvatar $color="#BBA188">{getInitials(selected.name)}</DetailAvatar>
              <div>
                <DetailName>{selected.name}</DetailName>
                <DetailMeta>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.92 6.92l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 17z"/></svg>
                    {selected.phone || '—'}
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {selected.email}
                  </DetailMetaItem>
                  {selected.birthdate && (
                    <DetailMetaItem>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      {getAge(selected.birthdate)} anos · Cliente desde {selected.since}
                    </DetailMetaItem>
                  )}
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
              {selected.history.length === 0 ? (
                <div style={{ color: '#bbb', fontSize: '0.88rem', padding: '16px 0' }}>Nenhum agendamento registrado para este paciente.</div>
              ) : (
                <FullTimeline>
                  {selected.history.map((h, i) => (
                    <FullTimelineItem key={i}>
                      <FullDot $color={procedureColors[h.procedure] || '#BBA188'} $first={i === 0} />
                      <FullContent>
                        <FullDate>{h.date}</FullDate>
                        <FullTitle>{h.procedure}</FullTitle>
                        <FullDesc>
                          {h.value > 0 && <><span style={{ fontWeight: 700, color: '#1a1a1a' }}>R$ {h.value.toLocaleString('pt-BR')}</span><span>·</span></>}
                          <span>{h.professional}</span>
                        </FullDesc>
                        <FullTags>
                          {h.lote !== '—' && <FullTag $color={procedureColors[h.procedure] || '#BBA188'}>Lote: {h.lote}</FullTag>}
                          <FullTag $color={h.status === 'realizado' ? '#8a7560' : h.status === 'cancelado' ? '#e74c3c' : '#BBA188'}>
                            {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                          </FullTag>
                        </FullTags>
                      </FullContent>
                    </FullTimelineItem>
                  ))}
                </FullTimeline>
              )}
            </DetailSection>
          </DetailModal>
        )}
      </Modal>

      <Modal
        isOpen={isNewOpen}
        onClose={handleCloseNew}
        title="Novo Paciente"
        size="md"
        footer={
          <>
            <Button type="button" variant="outline" onClick={handleCloseNew}>Cancelar</Button>
            <Button type="button" variant="primary" onClick={handleSaveNew} disabled={saving}>
              {saving ? 'Cadastrando...' : 'Cadastrar Paciente'}
            </Button>
          </>
        }
      >
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Nome Completo *"
              placeholder="Nome completo da paciente..."
              value={form.nome}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                handleChange('nome', val);
              }}
              maxLength={80}
              error={errors.nome}
            />
          </div>

          <Input
            label="CPF *"
            mask="cpf"
            value={form.cpf}
            inputMode="numeric"
            maxLength={14}
            onValueChange={(v) => handleMaskedChange('cpf', v)}
            error={errors.cpf}
          />

          <Input
            label="Data de Nascimento *"
            type="date"
            value={form.nascimento}
            onChange={(e) => handleDateChange('nascimento', e.target.value)}
            error={errors.nascimento}
          />

          <Input
            label="Telefone *"
            mask="telefone"
            value={form.telefone}
            inputMode="numeric"
            maxLength={15}
            onValueChange={(v) => handleMaskedChange('telefone', v)}
            error={errors.telefone}
          />

          <Input
            label="E-mail *"
            type="email"
            placeholder="email@exemplo.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />

          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Observações / Alergias"
              placeholder="Alergias, preferências, observações importantes..."
              maxLength={300}
              value={form.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
            />
          </div>
        </FormGrid>
      </Modal>
    </Container>
  );
}
