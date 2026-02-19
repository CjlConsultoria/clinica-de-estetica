'use client';

import { useState } from 'react';
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
  TimelineList, TimelineItem, TimelineDot, TimelineContent, TimelineDate, TimelineText,
  DetailSection, DetailSectionTitle, DetailGrid, DetailItem, DetailLabel, DetailValue,
  UsageTh, UsageTr, UsageTd,
} from './styles';

const categoryOptions = [
  { value: 'toxina',        label: 'Toxina Botulínica' },
  { value: 'preenchimento', label: 'Preenchimento'      },
  { value: 'bioestimulador',label: 'Bioestimulador'     },
  { value: 'fio',           label: 'Fio de PDO'         },
  { value: 'skincare',      label: 'Skincare/Pele'      },
  { value: 'descartavel',   label: 'Descartável'        },
];

const statusOptions = [
  { value: 'ativo',      label: 'Ativo'      },
  { value: 'esgotado',   label: 'Esgotado'   },
  { value: 'vencido',    label: 'Vencido'    },
  { value: 'descartado', label: 'Descartado' },
];

const filterStatus     = ['Todos', 'Ativo', 'Esgotado', 'Vencido', 'Descartado'];
const filterCategories = ['Todas', 'Toxina Botulínica', 'Preenchimento', 'Bioestimulador', 'Fio de PDO', 'Skincare/Pele'];

