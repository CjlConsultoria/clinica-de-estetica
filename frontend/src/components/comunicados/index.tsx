'use client';

import { useState, useEffect } from 'react';
import { useRoleRedirect } from '@/components/ui/hooks/useRoleRedirect';
import { listarComunicadosAdmin, criarComunicado, ComunicadoAPI } from '@/services/comunicadoService';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';

import {
  Container, Header, Title, Subtitle,
  StatsRow, StatBox, StatBoxValue, StatBoxLabel,
  TabRow, TabBtn,
  Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem,
  FormGrid,
  ComunicadoCard, ComunicadoHeader, ComunicadoTitle, ComunicadoMeta,
  ComunicadoBody, ComunicadoFooter,
  BadgeTipo, BadgeStatus,
  EmpresaChipList, EmpresaChip,
  CheckboxRow, CheckboxBox, CheckboxLabel,
  EmptyState,
  PreviewBox, PreviewTitle, PreviewBody,
} from './styles';

type Tipo      = 'manutencao' | 'novidade' | 'alerta' | 'cobranca';
type StatusCom = 'enviado' | 'agendado' | 'rascunho';
type ComunicadoField = 'titulo' | 'mensagem' | 'empresas';

interface Comunicado {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: Tipo;
  status: StatusCom;
  destinatarios: 'todas' | string[];
  dataEnvio: string;
  lidas: number;
  total: number;
}

interface ComunicadoForm {
  titulo: string;
  mensagem: string;
  tipo: Tipo;
  destinatario: 'todas' | 'selecionar';
  empresasSelecionadas: string[];
  agendar: boolean;
  dataAgendamento: string;
}

const COMUNICADO_VALIDATION = [
  {
    key:      'titulo' as ComunicadoField,
    validate: (v: string) => !v.trim() ? 'Título é obrigatório' : null,
  },
  {
    key:      'mensagem' as ComunicadoField,
    validate: (v: string) => !v.trim() ? 'Mensagem é obrigatória' : null,
  },
];

const EMPRESAS = [
  { id: 'e1', nome: 'Clínica Bella Vita'    },
  { id: 'e2', nome: 'Studio Ana Rodrigues'  },
  { id: 'e3', nome: 'Clínica Derma Saúde'   },
  { id: 'e4', nome: 'Instituto Skin Care'   },
  { id: 'e5', nome: 'Espaço Beleza Premium' },
];


const TipoIcon = ({ tipo }: { tipo: Tipo }) => {
  if (tipo === 'manutencao') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
  if (tipo === 'novidade') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
  if (tipo === 'alerta') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
};

const tipoConfig: Record<Tipo, { label: string }> = {
  manutencao: { label: 'Manutenção' },
  novidade:   { label: 'Novidade'   },
  alerta:     { label: 'Alerta'     },
  cobranca:   { label: 'Cobrança'   },
};

const statusConfig: Record<StatusCom, { label: string; bg: string; color: string }> = {
  enviado:  { label: 'Enviado',  bg: 'rgba(138,117,96,0.12)', color: '#8a7560' },
  agendado: { label: 'Agendado', bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  rascunho: { label: 'Rascunho', bg: 'rgba(200,200,200,0.2)', color: '#999'    },
};

const tipoOptions = [
  { value: 'novidade',   label: 'Novidade'   },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'alerta',     label: 'Alerta'     },
  { value: 'cobranca',   label: 'Cobrança'   },
];

const destinatarioOptions = [
  { value: 'todas',      label: 'Todas as empresas'    },
  { value: 'selecionar', label: 'Selecionar empresas'  },
];

const FORM_INITIAL: ComunicadoForm = {
  titulo:               '',
  mensagem:             '',
  tipo:                 'novidade',
  destinatario:         'todas',
  empresasSelecionadas: [],
  agendar:              false,
  dataAgendamento:      '',
};

function isFormDirty(form: ComunicadoForm): boolean {
  return form.titulo.trim() !== '' || form.mensagem.trim() !== '';
}

function nomeEmpresaById(id: string) {
  return EMPRESAS.find(e => e.id === id)?.nome ?? id;
}

