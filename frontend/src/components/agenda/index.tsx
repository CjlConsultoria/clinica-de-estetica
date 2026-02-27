'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import AccessDenied from '@/components/ui/AccessDenied';
import {
  listarAgendamentos, criarAgendamento,
  type AgendamentoResponse,
} from '@/services/agendamentosApi';
import { listarPacientes, type PacienteResponse } from '@/services/pacientesApi';
import { listarUsuarios, type UsuarioResponse } from '@/services/usuariosApi';
import {
  Container, Header, Title, ActionsRow,
  CalendarNav, CalendarTitle, CalendarGrid, DayHeader,
  DayCell, DayNumber, EventChip, EventsWrap,
  WeekView, TimeSlot, TimeLabel, SlotRow, EventBlock,
  ToggleGroup, ToggleBtn, Legend, LegendItem, LegendDot, FormGrid,
} from './styles';

const NAV_MIN = { year: 2025, month: 0  };
const NAV_MAX = { year: 2026, month: 11 };

const procedureOptions = [
  { value: 'botox',            label: 'Botox Facial'        },
  { value: 'preenchimento',    label: 'Preenchimento Labial' },
  { value: 'bioestimulador',   label: 'Bioestimulador'       },
  { value: 'fio-pdo',          label: 'Fio de PDO'           },
  { value: 'microagulhamento', label: 'Microagulhamento'     },
  { value: 'toxina',           label: 'Toxina Botulínica'    },
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
}

type AgendamentoField = 'pacienteId' | 'medicoId' | 'data' | 'horario' | 'procedimento';

interface AgendamentoForm {
  pacienteId: string;
  medicoId: string;
  data: string;
  horario: string;
  procedimento: string;
  observacoes: string;
}

const DAYS  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS = Array.from({ length: 11 }, (_, i) => `${i + 8}:00`);
const FORM_INITIAL: AgendamentoForm = {
  pacienteId: '', medicoId: '', data: '', horario: '', procedimento: '', observacoes: '',
};

const VALIDATION_FIELDS = [
  { key: 'pacienteId'   as AgendamentoField, validate: (v: string) => !v ? 'Selecione um paciente'         : null },
  { key: 'medicoId'     as AgendamentoField, validate: (v: string) => !v ? 'Selecione um profissional'     : null },
  { key: 'data'         as AgendamentoField, validate: (v: string) => !v ? 'Data é obrigatória'            : null },
  { key: 'horario'      as AgendamentoField, validate: (v: string) => !v ? 'Horário é obrigatório'         : null },
  { key: 'procedimento' as AgendamentoField, validate: (v: string) => !v ? 'Selecione um procedimento'     : null },
];

function mapAgendamento(a: AgendamentoResponse): CalEvent {
  const d = new Date(a.dataHora);
  const tipoConsulta = a.tipoConsulta ?? '';
  const procedureLabel = (procedureOptions.find(p => p.value === tipoConsulta)?.label ?? tipoConsulta) || 'Consulta';
  return {
    id:        a.id,
    weekDay:   d.getDay(),
    hour:      d.getHours(),
    year:      d.getFullYear(),
    month:     d.getMonth(),
    monthDay:  d.getDate(),
    name:      a.pacienteNome ?? '—',
    procedure: procedureLabel,
    color:     PROCEDURE_COLOR[tipoConsulta] ?? '#BBA188',
  };
}

function getWeekDaysForMonth(year: number, month: number): Date[] {
  const anchor = new Date(year, month, 1);
  const start  = new Date(anchor);
  start.setDate(anchor.getDate() - anchor.getDay());
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
}

function isFormDirty(form: AgendamentoForm): boolean {
  return form.pacienteId !== '' || form.medicoId !== '' || form.data !== '' ||
    form.horario !== '' || form.procedimento !== '' || form.observacoes.trim() !== '';
}

