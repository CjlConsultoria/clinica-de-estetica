'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { pacientesService, Paciente } from '@/services/pacientes.service';
import { fotosService, FotoPaciente } from '@/services/fotos.service';
import {
  Container, Header, Title, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  PatientsGrid, PatientFotoCard, PatientCardHeader, PatientAvatar, PatientName, PatientSub,
  PatientCardBody, FotoGrid, FotoItem, FotoLabel, FotoDate, FotoEmpty,
  CompareSection, CompareTitle, CompareGrid, CompareSide, CompareSideLabel, CompareImg,
  UploadZone, UploadIcon, UploadText, UploadHint,
  FormGrid, Badge,
} from './styles';

type UploadField = 'paciente' | 'dataFoto' | 'procedimento' | 'momento';

interface UploadForm {
  paciente: string;
  pacienteId: string;
  dataFoto: string;
  procedimento: string;
  momento: string;
  observacoes: string;
}

const UPLOAD_INITIAL: UploadForm = {
  paciente: '', pacienteId: '', dataFoto: '', procedimento: '', momento: '', observacoes: '',
};

const UPLOAD_VALIDATION = [
  { key: 'paciente'     as UploadField, validate: (v: string) => !v.trim() ? 'Selecione ou informe o paciente' : null },
  { key: 'dataFoto'     as UploadField, validate: (v: string) => !v ? 'Data da foto é obrigatória' : null },
  { key: 'procedimento' as UploadField, validate: (v: string) => !v ? 'Selecione o procedimento' : null },
  { key: 'momento'      as UploadField, validate: (v: string) => !v ? 'Selecione o momento' : null },
];

const procedureOptions = [
  { value: 'botox',            label: 'Botox Facial'         },
  { value: 'preenchimento',    label: 'Preenchimento Labial'  },
  { value: 'bioestimulador',   label: 'Bioestimulador'        },
  { value: 'fio-pdo',          label: 'Fio de PDO'            },
  { value: 'microagulhamento', label: 'Microagulhamento'      },
  { value: 'peeling',          label: 'Peelings Químicos'     },
];

const momentoOptions = [
  { value: 'ANTES',   label: 'Antes do Procedimento'  },
  { value: 'DEPOIS',  label: 'Depois do Procedimento' },
  { value: 'RETORNO', label: 'Retorno / Follow-up'    },
];

const filterProcedures = ['Todos', 'Botox', 'Preenchimento', 'Bioestimulador', 'Fio PDO', 'Microagulhamento'];

const tipoColors: Record<string, { bg: string; color: string; label: string }> = {
  ANTES:   { bg: '#fff3cd', color: '#856404', label: 'Antes'   },
  antes:   { bg: '#fff3cd', color: '#856404', label: 'Antes'   },
  DEPOIS:  { bg: '#f0ebe4', color: '#8a7560', label: 'Depois'  },
  depois:  { bg: '#f0ebe4', color: '#8a7560', label: 'Depois'  },
  RETORNO: { bg: 'rgba(187,161,136,0.15)', color: '#BBA188', label: 'Retorno' },
  retorno: { bg: 'rgba(187,161,136,0.15)', color: '#BBA188', label: 'Retorno' },
};

const AVATAR_COLORS = ['#BBA188', '#a8906f', '#1b1b1b', '#8a7560', '#EBD5B0'];

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  return parts[0]?.[0]?.toUpperCase() ?? '?';
}

function formatDate(dt: string | null | undefined): string {
  if (!dt) return '';
  try {
    return new Date(dt).toLocaleDateString('pt-BR');
  } catch { return dt; }
}

interface PatientWithFotos {
  paciente: Paciente;
  fotos: FotoPaciente[];
  color: string;
}

