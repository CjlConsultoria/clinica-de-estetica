'use client';

import { useRef, useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
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
  tipo: string;
  procedimento: string;
  data: string;
  imgUrl?: string;
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

const INITIAL_PATIENTS: PatientData[] = [
  {
    id: 1, name: 'Ana Beatriz Costa', initials: 'AB', color: '#BBA188',
    lastProcedure: 'Botox Facial',
    fotos: [
      { id: 1,  tipo: 'antes',   procedimento: 'Botox Facial',    data: '10/01/2025' },
      { id: 2,  tipo: 'depois',  procedimento: 'Botox Facial',    data: '10/01/2025' },
      { id: 3,  tipo: 'retorno', procedimento: 'Botox Facial',    data: '24/01/2025' },
      { id: 4,  tipo: 'antes',   procedimento: 'Botox Facial',    data: '18/02/2025' },
      { id: 5,  tipo: 'depois',  procedimento: 'Botox Facial',    data: '18/02/2025' },
      { id: 6,  tipo: 'retorno', procedimento: 'Botox Facial',    data: '05/03/2025' },
      { id: 7,  tipo: 'antes',   procedimento: 'Bioestimulador',  data: '12/03/2025' },
      { id: 8,  tipo: 'depois',  procedimento: 'Bioestimulador',  data: '12/03/2025' },
      { id: 9,  tipo: 'retorno', procedimento: 'Bioestimulador',  data: '26/03/2025' },
    ],
  },
  {
    id: 2, name: 'Carla Mendonça', initials: 'CM', color: '#a8906f',
    lastProcedure: 'Preenchimento Labial',
    fotos: [
      { id: 1, tipo: 'antes',   procedimento: 'Preenchimento Labial', data: '15/01/2025' },
      { id: 2, tipo: 'depois',  procedimento: 'Preenchimento Labial', data: '15/01/2025' },
      { id: 3, tipo: 'retorno', procedimento: 'Preenchimento Labial', data: '01/02/2025' },
      { id: 4, tipo: 'antes',   procedimento: 'Botox Facial',         data: '10/02/2025' },
      { id: 5, tipo: 'depois',  procedimento: 'Botox Facial',         data: '10/02/2025' },
      { id: 6, tipo: 'retorno', procedimento: 'Botox Facial',         data: '24/02/2025' },
      { id: 7, tipo: 'antes',   procedimento: 'Bioestimulador',       data: '10/03/2025' },
      { id: 8, tipo: 'depois',  procedimento: 'Bioestimulador',       data: '10/03/2025' },
      { id: 9, tipo: 'retorno', procedimento: 'Bioestimulador',       data: '24/03/2025' },
    ],
  },
  {
    id: 3, name: 'Fernanda Lima', initials: 'FL', color: '#1b1b1b',
    lastProcedure: 'Bioestimulador',
    fotos: [
      { id: 1, tipo: 'antes',   procedimento: 'Bioestimulador',  data: '05/01/2025' },
      { id: 2, tipo: 'depois',  procedimento: 'Bioestimulador',  data: '05/01/2025' },
      { id: 3, tipo: 'retorno', procedimento: 'Bioestimulador',  data: '20/01/2025' },
      { id: 4, tipo: 'antes',   procedimento: 'Peeling Químico', data: '05/02/2025' },
      { id: 5, tipo: 'depois',  procedimento: 'Peeling Químico', data: '05/02/2025' },
      { id: 6, tipo: 'retorno', procedimento: 'Peeling Químico', data: '19/02/2025' },
      { id: 7, tipo: 'antes',   procedimento: 'Fio de PDO',      data: '05/03/2025' },
      { id: 8, tipo: 'depois',  procedimento: 'Fio de PDO',      data: '05/03/2025' },
      { id: 9, tipo: 'retorno', procedimento: 'Fio de PDO',      data: '19/03/2025' },
    ],
  },
  {
    id: 4, name: 'Marina Souza', initials: 'MS', color: '#BBA188',
    lastProcedure: 'Fio PDO',
    fotos: [
      { id: 1, tipo: 'antes',   procedimento: 'Fio de PDO',   data: '08/01/2025' },
      { id: 2, tipo: 'depois',  procedimento: 'Fio de PDO',   data: '08/01/2025' },
      { id: 3, tipo: 'retorno', procedimento: 'Fio de PDO',   data: '22/01/2025' },
      { id: 4, tipo: 'antes',   procedimento: 'Botox Facial', data: '05/02/2025' },
      { id: 5, tipo: 'depois',  procedimento: 'Botox Facial', data: '05/02/2025' },
      { id: 6, tipo: 'retorno', procedimento: 'Botox Facial', data: '19/02/2025' },
      { id: 7, tipo: 'antes',   procedimento: 'Fio de PDO',   data: '05/03/2025' },
      { id: 8, tipo: 'depois',  procedimento: 'Fio de PDO',   data: '05/03/2025' },
      { id: 9, tipo: 'retorno', procedimento: 'Fio de PDO',   data: '19/03/2025' },
    ],
  },
  {
    id: 5, name: 'Juliana Rocha', initials: 'JR', color: '#8a7560',
    lastProcedure: 'Botox Facial',
    fotos: [
      { id: 1, tipo: 'antes',   procedimento: 'Botox Facial', data: '02/01/2025' },
      { id: 2, tipo: 'depois',  procedimento: 'Botox Facial', data: '02/01/2025' },
      { id: 3, tipo: 'retorno', procedimento: 'Botox Facial', data: '16/01/2025' },
      { id: 4, tipo: 'antes',   procedimento: 'Fio de PDO',   data: '05/02/2025' },
      { id: 5, tipo: 'depois',  procedimento: 'Fio de PDO',   data: '05/02/2025' },
      { id: 6, tipo: 'retorno', procedimento: 'Fio de PDO',   data: '19/02/2025' },
      { id: 7, tipo: 'antes',   procedimento: 'Botox Facial', data: '05/03/2025' },
      { id: 8, tipo: 'depois',  procedimento: 'Botox Facial', data: '05/03/2025' },
      { id: 9, tipo: 'retorno', procedimento: 'Botox Facial', data: '19/03/2025' },
    ],
  },
  {
    id: 6, name: 'Patrícia Alves', initials: 'PA', color: '#c9a882',
    lastProcedure: 'Microagulhamento',
    fotos: [
      { id: 1, tipo: 'antes',   procedimento: 'Microagulhamento', data: '20/11/2024' },
      { id: 2, tipo: 'depois',  procedimento: 'Microagulhamento', data: '20/11/2024' },
      { id: 3, tipo: 'retorno', procedimento: 'Microagulhamento', data: '04/12/2024' },
      { id: 4, tipo: 'antes',   procedimento: 'Microagulhamento', data: '20/12/2024' },
      { id: 5, tipo: 'depois',  procedimento: 'Microagulhamento', data: '20/12/2024' },
      { id: 6, tipo: 'retorno', procedimento: 'Microagulhamento', data: '15/01/2025' },
      { id: 7, tipo: 'antes',   procedimento: 'Peeling Químico',  data: '05/02/2025' },
      { id: 8, tipo: 'depois',  procedimento: 'Peeling Químico',  data: '05/02/2025' },
      { id: 9, tipo: 'retorno', procedimento: 'Peeling Químico',  data: '19/02/2025' },
    ],
  },
  {
    id: 7, name: 'Roberta Gomes', initials: 'RG', color: '#917255',
    lastProcedure: 'Preenchimento Labial',
    fotos: [
      { id: 1, tipo: 'antes',   procedimento: 'Preenchimento Labial', data: '15/11/2024' },
      { id: 2, tipo: 'depois',  procedimento: 'Preenchimento Labial', data: '15/11/2024' },
      { id: 3, tipo: 'retorno', procedimento: 'Preenchimento Labial', data: '29/11/2024' },
      { id: 4, tipo: 'antes',   procedimento: 'Botox Facial',         data: '15/12/2024' },
      { id: 5, tipo: 'depois',  procedimento: 'Botox Facial',         data: '15/12/2024' },
      { id: 6, tipo: 'retorno', procedimento: 'Botox Facial',         data: '29/12/2024' },
      { id: 7, tipo: 'antes',   procedimento: 'Bioestimulador',       data: '15/01/2025' },
      { id: 8, tipo: 'depois',  procedimento: 'Bioestimulador',       data: '15/01/2025' },
      { id: 9, tipo: 'retorno', procedimento: 'Bioestimulador',       data: '29/01/2025' },
    ],
  },
];

import { listarFotosPorPaciente, FotoAPI, urlFoto } from '@/services/fotoService';
import { listarPacientes } from '@/services/pacienteService';

const tipoColors: Record<string, { bg: string; color: string; label: string }> = {
  antes:   { bg: '#fff3cd',                color: '#856404', label: 'Antes'   },
  depois:  { bg: '#f0ebe4',                color: '#8a7560', label: 'Depois'  },
  retorno: { bg: 'rgba(187,161,136,0.15)', color: '#BBA188', label: 'Retorno' },
};

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

let nextFotoId = 100;

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
    form.pacienteId !== '' ||
    form.dataFoto !== '' ||
    form.procedimento !== '' ||
    form.momento !== '' ||
    form.observacoes.trim() !== ''
  );
}

