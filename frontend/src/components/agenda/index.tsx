'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { useCurrentUser } from '@/components/ui/hooks/useCurrentUser';
import AccessDenied from '@/components/ui/AccessDenied';
import { listarAgendamentos, criarAgendamento, AgendamentoAPI } from '@/services/agendaService';
import { listarPacientes, PacienteAPI } from '@/services/pacienteService';
import { listarAreaTecnica, ProfissionalAPI } from '@/services/profissionalService';
import { criarLancamento, pagarLancamento, listarLancamentos, LancamentoAPI } from '@/services/financeService';
import {
  Container, Header, Title, ActionsRow,
  CalendarNav, CalendarTitle, CalendarGrid, DayHeader,
  DayCell, DayNumber, EventChip, EventsWrap,
  WeekView, WeekHeader, TimeSlot, TimeLabel, SlotRow, EventBlock,
  ToggleGroup, ToggleBtn, Legend, LegendItem, LegendDot, FormGrid,
} from './styles';

const NAV_MIN = { year: 2025, month: 0  };
const NAV_MAX = { year: 2026, month: 11 };

function PagamentoBadge({ status }: { status?: string }) {
  if (!status) return null;
  const isPago = status === 'PAGO';
  return (
    <span style={{
      fontSize:      '0.6rem',
      fontWeight:    700,
      padding:       '1px 5px',
      borderRadius:  4,
      marginLeft:    4,
      background:    isPago ? 'rgba(39,174,96,0.2)' : 'rgba(231,76,60,0.2)',
      color:         isPago ? '#27ae60' : '#e74c3c',
      whiteSpace:    'nowrap',
    }}>
      {isPago ? '✓ Pago' : '⏳ Pendente'}
    </span>
  );
}

const procedureOptions = [
  { value: 'botox',            label: 'Botox Facial'        },
  { value: 'preenchimento',    label: 'Preenchimento Labial' },
  { value: 'bioestimulador',   label: 'Bioestimulador'       },
  { value: 'fio-pdo',          label: 'Fio de PDO'           },
  { value: 'microagulhamento', label: 'Microagulhamento'     },
  { value: 'toxina',           label: 'Toxina Botulínica'    },
];

const statusOptions = [
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'aguardando', label: 'Aguardando' },
  { value: 'cancelado',  label: 'Cancelado'  },
];

const pagamentoOptions = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGO',     label: 'Pago'     },
];

const formaPagamentoOptions = [
  { value: 'PIX',             label: 'PIX'             },
  { value: 'DINHEIRO',        label: 'Dinheiro'        },
  { value: 'CARTAO_CREDITO',  label: 'Cartão de Crédito' },
  { value: 'CARTAO_DEBITO',   label: 'Cartão de Débito'  },
  { value: 'TRANSFERENCIA',   label: 'Transferência'   },
];

const PROCEDURE_COLOR: Record<string, string> = {
  botox:            '#BBA188',
  toxina:           '#BBA188',
  preenchimento:    '#EBD5B0',
  bioestimulador:   '#1b1b1b',
  'fio-pdo':        '#a8906f',
  microagulhamento: '#8a7560',
};

interface CalEvent {
  id: number; weekDay: number; hour: number;
  year: number; month: number; monthDay: number;
  name: string; procedure: string; color: string;
  lancamentoId?: number;
  pagamentoStatus?: string;
  medicoId?: number;
  pacienteId?: number;
  valorLancamento?: number;
}

type AgendamentoField = 'nome' | 'telefone' | 'data' | 'horario' | 'procedimento' | 'status' | 'valor' | 'medicoId' | 'pagamento';

interface AgendamentoForm {
  nome: string; telefone: string; data: string; horario: string;
  procedimento: string; status: string; valor: string; observacoes: string;
  medicoId: string;
  pagamento: string;
  formaPagamento: string;
}

const DAYS  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS = Array.from({ length: 11 }, (_, i) => `${i + 8}:00`);
const FORM_INITIAL: AgendamentoForm = {
  nome: '', telefone: '', data: '', horario: '',
  procedimento: '', status: '', valor: '', observacoes: '',
  medicoId: '', pagamento: '', formaPagamento: '',
};

