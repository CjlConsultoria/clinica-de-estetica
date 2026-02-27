'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import {
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  Avatar, PatientInfo, PatientName, PatientEmail, EmptyState,
  FormGrid, SectionLabel, WizardNav, PhoneText, DateText,
  DetailModal, DetailHeader, DetailAvatar, DetailName, DetailMeta, DetailMetaItem,
  DetailSection, DetailSectionTitle, StatsRow, StatPill,
  InfoGrid, InfoItem, InfoLabel, InfoValue, ObsBox,
  WizardSteps, WizardStep, WizardStepLine, WizardStepCircle, WizardStepLabel,
  StepSection,
} from './styles';

interface PacienteForm {
  nome: string;
  email: string;
  telefone: string;
  nascimento: string;
  cpf: string;
  sexo: string;
  // Etapa 2 — Endereço
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  convenio: string;
  numeroCarteirinha: string;
  indicacao: string;
  observacoes: string;
  status: string;
}

type Step1Field = 'nome' | 'email' | 'telefone' | 'nascimento' | 'cpf';
type Step2Field = 'cep' | 'logradouro' | 'numero';
type Step3Field = never; 

const FORM_INITIAL: PacienteForm = {
  nome: '', email: '', telefone: '', nascimento: '', cpf: '', sexo: '',
  cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  convenio: '', numeroCarteirinha: '', indicacao: '', observacoes: '', status: 'ativo',
};

const STEP_LABELS = ['Dados Pessoais', 'Endereço', 'Convênio & Extras'];

const sexoOptions = [
  { value: 'feminino',     label: 'Feminino'     },
  { value: 'masculino',    label: 'Masculino'     },
  { value: 'nao_binario',  label: 'Não-binário'   },
  { value: 'prefiro_nao',  label: 'Prefiro não dizer' },
];

const statusOptions   = [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }];
const filterStatus    = ['Todos', 'Ativo', 'Inativo'];
const filterProcedure = ['Todos', 'Botox', 'Preenchimento', 'Bioestimulador', 'Fio PDO', 'Microagulhamento'];

const UF_OPTIONS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
].map(uf => ({ value: uf, label: uf }));

const statusColors: Record<string, { bg: string; color: string }> = {
  ativo:   { bg: '#f0ebe4', color: '#8a7560' },
  inativo: { bg: '#f5f5f5', color: '#888'    },
};

const avatarColors = ['#BBA188', '#8a7560', '#a8906f', '#c9a882', '#917255', '#d4b896'];