export default function Agenda() {
  const { can, isSuperAdmin } = usePermissions();
  const today = new Date();

  const [view,              setView]              = useState<'semana' | 'mes'>('semana');
  const [isModalOpen,       setIsModalOpen]       = useState(false);
  const [form,              setForm]              = useState<AgendamentoForm>(FORM_INITIAL);
  const [events,            setEvents]            = useState<CalEvent[]>([]);
  const [pacientes,         setPacientes]         = useState<PacienteResponse[]>([]);
  const [profissionais,     setProfissionais]     = useState<UsuarioResponse[]>([]);
  const [navYear,           setNavYear]           = useState(today.getFullYear());
  const [navMonth,          setNavMonth]          = useState(today.getMonth());
  const [weekOffset,        setWeekOffset]        = useState(0);
  const [showCancelModal,   setShowCancelModal]   = useState(false);
  const [showConfirmModal,  setShowConfirmModal]  = useState(false);
  const [showSuccessModal,  setShowSuccessModal]  = useState(false);
  const [successMessage,    setSuccessMessage]    = useState('');

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<AgendamentoField>(VALIDATION_FIELDS);

  useEffect(() => {
    listarAgendamentos(0, 200)
      .then(r => setEvents(r.content.map(mapAgendamento)))
      .catch(console.error);

    listarPacientes(undefined, 0, 500)
      .then(r => setPacientes(r.content))
      .catch(console.error);

    listarUsuarios()
      .then(users => setProfissionais(users.filter(u => u.areaProfissional === 'TECNICA')))
      .catch(console.error);
  }, []);

  if (!isSuperAdmin && !can('agenda.read') && !can('agenda.read_own')) return <AccessDenied />;

  const canCreate = isSuperAdmin || can('agenda.create');

  const pacienteOptions = pacientes.map(p => ({ value: String(p.id), label: p.nome }));
  const profissionalOptions = profissionais.map(u => ({ value: String(u.id), label: u.nome }));

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
  function handleDataChange(raw: string) {
    if (!raw) { handleChange('data', ''); return; }
    const [yearStr, month, day] = raw.split('-');
    handleChange('data', `${(yearStr || '').slice(0, 4)}-${month ?? ''}-${day ?? ''}`);
  }
  function handleCancelClick() { isFormDirty(form) ? setShowCancelModal(true) : forceClose(); }
  function forceClose() { setForm(FORM_INITIAL); clearAll(); setIsModalOpen(false); setShowCancelModal(false); setShowConfirmModal(false); }
  function handleSaveClick() {
    const isValid = validate({ pacienteId: form.pacienteId, medicoId: form.medicoId, data: form.data, horario: form.horario, procedimento: form.procedimento });
    if (!isValid) return;
    setShowConfirmModal(true);
  }

  async function handleConfirmSave() {
    setShowConfirmModal(false);
    const [h, m] = form.horario.split(':');
    const dataHora = `${form.data}T${h}:${m ?? '00'}:00`;
    const payload = {
      pacienteId:   Number(form.pacienteId),
      medicoId:     Number(form.medicoId),
      dataHora,
      tipoConsulta: form.procedimento,
      observacoes:  form.observacoes || undefined,
    };
    try {
      const created = await criarAgendamento(payload);
      setEvents(prev => [...prev, mapAgendamento(created)]);
      setIsModalOpen(false);
      setSuccessMessage('Agendamento salvo com sucesso!');
      setShowSuccessModal(true);
    } catch (err) {
      alert((err as Error).message);
    }
  }

  function handleSuccessClose() { setShowSuccessModal(false); setSuccessMessage(''); setForm(FORM_INITIAL); clearAll(); }

  const pacienteSelecionado = pacientes.find(p => String(p.id) === form.pacienteId);

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
                  {day && (<><DayNumber $isToday={isToday}>{day}</DayNumber><EventsWrap>{dayEvents.slice(0, 3).map(ev => <EventChip key={ev.id} $color={ev.color}>{ev.name.split(' ')[0]}</EventChip>)}{dayEvents.length > 3 && <EventChip $color="#999">+{dayEvents.length - 3}</EventChip>}</EventsWrap></>)}
                </DayCell>
              );
            })}
          </CalendarGrid>
        </div>
      ) : (
        <WeekView>
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', background: '#BBA188', borderRadius: '14px 14px 0 0', overflow: 'hidden' }}>
            <div style={{ padding: '12px 0' }} />
            {weekDays.map((d, i) => (
              <div key={i} style={{ padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{DAYS[i]}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: d.toDateString() === today.toDateString() ? '#fff' : 'rgba(255,255,255,0.9)', background: d.toDateString() === today.toDateString() ? 'rgba(255,255,255,0.25)' : 'transparent', borderRadius: 8, padding: '2px 0', marginTop: 2 }}>{d.getDate()}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: '0 0 14px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            {HOURS.map((hour, hi) => (
              <SlotRow key={hi}>
                <TimeLabel>{hour}</TimeLabel>
                {weekDays.map((d, di) => {
                  const slotEvents = events.filter(e => e.year === d.getFullYear() && e.month === d.getMonth() && e.monthDay === d.getDate() && e.hour === hi + 8);
                  return (<TimeSlot key={di}>{slotEvents.map(ev => <EventBlock key={ev.id} $color={ev.color}><strong>{ev.name}</strong><span>{ev.procedure}</span></EventBlock>)}</TimeSlot>);
                })}
              </SlotRow>
            ))}
          </div>
        </WeekView>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCancelClick} closeOnOverlayClick={false} title="Novo Agendamento" size="md"
        footer={<><Button variant="outline" onClick={handleCancelClick}>Cancelar</Button><Button variant="primary" onClick={handleSaveClick}>Salvar Agendamento</Button></>}
      >
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Select
              label="Paciente *"
              placeholder={pacientes.length === 0 ? 'Carregando...' : 'Selecione um paciente...'}
              options={pacienteOptions}
              value={form.pacienteId}
              onChange={v => handleChange('pacienteId', v)}
              error={errors.pacienteId}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Select
              label="Profissional *"
              placeholder={profissionais.length === 0 ? 'Carregando...' : 'Selecione um profissional...'}
              options={profissionalOptions}
              value={form.medicoId}
              onChange={v => handleChange('medicoId', v)}
              error={errors.medicoId}
            />
          </div>
          <Input label="Data *" type="date" value={form.data} onChange={e => handleDataChange(e.target.value)} error={errors.data} />
          <Input label="Horário *" type="time" value={form.horario} onChange={e => handleChange('horario', e.target.value)} error={errors.horario} />
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Procedimento *" placeholder="Selecione..." options={procedureOptions} value={form.procedimento} onChange={v => handleChange('procedimento', v)} error={errors.procedimento} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Observações" placeholder="Informações adicionais..." maxLength={300} value={form.observacoes} onChange={e => handleChange('observacoes', e.target.value)} />
          </div>
        </FormGrid>
      </Modal>

      <CancelModal isOpen={showCancelModal} title="Deseja cancelar?" message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas." onConfirm={forceClose} onCancel={() => setShowCancelModal(false)} />
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Salvar agendamento?"
        message={`Tem certeza que deseja agendar ${pacienteSelecionado?.nome ?? 'este paciente'}?`}
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />
      <SucessModal isOpen={showSuccessModal} title="Sucesso!" message={successMessage} onClose={handleSuccessClose} buttonText="Continuar" />
    </Container>
  );
}
