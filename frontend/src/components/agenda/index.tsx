'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import {
  Container, Header, Title, ActionsRow,
  CalendarNav, CalendarTitle, CalendarGrid, DayHeader,
  DayCell, DayNumber, EventChip, EventsWrap,
  WeekView, TimeSlot, TimeLabel, SlotRow, EventBlock,
  ToggleGroup, ToggleBtn, Legend, LegendItem, LegendDot, FormGrid,
} from './styles';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS = Array.from({ length: 11 }, (_, i) => `${i + 8}:00`);

const procedureOptions = [
  { value: 'botox', label: 'Botox Facial' },
  { value: 'preenchimento', label: 'Preenchimento Labial' },
  { value: 'bioestimulador', label: 'Bioestimulador' },
  { value: 'fio-pdo', label: 'Fio de PDO' },
  { value: 'microagulhamento', label: 'Microagulhamento' },
  { value: 'toxina', label: 'Toxina Botulínica' },
];

const statusOptions = [
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'aguardando', label: 'Aguardando' },
  { value: 'cancelado', label: 'Cancelado' },
];

const mockEvents = [
  { id: 1, day: 1, hour: 8, name: 'Ana Beatriz', procedure: 'Botox', color: '#BBA188', duration: 1 },
  { id: 2, day: 1, hour: 10, name: 'Carla M.', procedure: 'Preenchimento', color: '#EBD5B0', duration: 1 },
  { id: 3, day: 2, hour: 9, name: 'Fernanda Lima', procedure: 'Bioestimulador', color: '#1b1b1b', duration: 2 },
  { id: 4, day: 3, hour: 14, name: 'Marina Souza', procedure: 'Fio PDO', color: '#a8906f', duration: 1 },
  { id: 5, day: 4, hour: 11, name: 'Juliana R.', procedure: 'Toxina', color: '#BBA188', duration: 1 },
  { id: 6, day: 5, hour: 15, name: 'Patrícia A.', procedure: 'Microagulhamento', color: '#8a7560', duration: 1 },
];

const calMonthEvents: Record<number, { name: string; color: string }[]> = {
  3: [{ name: 'Ana B.', color: '#BBA188' }, { name: 'Carla M.', color: '#EBD5B0' }],
  7: [{ name: 'Fernanda L.', color: '#1b1b1b' }],
  10: [{ name: 'Marina S.', color: '#a8906f' }, { name: 'Juliana R.', color: '#BBA188' }, { name: '+2', color: '#999' }],
  14: [{ name: 'Patrícia A.', color: '#8a7560' }],
  18: [{ name: 'Ana B.', color: '#BBA188' }],
  21: [{ name: 'Novo pac.', color: '#BBA188' }, { name: 'Carla M.', color: '#EBD5B0' }],
  25: [{ name: 'Fernanda L.', color: '#1b1b1b' }, { name: '+1', color: '#999' }],
};

export default function Agenda() {
  const [view, setView] = useState<'semana' | 'mes'>('semana');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate] = useState(new Date());

  const weekStart = new Date(currentDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calCells = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <Container>
      <Header>
        <Title>Agenda</Title>
        <ActionsRow>
          <ToggleGroup>
            <ToggleBtn $active={view === 'semana'} onClick={() => setView('semana')}>Semana</ToggleBtn>
            <ToggleBtn $active={view === 'mes'} onClick={() => setView('mes')}>Mês</ToggleBtn>
          </ToggleGroup>
          <Button
            variant="primary"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
            onClick={() => setIsModalOpen(true)}
          >
            Novo Agendamento
          </Button>
        </ActionsRow>
      </Header>

      <CalendarNav>
        <button className="nav-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <CalendarTitle>
          {view === 'semana'
            ? `${weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} – ${weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`
            : monthName.charAt(0).toUpperCase() + monthName.slice(1)}
        </CalendarTitle>
        <button className="nav-btn">
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
            {calCells.map((day, i) => (
              <DayCell key={i} $isToday={day === currentDate.getDate()} $isEmpty={!day}>
                {day && <>
                  <DayNumber $isToday={day === currentDate.getDate()}>{day}</DayNumber>
                  <EventsWrap>
                    {(calMonthEvents[day] || []).map((ev, j) => (
                      <EventChip key={j} $color={ev.color}>{ev.name}</EventChip>
                    ))}
                  </EventsWrap>
                </>}
              </DayCell>
            ))}
          </CalendarGrid>
        </div>
      ) : (
        <WeekView>
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', background: '#BBA188', borderRadius: '14px 14px 0 0', overflow: 'hidden' }}>
            <div style={{ padding: '12px 0' }} />
            {weekDays.map((d, i) => (
              <div key={i} style={{ padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{DAYS[i]}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: d.toDateString() === currentDate.toDateString() ? '#fff' : 'rgba(255,255,255,0.9)', background: d.toDateString() === currentDate.toDateString() ? 'rgba(255,255,255,0.25)' : 'transparent', borderRadius: 8, padding: '2px 0', marginTop: 2 }}>{d.getDate()}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: '0 0 14px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            {HOURS.map((hour, hi) => (
              <SlotRow key={hi}>
                <TimeLabel>{hour}</TimeLabel>
                {weekDays.map((_, di) => {
                  const ev = mockEvents.find(e => e.day === di && e.hour === hi + 8);
                  return (
                    <TimeSlot key={di}>
                      {ev && (
                        <EventBlock $color={ev.color}>
                          <strong>{ev.name}</strong>
                          <span>{ev.procedure}</span>
                        </EventBlock>
                      )}
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
        onClose={() => setIsModalOpen(false)}
        title="Novo Agendamento"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary">Salvar Agendamento</Button>
          </>
        }
      >
        <FormGrid>
          <Input label="Nome do Paciente" placeholder="Digite o nome..." />
          <Input label="Telefone" placeholder="(00) 00000-0000" />
          <Input label="Data" type="date" />
          <Input label="Horário" type="time" />
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Procedimento" options={procedureOptions} placeholder="Selecione..." />
          </div>
          <Select label="Status" options={statusOptions} placeholder="Selecione..." />
          <Input label="Valor (R$)" type="number" placeholder="0,00" />
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Observações" placeholder="Informações adicionais..." />
          </div>
        </FormGrid>
      </Modal>
    </Container>
  );
}