const INITIAL_PATIENTS = [
  { id: 1,  name: 'Ana Beatriz Costa',  email: 'ana.costa@email.com',     phone: '(11) 98765-4321', birthdate: '1988-03-15', cpf: '123.456.789-00', lastVisit: '18/02/2025', procedure: 'Botox',            status: 'ativo',   visits: 8,  indicacao: 'Instagram',          observacoes: 'Alergia a látex',                sexo: 'feminino',  cep: '01310-100', logradouro: 'Av. Paulista',      numero: '1000', complemento: 'Apto 51', bairro: 'Bela Vista',     cidade: 'São Paulo',     estado: 'SP', convenio: 'Unimed',     numeroCarteirinha: '123456789' },
  { id: 2,  name: 'Carla Mendonça',     email: 'carla.m@email.com',       phone: '(11) 97654-3210', birthdate: '1992-07-22', cpf: '234.567.890-11', lastVisit: '15/02/2025', procedure: 'Preenchimento',    status: 'ativo',   visits: 5,  indicacao: 'Indicação de amiga', observacoes: '',                               sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 3,  name: 'Fernanda Lima',      email: 'fernanda.lima@email.com', phone: '(11) 96543-2109', birthdate: '1985-11-05', cpf: '345.678.901-22', lastVisit: '10/02/2025', procedure: 'Bioestimulador',   status: 'ativo',   visits: 3,  indicacao: 'Google',             observacoes: 'Gestante, verificar procedimentos', sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 4,  name: 'Marina Souza',       email: 'marina.s@email.com',      phone: '(21) 95432-1098', birthdate: '1990-04-30', cpf: '456.789.012-33', lastVisit: '08/01/2025', procedure: 'Fio PDO',          status: 'ativo',   visits: 6,  indicacao: 'Instagram',          observacoes: '',                               sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 5,  name: 'Juliana Rocha',      email: 'juliana.r@email.com',     phone: '(21) 94321-0987', birthdate: '1995-09-14', cpf: '567.890.123-44', lastVisit: '05/01/2025', procedure: 'Botox',            status: 'ativo',   visits: 2,  indicacao: 'Indicação médico',   observacoes: '',                               sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 6,  name: 'Patrícia Alves',     email: 'patricia.a@email.com',    phone: '(31) 93210-9876', birthdate: '1982-12-19', cpf: '678.901.234-55', lastVisit: '20/12/2024', procedure: 'Microagulhamento', status: 'inativo', visits: 12, indicacao: 'Google',             observacoes: 'Histórico de queloides',         sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 7,  name: 'Roberta Gomes',      email: 'roberta.g@email.com',     phone: '(31) 92109-8765', birthdate: '1998-06-08', cpf: '789.012.345-66', lastVisit: '15/12/2024', procedure: 'Preenchimento',    status: 'ativo',   visits: 1,  indicacao: 'TikTok',             observacoes: '',                               sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 8,  name: 'Sandra Oliveira',    email: 'sandra.o@email.com',      phone: '(41) 91098-7654', birthdate: '1978-02-25', cpf: '890.123.456-77', lastVisit: '10/11/2024', procedure: 'Bioestimulador',   status: 'inativo', visits: 7,  indicacao: 'Indicação de amiga', observacoes: '',                               sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 9,  name: 'Luciana Ferreira',   email: 'luciana.f@email.com',     phone: '(11) 90987-6543', birthdate: '1991-01-10', cpf: '901.234.567-88', lastVisit: '12/02/2025', procedure: 'Botox',            status: 'ativo',   visits: 4,  indicacao: 'Instagram',          observacoes: '',                               sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 10, name: 'Renata Cardoso',     email: 'renata.c@email.com',      phone: '(21) 99876-5432', birthdate: '1987-08-03', cpf: '012.345.678-99', lastVisit: '20/01/2025', procedure: 'Fio PDO',          status: 'ativo',   visits: 9,  indicacao: 'Google',             observacoes: 'Diabética tipo 2',               sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 11, name: 'Camila Torres',      email: 'camila.t@email.com',      phone: '(31) 98765-0123', birthdate: '1994-05-17', cpf: '111.222.333-44', lastVisit: '05/02/2025', procedure: 'Preenchimento',    status: 'ativo',   visits: 2,  indicacao: 'Indicação de amiga', observacoes: '',                               sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
  { id: 12, name: 'Beatriz Nunes',      email: 'beatriz.n@email.com',     phone: '(41) 97654-9012', birthdate: '2000-11-28', cpf: '222.333.444-55', lastVisit: '01/01/2025', procedure: 'Microagulhamento', status: 'ativo',   visits: 1,  indicacao: 'Instagram',          observacoes: '',                               sexo: 'feminino',  cep: '',     logradouro: '',                  numero: '',    complemento: '',        bairro: '',               cidade: '',              estado: '', convenio: '',           numeroCarteirinha: ''          },
];

type Patient = typeof INITIAL_PATIENTS[0];

const ITEMS_PER_PAGE = 10;

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  if (dateStr.includes('/')) return dateStr;
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

function toInputDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m}-${d}`;
  }
  return dateStr;
}

function calcAge(dateStr: string): string {
  if (!dateStr) return '';
  const input = toInputDate(dateStr);
  const birth = new Date(input);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} anos`;
}

function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}