export default function Comunicados() {
  const allowed = useRoleRedirect({ superAdminOnly: true });

  const [comunicados,  setComunicados]  = useState<Comunicado[]>([]);
  const [search,       setSearch]       = useState('');
  const [filterTipo,   setFilterTipo]   = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [isNovoOpen,      setIsNovoOpen]      = useState(false);
  const [form,            setForm]            = useState<ComunicadoForm>(FORM_INITIAL);
  const [showCancelNovo,  setShowCancelNovo]  = useState(false);
  const [showConfirmNovo, setShowConfirmNovo] = useState(false);
  const [empresaError,    setEmpresaError]    = useState('');

  const {
    errors:     comunicadoErrors,
    validate:   validateComunicado,
    clearError: clearComunicadoError,
    clearAll:   clearComunicadoAll,
  } = useSequentialValidation<ComunicadoField>(COMUNICADO_VALIDATION);

  const [sucessModal, setSucessModal] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    listarComunicadosAdmin().then((data: ComunicadoAPI[]) => {
      const mapped: Comunicado[] = data.map(c => ({
        id:            c.id,
        titulo:        c.titulo,
        mensagem:      c.conteudo,
        tipo:          (['manutencao', 'novidade', 'alerta', 'cobranca'].includes((c.tipo || '').toLowerCase())
                          ? (c.tipo || '').toLowerCase()
                          : 'novidade') as Tipo,
        status:        (['enviado', 'agendado', 'rascunho'].includes((c.status || '').toLowerCase())
                          ? (c.status || '').toLowerCase()
                          : 'enviado') as StatusCom,
        destinatarios: (() => {
          const d = c.destinatariosJson;
          if (!d || d === 'todas') return 'todas' as const;
          try { const arr = JSON.parse(d); return Array.isArray(arr) ? arr as string[] : 'todas' as const; }
          catch { return 'todas' as const; }
        })(),
        dataEnvio:     c.criadoEm ? new Date(c.criadoEm).toLocaleDateString('pt-BR') : '—',
        lidas:         0,
        total:         0,
      }));
      if (mapped.length > 0) setComunicados(mapped);
    }).catch(() => {});
  
  }, []);

  if (!allowed) return null;

  const filtered = comunicados.filter(c => {
    const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase());
    const matchTipo   = filterTipo === 'Todos'   || tipoConfig[c.tipo]?.label === filterTipo;
    const matchStatus = filterStatus === 'Todos' || statusConfig[c.status]?.label === filterStatus;
    return matchSearch && matchTipo && matchStatus;
  });

  const totalEnviados  = comunicados.filter(c => c.status === 'enviado').length;
  const totalAgendados = comunicados.filter(c => c.status === 'agendado').length;
  const enviados       = comunicados.filter(c => c.status === 'enviado');
  const taxaLeitura    = enviados.length > 0
    ? Math.round(enviados.reduce((a, c) => a + (c.lidas / c.total) * 100, 0) / enviados.length)
    : 0;

  function toggle(name: string) {
    setOpenDropdown(p => p === name ? null : name);
  }

  function handleFormChange(field: keyof ComunicadoForm, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'titulo')               clearComunicadoError('titulo');
    if (field === 'mensagem')             clearComunicadoError('mensagem');
    if (field === 'empresasSelecionadas') setEmpresaError('');
  }

  function toggleEmpresa(id: string) {
    setForm(prev => ({
      ...prev,
      empresasSelecionadas: prev.empresasSelecionadas.includes(id)
        ? prev.empresasSelecionadas.filter(e => e !== id)
        : [...prev.empresasSelecionadas, id],
    }));
    setEmpresaError('');
  }

  function handleCancelNovoClick() {
    if (isFormDirty(form)) setShowCancelNovo(true);
    else forceCloseNovo();
  }

  function forceCloseNovo() {
    setForm(FORM_INITIAL);
    clearComunicadoAll();
    setEmpresaError('');
    setIsNovoOpen(false);
    setShowCancelNovo(false);
    setShowConfirmNovo(false);
  }

  function handleSaveNovoClick() {
    const ok = validateComunicado({
      titulo:   form.titulo,
      mensagem: form.mensagem,
      empresas: '',
    });

    if (form.destinatario === 'selecionar' && form.empresasSelecionadas.length === 0) {
      setEmpresaError('Selecione ao menos uma empresa');
      if (!ok) return;
      return;
    }

    if (!ok) return;
    setShowConfirmNovo(true);
  }

  async function handleConfirmNovo() {
    const totalDest = form.destinatario === 'todas' ? EMPRESAS.length : form.empresasSelecionadas.length;
    const novo: Comunicado = {
      id:            Date.now(),
      titulo:        form.titulo,
      mensagem:      form.mensagem,
      tipo:          form.tipo,
      status:        form.agendar ? 'agendado' : 'enviado',
      destinatarios: form.destinatario === 'todas' ? 'todas' : form.empresasSelecionadas,
      dataEnvio:     form.agendar
        ? form.dataAgendamento
        : new Date().toLocaleDateString('pt-BR'),
      lidas: 0,
      total: totalDest,
    };
    try {
      const criado = await criarComunicado({
        titulo:   form.titulo,
        conteudo: form.mensagem,
        tipo:     form.tipo,
      });
      novo.id = criado.id;
    } catch {}
    setComunicados(prev => [novo, ...prev]);
    setSucessModal({
      title:   form.agendar ? 'Comunicado agendado!' : 'Comunicado enviado!',
      message: form.agendar
        ? `O comunicado "${form.titulo}" foi agendado para ${form.dataAgendamento}.`
        : `O comunicado "${form.titulo}" foi enviado para ${novo.total} empresa${novo.total !== 1 ? 's' : ''}.`,
    });
    setShowConfirmNovo(false);
    setIsNovoOpen(false);
    setForm(FORM_INITIAL);
    clearComunicadoAll();
    setEmpresaError('');
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>Comunicados</Title>
          <Subtitle>Envie avisos e notificações para todas ou algumas empresas</Subtitle>
        </div>
        <Button
          type="button"
          variant="primary"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          }
          onClick={() => setIsNovoOpen(true)}
        >
          Novo Comunicado
        </Button>
      </Header>

      <StatsRow>
        <StatBox>
          <StatBoxValue>{comunicados.length}</StatBoxValue>
          <StatBoxLabel>Total</StatBoxLabel>
        </StatBox>
        <StatBox>
          <StatBoxValue>{totalEnviados}</StatBoxValue>
          <StatBoxLabel>Enviados</StatBoxLabel>
        </StatBox>
        <StatBox>
          <StatBoxValue>{totalAgendados}</StatBoxValue>
          <StatBoxLabel>Agendados</StatBoxLabel>
        </StatBox>
        <StatBox $highlight>
          <StatBoxValue>{taxaLeitura}%</StatBoxValue>
          <StatBoxLabel>Taxa de leitura</StatBoxLabel>
        </StatBox>
      </StatsRow>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </SearchIconWrap>
          <SearchInputStyled
            placeholder="Buscar comunicado..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => toggle('tipo')}>
              {filterTipo}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </DropdownBtn>
            {openDropdown === 'tipo' && (
              <DropdownList>
                {['Todos', 'Manutenção', 'Novidade', 'Alerta', 'Cobrança'].map(t => (
                  <DropdownItem key={t} $active={filterTipo === t} onClick={() => { setFilterTipo(t); toggle('tipo'); }}>
                    {t}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          <DropdownWrapper>
            <DropdownBtn onClick={() => toggle('status')}>
              {filterStatus}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </DropdownBtn>
            {openDropdown === 'status' && (
              <DropdownList>
                {['Todos', 'Enviado', 'Agendado', 'Rascunho'].map(s => (
                  <DropdownItem key={s} $active={filterStatus === s} onClick={() => { setFilterStatus(s); toggle('status'); }}>
                    {s}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
        </FilterRow>
      </Controls>

      {filtered.length === 0 ? (
        <EmptyState>Nenhum comunicado encontrado.</EmptyState>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(c => (
            <ComunicadoCard key={c.id}>
              <ComunicadoHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    border: '1.5px solid #e8e0d8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#8a7560',
                  }}>
                    <TipoIcon tipo={c.tipo} />
                  </div>
                  <ComunicadoTitle>{c.titulo}</ComunicadoTitle>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <BadgeTipo $bg="rgba(138,117,96,0.08)" $color="#8a7560">
                    {tipoConfig[c.tipo].label}
                  </BadgeTipo>
                  <BadgeStatus $bg={statusConfig[c.status].bg} $color={statusConfig[c.status].color}>
                    {statusConfig[c.status].label}
                  </BadgeStatus>
                </div>
              </ComunicadoHeader>

              <ComunicadoMeta>
                {c.destinatarios === 'todas'
                  ? 'Para: Todas as empresas'
                  : `Para: ${(c.destinatarios as string[]).map(nomeEmpresaById).join(', ')}`}
                {' · '}
                {c.status === 'enviado'
                  ? `Enviado em ${c.dataEnvio}`
                  : c.status === 'agendado'
                  ? `Agendado para ${c.dataEnvio}`
                  : 'Rascunho'}
              </ComunicadoMeta>

              <ComunicadoBody>{c.mensagem}</ComunicadoBody>

              {c.status === 'enviado' && (
                <ComunicadoFooter>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      Lidas: <strong style={{ color: '#BBA188' }}>{c.lidas}</strong> / {c.total}
                    </div>
                    <div style={{ width: 80, height: 5, background: '#f0ebe4', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${c.total > 0 ? (c.lidas / c.total) * 100 : 0}%`,
                        background: '#BBA188',
                        borderRadius: 99,
                      }} />
                    </div>
                  </div>
                </ComunicadoFooter>
              )}
            </ComunicadoCard>
          ))}
        </div>
      )}

      <Modal
        isOpen={isNovoOpen}
        onClose={handleCancelNovoClick}
        closeOnOverlayClick={false}
        title="Novo Comunicado"
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Button type="button" variant="outline" onClick={handleCancelNovoClick}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveNovoClick}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              }
            >
              {form.agendar ? 'Agendar Comunicado' : 'Enviar Agora'}
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', maxHeight: '65vh', paddingRight: 4 }}>

          <div>
            <div style={{
              fontSize: '0.78rem', fontWeight: 600, color: '#BBA188',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12,
            }}>
              Conteúdo
            </div>

            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Título *"
                  placeholder="Ex: Manutenção programada — 15/03/2025"
                  value={form.titulo}
                  onChange={e => handleFormChange('titulo', e.target.value)}
                  error={comunicadoErrors.titulo}
                />
              </div>

              <Select
                label="Tipo"
                options={tipoOptions}
                value={form.tipo}
                onChange={v => handleFormChange('tipo', v as Tipo)}
              />

              <Select
                label="Destinatários"
                options={destinatarioOptions}
                value={form.destinatario}
                onChange={v => handleFormChange('destinatario', v as 'todas' | 'selecionar')}
              />

              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Mensagem *"
                  placeholder="Escreva aqui o conteúdo do comunicado..."
                  value={form.mensagem}
                  onChange={e => handleFormChange('mensagem', e.target.value)}
                  error={comunicadoErrors.mensagem}
                />
              </div>
            </FormGrid>
          </div>

          {form.destinatario === 'selecionar' && (
            <div>
              <div style={{
                fontSize: '0.78rem', fontWeight: 600, color: '#BBA188',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12,
              }}>
                Selecione as empresas *
              </div>

              <EmpresaChipList>
                {EMPRESAS.map(e => (
                  <EmpresaChip
                    key={e.id}
                    $selected={form.empresasSelecionadas.includes(e.id)}
                    onClick={() => toggleEmpresa(e.id)}
                  >
                    {e.nome}
                  </EmpresaChip>
                ))}
              </EmpresaChipList>

              {empresaError && (
                <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#e74c3c', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {empresaError}
                </div>
              )}
            </div>
          )}

          <div>
            <div style={{
              fontSize: '0.78rem', fontWeight: 600, color: '#BBA188',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12,
            }}>
              Agendamento
            </div>

            <CheckboxRow onClick={() => handleFormChange('agendar', !form.agendar)}>
              <CheckboxBox $checked={form.agendar}>
                {form.agendar && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </CheckboxBox>
              <CheckboxLabel>Agendar envio para data específica</CheckboxLabel>
            </CheckboxRow>

            {form.agendar && (
              <div style={{ marginTop: 14, paddingLeft: 28, maxWidth: 240 }}>
                <Input
                  label="Data de envio"
                  type="date"
                  value={form.dataAgendamento}
                  onChange={e => handleFormChange('dataAgendamento', e.target.value)}
                />
              </div>
            )}
          </div>

          {form.titulo.trim() && form.mensagem.trim() && (
            <div>
              <div style={{
                fontSize: '0.78rem', fontWeight: 600, color: '#BBA188',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12,
              }}>
                Pré-visualização
              </div>
              <PreviewBox $tipo={form.tipo}>
                <PreviewTitle>{form.titulo}</PreviewTitle>
                <PreviewBody>{form.mensagem}</PreviewBody>
              </PreviewBox>
            </div>
          )}

        </div>
      </Modal>

      <CancelModal
        isOpen={showCancelNovo}
        title="Deseja cancelar?"
        message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas."
        onConfirm={forceCloseNovo}
        onCancel={() => setShowCancelNovo(false)}
      />

      <ConfirmModal
        isOpen={showConfirmNovo}
        title={form.agendar ? 'Agendar comunicado?' : 'Enviar comunicado?'}
        message={
          form.agendar
            ? `O comunicado "${form.titulo}" será agendado para ${form.dataAgendamento} e enviado para ${form.destinatario === 'todas' ? 'todas as empresas' : form.empresasSelecionadas.length + ' empresa(s)'}.`
            : `O comunicado "${form.titulo}" será enviado imediatamente para ${form.destinatario === 'todas' ? 'todas as empresas' : form.empresasSelecionadas.length + ' empresa(s)'}. Esta ação não pode ser desfeita.`
        }
        confirmText={form.agendar ? 'Agendar' : 'Enviar'}
        cancelText="Cancelar"
        onConfirm={handleConfirmNovo}
        onCancel={() => setShowConfirmNovo(false)}
      />

      <SucessModal
        isOpen={!!sucessModal}
        title={sucessModal?.title ?? ''}
        message={sucessModal?.message ?? ''}
        onClose={() => setSucessModal(null)}
      />
    </Container>
  );
}