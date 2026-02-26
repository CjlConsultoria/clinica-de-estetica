'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import ErrorModal from '@/components/modals/errorModal';
import { getApiErrorMessage } from '@/utils/apiError';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import AccessDenied from '@/components/ui/AccessDenied';
import {
  listarAssinaturas, listarTermos, assinarTermo,
  AssinaturaResponse, TermoResponse,
} from '@/services/consentimentoApi';
import { listarPacientes, PacienteResponse } from '@/services/pacientesApi';
import {
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  FormGrid, SignatureBox, SignatureCanvas, SignatureLabel,
  TermoViewer, TermoTitle, TermoBody, TermoSection, TermoText,
  AlertBanner, AlertBannerIcon, AlertBannerText,
} from './styles';

// ─── Local types ──────────────────────────────────────────────────────────────

interface TermoItem {
  id:           number;
  paciente:     string;   // pacienteNome
  procedimento: string;   // termoTitulo
  versao:       string;   // termoVersao
  dataCriacao:  string;   // formatted criadoEm
  dataValidade: string;   // '—' (no backend field)
  status:       string;   // always 'assinado' from API
  assinadoEm:   string;   // formatted dataAssinatura
  ip:           string;   // ipOrigem
  profissional: string;   // '—' (no backend field)
  hash:         string;   // hashAssinatura
}

function mapAssinatura(a: AssinaturaResponse): TermoItem {
  const dt = new Date(a.dataAssinatura);
  const dataBR = dt.toLocaleDateString('pt-BR');
  const horaBR = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return {
    id:           a.id,
    paciente:     a.pacienteNome,
    procedimento: a.termoTitulo,
    versao:       a.termoVersao,
    dataCriacao:  new Date(a.criadoEm).toLocaleDateString('pt-BR'),
    dataValidade: '—',
    status:       'assinado',
    assinadoEm:   `${dataBR} ${horaBR}`,
    ip:           a.ipOrigem ?? '—',
    profissional: '—',
    hash:         a.hashAssinatura,
  };
}

// ─── Form types ───────────────────────────────────────────────────────────────

type TermoField = 'pacienteId' | 'termoId' | 'cpf' | 'nascimento' | 'dataProcedimento' | 'profissional' | 'email';

interface TermoForm {
  pacienteId:       string;
  termoId:          string;
  cpf:              string;
  nascimento:       string;
  dataProcedimento: string;
  profissional:     string;
  email:            string;
}

const FORM_INITIAL: TermoForm = {
  pacienteId: '', termoId: '', cpf: '', nascimento: '',
  dataProcedimento: '', profissional: '', email: '',
};

const VALIDATION_FIELDS = [
  { key: 'pacienteId' as TermoField, validate: (v: string) => !v ? 'Selecione o paciente'     : null },
  { key: 'termoId'    as TermoField, validate: (v: string) => !v ? 'Selecione o procedimento' : null },
];

const filterStatus = ['Todos', 'Assinado'];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  assinado: { label: 'Assinado', color: '#8a7560', bg: '#f0ebe4' },
  pendente: { label: 'Pendente', color: '#856404', bg: '#fff3cd' },
  expirado: { label: 'Expirado', color: '#7f8c8d', bg: '#f0f0f0' },
};

const ITEMS_PER_PAGE   = 10;
const TABLE_MIN_HEIGHT = 540;