export default function Fotos() {
  const [search,                setSearch]                = useState('');
  const [filterProc,            setFilterProc]            = useState('Todos');
  const [openDropProc,          setOpenDropProc]          = useState(false);
  const [selectedPatient,       setSelectedPatient]       = useState<PatientWithFotos | null>(null);
  const [isUploadOpen,          setIsUploadOpen]          = useState(false);
  const [isCompareOpen,         setIsCompareOpen]         = useState(false);
  const [uploadForm,            setUploadForm]            = useState<UploadForm>(UPLOAD_INITIAL);
  const [uploadFile,            setUploadFile]            = useState<File | null>(null);
  const [patients,              setPatients]              = useState<PatientWithFotos[]>([]);
  const [loading,               setLoading]               = useState(true);
  const [patientOptions,        setPatientOptions]        = useState<{ value: string; label: string }[]>([]);

  const {
    errors: uploadErrors,
    validate: validateUpload,
    clearError: clearUploadError,
    clearAll: clearUploadAll,
  } = useSequentialValidation<UploadField>(UPLOAD_VALIDATION);

  async function carregarPacientes() {
    try {
      setLoading(true);
      const pacs = await pacientesService.listarTodos(200);
      setPatientOptions(pacs.map(p => ({ value: String(p.id), label: p.nome })));
      // Load fotos for each patient
      const withFotos = await Promise.all(pacs.map(async (p, idx) => {
        try {
          const fotos = await fotosService.listarPorPaciente(p.id);
          return { paciente: p, fotos, color: AVATAR_COLORS[idx % AVATAR_COLORS.length] };
        } catch {
          return { paciente: p, fotos: [], color: AVATAR_COLORS[idx % AVATAR_COLORS.length] };
        }
      }));
      setPatients(withFotos);
    } catch {
      // silent - show empty state
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregarPacientes(); }, []);

  const filtered = patients.filter(p =>
    p.paciente.nome.toLowerCase().includes(search.toLowerCase())
  );

  function handleUploadChange(field: keyof UploadForm, value: string) {
    setUploadForm(prev => ({ ...prev, [field]: value }));
    clearUploadError(field as UploadField);
  }

  function handleUploadDateChange(raw: string) {
    if (!raw) { handleUploadChange('dataFoto', ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleUploadChange('dataFoto', `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function handleCloseUpload() {
    setUploadForm(UPLOAD_INITIAL);
    setUploadFile(null);
    clearUploadAll();
    setIsUploadOpen(false);
  }

  async function handleSaveUpload() {
    const isValid = validateUpload({
      paciente: uploadForm.pacienteId || uploadForm.paciente,
      dataFoto: uploadForm.dataFoto,
      procedimento: uploadForm.procedimento,
      momento: uploadForm.momento,
    });
    if (!isValid) return;
    if (!uploadFile) { alert('Selecione um arquivo de foto.'); return; }
    const pacId = parseInt(uploadForm.pacienteId);
    if (!pacId) { alert('Selecione um paciente válido.'); return; }
    try {
      await fotosService.upload(pacId, uploadForm.momento, uploadFile, uploadForm.observacoes || undefined, uploadForm.procedimento || undefined);
      await carregarPacientes();
      handleCloseUpload();
    } catch {
      alert('Erro ao fazer upload da foto.');
    }
  }

  function openUpload(patient?: PatientWithFotos) {
    if (patient) {
      setSelectedPatient(patient);
      setUploadForm(prev => ({
        ...prev,
        paciente: patient.paciente.nome,
        pacienteId: String(patient.paciente.id),
      }));
    }
    setIsUploadOpen(true);
  }

  if (loading) return <Container><p style={{ padding: 32, color: '#888' }}>Carregando pacientes...</p></Container>;

  return (
    <Container>
      <Header>
        <Title>Histórico Fotográfico</Title>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            variant="outline"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
            onClick={() => setIsCompareOpen(true)}
          >
            Comparar Fotos
          </Button>
          <Button
            variant="primary"
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
          <SearchInputStyled placeholder="Buscar paciente..." value={search} onChange={e => setSearch(e.target.value)} />
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
                  <DropdownItem key={p} $active={filterProc === p} onClick={() => { setFilterProc(p); setOpenDropProc(false); }}>{p}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          {filterProc !== 'Todos' && (
            <ClearFilterBtn onClick={() => setFilterProc('Todos')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <PatientsGrid>
        {filtered.length === 0 ? (
          <p style={{ padding: 32, color: '#bbb', gridColumn: '1/-1' }}>Nenhum paciente encontrado.</p>
        ) : filtered.map(entry => (
          <PatientFotoCard key={entry.paciente.id}>
            <PatientCardHeader>
              <PatientAvatar $color={entry.color}>{getInitials(entry.paciente.nome)}</PatientAvatar>
              <div>
                <PatientName>{entry.paciente.nome}</PatientName>
                <PatientSub>{entry.fotos.length} foto(s)</PatientSub>
              </div>
            </PatientCardHeader>

            <PatientCardBody>
              {entry.fotos.length === 0 ? (
                <FotoEmpty>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Nenhuma foto cadastrada</span>
                </FotoEmpty>
              ) : (
                <FotoGrid>
                  {entry.fotos.slice(0, 4).map(foto => (
                    <FotoItem key={foto.id}>
                      <div style={{ width: '100%', paddingBottom: '100%', background: `linear-gradient(135deg, ${entry.color}22, ${entry.color}44)`, borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: entry.color, opacity: 0.5 }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                        <Badge $bg={tipoColors[foto.tipo]?.bg} $color={tipoColors[foto.tipo]?.color} style={{ position: 'absolute', top: 4, left: 4 }}>
                          {tipoColors[foto.tipo]?.label ?? foto.tipo}
                        </Badge>
                      </div>
                      <FotoLabel>{foto.procedimento ?? '—'}</FotoLabel>
                      <FotoDate>{formatDate(foto.dataFoto ?? foto.criadoEm)}</FotoDate>
                    </FotoItem>
                  ))}
                </FotoGrid>
              )}
            </PatientCardBody>

            <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
              <Button variant="outline" size="sm" onClick={() => { setSelectedPatient(entry); setIsCompareOpen(true); }}>Comparar</Button>
              <Button variant="ghost" size="sm" onClick={() => openUpload(entry)}>+ Foto</Button>
            </div>
          </PatientFotoCard>
        ))}
      </PatientsGrid>

      <Modal
        isOpen={isUploadOpen}
        onClose={handleCloseUpload}
        title="Adicionar Foto"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={handleCloseUpload}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveUpload}>Salvar Foto</Button>
          </>
        }
      >
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <UploadZone onClick={() => document.getElementById('foto-file-input')?.click()}>
              <UploadIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </UploadIcon>
              <UploadText>{uploadFile ? uploadFile.name : 'Clique para selecionar ou arraste a foto aqui'}</UploadText>
              <UploadHint>JPG, PNG ou WEBP · Máx. 10MB</UploadHint>
              <input
                id="foto-file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
            </UploadZone>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Select
              label="Paciente *"
              options={patientOptions}
              placeholder="Selecione o paciente..."
              value={uploadForm.pacienteId}
              onChange={(v) => {
                const label = patientOptions.find(p => p.value === v)?.label ?? '';
                setUploadForm(prev => ({ ...prev, pacienteId: v, paciente: label }));
                clearUploadError('paciente');
              }}
              error={uploadErrors.paciente}
            />
          </div>

          <Input
            label="Data da Foto *"
            type="date"
            value={uploadForm.dataFoto}
            onChange={(e) => handleUploadDateChange(e.target.value)}
            error={uploadErrors.dataFoto}
          />

          <Select
            label="Procedimento *"
            options={procedureOptions}
            placeholder="Selecione..."
            value={uploadForm.procedimento}
            onChange={(v) => handleUploadChange('procedimento', v)}
            error={uploadErrors.procedimento}
          />

          <div style={{ gridColumn: 'span 2' }}>
            <Select
              label="Momento *"
              options={momentoOptions}
              placeholder="Selecione..."
              value={uploadForm.momento}
              onChange={(v) => handleUploadChange('momento', v)}
              error={uploadErrors.momento}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Observações"
              placeholder="Notas sobre esta foto..."
              maxLength={200}
              value={uploadForm.observacoes}
              onChange={(e) => handleUploadChange('observacoes', e.target.value)}
            />
          </div>
        </FormGrid>
      </Modal>

      <Modal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        title={`Comparativo Antes / Depois${selectedPatient ? ` — ${selectedPatient.paciente.nome}` : ''}`}
        size="xl"
        footer={<Button variant="outline" onClick={() => setIsCompareOpen(false)}>Fechar</Button>}
      >
        <CompareSection>
          <div style={{ marginBottom: 20 }}>
            <Select
              label="Selecionar Paciente"
              options={patientOptions}
              placeholder="Selecione o paciente..."
              value={selectedPatient ? String(selectedPatient.paciente.id) : ''}
              onChange={(v) => {
                const found = patients.find(p => String(p.paciente.id) === v);
                if (found) setSelectedPatient(found);
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <Select label="Procedimento" options={procedureOptions} placeholder="Todos os procedimentos..." />
          </div>
          <CompareGrid>
            <CompareSide>
              <CompareSideLabel $tipo="antes">Antes</CompareSideLabel>
              <CompareImg $color="#BBA188">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>{selectedPatient && selectedPatient.fotos.filter(f => f.tipo === 'ANTES' || f.tipo === 'antes').length > 0 ? `${selectedPatient.fotos.filter(f => f.tipo === 'ANTES' || f.tipo === 'antes').length} foto(s) disponível` : 'Nenhuma foto'}</span>
              </CompareImg>
              <Input label="Data (Antes)" type="date" />
            </CompareSide>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#BBA188', fontWeight: 700 }}>↔</div>
            <CompareSide>
              <CompareSideLabel $tipo="depois">Depois</CompareSideLabel>
              <CompareImg $color="#a8906f">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>{selectedPatient && selectedPatient.fotos.filter(f => f.tipo === 'DEPOIS' || f.tipo === 'depois').length > 0 ? `${selectedPatient.fotos.filter(f => f.tipo === 'DEPOIS' || f.tipo === 'depois').length} foto(s) disponível` : 'Nenhuma foto'}</span>
              </CompareImg>
              <Input label="Data (Depois)" type="date" />
            </CompareSide>
          </CompareGrid>
          <div style={{ marginTop: 20, padding: 16, background: '#fdf9f5', borderRadius: 12, border: '1px solid #f0ebe4' }}>
            <CompareTitle>Observações do Comparativo</CompareTitle>
            <Input label="" placeholder="Descreva o resultado observado na comparação..." />
          </div>
        </CompareSection>
      </Modal>
    </Container>
  );
}