const mockLotes = [
  {
    id: 1,
    lote: 'LOT-2024-BTX-001',
    produto: 'Toxina Botulínica Allergan 100U',
    categoria: 'Toxina Botulínica',
    fabricante: 'Allergan',
    fornecedor: 'Biolab',
    dataEntrada: '10/01/2025',
    dataFabricacao: '01/06/2024',
    dataValidade: '2025-06-15',
    quantidadeEntrada: 10,
    quantidadeAtual: 8,
    unidade: 'fr',
    registroAnvisa: '1.0309.0198.001-9',
    status: 'ativo',
    usos: [
      { data: '18/02/2025', paciente: 'Ana Beatriz Costa', procedimento: 'Botox Facial',   profissional: 'Maria Oliveira', quantidade: 1 },
      { data: '15/02/2025', paciente: 'Carla Mendonça',    procedimento: 'Botox Testa',    profissional: 'Maria Oliveira', quantidade: 1 },
    ],
  },
  {
    id: 2,
    lote: 'LOT-2024-BTX-002',
    produto: 'Toxina Botulínica Medytoxin 200U',
    categoria: 'Toxina Botulínica',
    fabricante: 'Hugel',
    fornecedor: 'MedEsthetics',
    dataEntrada: '20/01/2025',
    dataFabricacao: '01/09/2024',
    dataValidade: '2025-04-20',
    quantidadeEntrada: 5,
    quantidadeAtual: 2,
    unidade: 'fr',
    registroAnvisa: '1.0309.0230.001-1',
    status: 'critico',
    usos: [
      { data: '10/02/2025', paciente: 'Fernanda Lima',  procedimento: 'Botox Facial',    profissional: 'Clara Andrade', quantidade: 2 },
      { data: '05/02/2025', paciente: 'Marina Souza',   procedimento: 'Toxina Bruxismo', profissional: 'Clara Andrade', quantidade: 1 },
    ],
  },
  {
    id: 3,
    lote: 'LOT-2024-PRE-001',
    produto: 'Ácido Hialurônico Juvederm 1ml',
    categoria: 'Preenchimento',
    fabricante: 'Allergan',
    fornecedor: 'Allergan Brasil',
    dataEntrada: '05/12/2024',
    dataFabricacao: '01/07/2024',
    dataValidade: '2025-08-10',
    quantidadeEntrada: 8,
    quantidadeAtual: 3,
    unidade: 'ser',
    registroAnvisa: '1.0309.0198.003-5',
    status: 'ativo',
    usos: [
      { data: '18/02/2025', paciente: 'Carla Mendonça', procedimento: 'Preenchimento Labial', profissional: 'Maria Oliveira', quantidade: 1 },
      { data: '12/02/2025', paciente: 'Juliana Rocha',  procedimento: 'Preenchimento Malar',  profissional: 'Maria Oliveira', quantidade: 2 },
    ],
  },
  {
    id: 4,
    lote: 'LOT-2024-BIO-001',
    produto: 'Sculptra 150mg',
    categoria: 'Bioestimulador',
    fabricante: 'Galderma',
    fornecedor: 'Galderma Brasil',
    dataEntrada: '15/11/2024',
    dataFabricacao: '01/05/2024',
    dataValidade: '2025-07-22',
    quantidadeEntrada: 4,
    quantidadeAtual: 0,
    unidade: 'fr',
    registroAnvisa: '1.0309.0312.001-7',
    status: 'esgotado',
    usos: [
      { data: '20/01/2025', paciente: 'Roberta Gomes',  procedimento: 'Bioestimulador Facial', profissional: 'Clara Andrade', quantidade: 2 },
      { data: '05/01/2025', paciente: 'Sandra Oliveira', procedimento: 'Bioestimulador',       profissional: 'Clara Andrade', quantidade: 2 },
    ],
  },
  {
    id: 5,
    lote: 'LOT-2024-FIO-001',
    produto: 'Fio PDO Tensor Espiral 19G',
    categoria: 'Fio de PDO',
    fabricante: 'Aesthetic',
    fornecedor: 'Aesthetic Brasil',
    dataEntrada: '01/12/2024',
    dataFabricacao: '01/06/2024',
    dataValidade: '2026-01-10',
    quantidadeEntrada: 10,
    quantidadeAtual: 4,
    unidade: 'cx',
    registroAnvisa: '1.0309.0400.001-2',
    status: 'ativo',
    usos: [
      { data: '14/02/2025', paciente: 'Marina Souza', procedimento: 'Fio PDO Facial', profissional: 'Beatriz Santos', quantidade: 2 },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ativo:      { label: 'Ativo',      color: '#8a7560', bg: '#f0ebe4' },
  critico:    { label: 'Crítico',    color: '#c0392b', bg: '#fdecea' },
  esgotado:   { label: 'Esgotado',   color: '#7f8c8d', bg: '#f0f0f0' },
  vencido:    { label: 'Vencido',    color: '#856404', bg: '#fff3cd' },
  descartado: { label: 'Descartado', color: '#555',    bg: '#eee'    },
};

const catColors: Record<string, string> = {
  'Toxina Botulínica': '#BBA188',
  'Preenchimento':     '#EBD5B0',
  'Bioestimulador':    '#1b1b1b',
  'Fio de PDO':        '#a8906f',
  'Skincare/Pele':     '#8a7560',
  'Descartável':       '#95a5a6',
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function isExpiringSoon(dateStr: string) {
  const diff = (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff <= 30 && diff > 0;
}

function isExpired(dateStr: string) {
  return new Date(dateStr).getTime() < Date.now();
}

type Lote = typeof mockLotes[0];

export default function Lotes() {
  const [search, setSearch]             = useState('');
  const [filterCat, setFilterCat]       = useState('Todas');
  const [filterStat, setFilterStat]     = useState('Todos');
  const [openDropCat, setOpenDropCat]   = useState(false);
  const [openDropStat, setOpenDropStat] = useState(false);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selected, setSelected]         = useState<Lote | null>(null);

  const filtered = mockLotes.filter(l => {
    const matchSearch =
      l.lote.toLowerCase().includes(search.toLowerCase()) ||
      l.produto.toLowerCase().includes(search.toLowerCase()) ||
      l.registroAnvisa.toLowerCase().includes(search.toLowerCase());
    const matchCat  = filterCat  === 'Todas' || l.categoria === filterCat;
    const matchStat = filterStat === 'Todos' || l.status === filterStat.toLowerCase();
    return matchSearch && matchCat && matchStat;
  });

  const totalLotes    = mockLotes.length;
  const ativos        = mockLotes.filter(l => l.status === 'ativo').length;
  const criticos      = mockLotes.filter(l => l.status === 'critico' || isExpiringSoon(l.dataValidade)).length;
  const esgotados     = mockLotes.filter(l => l.status === 'esgotado').length;
  const totalProdutos = mockLotes.reduce((a, l) => a + l.quantidadeAtual, 0);

  return (
    <Container>
      <Header>
        <Title>Controle de Lotes ANVISA</Title>
        <Button
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={() => { setSelected(null); setIsModalOpen(true); }}
        >
          Registrar Lote
        </Button>
      </Header>

      {criticos > 0 && (
        <AlertBanner>
          <AlertBannerIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </AlertBannerIcon>
          <AlertBannerText>
            <strong>{criticos} {criticos === 1 ? 'lote' : 'lotes'}</strong> com validade próxima ou estoque crítico.
          </AlertBannerText>
        </AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Total de Lotes" value={totalLotes} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
        />
        <StatCard label="Lotes Ativos" value={ativos} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="Críticos / A Vencer" value={criticos} color="#e74c3c"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
          trend={{ value: 'Atenção!', positive: false }}
        />
        <StatCard label="Esgotados" value={esgotados} color="#a8906f"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>}
        />
        <StatCard label="Unidades em Estoque" value={totalProdutos} color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled
            placeholder="Buscar por lote, produto ou registro ANVISA..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropCat(!openDropCat); setOpenDropStat(false); }}>
              <span>{filterCat}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropCat && (
              <DropdownList>
                {filterCategories.map(c => (
                  <DropdownItem key={c} $active={filterCat === c} onClick={() => { setFilterCat(c); setOpenDropCat(false); }}>{c}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropStat(!openDropStat); setOpenDropCat(false); }}>
              <span>{filterStat}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropStat && (
              <DropdownList>
                {filterStatus.map(s => (
                  <DropdownItem key={s} $active={filterStat === s} onClick={() => { setFilterStat(s); setOpenDropStat(false); }}>{s}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          {(filterCat !== 'Todas' || filterStat !== 'Todos') && (
            <ClearFilterBtn onClick={() => { setFilterCat('Todas'); setFilterStat('Todos'); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Th $width="14%">Nº do Lote</Th>
                <Th $width="22%">Produto</Th>
                <Th $width="15%">Categoria</Th>
                <Th $width="16%">Registro ANVISA</Th>
                <Th $width="11%">Validade</Th>
                <Th $width="9%">Qtd Atual</Th>
                <Th $width="8%">Status</Th>
                <Th $width="5%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {filtered.length === 0 ? (
                <tr>
                  <Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>
                    Nenhum lote encontrado.
                  </Td>
                </tr>
              ) : filtered.map(lote => (
                <Tr key={lote.id}>
                  <Td>
                    <code style={{ fontSize: '0.78rem', color: '#BBA188', fontWeight: 700 }}>{lote.lote}</code>
                  </Td>
                  <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {lote.produto}
                    {isExpiringSoon(lote.dataValidade) && (
                      <span style={{ marginLeft: 6, fontSize: '0.7rem', background: '#fff3cd', color: '#856404', borderRadius: 6, padding: '2px 7px', fontWeight: 600 }}>A vencer</span>
                    )}
                    {isExpired(lote.dataValidade) && (
                      <span style={{ marginLeft: 6, fontSize: '0.7rem', background: '#fdecea', color: '#c0392b', borderRadius: 6, padding: '2px 7px', fontWeight: 600 }}>Vencido</span>
                    )}
                  </Td>
                  <Td>
                    <Badge $bg={`${catColors[lote.categoria]}18`} $color={catColors[lote.categoria]}>{lote.categoria}</Badge>
                  </Td>
                  <Td style={{ fontSize: '0.78rem', color: '#666', fontFamily: 'monospace' }}>{lote.registroAnvisa}</Td>
                  <Td style={{
                    color: isExpiringSoon(lote.dataValidade) ? '#d68a00' : isExpired(lote.dataValidade) ? '#c0392b' : '#555',
                    fontWeight: isExpiringSoon(lote.dataValidade) ? 600 : 400,
                  }}>
                    {formatDate(lote.dataValidade)}
                  </Td>
                  <Td style={{ fontWeight: 700, color: lote.quantidadeAtual === 0 ? '#e74c3c' : '#1a1a1a' }}>
                    {lote.quantidadeAtual} <span style={{ color: '#aaa', fontWeight: 400, fontSize: '0.8rem' }}>{lote.unidade}</span>
                  </Td>
                  <Td>
                    <Badge $bg={statusConfig[lote.status]?.bg} $color={statusConfig[lote.status]?.color}>
                      {statusConfig[lote.status]?.label}
                    </Badge>
                  </Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="Ver rastreabilidade" onClick={() => { setSelected(lote); setIsDetailOpen(true); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </IconBtn>
                      <IconBtn title="Editar" onClick={() => { setSelected(lote); setIsModalOpen(true); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </IconBtn>
                    </ActionGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
      </div>

      {/* Modal Registrar / Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selected ? 'Editar Lote' : 'Registrar Novo Lote'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary">Salvar Lote</Button>
          </>
        }
      >
        <FormGrid>
          <Input label="Número do Lote"   placeholder="Ex: LOT-2025-BTX-001"    defaultValue={selected?.lote} />
          <Input label="Registro ANVISA"  placeholder="Ex: 1.0309.0198.001-9"   defaultValue={selected?.registroAnvisa} />
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Nome do Produto" placeholder="Nome completo do produto..." defaultValue={selected?.produto} />
          </div>
          <Select label="Categoria"   options={categoryOptions} placeholder="Selecione..." />
          <Input  label="Fabricante"  placeholder="Nome do fabricante"           defaultValue={selected?.fabricante} />
          <Input  label="Fornecedor"  placeholder="Nome do fornecedor"           defaultValue={selected?.fornecedor} />
          <Input  label="Qtd. Entrada" type="number" placeholder="0"            defaultValue={selected?.quantidadeEntrada?.toString()} />
          <Input  label="Data de Fabricação" type="date"                         defaultValue={selected?.dataFabricacao} />
          <Input  label="Data de Validade"   type="date"                         defaultValue={selected?.dataValidade} />
          <Input  label="Data de Entrada"    type="date"                         defaultValue={selected?.dataEntrada} />
          <Select label="Status"      options={statusOptions}   placeholder="Selecione..." />
        </FormGrid>
      </Modal>

      {/* Modal Rastreabilidade */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Rastreabilidade — ${selected?.lote}`}
        size="xl"
        footer={<Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>}
      >
        {selected && (
          <>
            <DetailSection>
              <DetailSectionTitle>Informações do Lote</DetailSectionTitle>
              <DetailGrid>
                <DetailItem><DetailLabel>Nº do Lote</DetailLabel><DetailValue $highlight>{selected.lote}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Registro ANVISA</DetailLabel><DetailValue>{selected.registroAnvisa}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Produto</DetailLabel><DetailValue>{selected.produto}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Categoria</DetailLabel><DetailValue>{selected.categoria}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Fabricante</DetailLabel><DetailValue>{selected.fabricante}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Fornecedor</DetailLabel><DetailValue>{selected.fornecedor}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Data de Fabricação</DetailLabel><DetailValue>{selected.dataFabricacao}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Data de Validade</DetailLabel><DetailValue $warn={isExpiringSoon(selected.dataValidade)}>{formatDate(selected.dataValidade)}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Qtd. Entrada</DetailLabel><DetailValue>{selected.quantidadeEntrada} {selected.unidade}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Qtd. Atual</DetailLabel><DetailValue $highlight>{selected.quantidadeAtual} {selected.unidade}</DetailValue></DetailItem>
              </DetailGrid>
            </DetailSection>

            <DetailSection>
              <DetailSectionTitle>Rastreabilidade de Uso por Procedimento</DetailSectionTitle>
              <TimelineList>
                {selected.usos.map((uso, i) => (
                  <TimelineItem key={i}>
                    <TimelineDot />
                    <TimelineContent>
                      <TimelineDate>{uso.data}</TimelineDate>
                      <TimelineText>
                        <strong>{uso.paciente}</strong> — {uso.procedimento}
                        <span style={{ marginLeft: 8, color: '#BBA188', fontSize: '0.8rem' }}>Prof: {uso.profissional}</span>
                        <span style={{ marginLeft: 8, color: '#999', fontSize: '0.8rem' }}>{uso.quantidade} {selected.unidade} utilizado(s)</span>
                      </TimelineText>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </TimelineList>

              <div style={{ marginTop: 20, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #BBA188, #a8906f)' }}>
                      <UsageTh>Data</UsageTh>
                      <UsageTh>Paciente</UsageTh>
                      <UsageTh>Procedimento</UsageTh>
                      <UsageTh>Profissional</UsageTh>
                      <UsageTh>Qtd Usada</UsageTh>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.usos.map((uso, i) => (
                      <UsageTr key={i}>
                        <UsageTd>{uso.data}</UsageTd>
                        <UsageTd style={{ fontWeight: 600 }}>{uso.paciente}</UsageTd>
                        <UsageTd>{uso.procedimento}</UsageTd>
                        <UsageTd>{uso.profissional}</UsageTd>
                        <UsageTd>{uso.quantidade} {selected.unidade}</UsageTd>
                      </UsageTr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DetailSection>
          </>
        )}
      </Modal>
    </Container>
  );
}