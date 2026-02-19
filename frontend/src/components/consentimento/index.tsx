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
  FormGrid, SignatureBox, SignatureCanvas, SignatureLabel,
  TermoViewer, TermoTitle, TermoBody, TermoSection, TermoText,
  AlertBanner, AlertBannerIcon, AlertBannerText,
} from './styles';

const procedureOptions = [
  { value: 'botox',          label: 'Botox Facial'          },
  { value: 'preenchimento',  label: 'Preenchimento Labial'   },
  { value: 'bioestimulador', label: 'Bioestimulador'         },
  { value: 'fio-pdo',        label: 'Fio de PDO'             },
  { value: 'microagulhamento', label: 'Microagulhamento'     },
  { value: 'peeling',        label: 'Peelings Químicos'      },
  { value: 'toxina',         label: 'Toxina Botulínica'      },
];

const filterStatus = ['Todos', 'Assinado', 'Pendente', 'Expirado'];

const mockTermos = [
  {
    id: 1,
    paciente: 'Ana Beatriz Costa',
    procedimento: 'Botox Facial',
    dataCriacao: '18/02/2025',
    dataValidade: '18/02/2026',
    status: 'assinado',
    assinadoEm: '18/02/2025 10:32',
    ip: '177.84.12.45',
    profissional: 'Maria Oliveira',
    versao: 'v2.1',
  },
  {
    id: 2,
    paciente: 'Carla Mendonça',
    procedimento: 'Preenchimento Labial',
    dataCriacao: '15/02/2025',
    dataValidade: '15/02/2026',
    status: 'assinado',
    assinadoEm: '15/02/2025 14:10',
    ip: '189.90.34.21',
    profissional: 'Maria Oliveira',
    versao: 'v2.1',
  },
  {
    id: 3,
    paciente: 'Fernanda Lima',
    procedimento: 'Bioestimulador',
    dataCriacao: '10/02/2025',
    dataValidade: '10/02/2026',
    status: 'pendente',
    assinadoEm: null,
    ip: null,
    profissional: 'Clara Andrade',
    versao: 'v2.1',
  },
  {
    id: 4,
    paciente: 'Marina Souza',
    procedimento: 'Fio de PDO',
    dataCriacao: '05/01/2025',
    dataValidade: '05/01/2026',
    status: 'assinado',
    assinadoEm: '05/01/2025 09:55',
    ip: '201.45.67.88',
    profissional: 'Beatriz Santos',
    versao: 'v2.0',
  },
  {
    id: 5,
    paciente: 'Juliana Rocha',
    procedimento: 'Toxina Botulínica',
    dataCriacao: '10/01/2025',
    dataValidade: '10/01/2026',
    status: 'pendente',
    assinadoEm: null,
    ip: null,
    profissional: 'Maria Oliveira',
    versao: 'v2.1',
  },
  {
    id: 6,
    paciente: 'Patrícia Alves',
    procedimento: 'Microagulhamento',
    dataCriacao: '20/12/2024',
    dataValidade: '20/12/2025',
    status: 'assinado',
    assinadoEm: '20/12/2024 16:20',
    ip: '177.84.98.10',
    profissional: 'Beatriz Santos',
    versao: 'v2.0',
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  assinado: { label: 'Assinado', color: '#8a7560', bg: '#f0ebe4' },
  pendente: { label: 'Pendente', color: '#856404', bg: '#fff3cd' },
  expirado: { label: 'Expirado', color: '#7f8c8d', bg: '#f0f0f0' },
};

type Termo = typeof mockTermos[0];

export default function Consentimento() {
  const [search, setSearch]               = useState('');
  const [filterStat, setFilterStat]       = useState('Todos');
  const [openDropStat, setOpenDropStat]   = useState(false);
  const [isNovoOpen, setIsNovoOpen]       = useState(false);
  const [isViewOpen, setIsViewOpen]       = useState(false);
  const [isSignOpen, setIsSignOpen]       = useState(false);
  const [selected, setSelected]           = useState<Termo | null>(null);
  const [signed, setSigned]               = useState(false);

  const filtered = mockTermos.filter(t => {
    const matchSearch = t.paciente.toLowerCase().includes(search.toLowerCase()) || t.procedimento.toLowerCase().includes(search.toLowerCase());
    const matchStat   = filterStat === 'Todos' || t.status === filterStat.toLowerCase();
    return matchSearch && matchStat;
  });

  const totalTermos  = mockTermos.length;
  const assinados    = mockTermos.filter(t => t.status === 'assinado').length;
  const pendentes    = mockTermos.filter(t => t.status === 'pendente').length;
  const expirados    = mockTermos.filter(t => t.status === 'expirado').length;

  return (
    <Container>
      <Header>
        <Title>Consentimento Digital</Title>
        <Button
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={() => setIsNovoOpen(true)}
        >
          Novo Termo
        </Button>
      </Header>

      {pendentes > 0 && (
        <AlertBanner>
          <AlertBannerIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </AlertBannerIcon>
          <AlertBannerText>
            <strong>{pendentes} {pendentes === 1 ? 'termo' : 'termos'}</strong> aguardando assinatura digital do paciente.
          </AlertBannerText>
        </AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Total de Termos" value={totalTermos} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
        />
        <StatCard label="Assinados" value={assinados} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="Pendentes" value={pendentes} color="#d4a84b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          trend={{ value: 'Aguardando', positive: false }}
        />
        <StatCard label="Expirados" value={expirados} color="#95a5a6"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled
            placeholder="Buscar por paciente ou procedimento..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDropStat(!openDropStat)}>
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
          {filterStat !== 'Todos' && (
            <ClearFilterBtn onClick={() => setFilterStat('Todos')}>
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
                <Th $width="20%">Paciente</Th>
                <Th $width="18%">Procedimento</Th>
                <Th $width="12%">Criado em</Th>
                <Th $width="14%">Assinado em</Th>
                <Th $width="14%">Profissional</Th>
                <Th $width="8%">Versão</Th>
                <Th $width="8%">Status</Th>
                <Th $width="6%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {filtered.map(termo => (
                <Tr key={termo.id}>
                  <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{termo.paciente}</Td>
                  <Td>
                    <Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{termo.procedimento}</Badge>
                  </Td>
                  <Td style={{ color: '#888', fontSize: '0.82rem' }}>{termo.dataCriacao}</Td>
                  <Td style={{ color: '#555', fontSize: '0.82rem' }}>
                    {termo.assinadoEm ?? <span style={{ color: '#ccc' }}>—</span>}
                  </Td>
                  <Td style={{ fontSize: '0.85rem' }}>{termo.profissional}</Td>
                  <Td>
                    <code style={{ fontSize: '0.76rem', color: '#999', background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>{termo.versao}</code>
                  </Td>
                  <Td>
                    <Badge $bg={statusConfig[termo.status]?.bg} $color={statusConfig[termo.status]?.color}>
                      {statusConfig[termo.status]?.label}
                    </Badge>
                  </Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="Ver termo" onClick={() => { setSelected(termo); setIsViewOpen(true); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </IconBtn>
                      {termo.status === 'pendente' && (
                        <IconBtn title="Coletar assinatura" onClick={() => { setSelected(termo); setSigned(false); setIsSignOpen(true); }} style={{ borderColor: '#d4a84b', color: '#d4a84b' }}>
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
      </div>

      {/* Modal: Novo Termo */}
      <Modal
        isOpen={isNovoOpen}
        onClose={() => setIsNovoOpen(false)}
        title="Novo Termo de Consentimento"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNovoOpen(false)}>Cancelar</Button>
            <Button variant="primary">Gerar Termo</Button>
          </>
        }
      >
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Nome do Paciente" placeholder="Nome completo do paciente..." />
          </div>
          <Input label="CPF" placeholder="000.000.000-00" />
          <Input label="Data de Nascimento" type="date" />
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Procedimento" options={procedureOptions} placeholder="Selecione o procedimento..." />
          </div>
          <Input label="Data do Procedimento" type="date" />
          <Input label="Profissional Responsável" placeholder="Nome do profissional..." />
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="E-mail do Paciente (para envio do link de assinatura)" type="email" placeholder="email@exemplo.com" />
          </div>
        </FormGrid>
      </Modal>

      {/* Modal: Visualizar Termo */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Termo de Consentimento"
        size="lg"
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
            <Button variant="outline" icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}>
              Baixar PDF
            </Button>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Fechar</Button>
          </div>
        }
      >
        {selected && (
          <TermoViewer>
            <TermoTitle>TERMO DE CONSENTIMENTO INFORMADO</TermoTitle>
            <TermoText style={{ textAlign: 'center', color: '#999', fontSize: '0.82rem', marginBottom: 24 }}>
              Versão {selected.versao} · Gerado em {selected.dataCriacao}
            </TermoText>

            <TermoSection>
              <h4>Dados do Paciente</h4>
              <p><strong>Nome:</strong> {selected.paciente}</p>
              <p><strong>Procedimento:</strong> {selected.procedimento}</p>
              <p><strong>Profissional Responsável:</strong> {selected.profissional}</p>
            </TermoSection>

            <TermoSection>
              <h4>Descrição do Procedimento</h4>
              <TermoBody>
                Eu, paciente acima identificado(a), declaro que fui devidamente informado(a) sobre o procedimento de <strong>{selected.procedimento}</strong>, seus objetivos, riscos, alternativas e possíveis complicações, tendo compreendido todas as informações prestadas pelo profissional responsável.
              </TermoBody>
              <TermoBody>
                Declaro ainda que as informações por mim fornecidas são verdadeiras, e que não omiti nenhum dado relevante sobre meu estado de saúde, alergias ou medicamentos em uso.
              </TermoBody>
            </TermoSection>

            <TermoSection>
              <h4>Riscos e Complicações</h4>
              <TermoBody>
                Estou ciente de que qualquer procedimento estético pode apresentar riscos e complicações, incluindo mas não se limitando a: reações alérgicas, hematomas, assimetrias temporárias, e em casos raros, complicações mais graves. Fui informado(a) sobre todos esses riscos e aceito submetê-los a este procedimento voluntariamente.
              </TermoBody>
            </TermoSection>

            <TermoSection>
              <h4>Consentimento e Assinatura</h4>
              {selected.status === 'assinado' ? (
                <div style={{ background: '#f0ebe4', borderRadius: 10, padding: 16, border: '1.5px solid #BBA188' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a7560" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span style={{ fontWeight: 700, color: '#8a7560', fontSize: '0.9rem' }}>Assinado Digitalmente</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#666' }}>
                    <p style={{ margin: '4px 0' }}><strong>Paciente:</strong> {selected.paciente}</p>
                    <p style={{ margin: '4px 0' }}><strong>Data/Hora:</strong> {selected.assinadoEm}</p>
                    <p style={{ margin: '4px 0' }}><strong>IP:</strong> {selected.ip}</p>
                    <p style={{ margin: '4px 0' }}><strong>Validade:</strong> {selected.dataValidade}</p>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fff3cd', borderRadius: 10, padding: 16, border: '1.5px solid #ffc107', color: '#856404', fontSize: '0.88rem' }}>
                  ⏳ Aguardando assinatura digital do paciente.
                </div>
              )}
            </TermoSection>
          </TermoViewer>
        )}
      </Modal>

      {/* Modal: Coletar Assinatura */}
      <Modal
        isOpen={isSignOpen}
        onClose={() => setIsSignOpen(false)}
        title={`Assinatura Digital — ${selected?.paciente}`}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsSignOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => { setSigned(true); }} disabled={signed}>
              {signed ? '✓ Assinatura Coletada' : 'Confirmar Assinatura'}
            </Button>
          </>
        }
      >
        <div style={{ marginBottom: 20, fontSize: '0.88rem', color: '#666', lineHeight: 1.6 }}>
          O paciente <strong style={{ color: '#1a1a1a' }}>{selected?.paciente}</strong> deve assinar abaixo para confirmar que leu e concorda com o termo de consentimento para o procedimento de <strong style={{ color: '#BBA188' }}>{selected?.procedimento}</strong>.
        </div>

        <SignatureBox>
          <SignatureLabel>Assine abaixo:</SignatureLabel>
          <SignatureCanvas>
            {signed && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#8a7560' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span style={{ fontWeight: 700 }}>Assinatura registrada</span>
              </div>
            )}
            {!signed && (
              <div style={{ color: '#ccc', fontSize: '0.82rem' }}>Área de assinatura digital</div>
            )}
          </SignatureCanvas>
          {!signed && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                style={{ fontSize: '0.78rem', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setSigned(false)}
              >
                Limpar
              </button>
            </div>
          )}
        </SignatureBox>

        <div style={{ marginTop: 16, padding: 12, background: '#fdf9f5', borderRadius: 10, border: '1px solid #f0ebe4', fontSize: '0.78rem', color: '#888' }}>
          <strong>Registro automático:</strong> IP, data, hora e dispositivo serão salvos para fins legais (LGPD).
        </div>
      </Modal>
    </Container>
  );
}