function maskCPF(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length > 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  if (d.length > 6) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0,3)}.${d.slice(3)}`;
  return d;
}

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length > 10) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  if (d.length > 6)  return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  if (d.length > 2)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return d;
}

function getSexoLabel(value: string): string {
  return sexoOptions.find(o => o.value === value)?.label || '—';
}

function isFormDirty(form: PacienteForm): boolean {
  return form.nome.trim() !== '' || form.email.trim() !== '' || form.telefone.trim() !== '' || form.cpf.trim() !== '';
}


export default function Patients() {
  const [patients,         setPatients]         = useState<Patient[]>(INITIAL_PATIENTS);
  const [search,           setSearch]           = useState('');
  const [filterSt,         setFilterSt]         = useState('Todos');
  const [filterProc,       setFilterProc]       = useState('Todos');
  const [openDrop,         setOpenDrop]         = useState<string | null>(null);
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [isDetailOpen,     setIsDetailOpen]     = useState(false);
  const [selectedPatient,  setSelectedPatient]  = useState<Patient | null>(null);
  const [isEditing,        setIsEditing]        = useState(false);
  const [form,             setForm]             = useState<PacienteForm>(FORM_INITIAL);
  const [step,             setStep]             = useState(1);
  const [currentPage,      setCurrentPage]      = useState(1);
  const [cepLoading,       setCepLoading]       = useState(false);
  const [cepError,         setCepError]         = useState('');
  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const step1Validation = useSequentialValidation<Step1Field>([
    { key: 'nome',       validate: (v) => !v.trim() ? 'Nome completo é obrigatório'      : null },
    { key: 'email',      validate: (v) => !v.trim() ? 'E-mail é obrigatório'             : null },
    { key: 'telefone',   validate: (v) => !v.trim() ? 'Telefone é obrigatório'           : null },
    { key: 'nascimento', validate: (v) => !v        ? 'Data de nascimento é obrigatória' : null },
    { key: 'cpf',        validate: (v) => !v.trim() ? 'CPF é obrigatório'                : null },
  ]);

  const step2Validation = useSequentialValidation<Step2Field>([
    { key: 'cep',        validate: (v) => (v && v.replace(/\D/g,'').length > 0 && v.replace(/\D/g,'').length < 8) ? 'CEP inválido' : null },
    { key: 'logradouro', validate: () => null },
    { key: 'numero',     validate: () => null },
  ]);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.includes(search);
    const matchStatus = filterSt   === 'Todos' || p.status    === filterSt.toLowerCase();
    const matchProc   = filterProc === 'Todos' || p.procedure === filterProc;
    return matchSearch && matchStatus && matchProc;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const startIndex    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const ativos   = patients.filter(p => p.status === 'ativo').length;
  const inativos = patients.filter(p => p.status === 'inativo').length;

  function handleSearchChange(v: string)     { setSearch(v);     setCurrentPage(1); }
  function handleFilterStChange(v: string)   { setFilterSt(v);   setCurrentPage(1); setOpenDrop(null); }
  function handleFilterProcChange(v: string) { setFilterProc(v); setCurrentPage(1); setOpenDrop(null); }
  function handleClearFilters()              { setFilterSt('Todos'); setFilterProc('Todos'); setCurrentPage(1); }

  function handleChange(field: keyof PacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (['nome','email','telefone','nascimento','cpf'].includes(field))
      step1Validation.clearError(field as Step1Field);
    if (['cep','logradouro','numero'].includes(field))
      step2Validation.clearError(field as Step2Field);
  }

  /* busca CEP */
  async function handleCEPChange(raw: string) {
    const masked = maskCEP(raw);
    handleChange('cep', masked);
    setCepError('');
    const digits = masked.replace(/\D/g, '');
    if (digits.length === 8) {
      setCepLoading(true);
      try {
        const res  = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (data.erro) {
          setCepError('CEP não encontrado');
          setForm(prev => ({ ...prev, logradouro: '', bairro: '', cidade: '', estado: '' }));
        } else {
          setForm(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro:     data.bairro     || '',
            cidade:     data.localidade || '',
            estado:     data.uf         || '',
          }));
        }
      } catch {
        setCepError('Erro ao buscar CEP');
      } finally {
        setCepLoading(false);
      }
    }
  }

  function validateStep(s: number): boolean {
    if (s === 1) return step1Validation.validate({ nome: form.nome, email: form.email, telefone: form.telefone, nascimento: form.nascimento, cpf: form.cpf });
    if (s === 2) return step2Validation.validate({ cep: form.cep, logradouro: form.logradouro, numero: form.numero });
    return true;
  }

  function nextStep() { if (!validateStep(step)) return; setStep(s => Math.min(s + 1, 3)); }
  function prevStep() {
    step1Validation.clearAll();
    step2Validation.clearAll();
    setStep(s => Math.max(s - 1, 1));
  }

  function clearAllErrors() { step1Validation.clearAll(); step2Validation.clearAll(); }

  function openNew() {
    setIsEditing(false); setSelectedPatient(null);
    setForm(FORM_INITIAL); clearAllErrors(); setCepError(''); setStep(1); setIsModalOpen(true);
  }

  function openEdit(p: Patient) {
    setIsEditing(true); setSelectedPatient(p);
    setForm({
      nome: p.name, email: p.email, telefone: p.phone,
      nascimento: toInputDate(p.birthdate), cpf: p.cpf,
      sexo: p.sexo || '', status: p.status,
      cep: p.cep || '', logradouro: p.logradouro || '',
      numero: p.numero || '', complemento: p.complemento || '',
      bairro: p.bairro || '', cidade: p.cidade || '', estado: p.estado || '',
      convenio: p.convenio || '', numeroCarteirinha: p.numeroCarteirinha || '',
      indicacao: p.indicacao, observacoes: p.observacoes,
    });
    clearAllErrors(); setCepError(''); setStep(1); setIsDetailOpen(false); setIsModalOpen(true);
  }

  function openDetail(p: Patient) { setSelectedPatient(p); setIsDetailOpen(true); }

  function handleCancelClick() {
    if (isFormDirty(form)) { setShowCancelModal(true); } else { forceClose(); }
  }

  function forceClose() {
    setForm(FORM_INITIAL); clearAllErrors(); setCepError('');
    setIsModalOpen(false); setSelectedPatient(null); setIsEditing(false);
    setStep(1); setShowCancelModal(false); setShowConfirmModal(false);
  }

  function handleSaveClick() {
    if (step < 3) { nextStep(); return; }
    setShowConfirmModal(true);
  }

  function handleConfirmSave() {
    setShowConfirmModal(false);
    const today = new Date().toLocaleDateString('pt-BR');
    if (isEditing && selectedPatient) {
      setPatients(prev => prev.map(p => p.id === selectedPatient.id
        ? {
            ...p,
            name: form.nome, email: form.email, phone: form.telefone,
            birthdate: form.nascimento, cpf: form.cpf,
            sexo: form.sexo, status: form.status,
            cep: form.cep, logradouro: form.logradouro, numero: form.numero,
            complemento: form.complemento, bairro: form.bairro,
            cidade: form.cidade, estado: form.estado,
            convenio: form.convenio, numeroCarteirinha: form.numeroCarteirinha,
            indicacao: form.indicacao, observacoes: form.observacoes,
          }
        : p
      ));
    } else {
      setPatients(prev => [...prev, {
        id: Date.now(), name: form.nome, email: form.email, phone: form.telefone,
        birthdate: form.nascimento, cpf: form.cpf,
        lastVisit: today, procedure: '—', status: 'ativo', visits: 0,
        sexo: form.sexo,
        cep: form.cep, logradouro: form.logradouro, numero: form.numero,
        complemento: form.complemento, bairro: form.bairro,
        cidade: form.cidade, estado: form.estado,
        convenio: form.convenio, numeroCarteirinha: form.numeroCarteirinha,
        indicacao: form.indicacao, observacoes: form.observacoes,
      }]);
    }
    setIsModalOpen(false); setShowSuccessModal(true);
  }

  function handleSuccessClose() {
    setShowSuccessModal(false); setForm(FORM_INITIAL);
    clearAllErrors(); setCepError(''); setSelectedPatient(null); setIsEditing(false); setStep(1);
  }

  const errors1 = step1Validation.errors;
  const errors2 = step2Validation.errors;

  function renderStepContent() {
    switch (step) {
      case 1:
        return (
          <StepSection>
            <SectionLabel style={{ marginBottom: 12 }}>Dados Pessoais</SectionLabel>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Nome Completo *"
                  placeholder="Digite o nome completo"
                  value={form.nome}
                  onChange={e => handleChange('nome', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
                  maxLength={80}
                  error={errors1.nome}
                />
              </div>
              <Input
                label="E-mail *"
                type="email"
                placeholder="Digite o e-mail"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                error={errors1.email}
              />
              <Input
                label="Telefone *"
                placeholder="(11) 99999-9999"
                value={form.telefone}
                inputMode="numeric"
                maxLength={15}
                onChange={e => handleChange('telefone', maskPhone(e.target.value))}
                error={errors1.telefone}
              />
              <Input
                label="Data de Nascimento *"
                type="date"
                value={form.nascimento}
                onChange={e => handleChange('nascimento', e.target.value)}
                error={errors1.nascimento}
              />
              <Input
                label="CPF *"
                placeholder="000.000.000-00"
                value={form.cpf}
                inputMode="numeric"
                maxLength={14}
                onChange={e => handleChange('cpf', maskCPF(e.target.value))}
                error={errors1.cpf}
              />
              <div style={{ gridColumn: isEditing ? 'auto' : 'auto' }}>
                <Select
                  label="Sexo"
                  options={sexoOptions}
                  placeholder="Selecione..."
                  value={form.sexo}
                  onChange={v => handleChange('sexo', v)}
                />
              </div>
              {isEditing && (
                <Select
                  label="Status"
                  options={statusOptions}
                  placeholder="Selecione o status"
                  value={form.status}
                  onChange={v => handleChange('status', v)}
                />
              )}
            </FormGrid>
          </StepSection>
        );

      case 2:
        return (
          <StepSection>
            <SectionLabel style={{ marginBottom: 12 }}>Endereço</SectionLabel>
            <FormGrid>
              <div style={{ position: 'relative' }}>
                <Input
                  label="CEP"
                  placeholder="00000-000"
                  value={form.cep}
                  inputMode="numeric"
                  maxLength={9}
                  onChange={e => handleCEPChange(e.target.value)}
                  error={cepError || errors2.cep}
                />
                {cepLoading && (
                  <div style={{
                    position: 'absolute', right: 12, top: 34,
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: '0.72rem', color: '#BBA188',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Buscando...
                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                  </div>
                )}
              </div>
              <div style={{ gridColumn: 'auto' }}>
                <Input
                  label="Logradouro"
                  placeholder="Rua, Avenida..."
                  value={form.logradouro}
                  onChange={e => handleChange('logradouro', e.target.value)}
                  maxLength={120}
                />
              </div>
              <Input
                label="Número"
                placeholder="Ex: 123"
                value={form.numero}
                inputMode="numeric"
                maxLength={10}
                onChange={e => handleChange('numero', e.target.value.replace(/\D/g, ''))}
              />
              <Input
                label="Complemento"
                placeholder="Apto, bloco..."
                value={form.complemento}
                onChange={e => handleChange('complemento', e.target.value)}
                maxLength={60}
              />
              <Input
                label="Bairro"
                placeholder="Bairro"
                value={form.bairro}
                onChange={e => handleChange('bairro', e.target.value)}
                maxLength={80}
              />
              <Input
                label="Cidade"
                placeholder="Cidade"
                value={form.cidade}
                onChange={e => handleChange('cidade', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
                maxLength={80}
              />
              <Select
                label="Estado (UF)"
                options={UF_OPTIONS}
                placeholder="UF"
                value={form.estado}
                onChange={v => handleChange('estado', v)}
              />
            </FormGrid>
          </StepSection>
        );

      case 3:
        return (
          <StepSection>
            <SectionLabel style={{ marginBottom: 12 }}>Convênio & Informações Extras</SectionLabel>
            <FormGrid>
              <Input
                label="Convênio"
                placeholder="Ex: Unimed, Bradesco Saúde..."
                value={form.convenio}
                onChange={e => handleChange('convenio', e.target.value)}
                maxLength={80}
              />
              <Input
                label="Nº da Carteirinha"
                placeholder="Número do convênio"
                value={form.numeroCarteirinha}
                inputMode="numeric"
                maxLength={30}
                onChange={e => handleChange('numeroCarteirinha', e.target.value.replace(/\D/g, ''))}
              />
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Como nos conheceu?"
                  placeholder="Ex: Instagram, indicação, Google..."
                  value={form.indicacao}
                  onChange={e => handleChange('indicacao', e.target.value)}
                  maxLength={100}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Observações / Alergias"
                  placeholder="Digite observações de saúde relevantes ou alergias"
                  maxLength={300}
                  value={form.observacoes}
                  onChange={e => handleChange('observacoes', e.target.value)}
                />
              </div>

              <div style={{ gridColumn: 'span 2', background: '#fdf9f5', borderRadius: 12, padding: 16, border: '1px solid #f0ebe4', marginTop: 4 }}>
                <p style={{ fontSize: '0.77rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>Resumo do Cadastro</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                  {([
                    ['Nome',        form.nome],
                    ['E-mail',      form.email],
                    ['Telefone',    form.telefone],
                    ['Nascimento',  formatDate(form.nascimento)],
                    ['CPF',         form.cpf],
                    ['Sexo',        getSexoLabel(form.sexo)],
                    ['CEP',         form.cep || '—'],
                    ['Cidade/UF',   form.cidade ? `${form.cidade}/${form.estado}` : '—'],
                    ['Convênio',    form.convenio || '—'],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label}>
                      <span style={{ fontSize: '0.72rem', color: '#bbb', display: 'block' }}>{label}</span>
                      <span style={{ fontSize: '0.83rem', color: '#555', fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FormGrid>
          </StepSection>
        );

      default: return null;
    }
  }

  const modalFooter = (
    <WizardNav>
      {step > 1
        ? <Button variant="outline" onClick={prevStep}>Voltar</Button>
        : <Button variant="outline" onClick={handleCancelClick}>Cancelar</Button>
      }
      {step < 3
        ? <Button variant="primary" onClick={nextStep}>Continuar</Button>
        : <Button variant="primary" onClick={() => setShowConfirmModal(true)}>
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente'}
          </Button>
      }
    </WizardNav>
  );

  return (
    <Container>
      <Header>
        <Title>Pacientes</Title>
        <Button
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={openNew}
        >
          Novo Paciente
        </Button>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Pacientes" value={patients.length} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard label="Pacientes Ativos" value={ativos} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="Inativos" value={inativos} color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>}
        />
        <StatCard label="Novos este mês" value={3} color="#a8906f"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <input type="text"     name="prevent-autofill-name"  autoComplete="off" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <input type="email"    name="prevent-autofill-email" autoComplete="off" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <input type="password" name="prevent-autofill-pass"  autoComplete="off" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled
            type="search"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            autoComplete="off"
            name="search-pacientes-filter"
            data-form-type="other"
            data-lpignore="true"
          />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDrop(p => p === 'status' ? null : 'status')}>
              <span>{filterSt}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDrop === 'status' && (
              <DropdownList>
                {filterStatus.map(s => <DropdownItem key={s} $active={filterSt === s} onClick={() => handleFilterStChange(s)}>{s}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDrop(p => p === 'proc' ? null : 'proc')}>
              <span>{filterProc}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDrop === 'proc' && (
              <DropdownList>
                {filterProcedure.map(s => <DropdownItem key={s} $active={filterProc === s} onClick={() => handleFilterProcChange(s)}>{s}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          {(filterSt !== 'Todos' || filterProc !== 'Todos') && (
            <ClearFilterBtn onClick={handleClearFilters}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 596 }}>
        <TableWrapper style={{ flex: 1 }}>
          <Table>
            <Thead>
              <tr>
                <Th $width="24%">Paciente</Th>
                <Th $width="13%">Telefone</Th>
                <Th $width="11%">Nascimento</Th>
                <Th $width="12%">Última Visita</Th>
                <Th $width="15%">Procedimento</Th>
                <Th $width="7%" $center>Visitas</Th>
                <Th $width="8%">Status</Th>
                <Th $width="10%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {paginatedData.length === 0 ? (
                <tr><td colSpan={8}>
                  <EmptyState>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <h3>Nenhum paciente encontrado</h3>
                    <p>Tente ajustar os filtros</p>
                  </EmptyState>
                </td></tr>
              ) : paginatedData.map((p, i) => (
                <Tr key={p.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar $color={avatarColors[(startIndex + i) % avatarColors.length]}>
                        {getInitials(p.name)}
                      </Avatar>
                      <PatientInfo>
                        <PatientName>{p.name}</PatientName>
                        <PatientEmail>{p.email}</PatientEmail>
                      </PatientInfo>
                    </div>
                  </Td>
                  <Td><PhoneText>{p.phone}</PhoneText></Td>
                  <Td><DateText>{formatDate(p.birthdate)}</DateText></Td>
                  <Td><DateText>{p.lastVisit}</DateText></Td>
                  <Td><Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{p.procedure}</Badge></Td>
                  <Td $center $bold>{p.visits || '—'}</Td>
                  <Td><Badge $bg={statusColors[p.status].bg} $color={statusColors[p.status].color}>{p.status === 'ativo' ? 'Ativo' : 'Inativo'}</Badge></Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="Ver detalhes" onClick={() => openDetail(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </IconBtn>
                      <IconBtn title="Editar" onClick={() => openEdit(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </IconBtn>
                    </ActionGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination
          currentPage={safePage}
          totalItems={totalFiltered}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        closeOnOverlayClick={false}
        title="Ficha do Paciente"
        size="lg"
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
            <Button variant="outline"
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
              onClick={() => selectedPatient && openEdit(selectedPatient)}
            >Editar Ficha</Button>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </div>
        }
      >
        {selectedPatient && (
          <DetailModal>
            <DetailHeader>
              <DetailAvatar $color="#BBA188">{getInitials(selectedPatient.name)}</DetailAvatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <DetailName>{selectedPatient.name}</DetailName>
                <DetailMeta>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.92 6.92l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 17z"/></svg>
                    {selectedPatient.phone}
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {selectedPatient.email}
                  </DetailMetaItem>
                </DetailMeta>
                <StatsRow style={{ marginTop: 10 }}>
                  <StatPill $color="#BBA188">{selectedPatient.visits} visitas</StatPill>
                  <StatPill $color={selectedPatient.status === 'ativo' ? '#8a7560' : '#888'}>{selectedPatient.status === 'ativo' ? 'Ativo' : 'Inativo'}</StatPill>
                  <StatPill $color="#a8906f">{selectedPatient.procedure}</StatPill>
                  {selectedPatient.sexo && <StatPill $color="#BBA188">{getSexoLabel(selectedPatient.sexo)}</StatPill>}
                </StatsRow>
              </div>
            </DetailHeader>

            {selectedPatient.observacoes && (
              <ObsBox><strong>⚠ Observações / Alergias: </strong>{selectedPatient.observacoes}</ObsBox>
            )}

            <DetailSection>
              <DetailSectionTitle>Dados do Paciente</DetailSectionTitle>
              <InfoGrid>
                <InfoItem><InfoLabel>Data de Nascimento</InfoLabel><InfoValue>{formatDate(selectedPatient.birthdate)}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Idade</InfoLabel><InfoValue>{calcAge(selectedPatient.birthdate)}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>CPF</InfoLabel><InfoValue><code style={{ fontSize: '0.83rem', color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 5 }}>{selectedPatient.cpf}</code></InfoValue></InfoItem>
                <InfoItem><InfoLabel>Sexo</InfoLabel><InfoValue>{getSexoLabel(selectedPatient.sexo || '')}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Último Procedimento</InfoLabel><InfoValue>{selectedPatient.procedure}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Última Visita</InfoLabel><InfoValue>{selectedPatient.lastVisit}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Total de Visitas</InfoLabel><InfoValue style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1.1rem' }}>{selectedPatient.visits}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Como nos conheceu</InfoLabel><InfoValue>{selectedPatient.indicacao || '—'}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Status</InfoLabel><InfoValue><Badge $bg={statusColors[selectedPatient.status].bg} $color={statusColors[selectedPatient.status].color}>{selectedPatient.status === 'ativo' ? 'Ativo' : 'Inativo'}</Badge></InfoValue></InfoItem>
                {selectedPatient.convenio && <InfoItem><InfoLabel>Convênio</InfoLabel><InfoValue>{selectedPatient.convenio}</InfoValue></InfoItem>}
                {selectedPatient.numeroCarteirinha && <InfoItem><InfoLabel>Nº Carteirinha</InfoLabel><InfoValue><code style={{ fontSize: '0.83rem', color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 5 }}>{selectedPatient.numeroCarteirinha}</code></InfoValue></InfoItem>}
              </InfoGrid>
            </DetailSection>

            {(selectedPatient.logradouro || selectedPatient.cep) && (
              <DetailSection style={{ marginTop: 16 }}>
                <DetailSectionTitle>Endereço</DetailSectionTitle>
                <InfoGrid>
                  {selectedPatient.cep         && <InfoItem><InfoLabel>CEP</InfoLabel><InfoValue>{selectedPatient.cep}</InfoValue></InfoItem>}
                  {selectedPatient.logradouro   && <InfoItem><InfoLabel>Logradouro</InfoLabel><InfoValue>{selectedPatient.logradouro}{selectedPatient.numero ? `, ${selectedPatient.numero}` : ''}</InfoValue></InfoItem>}
                  {selectedPatient.complemento  && <InfoItem><InfoLabel>Complemento</InfoLabel><InfoValue>{selectedPatient.complemento}</InfoValue></InfoItem>}
                  {selectedPatient.bairro       && <InfoItem><InfoLabel>Bairro</InfoLabel><InfoValue>{selectedPatient.bairro}</InfoValue></InfoItem>}
                  {selectedPatient.cidade       && <InfoItem><InfoLabel>Cidade / UF</InfoLabel><InfoValue>{selectedPatient.cidade}{selectedPatient.estado ? ` / ${selectedPatient.estado}` : ''}</InfoValue></InfoItem>}
                </InfoGrid>
              </DetailSection>
            )}
          </DetailModal>
        )}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelClick}
        closeOnOverlayClick={false}
        title={isEditing ? 'Editar Paciente' : 'Novo Paciente'}
        size="lg"
        footer={modalFooter}
      >
        <WizardSteps>
          {STEP_LABELS.map((label, idx) => {
            const num     = idx + 1;
            const done    = num < step;
            const current = num === step;
            return (
              <WizardStep key={num}>
                {idx > 0 && <WizardStepLine $done={done || current} />}
                <WizardStepCircle $done={done} $current={current}>
                  {done
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : num
                  }
                </WizardStepCircle>
                <WizardStepLabel $current={current}>{label}</WizardStepLabel>
              </WizardStep>
            );
          })}
        </WizardSteps>

        <div style={{ overflowY: 'auto', maxHeight: '60vh', paddingRight: 4 }}>
          {renderStepContent()}
        </div>
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
        title={isEditing ? 'Salvar alterações?' : 'Cadastrar paciente?'}
        message={isEditing
          ? 'Tem certeza que deseja salvar as alterações feitas na ficha deste paciente?'
          : `Tem certeza que deseja cadastrar ${form.nome || 'este paciente'}?`}
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />
      <SucessModal
        isOpen={showSuccessModal}
        title="Sucesso!"
        message={isEditing ? 'Alterações salvas com sucesso!' : 'Paciente cadastrado com sucesso!'}
        onClose={handleSuccessClose}
        buttonText="Continuar"
      />
    </Container>
  );
}