const VALIDATION_FIELDS = [
  { key: 'nome'         as AgendamentoField, validate: (v: string) => !v.trim() ? 'Nome do paciente é obrigatório'    : null },
  { key: 'telefone'     as AgendamentoField, validate: (v: string) => !v.trim() ? 'Telefone é obrigatório'            : null },
  { key: 'data'         as AgendamentoField, validate: (v: string) => !v        ? 'Data é obrigatória'                : null },
  { key: 'horario'      as AgendamentoField, validate: (v: string) => !v        ? 'Horário é obrigatório'             : null },
  { key: 'procedimento' as AgendamentoField, validate: (v: string) => !v        ? 'Selecione um procedimento'         : null },
  { key: 'medicoId'     as AgendamentoField, validate: (v: string) => !v        ? 'Selecione um profissional'         : null },
  { key: 'pagamento'    as AgendamentoField, validate: (v: string) => !v        ? 'Selecione o status de pagamento'   : null },
  { key: 'status'       as AgendamentoField, validate: (v: string) => !v        ? 'Selecione um status'               : null },
  { key: 'valor'        as AgendamentoField, validate: (v: string) => !v.trim() || v === 'R$ 0,00' ? 'Informe o valor do procedimento' : null },
];

function parseMoedaToNumber(v: string): number {
  return parseFloat(v.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
}

function mapAgendamentoToCalEvent(apt: AgendamentoAPI, lancamento?: LancamentoAPI): CalEvent {
  const date = new Date(apt.dataHora);
  const proc = (apt.tipoConsulta || '').toLowerCase().replace(/ /g, '-');
  return {
    id:               apt.id,
    weekDay:          date.getDay(),
    hour:             date.getHours(),
    year:             date.getFullYear(),
    month:            date.getMonth(),
    monthDay:         date.getDate(),
    name:             apt.pacienteNome,
    procedure:        apt.tipoConsulta || 'Consulta',
    color:            PROCEDURE_COLOR[proc] ?? '#BBA188',
    lancamentoId:     lancamento?.id,
    pagamentoStatus:  lancamento?.status,
    medicoId:         apt.medicoId,
    pacienteId:       apt.pacienteId,
    valorLancamento:  lancamento?.valor,
  };
}

function parseHour(h: string)       { return parseInt(h.split(':')[0], 10); }
function parseDayOfMonth(d: string) { return parseInt(d.split('-')[2], 10); }
function parseDayOfWeek(d: string)  { return new Date(`${d}T12:00:00`).getDay(); }
function parseYear(d: string)       { return parseInt(d.split('-')[0], 10); }
function parseMonth(d: string)      { return parseInt(d.split('-')[1], 10) - 1; }

function getWeekDaysForMonth(year: number, month: number): Date[] {
  const anchor = new Date(year, month, 1);
  const start  = new Date(anchor);
  start.setDate(anchor.getDate() - anchor.getDay());
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
}

function isFormDirty(form: AgendamentoForm): boolean {
  return form.nome.trim() !== '' || form.telefone.trim() !== '' || form.data !== '' ||
    form.horario !== '' || form.procedimento !== '' || form.medicoId !== '' ||
    form.pagamento !== '' || form.status !== '' ||
    form.valor.trim() !== '' || form.observacoes.trim() !== '';
}

export default function Agenda() {
  const { can, isSuperAdmin } = usePermissions();
  const { currentUser } = useCurrentUser();
  const today = new Date();

  const [view,        setView]        = useState<'semana' | 'mes'>('semana');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form,        setForm]        = useState<AgendamentoForm>(FORM_INITIAL);
  const [events,      setEvents]      = useState<CalEvent[]>([]);
  const [navYear,     setNavYear]     = useState(today.getFullYear());
  const [navMonth,    setNavMonth]    = useState(today.getMonth());
  const [weekOffset,  setWeekOffset]  = useState(0);
  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage,   setSuccessMessage]   = useState('');
  const [agendaError,      setAgendaError]      = useState<string | null>(null);

  const [allPacientes,       setAllPacientes]       = useState<PacienteAPI[]>([]);
  const [patientDropOpen,    setPatientDropOpen]    = useState(false);
  const [selectedPacienteId, setSelectedPacienteId] = useState<number | null>(null);
  const patientDropRef = useRef<HTMLDivElement>(null);

  const [profissionais, setProfissionais] = useState<ProfissionalAPI[]>([]);

  // Marcar como pago
  const [selectedEvent,      setSelectedEvent]      = useState<CalEvent | null>(null);
  const [showPagarModal,     setShowPagarModal]     = useState(false);
  const [formaPagarSelected, setFormaPagarSelected] = useState('');
  const [valorPagar,         setValorPagar]         = useState('');
  const [pagarError,         setPagarError]         = useState<string | null>(null);
  const [loadingPagar,       setLoadingPagar]       = useState(false);

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<AgendamentoField>(VALIDATION_FIELDS);

  // Carrega agendamentos + lancamentos e cruza os dados
  async function loadEvents() {
    try {
      const agendamentosRes = await listarAgendamentos(0, 200);
      let lMap: Record<number, LancamentoAPI> = {};
      try {
        const lancamentosRes = await listarLancamentos(0, 1000);
        (lancamentosRes.content || []).forEach(l => {
          if (l.agendamentoId) lMap[l.agendamentoId] = l;
        });
      } catch { /* mostra agendamentos mesmo se lancamentos falhar */ }
      setEvents((agendamentosRes.content || []).map(apt => mapAgendamentoToCalEvent(apt, lMap[apt.id])));
    } catch {}
  }

  useEffect(() => { loadEvents(); }, []);

  useEffect(() => {
    listarPacientes('', 0, 1000).then(res => {
      setAllPacientes(res.content || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    listarAreaTecnica().then(lista => {
      setProfissionais(lista.filter(p => p.ativo));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (patientDropRef.current && !patientDropRef.current.contains(e.target as Node)) {
        setPatientDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isSuperAdmin && !can('agenda.read') && !can('agenda.read_own')) return <AccessDenied />;

  const canCreate = isSuperAdmin || can('agenda.create');

  const isAtMin = navYear === NAV_MIN.year && navMonth === NAV_MIN.month;
  const isAtMax = navYear === NAV_MAX.year && navMonth === NAV_MAX.month;

  function goToPrev() {
    if (isAtMin) return;
    setWeekOffset(0);
    if (navMonth === 0) { setNavYear(y => y - 1); setNavMonth(11); }
    else { setNavMonth(m => m - 1); }
  }
  function goToNext() {
    if (isAtMax) return;
    setWeekOffset(0);
    if (navMonth === 11) { setNavYear(y => y + 1); setNavMonth(0); }
    else { setNavMonth(m => m + 1); }
  }

  const firstDay    = new Date(navYear, navMonth, 1).getDay();
  const daysInMonth = new Date(navYear, navMonth + 1, 0).getDate();
  const calCells    = Array.from({ length: 42 }, (_, i) => { const d = i - firstDay + 1; return d > 0 && d <= daysInMonth ? d : null; });
  const monthName   = new Date(navYear, navMonth, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const isCurrentMonth = navYear === today.getFullYear() && navMonth === today.getMonth();

  const baseWeekDays = isCurrentMonth
    ? (() => { const s = new Date(today); s.setDate(today.getDate() - today.getDay()); return Array.from({ length: 7 }, (_, i) => { const d = new Date(s); d.setDate(s.getDate() + i); return d; }); })()
    : getWeekDaysForMonth(navYear, navMonth);

  const weekDays = baseWeekDays.map(d => { const s = new Date(d); s.setDate(d.getDate() + weekOffset * 7); return s; });
  const weekTitle = `${weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} – ${weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  function handleChange(field: keyof AgendamentoForm, value: string) { setForm(prev => ({ ...prev, [field]: value })); clearError(field as AgendamentoField); }
  function handleMaskedChange(field: keyof AgendamentoForm, value: string) { setForm(prev => ({ ...prev, [field]: value })); clearError(field as AgendamentoField); }
  function handleDataChange(raw: string) {
    if (!raw) { handleChange('data', ''); return; }
    const [yearStr, month, day] = raw.split('-');
    handleChange('data', `${(yearStr || '').slice(0, 4)}-${month ?? ''}-${day ?? ''}`);
  }
  function handleCancelClick() { isFormDirty(form) ? setShowCancelModal(true) : forceClose(); }
  function forceClose() {
    setForm(FORM_INITIAL); clearAll(); setAgendaError(null);
    setIsModalOpen(false); setShowCancelModal(false); setShowConfirmModal(false);
    setPatientDropOpen(false); setSelectedPacienteId(null);
  }
  function handleSaveClick() {
    const isValid = validate({
      nome: form.nome, telefone: form.telefone, data: form.data, horario: form.horario,
      procedimento: form.procedimento, medicoId: form.medicoId,
      pagamento: form.pagamento, status: form.status, valor: form.valor,
    });
    if (!isValid) return;
    if (form.pagamento === 'PAGO' && !form.formaPagamento) {
      setAgendaError('Selecione a forma de pagamento.');
      return;
    }
    setShowConfirmModal(true);
  }

  async function handleConfirmSave() {
    setShowConfirmModal(false);
    setAgendaError(null);
    const procedureLabel = procedureOptions.find(p => p.value === form.procedimento)?.label ?? form.procedimento;
    try {
      let pacienteId: number | undefined = selectedPacienteId ?? undefined;

      if (!pacienteId) {
        const pacientesResult = await listarPacientes(form.nome, 0, 5);
        const paciente = (pacientesResult.content || [])[0];
        if (!paciente) {
          setAgendaError(`Paciente "${form.nome}" não encontrado. Cadastre-o primeiro na tela de Pacientes.`);
          return;
        }
        pacienteId = paciente.id;
      }

      const dataHora = `${form.data}T${form.horario}:00`;
      const novoAgendamento = await criarAgendamento({
        pacienteId,
        medicoId:     parseInt(form.medicoId, 10),
        dataHora,
        tipoConsulta: procedureLabel,
        observacoes:  form.observacoes,
      });

      // Cria o lançamento vinculado ao agendamento
      const valorNumerico = parseMoedaToNumber(form.valor);
      const lancamento = await criarLancamento({
        pacienteId,
        agendamentoId: novoAgendamento.id,
        valor:         valorNumerico,
        formaPagamento: form.pagamento === 'PAGO' ? form.formaPagamento : 'PIX',
        dataVencimento: form.data,
        descricao:      procedureLabel,
      });

      let lancamentoPago = lancamento;
      if (form.pagamento === 'PAGO') {
        lancamentoPago = await pagarLancamento(lancamento.id, form.formaPagamento);
      }

      await loadEvents();
      setIsModalOpen(false);

      const msg = form.pagamento === 'PAGO'
        ? 'Agendamento salvo e pagamento registrado! Comissão gerada para o profissional.'
        : 'Agendamento salvo com pagamento pendente.';
      setSuccessMessage(msg);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar agendamento. Tente novamente.';
      setAgendaError(msg);
    }
  }

  function handleSuccessClose() {
    setShowSuccessModal(false); setSuccessMessage(''); setAgendaError(null);
    setForm(FORM_INITIAL); clearAll(); setSelectedPacienteId(null);
  }

  // Marcar como pago a partir do calendário
  function handleEventClick(ev: CalEvent) {
    if (ev.pagamentoStatus === 'PAGO') return;
    setSelectedEvent(ev);
    setFormaPagarSelected('');
    setValorPagar('');
    setPagarError(null);
    setShowPagarModal(true);
  }

  async function handleConfirmPagar() {
    if (!selectedEvent) return;
    if (!formaPagarSelected) { setPagarError('Selecione a forma de pagamento.'); return; }

    setLoadingPagar(true);
    setPagarError(null);
    try {
      let lancamentoId = selectedEvent.lancamentoId;

      // Agendamento sem lançamento — cria o lançamento agora
      if (!lancamentoId) {
        const valorNum = parseMoedaToNumber(valorPagar);
        if (!valorNum || valorNum <= 0) {
          setPagarError('Informe o valor do procedimento.');
          setLoadingPagar(false);
          return;
        }
        const hoje = new Date().toISOString().split('T')[0];
        const novoLancamento = await criarLancamento({
          pacienteId:     selectedEvent.pacienteId!,
          agendamentoId:  selectedEvent.id,
          valor:          valorNum,
          formaPagamento: formaPagarSelected,
          dataVencimento: hoje,
          descricao:      selectedEvent.procedure,
        });
        lancamentoId = novoLancamento.id;
      }

      await pagarLancamento(lancamentoId, formaPagarSelected);
      await loadEvents();
      setShowPagarModal(false);
      setSelectedEvent(null);
      setSuccessMessage('Pagamento registrado! Comissão gerada para o profissional.');
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao registrar pagamento.';
      setPagarError(msg);
    }
    setLoadingPagar(false);
  }

  const filteredPacientes = allPacientes.filter(p =>
    p.nome.toLowerCase().includes(form.nome.toLowerCase()) && p.ativo
  );

  function handleNomeChange(value: string) {
    setSelectedPacienteId(null);
    setForm(prev => ({ ...prev, nome: value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '') }));
    clearError('nome');
    setPatientDropOpen(value.trim().length > 0);
  }

  function handleSelectPaciente(paciente: PacienteAPI) {
    setSelectedPacienteId(paciente.id);
    setForm(prev => ({
      ...prev,
      nome:     paciente.nome,
      telefone: paciente.telefone || paciente.celular || prev.telefone,
    }));
    clearError('nome');
    clearError('telefone');
    setPatientDropOpen(false);
  }

  return (
    <Container>
      <Header>
        <Title>Agenda</Title>
        <ActionsRow>
          <ToggleGroup>
            <ToggleBtn $active={view === 'semana'} onClick={() => setView('semana')}>Semana</ToggleBtn>
            <ToggleBtn $active={view === 'mes'}    onClick={() => setView('mes')}>Mês</ToggleBtn>
          </ToggleGroup>
          {canCreate && (
            <Button variant="primary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>} onClick={() => setIsModalOpen(true)}>
              Novo Agendamento
            </Button>
          )}
        </ActionsRow>
      </Header>

      <CalendarNav>
        <button className="nav-btn" onClick={goToPrev} disabled={isAtMin} style={{ opacity: isAtMin ? 0.3 : 1, cursor: isAtMin ? 'not-allowed' : 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <CalendarTitle>{view === 'semana' ? weekTitle : monthName.charAt(0).toUpperCase() + monthName.slice(1)}</CalendarTitle>
        <button className="nav-btn" onClick={goToNext} disabled={isAtMax} style={{ opacity: isAtMax ? 0.3 : 1, cursor: isAtMax ? 'not-allowed' : 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </CalendarNav>

      <Legend>
        {[{ label: 'Botox/Toxina', color: '#BBA188' }, { label: 'Preenchimento', color: '#EBD5B0' }, { label: 'Bioestimulador', color: '#1b1b1b' }, { label: 'Outros', color: '#a8906f' }].map(l => (
          <LegendItem key={l.label}><LegendDot $color={l.color} />{l.label}</LegendItem>
        ))}
        <LegendItem><LegendDot $color="#27ae60" />Pago</LegendItem>
        <LegendItem><LegendDot $color="#e74c3c" />Pendente (clique para pagar)</LegendItem>
      </Legend>

      {view === 'mes' ? (
        <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <CalendarGrid>
            {DAYS.map(d => <DayHeader key={d}>{d}</DayHeader>)}
            {calCells.map((day, i) => {
              const isToday = day === today.getDate() && navMonth === today.getMonth() && navYear === today.getFullYear();
              const dayEvents = events.filter(e => e.year === navYear && e.month === navMonth && e.monthDay === day);
              return (
                <DayCell key={i} $isToday={isToday} $isEmpty={!day}>
                  {day && (
                    <>
                      <DayNumber $isToday={isToday}>{day}</DayNumber>
                      <EventsWrap>
                        {dayEvents.slice(0, 3).map(ev => (
                          <EventChip
                            key={ev.id}
                            $color={ev.pagamentoStatus === 'PAGO' ? '#27ae60' : ev.pagamentoStatus === 'PENDENTE' ? '#e74c3c' : ev.color}
                            onClick={() => handleEventClick(ev)}
                            style={{ cursor: ev.pagamentoStatus === 'PENDENTE' ? 'pointer' : 'default' }}
                          >
                            {ev.name.split(' ')[0]}
                          </EventChip>
                        ))}
                        {dayEvents.length > 3 && <EventChip $color="#999">+{dayEvents.length - 3}</EventChip>}
                      </EventsWrap>
                    </>
                  )}
                </DayCell>
              );
            })}
          </CalendarGrid>
        </div>
      ) : (
        <WeekView>
          <WeekHeader>
            <div style={{ padding: '12px 0' }} />
            {weekDays.map((d, i) => (
              <div key={i} style={{ padding: '12px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{DAYS[i]}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: d.toDateString() === today.toDateString() ? '#fff' : 'rgba(255,255,255,0.9)', background: d.toDateString() === today.toDateString() ? 'rgba(255,255,255,0.25)' : 'transparent', borderRadius: 8, padding: '2px 0', marginTop: 2 }}>{d.getDate()}</div>
              </div>
            ))}
          </WeekHeader>
          <div style={{ background: 'white', borderRadius: '0 0 14px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            {HOURS.map((hour, hi) => (
              <SlotRow key={hi}>
                <TimeLabel>{hour}</TimeLabel>
                {weekDays.map((d, di) => {
                  const slotEvents = events.filter(e => e.year === d.getFullYear() && e.month === d.getMonth() && e.monthDay === d.getDate() && e.hour === hi + 8);
                  return (
                    <TimeSlot key={di}>
                      {slotEvents.map(ev => (
                        <EventBlock
                          key={ev.id}
                          $color={ev.pagamentoStatus === 'PAGO' ? '#27ae60' : ev.pagamentoStatus === 'PENDENTE' ? '#e74c3c' : ev.color}
                          onClick={() => handleEventClick(ev)}
                          style={{ cursor: ev.pagamentoStatus === 'PENDENTE' ? 'pointer' : 'default' }}
                        >
                          <strong>{ev.name}</strong>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {ev.procedure}
                            <PagamentoBadge status={ev.pagamentoStatus} />
                          </span>
                        </EventBlock>
                      ))}
                    </TimeSlot>
                  );
                })}
              </SlotRow>
            ))}
          </div>
        </WeekView>
      )}

      {/* Modal: Novo Agendamento */}
      <Modal isOpen={isModalOpen} onClose={handleCancelClick} closeOnOverlayClick={false} title="Novo Agendamento" size="md"
        footer={<><Button variant="outline" onClick={handleCancelClick}>Cancelar</Button><Button variant="primary" onClick={handleSaveClick}>Salvar Agendamento</Button></>}
      >
        {agendaError && (
          <div style={{ marginBottom: 14, padding: '10px 14px', background: '#fdecea', border: '1px solid #f5c6cb', borderRadius: 8, color: '#c0392b', fontSize: '0.85rem' }}>
            {agendaError}
          </div>
        )}
        <FormGrid>
          {/* Paciente com autocomplete */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }} ref={patientDropRef}>
            <Input
              label="Nome do Paciente *"
              placeholder="Digite o nome..."
              value={form.nome}
              onChange={e => handleNomeChange(e.target.value)}
              onFocus={() => { if (form.nome.trim().length > 0) setPatientDropOpen(true); }}
              maxLength={80}
              error={errors.nome}
              autoComplete="off"
            />
            {patientDropOpen && filteredPacientes.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999, background: '#fff', border: '1.5px solid #e8e0d8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: 4, overflowY: 'auto', maxHeight: `${4 * 52}px` }}>
                {filteredPacientes.map((paciente, idx) => (
                  <div
                    key={paciente.id}
                    onMouseDown={e => { e.preventDefault(); handleSelectPaciente(paciente); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: idx < filteredPacientes.length - 1 ? '1px solid #f5f0eb' : 'none', background: 'transparent', transition: 'background 0.15s', minHeight: 52, boxSizing: 'border-box' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fdf9f5'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#BBA188', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {paciente.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{paciente.nome}</span>
                      <span style={{ fontSize: '0.73rem', color: '#999' }}>{paciente.telefone || paciente.celular || paciente.email || '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {patientDropOpen && form.nome.trim().length > 0 && filteredPacientes.length === 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999, background: '#fff', border: '1.5px solid #e8e0d8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: 4, padding: '14px', textAlign: 'center', fontSize: '0.82rem', color: '#aaa' }}>
                Nenhum paciente encontrado
              </div>
            )}
          </div>

          <Input label="Telefone *" mask="telefone" value={form.telefone} inputMode="numeric" maxLength={15} onValueChange={v => handleMaskedChange('telefone', v)} error={errors.telefone} />
          <Input label="Data *" type="date" value={form.data} onChange={e => handleDataChange(e.target.value)} error={errors.data} />
          <Input label="Horário *" type="time" value={form.horario} onChange={e => handleChange('horario', e.target.value)} error={errors.horario} />
          <Input label="Valor (R$) *" mask="moeda" value={form.valor} inputMode="numeric" maxLength={14} onValueChange={v => handleMaskedChange('valor', v)} error={errors.valor} />

          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Procedimento *" placeholder="Selecione..." options={procedureOptions} value={form.procedimento} onChange={v => handleChange('procedimento', v)} error={errors.procedimento} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Profissional *" placeholder="Selecione um profissional..." options={profissionais.map(p => ({ value: String(p.id), label: p.nome }))} value={form.medicoId} onChange={v => handleChange('medicoId', v)} error={errors.medicoId} />
          </div>

          {/* Pagamento */}
          <Select
            label="Pagamento *"
            placeholder="Selecione..."
            options={pagamentoOptions}
            value={form.pagamento}
            onChange={v => { handleChange('pagamento', v); if (v !== 'PAGO') handleChange('formaPagamento', ''); }}
            error={errors.pagamento}
          />
          {form.pagamento === 'PAGO' ? (
            <Select
              label="Forma de Pagamento *"
              placeholder="Selecione..."
              options={formaPagamentoOptions}
              value={form.formaPagamento}
              onChange={v => handleChange('formaPagamento', v)}
            />
          ) : (
            <div />
          )}

          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Status *" placeholder="Selecione..." options={statusOptions} value={form.status} onChange={v => handleChange('status', v)} error={errors.status} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Observações" placeholder="Informações adicionais..." maxLength={300} value={form.observacoes} onChange={e => handleChange('observacoes', e.target.value)} />
          </div>
        </FormGrid>
      </Modal>

      {/* Modal: Confirmar pagamento de evento pendente */}
      <Modal
        isOpen={showPagarModal}
        onClose={() => { setShowPagarModal(false); setSelectedEvent(null); }}
        closeOnOverlayClick
        title="Confirmar Pagamento"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => { setShowPagarModal(false); setSelectedEvent(null); }}>Cancelar</Button>
            <Button variant="primary" onClick={handleConfirmPagar}>
              {loadingPagar ? 'Registrando...' : 'Confirmar Pagamento'}
            </Button>
          </>
        }
      >
        {selectedEvent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fdf9f5', borderRadius: 10, padding: '12px 16px' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Paciente</p>
              <p style={{ margin: '2px 0 0', fontWeight: 600, color: '#1a1a1a' }}>{selectedEvent.name}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>{selectedEvent.procedure}</p>
            </div>
            {pagarError && (
              <div style={{ padding: '10px 14px', background: '#fdecea', border: '1px solid #f5c6cb', borderRadius: 8, color: '#c0392b', fontSize: '0.85rem' }}>
                {pagarError}
              </div>
            )}
            {/* Só pede valor quando o agendamento ainda não tem lançamento */}
            {!selectedEvent.lancamentoId && (
              <Input
                label="Valor do Procedimento (R$) *"
                mask="moeda"
                value={valorPagar}
                inputMode="numeric"
                maxLength={14}
                onValueChange={v => { setValorPagar(v); setPagarError(null); }}
              />
            )}
            <Select
              label="Forma de Pagamento *"
              placeholder="Selecione..."
              options={formaPagamentoOptions}
              value={formaPagarSelected}
              onChange={v => { setFormaPagarSelected(v); setPagarError(null); }}
            />
          </div>
        )}
      </Modal>

      <CancelModal isOpen={showCancelModal} title="Deseja cancelar?" message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas." onConfirm={forceClose} onCancel={() => setShowCancelModal(false)} />
      <ConfirmModal isOpen={showConfirmModal} title="Salvar agendamento?" message={`Tem certeza que deseja agendar ${form.nome || 'este paciente'}?`} confirmText="Confirmar" cancelText="Voltar" onConfirm={handleConfirmSave} onCancel={() => setShowConfirmModal(false)} />
      <SucessModal isOpen={showSuccessModal} title="Sucesso!" message={successMessage} onClose={handleSuccessClose} buttonText="Continuar" />
    </Container>
  );
}
