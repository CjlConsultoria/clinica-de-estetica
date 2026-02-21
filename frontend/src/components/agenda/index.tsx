'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
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
  { value: 'botox',            label: 'Botox Facial' },
  { value: 'preenchimento',    label: 'Preenchimento Labial' },
  { value: 'bioestimulador',   label: 'Bioestimulador' },
  { value: 'fio-pdo',          label: 'Fio de PDO' },
  { value: 'microagulhamento', label: 'Microagulhamento' },
  { value: 'toxina',           label: 'Toxina Botulínica' },
];

const statusOptions = [
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'aguardando', label: 'Aguardando' },
  { value: 'cancelado',  label: 'Cancelado' },
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
  id: number;
  weekDay: number;
  hour: number;
  year: number;
  month: number;
  monthDay: number;
  name: string;
  procedure: string;
  color: string;
}

type AgendamentoField =
  | 'nome' | 'telefone' | 'data' | 'horario'
  | 'procedimento' | 'status' | 'valor';

interface AgendamentoForm {
  nome: string;
  telefone: string;
  data: string;
  horario: string;
  procedimento: string;
  status: string;
  valor: string;
  observacoes: string;
}

const DAYS  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS = Array.from({ length: 11 }, (_, i) => `${i + 8}:00`);
const FORM_INITIAL: AgendamentoForm = {
  nome: '', telefone: '', data: '', horario: '',
  procedimento: '', status: '', valor: '', observacoes: '',
};

const INITIAL_EVENTS: CalEvent[] = [
  { id: 1, weekDay: 0, hour: 8,  year: 2026, month: 1, monthDay: 1,  name: 'Ana Beatriz',   procedure: 'Botox Facial',      color: '#BBA188' },
  { id: 2, weekDay: 0, hour: 10, year: 2026, month: 1, monthDay: 1,  name: 'Carla M.',      procedure: 'Preenchimento',     color: '#EBD5B0' },
  { id: 3, weekDay: 1, hour: 9,  year: 2026, month: 1, monthDay: 9,  name: 'Fernanda Lima', procedure: 'Bioestimulador',    color: '#1b1b1b' },
  { id: 4, weekDay: 3, hour: 14, year: 2026, month: 1, monthDay: 11, name: 'Marina Souza',  procedure: 'Fio PDO',           color: '#a8906f' },
  { id: 5, weekDay: 4, hour: 11, year: 2026, month: 1, monthDay: 19, name: 'Juliana R.',    procedure: 'Toxina Botulínica', color: '#BBA188' },
  { id: 6, weekDay: 5, hour: 15, year: 2026, month: 1, monthDay: 20, name: 'Patrícia A.',   procedure: 'Microagulhamento',  color: '#8a7560' },
];

const VALIDATION_FIELDS = [
  { key: 'nome'         as AgendamentoField, validate: (v: string) => !v.trim() ? 'Nome do paciente é obrigatório' : null },
  { key: 'telefone'     as AgendamentoField, validate: (v: string) => !v.trim() ? 'Telefone é obrigatório' : null },
  { key: 'data'         as AgendamentoField, validate: (v: string) => !v ? 'Data é obrigatória' : null },
  { key: 'horario'      as AgendamentoField, validate: (v: string) => !v ? 'Horário é obrigatório' : null },
  { key: 'procedimento' as AgendamentoField, validate: (v: string) => !v ? 'Selecione um procedimento' : null },
  { key: 'status'       as AgendamentoField, validate: (v: string) => !v ? 'Selecione um status' : null },
  { key: 'valor'        as AgendamentoField, validate: (v: string) => !v.trim() || v === 'R$ 0,00' ? 'Informe o valor do procedimento' : null },
];

