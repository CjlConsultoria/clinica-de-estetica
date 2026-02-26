'use client';

import { useRef, useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import ErrorModal from '@/components/modals/errorModal';
import { getApiErrorMessage } from '@/utils/apiError';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { listarFotosPorPaciente, uploadFoto, fetchFotoBlob, FotoPacienteResponse } from '@/services/fotosApi';
import { listarPacientes, PacienteResponse } from '@/services/pacientesApi';
import {
  Container, Header, Title, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  PatientsGrid, PatientFotoCard, PatientCardHeader, PatientAvatar, PatientName, PatientSub,
  PatientCardBody, PatientCardFooter, FotoGrid, FotoItem, FotoImg, FotoLabel, FotoDate, FotoEmpty,
  CompareSection, CompareGrid, CompareSide, CompareSideLabel, CompareImg,
  UploadZone, UploadIcon, UploadText, UploadHint, UploadPreview,
  FormGrid, SectionLabel, WizardNav, Badge, SavedBanner,
  PaginationWrapper, PaginationInfo, PaginationControls, PageButton, PageEllipsis, PaginationArrow,
} from './styles';

type UploadField = 'pacienteId' | 'dataFoto' | 'procedimento' | 'momento';

interface Foto {
  id: number;
  tipo: string;        // 'antes' | 'depois' | 'retorno'
  procedimento: string;
  data: string;
  imgUrl?: string;     // blob URL or undefined (lazy-loaded)
}

interface PatientData {
  id: number;
  name: string;
  initials: string;
  color: string;
  lastProcedure: string;
  fotos: Foto[];
}

interface UploadForm {
  pacienteId: string;
  dataFoto: string;
  procedimento: string;
  momento: string;
  observacoes: string;
}

interface CompareForm {
  pacienteId: string;
  procedimento: string;
  dataAntes: string;
  dataDepois: string;
  observacoes: string;
}

const UPLOAD_INITIAL: UploadForm = {
  pacienteId: '', dataFoto: '', procedimento: '', momento: '', observacoes: '',
};

const COMPARE_INITIAL: CompareForm = {
  pacienteId: '', procedimento: '', dataAntes: '', dataDepois: '', observacoes: '',
};

const UPLOAD_VALIDATION = [
  { key: 'pacienteId'   as UploadField, validate: (v: string) => !v ? 'Selecione o paciente' : null },
  { key: 'dataFoto'     as UploadField, validate: (v: string) => !v ? 'Data da foto é obrigatória' : null },
  { key: 'procedimento' as UploadField, validate: (v: string) => !v ? 'Selecione o procedimento' : null },
  { key: 'momento'      as UploadField, validate: (v: string) => !v ? 'Selecione o momento' : null },
];

const procedureOptions = [
  { value: 'botox',            label: 'Botox Facial'        },
  { value: 'preenchimento',    label: 'Preenchimento Labial' },
  { value: 'bioestimulador',   label: 'Bioestimulador'       },
  { value: 'fio-pdo',          label: 'Fio de PDO'           },
  { value: 'microagulhamento', label: 'Microagulhamento'     },
  { value: 'peeling',          label: 'Peelings Químicos'    },
];

const momentoOptions = [
  { value: 'antes',   label: 'Antes do Procedimento'  },
  { value: 'depois',  label: 'Depois do Procedimento' },
  { value: 'retorno', label: 'Retorno / Follow-up'    },
];

const filterProcedures = ['Todos', 'Botox', 'Preenchimento', 'Bioestimulador', 'Fio PDO', 'Microagulhamento'];

const AVATAR_COLORS = ['#BBA188', '#a8906f', '#1b1b1b', '#8a7560', '#EBD5B0', '#c9a882', '#917255'];

const tipoColors: Record<string, { bg: string; color: string; label: string }> = {
  antes:   { bg: '#fff3cd',                color: '#856404', label: 'Antes'   },
  depois:  { bg: '#f0ebe4',                color: '#8a7560', label: 'Depois'  },
  retorno: { bg: 'rgba(187,161,136,0.15)', color: '#BBA188', label: 'Retorno' },
};

const momentoToTipo: Record<string, 'ANTES' | 'DEPOIS' | 'EVOLUCAO'> = {
  antes: 'ANTES', depois: 'DEPOIS', retorno: 'EVOLUCAO',
};

const tipoToMomento: Record<string, string> = {
  ANTES: 'antes', DEPOIS: 'depois', EVOLUCAO: 'retorno',
};

function mapFotoResponse(f: FotoPacienteResponse): Foto {
  const dt = new Date(f.criadoEm);
  const data = `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
  return {
    id: f.id,
    tipo: tipoToMomento[f.tipoFoto] ?? 'retorno',
    procedimento: f.descricao ?? '—',
    data,
  };
}

function mapPaciente(p: PacienteResponse, idx: number): PatientData {
  const words = p.nome.trim().split(' ');
  const initials = ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase();
  return {
    id: p.id,
    name: p.nome,
    initials,
    color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
    lastProcedure: '—',
    fotos: [],
  };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatDateDisplay(raw: string): string {
  if (!raw || !raw.includes('-')) return raw;
  const [y, m, d] = raw.split('-');
  return `${d}/${m}/${y}`;
}

// Lazy-loads a single foto image from the backend
function FotoImageItem({ foto, patientColor }: { foto: Foto; patientColor: string }) {
  const [src, setSrc] = useState<string | undefined>(foto.imgUrl);

  useEffect(() => {
    if (src) return; // already have it
    let active = true;
    fetchFotoBlob(foto.id)
      .then(url => { if (active) setSrc(url); })
      .catch(() => {}); // show placeholder on error
    return () => { active = false; };
  }, [foto.id]);

  return (
    <FotoItem key={foto.id}>
      <div style={{ width: '100%', paddingBottom: '100%', background: src ? 'transparent' : `linear-gradient(135deg, ${patientColor}22, ${patientColor}44)`, borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
        {src
          ? <FotoImg src={src} alt={foto.tipo} />
          : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: patientColor, opacity: 0.5 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          )
        }
        <Badge $bg={tipoColors[foto.tipo]?.bg} $color={tipoColors[foto.tipo]?.color} style={{ position: 'absolute', top: 4, left: 4 }}>
          {tipoColors[foto.tipo]?.label}
        </Badge>
      </div>
      <FotoLabel>{foto.procedimento}</FotoLabel>
      <FotoDate>{foto.data}</FotoDate>
    </FotoItem>
  );
}

const CARDS_PER_PAGE = 6;

function getVisiblePages(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | '...')[] = [];
  const half = 2;
  let start = Math.max(2, currentPage - half);
  let end   = Math.min(totalPages - 1, currentPage + half);
  if (currentPage <= half + 1) end   = Math.min(totalPages - 1, 4);
  if (currentPage >= totalPages - half) start = Math.max(2, totalPages - 3);
  pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);
  return pages;
}

function isUploadFormDirty(form: UploadForm): boolean {
  return (
    form.pacienteId !== '' || form.dataFoto !== '' || form.procedimento !== '' ||
    form.momento !== '' || form.observacoes.trim() !== ''
  );
}

export default function Fotos() {
  const [patients,     setPatients]     = useState<PatientData[]>([]);
  const [loading,      setLoading]      = useState(true);

  const [search,        setSearch]        = useState('');
  const [filterProc,    setFilterProc]    = useState('Todos');
  const [openDropProc,  setOpenDropProc]  = useState(false);
  const [isUploadOpen,  setIsUploadOpen]  = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [currentPage,   setCurrentPage]   = useState(1);

  const [uploadForm,    setUploadForm]    = useState<UploadForm>(UPLOAD_INITIAL);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile,    setUploadFile]    = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [compareForm,   setCompareForm]   = useState<CompareForm>(COMPARE_INITIAL);
  const [compareAntes,  setCompareAntes]  = useState<string | null>(null);
  const [compareDepois, setCompareDepois] = useState<string | null>(null);
  const compareAntesRef  = useRef<HTMLInputElement>(null);
  const compareDepoisRef = useRef<HTMLInputElement>(null);

  const [showCancelUploadModal,  setShowCancelUploadModal]  = useState(false);
  const [showConfirmUploadModal, setShowConfirmUploadModal] = useState(false);
  const [showSuccessModal,       setShowSuccessModal]       = useState(false);
  const [showConfirmCompareModal,setShowConfirmCompareModal]= useState(false);
  const [showSuccessCompareModal,setShowSuccessCompareModal]= useState(false);
  const [errorMsg,               setErrorMsg]               = useState('');
  const [isErrorOpen,            setIsErrorOpen]            = useState(false);

  const {
    errors: uploadErrors,
    validate: validateUpload,
    clearError: clearUploadError,
    clearAll: clearUploadAll,
  } = useSequentialValidation<UploadField>(UPLOAD_VALIDATION);

  useEffect(() => {
    listarPacientes(undefined, 0, 100)
      .then(async r => {
        const mapped = r.content.map(mapPaciente);
        setPatients(mapped);
        setLoading(false);
        // Load fotos for all patients in parallel (best effort)
        const fotoResults = await Promise.allSettled(
          mapped.map(p => listarFotosPorPaciente(p.id))
        );
        setPatients(prev =>
          prev.map((p, i) => {
            const result = fotoResults[i];
            if (result.status === 'fulfilled') {
              const fotos = result.value.map(mapFotoResponse);
              const lastProcedure = fotos.length > 0 ? fotos[fotos.length - 1].procedimento : '—';
              return { ...p, fotos, lastProcedure };
            }
            return p;
          })
        );
      })
      .catch(err => {
        showError(err, 'carregar pacientes');
        setLoading(false);
      });
  }, []);

  const patientOptions = patients.map(p => ({ value: String(p.id), label: p.name }));

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages  = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage    = Math.min(currentPage, totalPages);
  const startIdx    = (safePage - 1) * CARDS_PER_PAGE;
  const paginated   = filtered.slice(startIdx, startIdx + CARDS_PER_PAGE);
  const startItem   = filtered.length === 0 ? 0 : startIdx + 1;
  const visiblePages = getVisiblePages(safePage, totalPages);

  function showError(err: unknown, context: string) {
    setErrorMsg(getApiErrorMessage(err, context));
    setIsErrorOpen(true);
  }

  function handleSearchChange(v: string) { setSearch(v); setCurrentPage(1); }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(await readFileAsDataURL(file));
  }

  function handleUploadChange(field: keyof UploadForm, value: string) {
    setUploadForm(prev => ({ ...prev, [field]: value }));
    clearUploadError(field as UploadField);
  }

  function handleUploadDateChange(raw: string) {
    if (!raw) { handleUploadChange('dataFoto', ''); return; }
    const [yearStr, month, day] = raw.split('-');
    handleUploadChange('dataFoto', `${(yearStr ?? '').slice(0, 4)}-${month ?? ''}-${day ?? ''}`);
  }

  function handleCancelUploadClick() {
    if (isUploadFormDirty(uploadForm) || uploadPreview) {
      setShowCancelUploadModal(true);
    } else {
      forceCloseUpload();
    }
  }

  function forceCloseUpload() {
    setUploadForm(UPLOAD_INITIAL); setUploadPreview(null); setUploadFile(null);
    if (uploadInputRef.current) uploadInputRef.current.value = '';
    clearUploadAll(); setIsUploadOpen(false);
    setShowCancelUploadModal(false); setShowConfirmUploadModal(false);
  }

  function handleSaveUploadClick() {
    const isValid = validateUpload({
      pacienteId:   uploadForm.pacienteId,
      dataFoto:     uploadForm.dataFoto,
      procedimento: uploadForm.procedimento,
      momento:      uploadForm.momento,
    });
    if (!isValid) return;
    setShowConfirmUploadModal(true);
  }

  async function handleConfirmUpload() {
    if (!uploadFile) {
      showError(new Error('Selecione uma imagem antes de salvar.'), 'salvar foto');
      setShowConfirmUploadModal(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('pacienteId', uploadForm.pacienteId);
      formData.append('tipoFoto', momentoToTipo[uploadForm.momento] ?? 'EVOLUCAO');
      formData.append('descricao', procedureOptions.find(o => o.value === uploadForm.procedimento)?.label ?? uploadForm.procedimento);
      formData.append('arquivo', uploadFile);

      const result = await uploadFoto(formData);
      const novaFoto: Foto = {
        ...mapFotoResponse(result),
        imgUrl: uploadPreview ?? undefined,
      };
      const patId = Number(uploadForm.pacienteId);
      setPatients(prev =>
        prev.map(p =>
          p.id === patId
            ? { ...p, fotos: [...p.fotos, novaFoto], lastProcedure: novaFoto.procedimento }
            : p
        )
      );
      setShowConfirmUploadModal(false);
      setIsUploadOpen(false);
      setUploadForm(UPLOAD_INITIAL); setUploadPreview(null); setUploadFile(null);
      if (uploadInputRef.current) uploadInputRef.current.value = '';
      clearUploadAll();
      setShowSuccessModal(true);
    } catch (err) {
      showError(err, 'salvar foto');
      setShowConfirmUploadModal(false);
    }
  }

  function openUpload(patient?: PatientData) {
    setUploadForm({ ...UPLOAD_INITIAL, pacienteId: patient ? String(patient.id) : '' });
    setUploadPreview(null); setUploadFile(null);
    clearUploadAll(); setIsUploadOpen(true);
  }

  function handleCompareChange(field: keyof CompareForm, value: string) {
    setCompareForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleCompareAntesSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompareAntes(await readFileAsDataURL(file));
  }

  async function handleCompareDepoisSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompareDepois(await readFileAsDataURL(file));
  }

  function handleSaveComparativoClick() {
    if (!compareForm.pacienteId) return;
    setShowConfirmCompareModal(true);
  }

  async function handleConfirmComparativo() {
    const patId = Number(compareForm.pacienteId);
    const procedimentoLabel =
      procedureOptions.find(o => o.value === compareForm.procedimento)?.label ?? 'Procedimento';

    const novasFotos: Foto[] = [];
    const now = new Date();
    const dataFormatada = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;

    if (compareAntes) {
      novasFotos.push({
        id: Date.now(), tipo: 'antes', procedimento: procedimentoLabel,
        data: formatDateDisplay(compareForm.dataAntes) || dataFormatada, imgUrl: compareAntes,
      });
    }
    if (compareDepois) {
      novasFotos.push({
        id: Date.now() + 1, tipo: 'depois', procedimento: procedimentoLabel,
        data: formatDateDisplay(compareForm.dataDepois) || dataFormatada, imgUrl: compareDepois,
      });
    }
    if (novasFotos.length === 0) return;

    setPatients(prev =>
      prev.map(p =>
        p.id === patId
          ? { ...p, fotos: [...p.fotos, ...novasFotos], lastProcedure: procedimentoLabel }
          : p
      )
    );

    setShowConfirmCompareModal(false); setIsCompareOpen(false);
    setCompareAntes(null); setCompareDepois(null); setCompareForm(COMPARE_INITIAL);
    if (compareAntesRef.current)  compareAntesRef.current.value  = '';
    if (compareDepoisRef.current) compareDepoisRef.current.value = '';
    setShowSuccessCompareModal(true);
  }

  function openCompare(patient?: PatientData) {
    setCompareForm({ ...COMPARE_INITIAL, pacienteId: patient ? String(patient.id) : '' });
    setCompareAntes(null); setCompareDepois(null); setIsCompareOpen(true);
  }

  function handleCloseCompare() {
    setIsCompareOpen(false);
    setCompareAntes(null); setCompareDepois(null); setCompareForm(COMPARE_INITIAL);
    if (compareAntesRef.current)  compareAntesRef.current.value  = '';
    if (compareDepoisRef.current) compareDepoisRef.current.value = '';
  }

  return (
    <Container>
      <Header>
        <Title>Histórico Fotográfico</Title>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="outline"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
            onClick={() => openCompare()}
          >
            Comparar Fotos
          </Button>
          <Button variant="primary"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
            onClick={() => openUpload()}
          >
            Adicionar Foto
          </Button>
        </div>
      </Header>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled placeholder="Buscar paciente..." value={search} onChange={e => handleSearchChange(e.target.value)} />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDropProc(!openDropProc)}>
              <span>{filterProc}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropProc && (
              <DropdownList>
                {filterProcedures.map(p => (
                  <DropdownItem key={p} $active={filterProc === p} onClick={() => { setFilterProc(p); setOpenDropProc(false); setCurrentPage(1); }}>{p}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          {filterProc !== 'Todos' && (
            <ClearFilterBtn onClick={() => { setFilterProc('Todos'); setCurrentPage(1); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 20px 0', flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#bbb', minHeight: 400 }}>
              Carregando pacientes...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#ccc', gap: 12, minHeight: 400 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span style={{ fontSize: '0.9rem' }}>Nenhum paciente encontrado</span>
            </div>
          ) : (
            <PatientsGrid>
              {paginated.map(patient => (
                <PatientFotoCard key={patient.id}>
                  <PatientCardHeader>
                    <PatientAvatar $color={patient.color}>{patient.initials}</PatientAvatar>
                    <div>
                      <PatientName>{patient.name}</PatientName>
                      <PatientSub>{patient.lastProcedure} · {patient.fotos.length} foto(s)</PatientSub>
                    </div>
                  </PatientCardHeader>

                  <PatientCardBody>
                    {patient.fotos.length === 0 ? (
                      <FotoEmpty>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>Nenhuma foto cadastrada</span>
                      </FotoEmpty>
                    ) : (
                      <FotoGrid>
                        {patient.fotos.map(foto => (
                          <FotoImageItem key={foto.id} foto={foto} patientColor={patient.color} />
                        ))}
                      </FotoGrid>
                    )}
                  </PatientCardBody>

                  <PatientCardFooter>
                    <Button variant="outline" size="sm" onClick={() => openCompare(patient)}>Comparar</Button>
                    <Button variant="ghost"   size="sm" onClick={() => openUpload(patient)}>+ Foto</Button>
                  </PatientCardFooter>
                </PatientFotoCard>
              ))}
            </PatientsGrid>
          )}
        </div>

        <PaginationWrapper>
          <PaginationInfo>
            {filtered.length === 0
              ? 'Nenhum registro'
              : `Mostrando ${startItem} de ${filtered.length} paciente(s)`
            }
          </PaginationInfo>
          <PaginationControls>
            <PaginationArrow onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage <= 1} aria-label="Página anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </PaginationArrow>
            {visiblePages.map((page, idx) =>
              page === '...' ? (
                <PageEllipsis key={`ellipsis-${idx}`}>…</PageEllipsis>
              ) : (
                <PageButton key={page} $active={page === safePage} onClick={() => setCurrentPage(page as number)} aria-label={`Página ${page}`} aria-current={page === safePage ? 'page' : undefined}>
                  {page}
                </PageButton>
              )
            )}
            <PaginationArrow onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} aria-label="Próxima página">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </PaginationArrow>
          </PaginationControls>
        </PaginationWrapper>
      </div>

      <Modal isOpen={isUploadOpen} onClose={handleCancelUploadClick} closeOnOverlayClick={false} title="Adicionar Foto" size="lg"
        footer={
          <WizardNav>
            <Button variant="outline" onClick={handleCancelUploadClick}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveUploadClick}>Salvar Foto</Button>
          </WizardNav>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', maxHeight: '65vh', paddingRight: 4 }}>
          <div>
            <SectionLabel style={{ marginBottom: 12 }}>Imagem</SectionLabel>
            <input ref={uploadInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleFileSelect} />
            <UploadZone onClick={() => uploadInputRef.current?.click()}>
              {uploadPreview
                ? <UploadPreview src={uploadPreview} alt="preview" />
                : (
                  <>
                    <UploadIcon><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></UploadIcon>
                    <UploadText>Clique para selecionar ou arraste a foto aqui</UploadText>
                    <UploadHint>JPG, PNG ou WEBP · Máx. 10MB</UploadHint>
                  </>
                )}
            </UploadZone>
            {uploadPreview && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button type="button"
                  onClick={e => { e.stopPropagation(); setUploadPreview(null); setUploadFile(null); if (uploadInputRef.current) uploadInputRef.current.value = ''; }}
                  style={{ fontSize: '0.78rem', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Remover imagem
                </button>
              </div>
            )}
          </div>

          <div>
            <SectionLabel style={{ marginBottom: 12 }}>Dados da Foto</SectionLabel>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Select label="Paciente *" options={patientOptions} placeholder="Selecione o paciente" value={uploadForm.pacienteId} onChange={v => handleUploadChange('pacienteId', v)} error={uploadErrors.pacienteId} />
              </div>
              <Input label="Data da Foto *" type="date" value={uploadForm.dataFoto} onChange={e => handleUploadDateChange(e.target.value)} error={uploadErrors.dataFoto} />
              <Select label="Procedimento *" options={procedureOptions} placeholder="Selecione o procedimento" value={uploadForm.procedimento} onChange={v => handleUploadChange('procedimento', v)} error={uploadErrors.procedimento} />
              <div style={{ gridColumn: 'span 2' }}>
                <Select label="Momento *" options={momentoOptions} placeholder="Selecione o momento" value={uploadForm.momento} onChange={v => handleUploadChange('momento', v)} error={uploadErrors.momento} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <Input label="Observações" placeholder="Digite observações sobre esta foto" maxLength={200} value={uploadForm.observacoes} onChange={e => handleUploadChange('observacoes', e.target.value)} />
              </div>
            </FormGrid>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isCompareOpen} onClose={handleCloseCompare} closeOnOverlayClick={false} title="Comparativo Antes / Depois" size="xl"
        footer={
          <WizardNav>
            <Button variant="outline" onClick={handleCloseCompare}>Fechar</Button>
            <Button variant="primary" onClick={handleSaveComparativoClick}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>}
            >
              Salvar Comparativo
            </Button>
          </WizardNav>
        }
      >
        <div style={{ overflowY: 'auto', maxHeight: '65vh', paddingRight: 4 }}>
          <CompareSection>
            <input ref={compareAntesRef}  type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleCompareAntesSelect}  />
            <input ref={compareDepoisRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleCompareDepoisSelect} />

            <div>
              <SectionLabel style={{ marginBottom: 12 }}>Seleção</SectionLabel>
              <FormGrid>
                <Select label="Paciente *" options={patientOptions} placeholder="Selecione o paciente" value={compareForm.pacienteId} onChange={v => handleCompareChange('pacienteId', v)} />
                <Select label="Procedimento" options={procedureOptions} placeholder="Selecione o procedimento" value={compareForm.procedimento} onChange={v => handleCompareChange('procedimento', v)} />
              </FormGrid>
            </div>

            <div style={{ marginTop: 24 }}>
              <SectionLabel style={{ marginBottom: 12 }}>Fotos — clique para selecionar</SectionLabel>
              <CompareGrid>
                <CompareSide>
                  <CompareSideLabel $tipo="antes">Antes</CompareSideLabel>
                  <CompareImg $color="#BBA188" $hasImage={!!compareAntes} onClick={() => compareAntesRef.current?.click()}>
                    {compareAntes
                      ? <img src={compareAntes} alt="antes" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                      : (<><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Clique para selecionar</span></>)
                    }
                  </CompareImg>
                  {compareAntes && (
                    <button type="button" onClick={() => { setCompareAntes(null); if (compareAntesRef.current) compareAntesRef.current.value = ''; }}
                      style={{ fontSize: '0.75rem', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textAlign: 'center' }}>
                      Remover
                    </button>
                  )}
                  <Input label="Data (Antes)" type="date" value={compareForm.dataAntes} onChange={e => handleCompareChange('dataAntes', e.target.value)} />
                </CompareSide>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#BBA188', fontWeight: 700 }}>↔</div>

                <CompareSide>
                  <CompareSideLabel $tipo="depois">Depois</CompareSideLabel>
                  <CompareImg $color="#a8906f" $hasImage={!!compareDepois} onClick={() => compareDepoisRef.current?.click()}>
                    {compareDepois
                      ? <img src={compareDepois} alt="depois" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                      : (<><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Clique para selecionar</span></>)
                    }
                  </CompareImg>
                  {compareDepois && (
                    <button type="button" onClick={() => { setCompareDepois(null); if (compareDepoisRef.current) compareDepoisRef.current.value = ''; }}
                      style={{ fontSize: '0.75rem', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textAlign: 'center' }}>
                      Remover
                    </button>
                  )}
                  <Input label="Data (Depois)" type="date" value={compareForm.dataDepois} onChange={e => handleCompareChange('dataDepois', e.target.value)} />
                </CompareSide>
              </CompareGrid>
            </div>

            <div style={{ marginTop: 24 }}>
              <SectionLabel style={{ marginBottom: 12 }}>Observações do Comparativo</SectionLabel>
              <Input label="" placeholder="Digite o resultado observado na comparação" value={compareForm.observacoes} onChange={e => handleCompareChange('observacoes', e.target.value)} />
            </div>
          </CompareSection>
        </div>
      </Modal>

      <CancelModal
        isOpen={showCancelUploadModal}
        title="Deseja cancelar?"
        message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas."
        onConfirm={forceCloseUpload}
        onCancel={() => setShowCancelUploadModal(false)}
      />

      <ConfirmModal
        isOpen={showConfirmUploadModal}
        title="Salvar foto?"
        message="Tem certeza que deseja salvar esta foto no histórico do paciente?"
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmUpload}
        onCancel={() => setShowConfirmUploadModal(false)}
      />

      <SucessModal
        isOpen={showSuccessModal}
        title="Sucesso!"
        message="Foto adicionada com sucesso!"
        onClose={() => setShowSuccessModal(false)}
        buttonText="Continuar"
      />

      <ConfirmModal
        isOpen={showConfirmCompareModal}
        title="Salvar comparativo?"
        message="Tem certeza que deseja salvar este comparativo no histórico do paciente?"
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmComparativo}
        onCancel={() => setShowConfirmCompareModal(false)}
      />

      <SucessModal
        isOpen={showSuccessCompareModal}
        title="Sucesso!"
        message="Comparativo salvo com sucesso!"
        onClose={() => setShowSuccessCompareModal(false)}
        buttonText="Continuar"
      />

      <ErrorModal
        isOpen={isErrorOpen}
        message={errorMsg}
        onClose={() => setIsErrorOpen(false)}
      />
    </Container>
  );
}