/* ── FotoThumb: renders the square thumbnail correctly ── */
function FotoThumb({ foto, color }: { foto: Foto; color: string }) {
  const tipo = tipoColors[foto.tipo] ?? { bg: '#f5f5f5', color: '#999', label: foto.tipo };
  return (
    <FotoItem>
      <div style={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        background: foto.imgUrl
          ? 'transparent'
          : `linear-gradient(135deg, ${color}22, ${color}44)`,
      }}>
        {foto.imgUrl ? (
          <img
            src={foto.imgUrl}
            alt={foto.tipo}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            opacity: 0.5,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        <Badge
          $bg={tipo.bg}
          $color={tipo.color}
          style={{ position: 'absolute', top: 4, left: 4, zIndex: 1 }}
        >
          {tipo.label}
        </Badge>
      </div>
      <FotoLabel>{foto.procedimento}</FotoLabel>
      <FotoDate>{foto.data}</FotoDate>
    </FotoItem>
  );
}

export default function Fotos() {
  const [patients, setPatients] = useState<PatientData[]>(INITIAL_PATIENTS);

  const [search,        setSearch]        = useState('');
  const [filterProc,    setFilterProc]    = useState('Todos');
  const [openDropProc,  setOpenDropProc]  = useState(false);
  const [isUploadOpen,  setIsUploadOpen]  = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [currentPage,   setCurrentPage]   = useState(1);

  const [uploadForm,    setUploadForm]    = useState<UploadForm>(UPLOAD_INITIAL);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [compareForm,   setCompareForm]   = useState<CompareForm>(COMPARE_INITIAL);
  const [compareAntes,  setCompareAntes]  = useState<string | null>(null);
  const [compareDepois, setCompareDepois] = useState<string | null>(null);
  const compareAntesRef  = useRef<HTMLInputElement>(null);
  const compareDepoisRef = useRef<HTMLInputElement>(null);

  const [showCancelUploadModal,   setShowCancelUploadModal]   = useState(false);
  const [showConfirmUploadModal,  setShowConfirmUploadModal]  = useState(false);
  const [showSuccessModal,        setShowSuccessModal]        = useState(false);
  const [showConfirmCompareModal, setShowConfirmCompareModal] = useState(false);
  const [showSuccessCompareModal, setShowSuccessCompareModal] = useState(false);

  const {
    errors: uploadErrors,
    validate: validateUpload,
    clearError: clearUploadError,
    clearAll: clearUploadAll,
  } = useSequentialValidation<UploadField>(UPLOAD_VALIDATION);

  useEffect(() => {
    const load = async () => {
      try {
        const pacientesRes = await listarPacientes('', 0, 100);
        const pacs = pacientesRes.content || [];
        const colors = ['#BBA188', '#a8906f', '#1b1b1b', '#8a7560', '#EBD5B0', '#c9a882', '#917255'];
        const fotosArr = await Promise.all(
          pacs.map(p => listarFotosPorPaciente(p.id).catch(() => [] as FotoAPI[]))
        );
        const mapped: PatientData[] = pacs.map((p, idx) => {
          const fotos: Foto[] = fotosArr[idx].map((f: FotoAPI) => ({
            id:           f.id,
            tipo:         f.tipoFoto?.toLowerCase() || 'antes',
            procedimento: f.descricao || '—',
            data:         f.dataRegistro ? new Date(f.dataRegistro).toLocaleDateString('pt-BR') : '—',
            imgUrl:       urlFoto(f.id),
          }));
          return {
            id:            p.id,
            name:          p.nome,
            initials:      p.nome.split(' ').slice(0,2).map((n: string) => n[0]).join('').toUpperCase(),
            color:         colors[idx % colors.length],
            lastProcedure: fotos[fotos.length - 1]?.procedimento || '—',
            fotos,
          };
        });
        setPatients(mapped);
      } catch {}
    };
    load();
  }, []);

  const patientOptions = patients.map(p => ({ value: String(p.id), label: p.name }));

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchProc   = filterProc === 'Todos' ||
      p.fotos.some(f => f.procedimento.toLowerCase().includes(filterProc.toLowerCase()));
    return matchSearch && matchProc;
  });

  const totalPages   = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage     = Math.min(currentPage, totalPages);
  const startIdx     = (safePage - 1) * CARDS_PER_PAGE;
  const paginated    = filtered.slice(startIdx, startIdx + CARDS_PER_PAGE);
  const startItem    = filtered.length === 0 ? 0 : startIdx + 1;
  const visiblePages = getVisiblePages(safePage, totalPages);

  function handleSearchChange(v: string) { setSearch(v); setCurrentPage(1); }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setUploadPreview(dataUrl);
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
    setUploadForm(UPLOAD_INITIAL);
    setUploadPreview(null);
    if (uploadInputRef.current) uploadInputRef.current.value = '';
    clearUploadAll();
    setIsUploadOpen(false);
    setShowCancelUploadModal(false);
    setShowConfirmUploadModal(false);
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

  function handleConfirmUpload() {
    const patient = patients.find(p => String(p.id) === uploadForm.pacienteId);
    if (!patient) return;

    const procedimentoLabel =
      procedureOptions.find(o => o.value === uploadForm.procedimento)?.label ?? uploadForm.procedimento;

    const novaFoto: Foto = {
      id:           nextFotoId++,
      tipo:         uploadForm.momento,
      procedimento: procedimentoLabel,
      data:         formatDateDisplay(uploadForm.dataFoto),
      imgUrl:       uploadPreview ?? undefined,
    };

    setPatients(prev =>
      prev.map(p =>
        p.id === patient.id
          ? { ...p, fotos: [...p.fotos, novaFoto], lastProcedure: procedimentoLabel }
          : p
      )
    );

    setShowConfirmUploadModal(false);
    setIsUploadOpen(false);
    setUploadForm(UPLOAD_INITIAL);
    setUploadPreview(null);
    if (uploadInputRef.current) uploadInputRef.current.value = '';
    clearUploadAll();
    setShowSuccessModal(true);
  }

  function openUpload(patient?: PatientData) {
    setUploadForm({ ...UPLOAD_INITIAL, pacienteId: patient ? String(patient.id) : '' });
    setUploadPreview(null);
    clearUploadAll();
    setIsUploadOpen(true);
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

  function handleConfirmComparativo() {
    const patient = patients.find(p => String(p.id) === compareForm.pacienteId);
    if (!patient) return;

    const procedimentoLabel =
      procedureOptions.find(o => o.value === compareForm.procedimento)?.label ?? 'Procedimento';

    const novasFotos: Foto[] = [];

    if (compareAntes) {
      novasFotos.push({
        id: nextFotoId++, tipo: 'antes', procedimento: procedimentoLabel,
        data: formatDateDisplay(compareForm.dataAntes) || '—', imgUrl: compareAntes,
      });
    }
    if (compareDepois) {
      novasFotos.push({
        id: nextFotoId++, tipo: 'depois', procedimento: procedimentoLabel,
        data: formatDateDisplay(compareForm.dataDepois) || '—', imgUrl: compareDepois,
      });
    }
    if (novasFotos.length === 0) return;

    setPatients(prev =>
      prev.map(p =>
        p.id === patient.id
          ? { ...p, fotos: [...p.fotos, ...novasFotos], lastProcedure: procedimentoLabel }
          : p
      )
    );

    setShowConfirmCompareModal(false);
    setIsCompareOpen(false);
    setCompareAntes(null);
    setCompareDepois(null);
    setCompareForm(COMPARE_INITIAL);
    if (compareAntesRef.current)  compareAntesRef.current.value  = '';
    if (compareDepoisRef.current) compareDepoisRef.current.value = '';
    setShowSuccessCompareModal(true);
  }

  function openCompare(patient?: PatientData) {
    setCompareForm({ ...COMPARE_INITIAL, pacienteId: patient ? String(patient.id) : '' });
    setCompareAntes(null);
    setCompareDepois(null);
    setIsCompareOpen(true);
  }

  function handleCloseCompare() {
    setIsCompareOpen(false);
    setCompareAntes(null);
    setCompareDepois(null);
    setCompareForm(COMPARE_INITIAL);
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
          {filtered.length === 0 ? (
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
                          <FotoThumb key={foto.id} foto={foto} color={patient.color} />
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
                <PageButton key={page} $active={page === safePage} onClick={() => setCurrentPage(page as number)}>
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

      {/* ── Modal Upload ── */}
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
                    <UploadIcon>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </UploadIcon>
                    <UploadText>Clique para selecionar ou arraste a foto aqui</UploadText>
                    <UploadHint>JPG, PNG ou WEBP · Máx. 10MB</UploadHint>
                  </>
                )
              }
            </UploadZone>
            {uploadPreview && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button type="button"
                  onClick={e => { e.stopPropagation(); setUploadPreview(null); if (uploadInputRef.current) uploadInputRef.current.value = ''; }}
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

      {/* ── Modal Comparar ── */}
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
                      : (
                        <>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          <span>Clique para selecionar</span>
                        </>
                      )
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
                      : (
                        <>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          <span>Clique para selecionar</span>
                        </>
                      )
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
    </Container>
  );
}