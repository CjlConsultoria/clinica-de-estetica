'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import {
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  FormGrid, AlertBanner, AlertBannerIcon, AlertBannerText,
  CardsGrid, ReapCard, ReapCardHeader, ReapAvatar, ReapPatientName, ReapPatientSub,
  ReapCardBody, ReapRow, ReapLabel, ReapValue, ReapDaysTag, ReapCardFooter,
  ProgressBarOuter, ProgressBarInner,
} from './styles';
import { alertasService, type AlertaReaplicacao } from '@/services/alertas.service';

const procedureOptions = [
  { value: 'botox',           label: 'Botox Facial'         },
  { value: 'preenchimento',   label: 'Preenchimento Labial'  },
  { value: 'bioestimulador',  label: 'Bioestimulador'        },
  { value: 'fio-pdo',         label: 'Fio de PDO'            },
  { value: 'microagulhamento',label: 'Microagulhamento'      },
  { value: 'toxina',          label: 'Toxina Botulínica'     },
];

const filterStatus     = ['Todos', 'Urgente', 'Esta semana', 'Este mês', 'Programado'];
const filterProcedures = ['Todos', 'Botox', 'Preenchimento', 'Bioestimulador', 'Fio PDO', 'Microagulhamento'];
const avatarColors     = ['#BBA188', '#a8906f', '#1b1b1b', '#8a7560', '#EBD5B0'];

