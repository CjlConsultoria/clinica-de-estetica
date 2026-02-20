'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
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
  dataFoto: string;
  procedimento: string;
  momento: string;
  observacoes: string;
}

const UPLOAD_INITIAL: UploadForm = {
  paciente: '', dataFoto: '', procedimento: '', momento: '', observacoes: '',
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
  { value: 'antes',   label: 'Antes do Procedimento'  },
  { value: 'depois',  label: 'Depois do Procedimento' },
  { value: 'retorno', label: 'Retorno / Follow-up'    },
];

const filterProcedures = ['Todos', 'Botox', 'Preenchimento', 'Bioestimulador', 'Fio PDO', 'Microagulhamento'];

const mockPatients = [
  {
    id: 1, name: 'Ana Beatriz Costa', initials: 'AB', color: '#BBA188',
    lastProcedure: 'Botox Facial',
    fotos: [
      { id: 1, tipo: 'antes',  procedimento: 'Botox Facial', data: '10/01/2025', placeholder: 'antes1'  },
      { id: 2, tipo: 'depois', procedimento: 'Botox Facial', data: '10/01/2025', placeholder: 'depois1' },
      { id: 3, tipo: 'antes',  procedimento: 'Botox Facial', data: '18/02/2025', placeholder: 'antes2'  },
      { id: 4, tipo: 'depois', procedimento: 'Botox Facial', data: '18/02/2025', placeholder: 'depois2' },
    ],
  },
  {
    id: 2, name: 'Carla Mendonça', initials: 'CM', color: '#a8906f',
    lastProcedure: 'Preenchimento Labial',
    fotos: [
      { id: 1, tipo: 'antes',  procedimento: 'Preenchimento Labial', data: '15/02/2025', placeholder: 'antes3'  },
      { id: 2, tipo: 'depois', procedimento: 'Preenchimento Labial', data: '15/02/2025', placeholder: 'depois3' },
    ],
  },
  {
    id: 3, name: 'Fernanda Lima', initials: 'FL', color: '#1b1b1b',
    lastProcedure: 'Bioestimulador',
    fotos: [
      { id: 1, tipo: 'antes',   procedimento: 'Bioestimulador', data: '05/01/2025', placeholder: 'antes4'   },
      { id: 2, tipo: 'depois',  procedimento: 'Bioestimulador', data: '05/01/2025', placeholder: 'depois4'  },
      { id: 3, tipo: 'retorno', procedimento: 'Bioestimulador', data: '10/02/2025', placeholder: 'retorno1' },
    ],
  },
  { id: 4, name: 'Marina Souza', initials: 'MS', color: '#BBA188', lastProcedure: 'Fio PDO', fotos: [] },
];

const tipoColors: Record<string, { bg: string; color: string; label: string }> = {
  antes:   { bg: '#fff3cd', color: '#856404', label: 'Antes'   },
  depois:  { bg: '#f0ebe4', color: '#8a7560', label: 'Depois'  },
  retorno: { bg: 'rgba(187,161,136,0.15)', color: '#BBA188', label: 'Retorno' },
};

type Patient = typeof mockPatients[0];

export default function Fotos() {
  const [search, setSearch]                   = useState('');
  const [filterProc, setFilterProc]           = useState('Todos');
  const [openDropProc, setOpenDropProc]       = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isUploadOpen, setIsUploadOpen]       = useState(false);
  const [isCompareOpen, setIsCompareOpen]     = useState(false);

  const [uploadForm, setUploadForm] = useState<UploadForm>(UPLOAD_INITIAL);

  const {
    errors: uploadErrors,
    validate: validateUpload,
    clearError: clearUploadError,
    clearAll: clearUploadAll,
  } = useSequentialValidation<UploadField>(UPLOAD_VALIDATION);

  const filtered = mockPatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
    clearUploadAll();
    setIsUploadOpen(false);
  }

  function handleSaveUpload() {
    const isValid = validateUpload({
      paciente: uploadForm.paciente, dataFoto: uploadForm.dataFoto,
      procedimento: uploadForm.procedimento, momento: uploadForm.momento,
    });
    if (!isValid) return;
    console.log('Foto salva:', uploadForm);
    handleCloseUpload();
  }

  function openUpload(patient?: Patient) {
    if (patient) {
      setSelectedPatient(patient);
      setUploadForm(prev => ({ ...prev, paciente: patient.name }));
    }
    setIsUploadOpen(true);
  }

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
        {filtered.map(patient => (
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
                  {patient.fotos.slice(0, 4).map(foto => (
                    <FotoItem key={foto.id}>
                      <div style={{ width: '100%', paddingBottom: '100%', background: `linear-gradient(135deg, ${patient.color}22, ${patient.color}44)`, borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: patient.color, opacity: 0.5 }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                        <Badge $bg={tipoColors[foto.tipo]?.bg} $color={tipoColors[foto.tipo]?.color} style={{ position: 'absolute', top: 4, left: 4 }}>
                          {tipoColors[foto.tipo]?.label}
                        </Badge>
                      </div>
                      <FotoLabel>{foto.procedimento}</FotoLabel>
                      <FotoDate>{foto.data}</FotoDate>
                    </FotoItem>
                  ))}
                </FotoGrid>
              )}
            </PatientCardBody>

            <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
              <Button variant="outline" size="sm" onClick={() => { setSelectedPatient(patient); setIsCompareOpen(true); }}>Comparar</Button>
              <Button variant="ghost" size="sm" onClick={() => openUpload(patient)}>+ Foto</Button>
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
            <UploadZone>
              <UploadIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </UploadIcon>
              <UploadText>Clique para selecionar ou arraste a foto aqui</UploadText>
              <UploadHint>JPG, PNG ou WEBP · Máx. 10MB</UploadHint>
            </UploadZone>
          </div>

          <Input
            label="Paciente *"
            placeholder="Nome do paciente..."
            value={uploadForm.paciente}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
              handleUploadChange('paciente', val);
            }}
            maxLength={80}
            error={uploadErrors.paciente}
          />

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

          <Select
            label="Momento *"
            options={momentoOptions}
            placeholder="Selecione..."
            value={uploadForm.momento}
            onChange={(v) => handleUploadChange('momento', v)}
            error={uploadErrors.momento}
          />

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
        title={`Comparativo Antes / Depois${selectedPatient ? ` — ${selectedPatient.name}` : ''}`}
        size="xl"
        footer={<Button variant="outline" onClick={() => setIsCompareOpen(false)}>Fechar</Button>}
      >
        <CompareSection>
          <div style={{ marginBottom: 20 }}>
            <Select label="Selecionar Paciente" options={mockPatients.map(p => ({ value: String(p.id), label: p.name }))} placeholder="Selecione o paciente..." />
          </div>
          <div style={{ marginBottom: 20 }}>
            <Select label="Procedimento" options={procedureOptions} placeholder="Todos os procedimentos..." />
          </div>
          <CompareGrid>
            <CompareSide>
              <CompareSideLabel $tipo="antes">Antes</CompareSideLabel>
              <CompareImg $color="#BBA188">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>Selecione uma foto</span>
              </CompareImg>
              <Input label="Data (Antes)" type="date" />
            </CompareSide>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#BBA188', fontWeight: 700 }}>↔</div>
            <CompareSide>
              <CompareSideLabel $tipo="depois">Depois</CompareSideLabel>
              <CompareImg $color="#a8906f">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>Selecione uma foto</span>
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