function parseHour(h: string): number       { return parseInt(h.split(':')[0], 10); }
function parseDayOfMonth(d: string): number { return parseInt(d.split('-')[2], 10); }
function parseDayOfWeek(d: string): number  { return new Date(`${d}T12:00:00`).getDay(); }
function parseYear(d: string): number       { return parseInt(d.split('-')[0], 10); }
function parseMonth(d: string): number      { return parseInt(d.split('-')[1], 10) - 1; }
function getWeekDaysForMonth(year: number, month: number): Date[] {
  const anchor = new Date(year, month, 1);
  const start  = new Date(anchor);
  start.setDate(anchor.getDate() - anchor.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function isFormDirty(form: AgendamentoForm): boolean {
  return (
    form.nome.trim() !== '' ||
    form.telefone.trim() !== '' ||
    form.data !== '' ||
    form.horario !== '' ||
    form.procedimento !== '' ||
    form.status !== '' ||
    form.valor.trim() !== '' ||
    form.observacoes.trim() !== ''
  );
}

export default function Agenda() {
  const today = new Date();

  const [view, setView]               = useState<'semana' | 'mes'>('semana');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm]               = useState<AgendamentoForm>(FORM_INITIAL);
  const [events, setEvents]           = useState<CalEvent[]>(INITIAL_EVENTS);
  const [nextId, setNextId]           = useState(100);
  const [navYear,  setNavYear]        = useState(today.getFullYear());
  const [navMonth, setNavMonth]       = useState(today.getMonth());
  const [weekOffset, setWeekOffset]   = useState(0);

  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage,   setSuccessMessage]   = useState('');

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<AgendamentoField>(VALIDATION_FIELDS);

  const isAtMin = navYear === NAV_MIN.year && navMonth === NAV_MIN.month;
  const isAtMax = navYear === NAV_MAX.year && navMonth === NAV_MAX.month;

  function goToPrev() {
    if (isAtMin) return;
    setWeekOffset(0);
    if (navMonth === 0) { setNavYear((y) => y - 1); setNavMonth(11); }
    else { setNavMonth((m) => m - 1); }
  }

  function goToNext() {
    if (isAtMax) return;
    setWeekOffset(0);
    if (navMonth === 11) { setNavYear((y) => y + 1); setNavMonth(0); }
    else { setNavMonth((m) => m + 1); }
  }

  const firstDay    = new Date(navYear, navMonth, 1).getDay();
  const daysInMonth = new Date(navYear, navMonth + 1, 0).getDate();
  const calCells    = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });
  const monthName = new Date(navYear, navMonth, 1)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const isCurrentMonth = navYear === today.getFullYear() && navMonth === today.getMonth();
  const baseWeekDays   = isCurrentMonth
    ? (() => {
        const s = new Date(today);
        s.setDate(today.getDate() - today.getDay());
        return Array.from({ length: 7 }, (_, i) => { const d = new Date(s); d.setDate(s.getDate() + i); return d; });
      })()
    : getWeekDaysForMonth(navYear, navMonth);

  const weekDays = baseWeekDays.map((d) => {
    const shifted = new Date(d);
    shifted.setDate(d.getDate() + weekOffset * 7);
    return shifted;
  });

  const weekTitle = `${weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} – ${weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  function handleChange(field: keyof AgendamentoForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError(field as AgendamentoField);
  }

  function handleMaskedChange(field: keyof AgendamentoForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError(field as AgendamentoField);
  }

  function handleDataChange(raw: string) {
    if (!raw) { handleChange('data', ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleChange('data', `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function handleCancelClick() {
    if (isFormDirty(form)) {
      setShowCancelModal(true);
    } else {
      forceClose();
    }
  }

  function forceClose() {
    setForm(FORM_INITIAL);
    clearAll();
    setIsModalOpen(false);
    setShowCancelModal(false);
    setShowConfirmModal(false);
  }

  function handleSaveClick() {
    const isValid = validate({
      nome: form.nome, telefone: form.telefone, data: form.data,
      horario: form.horario, procedimento: form.procedimento,
      status: form.status, valor: form.valor,
    });
    if (!isValid) return;
    setShowConfirmModal(true);
  }

  function handleConfirmSave() {
    const procedureLabel =
      procedureOptions.find((p) => p.value === form.procedimento)?.label ?? form.procedimento;

    const novoEvento: CalEvent = {
      id:        nextId,
      weekDay:   parseDayOfWeek(form.data),
      hour:      parseHour(form.horario),
      year:      parseYear(form.data),
      month:     parseMonth(form.data),
      monthDay:  parseDayOfMonth(form.data),
      name:      form.nome,
      procedure: procedureLabel,
      color:     PROCEDURE_COLOR[form.procedimento] ?? '#BBA188',
    };

    setEvents((prev) => [...prev, novoEvento]);
    setNextId((n) => n + 1);
    setShowConfirmModal(false);
    setIsModalOpen(false);
    setSuccessMessage('Agendamento salvo com sucesso!');
    setShowSuccessModal(true);
  }

  function handleSuccessClose() {
    setShowSuccessModal(false);
    setSuccessMessage('');
    setForm(FORM_INITIAL);
    clearAll();
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
          <Button
            variant="primary"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            }
            onClick={() => setIsModalOpen(true)}
          >
            Novo Agendamento
          </Button>
        </ActionsRow>
      </Header>

      <CalendarNav>
        <button
          className="nav-btn"
          onClick={goToPrev}
          disabled={isAtMin}
          style={{ opacity: isAtMin ? 0.3 : 1, cursor: isAtMin ? 'not-allowed' : 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <CalendarTitle>
          {view === 'semana' ? weekTitle : monthName.charAt(0).toUpperCase() + monthName.slice(1)}
        </CalendarTitle>
        <button
          className="nav-btn"
          onClick={goToNext}
          disabled={isAtMax}
          style={{ opacity: isAtMax ? 0.3 : 1, cursor: isAtMax ? 'not-allowed' : 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </CalendarNav>

      <Legend>
        {[
          { label: 'Botox/Toxina',   color: '#BBA188' },
          { label: 'Preenchimento',  color: '#EBD5B0' },
          { label: 'Bioestimulador', color: '#1b1b1b' },
          { label: 'Outros',         color: '#a8906f' },
        ].map((l) => (
          <LegendItem key={l.label}><LegendDot $color={l.color} />{l.label}</LegendItem>
        ))}
      </Legend>

      {view === 'mes' ? (
        <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <CalendarGrid>
            {DAYS.map((d) => <DayHeader key={d}>{d}</DayHeader>)}
            {calCells.map((day, i) => {
              const isToday =
                day === today.getDate() &&
                navMonth === today.getMonth() &&
                navYear  === today.getFullYear();
              const dayEvents = events.filter(
                (e) => e.year === navYear && e.month === navMonth && e.monthDay === day
              );
              return (
                <DayCell key={i} $isToday={isToday} $isEmpty={!day}>
                  {day && (
                    <>
                      <DayNumber $isToday={isToday}>{day}</DayNumber>
                      <EventsWrap>
                        {dayEvents.slice(0, 3).map((ev) => (
                          <EventChip key={ev.id} $color={ev.color}>
                            {ev.name.split(' ')[0]}
                          </EventChip>
                        ))}
                        {dayEvents.length > 3 && (
                          <EventChip $color="#999">+{dayEvents.length - 3}</EventChip>
                        )}
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
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', background: '#BBA188', borderRadius: '14px 14px 0 0', overflow: 'hidden' }}>
            <div style={{ padding: '12px 0' }} />
            {weekDays.map((d, i) => (
              <div key={i} style={{ padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {DAYS[i]}
                </div>
                <div style={{
                  fontSize: '1.1rem', fontWeight: 700,
                  color: d.toDateString() === today.toDateString() ? '#fff' : 'rgba(255,255,255,0.9)',
                  background: d.toDateString() === today.toDateString() ? 'rgba(255,255,255,0.25)' : 'transparent',
                  borderRadius: 8, padding: '2px 0', marginTop: 2,
                }}>
                  {d.getDate()}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: '0 0 14px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            {HOURS.map((hour, hi) => (
              <SlotRow key={hi}>
                <TimeLabel>{hour}</TimeLabel>
                {weekDays.map((d, di) => {
                  const slotEvents = events.filter((e) =>
                    e.year     === d.getFullYear() &&
                    e.month    === d.getMonth() &&
                    e.monthDay === d.getDate() &&
                    e.hour     === hi + 8
                  );
                  return (
                    <TimeSlot key={di}>
                      {slotEvents.map((ev) => (
                        <EventBlock key={ev.id} $color={ev.color}>
                          <strong>{ev.name}</strong>
                          <span>{ev.procedure}</span>
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelClick}
        closeOnOverlayClick={false}
        title="Novo Agendamento"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={handleCancelClick}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveClick}>Salvar Agendamento</Button>
          </>
        }
      >
        <FormGrid>
          <Input
            label="Nome do Paciente *"
            placeholder="Digite o nome..."
            value={form.nome}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
              handleChange('nome', val);
            }}
            maxLength={80}
            error={errors.nome}
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
            label="Data *"
            type="date"
            value={form.data}
            onChange={(e) => handleDataChange(e.target.value)}
            error={errors.data}
          />
          <Input
            label="Horário *"
            type="time"
            value={form.horario}
            onChange={(e) => handleChange('horario', e.target.value)}
            error={errors.horario}
          />
          <div style={{ gridColumn: 'span 2' }}>
            <Select
              label="Procedimento *"
              placeholder="Selecione..."
              options={procedureOptions}
              value={form.procedimento}
              onChange={(v) => handleChange('procedimento', v)}
              error={errors.procedimento}
            />
          </div>
          <Select
            label="Status *"
            placeholder="Selecione..."
            options={statusOptions}
            value={form.status}
            onChange={(v) => handleChange('status', v)}
            error={errors.status}
          />
          <Input
            label="Valor (R$) *"
            mask="moeda"
            value={form.valor}
            inputMode="numeric"
            maxLength={14}
            onValueChange={(v) => handleMaskedChange('valor', v)}
            error={errors.valor}
          />
          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Observações"
              placeholder="Informações adicionais..."
              maxLength={300}
              value={form.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
            />
          </div>
        </FormGrid>
      </Modal>

      <CancelModal
        isOpen={showCancelModal}
        title="Deseja cancelar?"
        message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas."
        onConfirm={forceClose}
        onCancel={() => setShowCancelModal(false)}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Salvar agendamento?"
        message={`Tem certeza que deseja agendar ${form.nome || 'este paciente'}?`}
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />

      <SucessModal
        isOpen={showSuccessModal}
        title="Sucesso!"
        message={successMessage}
        onClose={handleSuccessClose}
        buttonText="Continuar"
      />
    </Container>
  );
}