function isFormDirty(form: TermoForm): boolean {
  return (
    form.pacienteId !== '' || form.termoId !== '' || form.cpf.trim() !== '' ||
    form.nascimento !== '' || form.dataProcedimento !== '' ||
    form.profissional.trim() !== '' || form.email.trim() !== ''
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Consentimento() {
  const { can, isSuperAdmin } = usePermissions();

  const [assinaturas,   setAssinaturas]   = useState<TermoItem[]>([]);
  const [termos,        setTermos]        = useState<TermoResponse[]>([]);
  const [pacientes,     setPacientes]     = useState<PacienteResponse[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [filterStat,    setFilterStat]    = useState('Todos');
  const [openDropStat,  setOpenDropStat]  = useState(false);
  const [isNovoOpen,    setIsNovoOpen]    = useState(false);
  const [isViewOpen,    setIsViewOpen]    = useState(false);
  const [isSignOpen,    setIsSignOpen]    = useState(false);
  const [selectedTermo, setSelectedTermo] = useState<TermoItem | null>(null);
  const [signed,        setSigned]        = useState(false);
  const [exporting,     setExporting]     = useState(false);
  const [form,          setForm]          = useState<TermoForm>(FORM_INITIAL);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg,         setErrorMsg]         = useState('');
  const [isErrorOpen,      setIsErrorOpen]      = useState(false);

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<TermoField>(VALIDATION_FIELDS);

  useEffect(() => {
    listarAssinaturas()
      .then(list => setAssinaturas(list.map(mapAssinatura)))
      .catch(err => showError(err, 'carregar assinaturas'))
      .finally(() => setLoading(false));
    listarTermos(true)
      .then(setTermos)
      .catch(err => showError(err, 'carregar termos'));
    listarPacientes(undefined, 0, 500)
      .then(r => setPacientes(r.content))
      .catch(err => showError(err, 'carregar pacientes'));
  }, []);

  if (!isSuperAdmin && !can('consentimento.read')) return <AccessDenied />;

  const canCreate = isSuperAdmin || can('consentimento.create');

  const filtered = assinaturas.filter(t => {
    const matchSearch = t.paciente.toLowerCase().includes(search.toLowerCase()) || t.procedimento.toLowerCase().includes(search.toLowerCase());
    const matchStat   = filterStat === 'Todos' || t.status === filterStat.toLowerCase();
    return matchSearch && matchStat;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const paginatedData = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const totalTermos: number = assinaturas.length;
  const assinados:   number = assinaturas.length;
  const pendentes:   number = 0;
  const expirados:   number = 0;

  function showError(err: unknown, context: string) {
    setErrorMsg(getApiErrorMessage(err, context));
    setIsErrorOpen(true);
  }

  function handleSearchChange(value: string) { setSearch(value); setCurrentPage(1); }
  function handleFilterStatChange(value: string) { setFilterStat(value); setCurrentPage(1); setOpenDropStat(false); }
  function handleChange(field: TermoField, value: string) { setForm(prev => ({ ...prev, [field]: value })); clearError(field); }
  function handleCancelClick() { isFormDirty(form) ? setShowCancelModal(true) : forceClose(); }
  function forceClose() { setForm(FORM_INITIAL); clearAll(); setIsNovoOpen(false); setShowCancelModal(false); setShowConfirmModal(false); }
  function handleSaveNovoClick() {
    const isValid = validate({ pacienteId: form.pacienteId, termoId: form.termoId, cpf: form.cpf, nascimento: form.nascimento, dataProcedimento: form.dataProcedimento, profissional: form.profissional, email: form.email });
    if (!isValid) return;
    setShowConfirmModal(true);
  }
  async function handleConfirmSave() {
    setShowConfirmModal(false);
    const payload = {
      pacienteId: Number(form.pacienteId),
      termoId:    Number(form.termoId),
    };
    try {
      const result = await assinarTermo(payload);
      setAssinaturas(prev => [mapAssinatura(result), ...prev]);
      setIsNovoOpen(false); setForm(FORM_INITIAL); clearAll(); setShowSuccessModal(true);
    } catch (err) { showError(err, 'gerar termo de consentimento'); }
  }

  const handleBaixarPDF = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedTermo) return;
    setExporting(true);
    let objectUrl: string | null = null;
    try {
      const response = await fetch('/api/relatorios/consentimento', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ termo: selectedTermo }) });
      if (!response.ok) throw new Error('Erro ao gerar PDF');
      const blob = await response.blob();
      objectUrl  = URL.createObjectURL(blob);
      const name = selectedTermo.paciente.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      const link = document.createElement('a');
      link.href = objectUrl; link.download = `consentimento-${name}.pdf`; link.style.display = 'none';
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } catch (err) { showError(err, 'gerar PDF do consentimento'); }
    finally { setExporting(false); if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl!), 1000); }
  };

  const selectedPaciente = pacientes.find(p => String(p.id) === form.pacienteId);

  return (
    <Container>
      <Header>
        <Title>Consentimento Digital</Title>
        {canCreate && (
          <Button variant="primary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>} onClick={() => setIsNovoOpen(true)}>
            Novo Termo
          </Button>
        )}
      </Header>

      {pendentes > 0 && (
        <AlertBanner>
          <AlertBannerIcon><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></AlertBannerIcon>
          <AlertBannerText><strong>{pendentes} {pendentes === 1 ? 'termo' : 'termos'}</strong> aguardando assinatura digital do paciente.</AlertBannerText>
        </AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Total de Assinaturas" value={totalTermos} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>} />
        <StatCard label="Assinados"            value={assinados}   color="#8a7560" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Termos Ativos"        value={termos.filter(t => t.ativo).length} color="#a8906f" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} />
        <StatCard label="Expirados"            value={expirados}   color="#95a5a6" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>} />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por paciente ou procedimento..." value={search} onChange={e => handleSearchChange(e.target.value)} />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDropStat(!openDropStat)}><span>{filterStat}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropStat && (<DropdownList>{filterStatus.map(s => (<DropdownItem key={s} $active={filterStat === s} onClick={() => handleFilterStatChange(s)}>{s}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          {filterStat !== 'Todos' && (<ClearFilterBtn onClick={() => { setFilterStat('Todos'); setCurrentPage(1); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <Table>
            <Thead>
              <tr>
                <Th $width="20%">Paciente</Th><Th $width="18%">Procedimento</Th><Th $width="12%">Criado em</Th><Th $width="14%">Assinado em</Th><Th $width="18%">Hash</Th><Th $width="8%">Versão</Th><Th $width="5%">Status</Th><Th $width="5%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Carregando...</Td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhuma assinatura encontrada.</Td></tr>
              ) : paginatedData.map(termo => (
                <Tr key={termo.id}>
                  <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{termo.paciente}</Td>
                  <Td><Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{termo.procedimento}</Badge></Td>
                  <Td style={{ color: '#777' }}>{termo.dataCriacao}</Td>
                  <Td style={{ color: '#555' }}>{termo.assinadoEm}</Td>
                  <Td><code style={{ fontSize: '0.65rem', color: '#999', background: '#f5f5f5', padding: '2px 5px', borderRadius: 4 }}>{termo.hash ? termo.hash.slice(0, 16) + '…' : '—'}</code></Td>
                  <Td><code style={{ fontSize: '0.71rem', color: '#999', background: '#f5f5f5', padding: '2px 5px', borderRadius: 4 }}>{termo.versao}</code></Td>
                  <Td><Badge $bg={statusConfig[termo.status]?.bg} $color={statusConfig[termo.status]?.color}>{statusConfig[termo.status]?.label}</Badge></Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="Ver termo" onClick={() => { setSelectedTermo(termo); setIsViewOpen(true); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </IconBtn>
                      {canCreate && termo.status === 'pendente' && (
                        <IconBtn title="Coletar assinatura" onClick={() => { setSelectedTermo(termo); setSigned(false); setIsSignOpen(true); }} style={{ borderColor: '#d4a84b', color: '#d4a84b' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </IconBtn>
                      )}
                    </ActionGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>

      {/* ── Novo Termo modal ───────────────────────────────────────────────── */}
      <Modal isOpen={isNovoOpen} onClose={handleCancelClick} closeOnOverlayClick={false} title="Novo Termo de Consentimento" size="lg" footer={<><Button variant="outline" onClick={handleCancelClick}>Cancelar</Button><Button variant="primary" onClick={handleSaveNovoClick}>Gerar Termo</Button></>}>
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Select
              label="Paciente *"
              options={pacientes.map(p => ({ value: String(p.id), label: p.nome }))}
              placeholder={pacientes.length === 0 ? 'Carregando pacientes...' : 'Selecione o paciente...'}
              value={form.pacienteId}
              onChange={v => handleChange('pacienteId', v)}
              error={errors.pacienteId}
            />
          </div>
          <Input label="CPF" placeholder="000.000.000-00" value={form.cpf} onChange={e => handleChange('cpf', e.target.value)} />
          <Input label="Data de Nascimento" type="date" value={form.nascimento} onChange={e => handleChange('nascimento', e.target.value)} />
          <div style={{ gridColumn: 'span 2' }}>
            <Select
              label="Procedimento *"
              options={termos.map(t => ({ value: String(t.id), label: `${t.titulo} (${t.versao})` }))}
              placeholder={termos.length === 0 ? 'Carregando procedimentos...' : 'Selecione o procedimento...'}
              value={form.termoId}
              onChange={v => handleChange('termoId', v)}
              error={errors.termoId}
            />
          </div>
          <Input label="Data do Procedimento" type="date" value={form.dataProcedimento} onChange={e => handleChange('dataProcedimento', e.target.value)} />
          <Input label="Profissional Responsável" placeholder="Nome do profissional" value={form.profissional} onChange={e => handleChange('profissional', e.target.value)} />
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="E-mail" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => handleChange('email', e.target.value)} />
          </div>
        </FormGrid>
      </Modal>

      {/* ── View modal ─────────────────────────────────────────────────────── */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Termo de Consentimento" size="lg"
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <Button variant="outline" onClick={handleBaixarPDF} disabled={exporting} icon={exporting ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}>{exporting ? 'Gerando PDF...' : 'Baixar PDF'}</Button>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Fechar</Button>
          </div>
        }
      >
        {selectedTermo && (
          <TermoViewer>
            <TermoTitle>TERMO DE CONSENTIMENTO INFORMADO</TermoTitle>
            <TermoText style={{ textAlign: 'center', color: '#999', fontSize: '0.82rem', marginBottom: 24 }}>Versão {selectedTermo.versao} · Gerado em {selectedTermo.dataCriacao}</TermoText>
            <TermoSection>
              <h4>Dados do Paciente</h4>
              <p><strong>Nome:</strong> {selectedTermo.paciente}</p>
              <p><strong>Procedimento:</strong> {selectedTermo.procedimento}</p>
              <p><strong>Profissional Responsável:</strong> {selectedTermo.profissional}</p>
            </TermoSection>
            <TermoSection>
              <h4>Descrição do Procedimento</h4>
              <TermoBody>Eu, paciente acima identificado(a), declaro que fui devidamente informado(a) sobre o procedimento de <strong>{selectedTermo.procedimento}</strong>, seus objetivos, riscos, alternativas e possíveis complicações.</TermoBody>
            </TermoSection>
            <TermoSection>
              <h4>Consentimento e Assinatura</h4>
              {selectedTermo.status === 'assinado' ? (
                <div style={{ background: '#f0ebe4', borderRadius: 10, padding: 16, border: '1.5px solid #BBA188' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a7560" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span style={{ fontWeight: 700, color: '#8a7560', fontSize: '0.9rem' }}>Assinado Digitalmente</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#666' }}>
                    <p style={{ margin: '4px 0' }}><strong>Data/Hora:</strong> {selectedTermo.assinadoEm}</p>
                    <p style={{ margin: '4px 0' }}><strong>IP:</strong> {selectedTermo.ip}</p>
                    <p style={{ margin: '4px 0' }}><strong>Hash:</strong> <code style={{ fontSize: '0.72rem' }}>{selectedTermo.hash}</code></p>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fff3cd', borderRadius: 10, padding: 16, border: '1.5px solid #ffc107', color: '#856404', fontSize: '0.88rem' }}>⏳ Aguardando assinatura digital do paciente.</div>
              )}
            </TermoSection>
          </TermoViewer>
        )}
      </Modal>

      {/* ── Sign modal ─────────────────────────────────────────────────────── */}
      <Modal isOpen={isSignOpen} onClose={() => setIsSignOpen(false)} title={`Assinatura Digital — ${selectedTermo?.paciente}`} size="md" footer={<><Button variant="outline" onClick={() => setIsSignOpen(false)}>Cancelar</Button><Button variant="primary" onClick={() => setSigned(true)} disabled={signed}>{signed ? '✓ Assinatura Coletada' : 'Confirmar Assinatura'}</Button></>}>
        <div style={{ marginBottom: 20, fontSize: '0.88rem', color: '#666', lineHeight: 1.6 }}>O paciente <strong style={{ color: '#1a1a1a' }}>{selectedTermo?.paciente}</strong> deve assinar abaixo para confirmar o procedimento de <strong style={{ color: '#BBA188' }}>{selectedTermo?.procedimento}</strong>.</div>
        <SignatureBox>
          <SignatureLabel>Assine abaixo:</SignatureLabel>
          <SignatureCanvas>
            {signed
              ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#8a7560' }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span style={{ fontWeight: 700 }}>Assinatura registrada</span></div>
              : <div style={{ color: '#ccc', fontSize: '0.82rem' }}>Área de assinatura digital</div>
            }
          </SignatureCanvas>
        </SignatureBox>
        <div style={{ marginTop: 16, padding: 12, background: '#fdf9f5', borderRadius: 10, border: '1px solid #f0ebe4', fontSize: '0.78rem', color: '#888' }}>
          <strong>Registro automático:</strong> IP, data, hora e dispositivo serão salvos para fins legais (LGPD).
        </div>
      </Modal>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <CancelModal isOpen={showCancelModal} title="Deseja cancelar?" message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas." onConfirm={forceClose} onCancel={() => setShowCancelModal(false)} />
      <ConfirmModal isOpen={showConfirmModal} title="Gerar termo?" message={`Tem certeza que deseja gerar o termo de consentimento para ${selectedPaciente?.nome ?? 'este paciente'}?`} confirmText="Confirmar" cancelText="Voltar" onConfirm={handleConfirmSave} onCancel={() => setShowConfirmModal(false)} />
      <SucessModal isOpen={showSuccessModal} title="Sucesso!" message="Termo de consentimento gerado com sucesso!" onClose={() => setShowSuccessModal(false)} buttonText="Continuar" />

      <ErrorModal
        isOpen={isErrorOpen}
        message={errorMsg}
        onClose={() => setIsErrorOpen(false)}
      />
    </Container>
  );
}