function diasRestantes(data: string): number {
  return Math.ceil((new Date(data).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function getUrgencia(dias: number): { label: string; color: string; bg: string } {
  if (dias < 0)   return { label: 'Atrasado',   color: '#c0392b', bg: '#fdecea' };
  if (dias <= 7)  return { label: 'Urgente',    color: '#c0392b', bg: '#fdecea' };
  if (dias <= 14) return { label: 'Esta semana',color: '#d68a00', bg: '#fff3cd' };
  if (dias <= 30) return { label: 'Este mês',   color: '#8a7560', bg: '#f0ebe4' };
  return                 { label: 'Programado', color: '#666',    bg: '#f5f5f5' };
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export default function Reaplicacoes() {
  const [alertas,      setAlertas]      = useState<AlertaReaplicacao[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filterStat,   setFilterStat]   = useState('Todos');
  const [filterProc,   setFilterProc]   = useState('Todos');
  const [openDropStat, setOpenDropStat] = useState(false);
  const [openDropProc, setOpenDropProc] = useState(false);
  const [view,         setView]         = useState<'tabela' | 'cards'>('cards');
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [selected,     setSelected]     = useState<AlertaReaplicacao | null>(null);

  const carregarAlertas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await alertasService.listar();
      setAlertas(data);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarAlertas(); }, [carregarAlertas]);

  const filtered = alertas.filter(r => {
    const matchSearch = r.pacienteNome?.toLowerCase().includes(search.toLowerCase()) ||
                        r.procedimento.toLowerCase().includes(search.toLowerCase());
    const dias       = diasRestantes(r.proximaReaplicacao);
    const matchStat  =
      filterStat === 'Todos'        ||
      (filterStat === 'Urgente'     && dias <= 7)              ||
      (filterStat === 'Esta semana' && dias > 7  && dias <= 14)||
      (filterStat === 'Este mês'    && dias > 14 && dias <= 30)||
      (filterStat === 'Programado'  && dias > 30);
    const matchProc  = filterProc === 'Todos' ||
                       r.procedimento.toLowerCase().includes(filterProc.toLowerCase());
    return matchSearch && matchStat && matchProc;
  });

  const urgentes   = alertas.filter(r => diasRestantes(r.proximaReaplicacao) <= 7).length;
  const estaSemana = alertas.filter(r => { const d = diasRestantes(r.proximaReaplicacao); return d > 7  && d <= 14; }).length;
  const esteMes    = alertas.filter(r => { const d = diasRestantes(r.proximaReaplicacao); return d > 14 && d <= 30; }).length;
  const programados= alertas.filter(r => diasRestantes(r.proximaReaplicacao) > 30).length;

  return (
    <Container>
      <Header>
        <Title>Alertas de Reaplicação</Title>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant={view === 'cards'  ? 'primary' : 'outline'} onClick={() => setView('cards')}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>}>Cards</Button>
          <Button variant={view === 'tabela' ? 'primary' : 'outline'} onClick={() => setView('tabela')}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>}>Tabela</Button>
        </div>
      </Header>

      {urgentes > 0 && (
        <AlertBanner>
          <AlertBannerIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </AlertBannerIcon>
          <AlertBannerText>
            <strong>{urgentes} {urgentes === 1 ? 'paciente' : 'pacientes'}</strong> com reaplicação vencida ou urgente — entre em contato para reagendar.
          </AlertBannerText>
        </AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Urgentes (≤ 7 dias)" value={urgentes} color="#e74c3c" trend={{ value: 'Contatar hoje!', positive: false }}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        />
        <StatCard label="Esta semana (8–14d)" value={estaSemana} color="#d4a84b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard label="Este mês (15–30d)" value={esteMes} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
        />
        <StatCard label="Programados" value={programados} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar paciente ou procedimento..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropStat(!openDropStat); setOpenDropProc(false); }}>
              <span>{filterStat}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropStat && (
              <DropdownList>
                {filterStatus.map(s => <DropdownItem key={s} $active={filterStat === s} onClick={() => { setFilterStat(s); setOpenDropStat(false); }}>{s}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropProc(!openDropProc); setOpenDropStat(false); }}>
              <span>{filterProc}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropProc && (
              <DropdownList>
                {filterProcedures.map(p => <DropdownItem key={p} $active={filterProc === p} onClick={() => { setFilterProc(p); setOpenDropProc(false); }}>{p}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          {(filterStat !== 'Todos' || filterProc !== 'Todos') && (
            <ClearFilterBtn onClick={() => { setFilterStat('Todos'); setFilterProc('Todos'); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#bbb' }}>Carregando alertas...</div>
      ) : view === 'cards' ? (
        <CardsGrid>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: '#bbb' }}>Nenhum alerta encontrado.</div>
          ) : filtered.map((r, i) => {
            const dias    = diasRestantes(r.proximaReaplicacao);
            const urg     = getUrgencia(dias);
            const progPct = Math.max(0, Math.min(100, 100 - (dias / r.intervaloDias) * 100));
            const name    = r.pacienteNome ?? `Paciente ${r.pacienteId}`;
            return (
              <ReapCard key={r.id} $urgente={dias <= 7}>
                <ReapCardHeader>
                  <ReapAvatar $color={avatarColors[i % avatarColors.length]}>{getInitials(name)}</ReapAvatar>
                  <div style={{ flex: 1 }}>
                    <ReapPatientName>{name}</ReapPatientName>
                    <ReapPatientSub>{r.procedimento}</ReapPatientSub>
                  </div>
                  <ReapDaysTag $color={urg.color} $bg={urg.bg}>
                    {dias < 0 ? `${Math.abs(dias)}d atrasado` : `${dias}d`}
                  </ReapDaysTag>
                </ReapCardHeader>
                <ReapCardBody>
                  <ProgressBarOuter>
                    <ProgressBarInner $pct={progPct} $color={urg.color} />
                  </ProgressBarOuter>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#bbb', marginTop: 4, marginBottom: 12 }}>
                    <span>Última: {r.ultimaAplicacao ? new Date(r.ultimaAplicacao).toLocaleDateString('pt-BR') : '—'}</span>
                    <span>Próxima: {new Date(r.proximaReaplicacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {r.profissionalNome && <ReapRow><ReapLabel>Profissional</ReapLabel><ReapValue>{r.profissionalNome}</ReapValue></ReapRow>}
                  <ReapRow><ReapLabel>Intervalo</ReapLabel><ReapValue>{r.intervaloDias} dias</ReapValue></ReapRow>
                  <ReapRow>
                    <ReapLabel>Status</ReapLabel>
                    <ReapValue><Badge $bg={urg.bg} $color={urg.color}>{urg.label}</Badge></ReapValue>
                  </ReapRow>
                </ReapCardBody>
                <ReapCardFooter>
                  <Button variant="outline" size="sm" onClick={() => { setSelected(r); setIsModalOpen(true); }}>Agendar</Button>
                  {r.pacienteTelefone && (
                    <a href={`tel:${r.pacienteTelefone}`} style={{ textDecoration: 'none' }}>
                      <Button variant="ghost" size="sm" icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.79 19.79 19.79 0 0 1 1.69 1.11a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}>Ligar</Button>
                    </a>
                  )}
                </ReapCardFooter>
              </ReapCard>
            );
          })}
        </CardsGrid>
      ) : (
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 596 }}>
          <TableWrapper style={{ flex: 1 }}>
            <Table>
              <Thead>
                <tr>
                  <Th $width="20%">Paciente</Th>
                  <Th $width="18%">Procedimento</Th>
                  <Th $width="13%">Última Sessão</Th>
                  <Th $width="13%">Próxima Data</Th>
                  <Th $width="9%">Dias Rest.</Th>
                  <Th $width="13%">Profissional</Th>
                  <Th $width="9%">Status</Th>
                  <Th $width="5%">Ações</Th>
                </tr>
              </Thead>
              <Tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: '#bbb' }}>Nenhum alerta encontrado.</td></tr>
                ) : filtered.map(r => {
                  const dias = diasRestantes(r.proximaReaplicacao);
                  const urg  = getUrgencia(dias);
                  return (
                    <Tr key={r.id}>
                      <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{r.pacienteNome ?? `Paciente ${r.pacienteId}`}</Td>
                      <Td><Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{r.procedimento}</Badge></Td>
                      <Td style={{ color: '#888', fontSize: '0.82rem' }}>{r.ultimaAplicacao ? new Date(r.ultimaAplicacao).toLocaleDateString('pt-BR') : '—'}</Td>
                      <Td style={{ fontWeight: 600, color: dias <= 7 ? '#c0392b' : '#1a1a1a' }}>{new Date(r.proximaReaplicacao).toLocaleDateString('pt-BR')}</Td>
                      <Td><span style={{ fontWeight: 700, color: urg.color }}>{dias < 0 ? `${Math.abs(dias)}d atrás` : `${dias}d`}</span></Td>
                      <Td style={{ fontSize: '0.85rem' }}>{r.profissionalNome ?? '—'}</Td>
                      <Td><Badge $bg={urg.bg} $color={urg.color}>{urg.label}</Badge></Td>
                      <Td>
                        <ActionGroup>
                          <IconBtn title="Agendar reaplicação" onClick={() => { setSelected(r); setIsModalOpen(true); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>
                          </IconBtn>
                        </ActionGroup>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableWrapper>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Agendar Reaplicação — ${selected?.pacienteNome ?? ''}`}
        size="md"
        footer={<><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button variant="primary">Confirmar</Button></>}
      >
        <FormGrid>
          <div style={{ gridColumn: 'span 2', padding: '12px 16px', background: '#fdf9f5', borderRadius: 10, border: '1px solid #f0ebe4', fontSize: '0.88rem', color: '#666' }}>
            <strong style={{ color: '#1a1a1a' }}>{selected?.pacienteNome}</strong> — {selected?.procedimento}<br />
            Intervalo: <strong>{selected?.intervaloDias} dias</strong>
          </div>
          <Input label="Data da Reaplicação" type="date" />
          <Input label="Horário" type="time" />
          <Select label="Procedimento" options={procedureOptions} placeholder={selected?.procedimento || 'Selecione...'} />
          <Input label="Profissional" defaultValue={selected?.profissionalNome ?? ''} />
          <div style={{ gridColumn: 'span 2' }}><Input label="Observações" placeholder="Informações adicionais..." /></div>
        </FormGrid>
      </Modal>
    </Container>
  );
}
