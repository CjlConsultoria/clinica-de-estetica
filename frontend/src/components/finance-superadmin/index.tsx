'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import PaymentModal, { FaturaInfo } from '@/components/modals/paymentModal';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import AccessDenied from '@/components/ui/AccessDenied';
import {
  Container, Header, Title, StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td,
  Badge, ActionGroup, IconBtn, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  ChartSection, ChartTitle, BarChart, BarItem, BarFill, BarLabel, FormGrid,
} from '@/components/finance/styles';

type PlanType     = 'Starter'|'Profissional'|'Enterprise';
type StatusFatura = 'pago'|'pendente'|'vencido'|'cancelado';

interface Empresa {
  id:string;nome:string;email:string;plano:PlanType;valor:number;
  vencimento:string;status:StatusFatura;dataInicio:string;
  proximaCobranca:string;ativo:boolean;usuarios:number;
}
interface HistoricoFatura {
  id:number;empresaId:string;empresaNome:string;competencia:string;
  valor:number;vencimento:string;pagamento:string|null;status:StatusFatura;plano:PlanType;
}

const EMPRESAS_INICIAL: Empresa[] = [
  {id:'empresa_a',nome:'Clínica Estética A',email:'admin@empresa-a.com',plano:'Profissional',valor:297.00,vencimento:'05/03/2025',status:'pendente', dataInicio:'01/03/2024',proximaCobranca:'05/03/2025',ativo:true, usuarios:8 },
  {id:'empresa_b',nome:'Clínica Estética B',email:'admin@empresa-b.com',plano:'Starter',     valor:97.00, vencimento:'10/01/2025',status:'vencido',  dataInicio:'15/06/2024',proximaCobranca:'10/02/2025',ativo:true, usuarios:3 },
  {id:'empresa_c',nome:'Studio Beauty C',   email:'admin@studio-c.com', plano:'Enterprise',  valor:697.00,vencimento:'01/03/2025',status:'vencido',  dataInicio:'10/01/2024',proximaCobranca:'01/04/2025',ativo:true, usuarios:22},
  {id:'empresa_d',nome:'Clínica Skin D',    email:'contato@skin-d.com', plano:'Starter',     valor:97.00, vencimento:'20/02/2025',status:'cancelado',dataInicio:'05/08/2024',proximaCobranca:'—',         ativo:false,usuarios:2 },
  {id:'empresa_e',nome:'Espaço Beleza E',   email:'fin@espacoe.com',    plano:'Profissional',valor:297.00,vencimento:'15/03/2025',status:'pendente', dataInicio:'20/11/2024',proximaCobranca:'15/03/2025',ativo:true, usuarios:6 },
];

const mockHistoricoInicial: HistoricoFatura[] = [
  {id:1, empresaId:'empresa_a',empresaNome:'Clínica Estética A',competencia:'Fevereiro 2025',valor:297.00,vencimento:'05/03/2025',pagamento:null,        status:'pendente', plano:'Profissional'},
  {id:2, empresaId:'empresa_b',empresaNome:'Clínica Estética B',competencia:'Janeiro 2025',  valor:97.00, vencimento:'10/01/2025',pagamento:null,        status:'vencido',  plano:'Starter'     },
  {id:3, empresaId:'empresa_c',empresaNome:'Studio Beauty C',   competencia:'Fevereiro 2025',valor:697.00,vencimento:'01/03/2025',pagamento:null,        status:'vencido',  plano:'Enterprise'  },
  {id:4, empresaId:'empresa_a',empresaNome:'Clínica Estética A',competencia:'Janeiro 2025',  valor:297.00,vencimento:'05/02/2025',pagamento:'03/02/2025',status:'pago',     plano:'Profissional'},
  {id:5, empresaId:'empresa_b',empresaNome:'Clínica Estética B',competencia:'Dezembro 2024', valor:97.00, vencimento:'10/01/2025',pagamento:'09/01/2025',status:'pago',     plano:'Starter'     },
  {id:6, empresaId:'empresa_c',empresaNome:'Studio Beauty C',   competencia:'Janeiro 2025',  valor:697.00,vencimento:'01/02/2025',pagamento:'31/01/2025',status:'pago',     plano:'Enterprise'  },
  {id:7, empresaId:'empresa_e',empresaNome:'Espaço Beleza E',   competencia:'Fevereiro 2025',valor:297.00,vencimento:'15/03/2025',pagamento:null,        status:'pendente', plano:'Profissional'},
  {id:8, empresaId:'empresa_d',empresaNome:'Clínica Skin D',    competencia:'Janeiro 2025',  valor:97.00, vencimento:'20/01/2025',pagamento:null,        status:'cancelado',plano:'Starter'     },
  {id:9, empresaId:'empresa_a',empresaNome:'Clínica Estética A',competencia:'Dezembro 2024', valor:297.00,vencimento:'05/01/2025',pagamento:'04/01/2025',status:'pago',     plano:'Profissional'},
  {id:10,empresaId:'empresa_c',empresaNome:'Studio Beauty C',   competencia:'Dezembro 2024', valor:697.00,vencimento:'01/01/2025',pagamento:'02/01/2025',status:'pago',     plano:'Enterprise'  },
];

const receitaMensal=[
  {month:'Set',valor:3700},{month:'Out',valor:4100},{month:'Nov',valor:4100},
  {month:'Dez',valor:4485},{month:'Jan',valor:4485},{month:'Fev',valor:4188},
];

const planoOptions  = [{value:'Starter',label:'Starter — R$ 97/mês'},{value:'Profissional',label:'Profissional — R$ 297/mês'},{value:'Enterprise',label:'Enterprise — R$ 697/mês'}];
const statusOptions = [{value:'pago',label:'Pago'},{value:'pendente',label:'Pendente'},{value:'vencido',label:'Vencido'},{value:'cancelado',label:'Cancelado'}];
const PLANO_VALOR: Record<string,number>={Starter:97,Profissional:297,Enterprise:697};
const fmt=(v:number)=>v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

const statusConfig: Record<StatusFatura,{label:string;bg:string;color:string}> = {
  pago:     {label:'Pago',     bg:'rgba(138,117,96,0.12)', color:'#8a7560'},
  pendente: {label:'Pendente', bg:'rgba(234,179,8,0.12)',  color:'#ca8a04'},
  vencido:  {label:'Vencido',  bg:'rgba(231,76,60,0.12)',  color:'#e74c3c'},
  cancelado:{label:'Cancelado',bg:'rgba(150,150,150,0.12)',color:'#888'   },
};
const planConfig: Record<PlanType,{bg:string;color:string}> = {
  Starter:     {bg:'rgba(59,130,246,0.1)',  color:'#3b82f6'},
  Profissional:{bg:'rgba(187,161,136,0.12)',color:'#BBA188'},
  Enterprise:  {bg:'rgba(124,58,237,0.1)', color:'#7c3aed'},
};

const filterStatus=['Todos','Pago','Pendente','Vencido','Cancelado'];
const filterPlanos=['Todos','Starter','Profissional','Enterprise'];
const ITEMS_PER_PAGE=8;
type ActiveTab='visao_geral'|'historico';

function hoje(){
  const d=new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}
function competenciaAtual(){
  const meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const d=new Date(); return `${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Ícones reutilizáveis ──────────────────────────────────────────────────────
const IcoExport  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

export default function FinanceSuperAdmin() {
  const {isSuperAdmin}=usePermissions();

  const [empresas, setEmpresas]  = useState<Empresa[]>(EMPRESAS_INICIAL);
  const [historico,setHistorico] = useState<HistoricoFatura[]>(mockHistoricoInicial);

  const [activeTab,      setActiveTab]      = useState<ActiveTab>('visao_geral');
  const [search,         setSearch]         = useState('');
  const [filterSt,       setFilterSt]       = useState('Todos');
  const [filterPl,       setFilterPl]       = useState('Todos');
  const [openDropdown,   setOpenDropdown]   = useState<string|null>(null);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [selectedEmpresa,setSelectedEmpresa]= useState<Empresa|null>(null);

  const [showPlanoModal,  setShowPlanoModal]  = useState(false);
  const [showConfirmPlano,setShowConfirmPlano]= useState(false);
  const [showSuccessPlano,setShowSuccessPlano]= useState(false);
  const [editPlano,  setEditPlano]  = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editValor,  setEditValor]  = useState('');

  const [showCobrancaModal,  setShowCobrancaModal]   = useState(false);
  const [showConfirmCobranca,setShowConfirmCobranca]  = useState(false);
  const [showSuccessCobranca,setShowSuccessCobranca]  = useState(false);
  const [cobrancaVencimento, setCobrancaVencimento]   = useState('');
  const [cobrancaCompetencia,setCobrancaCompetencia]  = useState('');
  const [cobrancaObs,        setCobrancaObs]          = useState('');

  const [exportando,        setExportando]        = useState(false);

  const [showSuccessDownload,setShowSuccessDownload] = useState(false);
  const [faturaDownloadNome, setFaturaDownloadNome]  = useState('');

  const [showPaymentModal,   setShowPaymentModal]   = useState(false);
  const [paymentFatura,      setPaymentFatura]      = useState<FaturaInfo|null>(null);
  const [selectedHistFatura, setSelectedHistFatura] = useState<HistoricoFatura|null>(null);

  if (!isSuperAdmin) return <AccessDenied/>;

  const empresasAtivas=empresas.filter(e=>e.ativo);
  const totalMRR      =empresasAtivas.reduce((a,e)=>a+e.valor,0);
  const totalPendente =empresas.filter(e=>e.status==='pendente').reduce((a,e)=>a+e.valor,0);
  const totalVencido  =empresas.filter(e=>e.status==='vencido').reduce((a,e)=>a+e.valor,0);
  const totalEmpresas =empresas.length;
  const maxBar        =Math.max(...receitaMensal.map(d=>d.valor));

  const filteredEmpresas =empresas.filter(e=>{
    const matchSearch=e.nome.toLowerCase().includes(search.toLowerCase())||e.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus=filterSt==='Todos'||e.status===filterSt.toLowerCase();
    const matchPlano =filterPl==='Todos'||e.plano===filterPl;
    return matchSearch&&matchStatus&&matchPlano;
  });
  const filteredHistorico=historico.filter(h=>{
    const matchSearch=h.empresaNome.toLowerCase().includes(search.toLowerCase());
    const matchStatus=filterSt==='Todos'||h.status===filterSt.toLowerCase();
    const matchPlano =filterPl==='Todos'||h.plano===filterPl;
    return matchSearch&&matchStatus&&matchPlano;
  });

  const activeList        =activeTab==='visao_geral'?filteredEmpresas:filteredHistorico;
  const totalPages        =Math.max(1,Math.ceil(activeList.length/ITEMS_PER_PAGE));
  const safePage          =Math.min(currentPage,totalPages);
  const paginatedEmpresas =filteredEmpresas.slice((safePage-1)*ITEMS_PER_PAGE,safePage*ITEMS_PER_PAGE);
  const paginatedHistorico=filteredHistorico.slice((safePage-1)*ITEMS_PER_PAGE,safePage*ITEMS_PER_PAGE);

  const toggle=(name:string)=>setOpenDropdown(prev=>prev===name?null:name);

  function openPlanoModal(e:Empresa){setSelectedEmpresa(e);setEditPlano(e.plano);setEditStatus(e.status);setEditValor(String(e.valor));setShowPlanoModal(true);}
  function openCobrancaModal(e:Empresa){setSelectedEmpresa(e);setCobrancaVencimento('');setCobrancaCompetencia(competenciaAtual());setCobrancaObs('');setShowCobrancaModal(true);}

  function openPaymentForEmpresa(e:Empresa){
    setPaymentFatura({empresaId:e.id,empresaNome:e.nome,plano:e.plano,valor:e.valor,competencia:competenciaAtual(),vencimento:e.vencimento});
    setSelectedHistFatura(null); setShowPaymentModal(true);
  }
  function openPaymentForHistorico(h:HistoricoFatura){
    setPaymentFatura({empresaId:h.empresaId,empresaNome:h.empresaNome,plano:h.plano,valor:h.valor,competencia:h.competencia,vencimento:h.vencimento});
    setSelectedHistFatura(h); setShowPaymentModal(true);
  }
  function handlePaymentSuccess(method:string){
    if(!paymentFatura) return;
    const now=hoje();
    setEmpresas(prev=>prev.map(e=>e.id===paymentFatura.empresaId?{...e,status:'pago'}:e));
    if(selectedHistFatura){
      setHistorico(prev=>prev.map(h=>h.id===selectedHistFatura.id?{...h,status:'pago',pagamento:now}:h));
    } else {
      setHistorico(prev=>[{id:prev.length+1,empresaId:paymentFatura.empresaId,empresaNome:paymentFatura.empresaNome,competencia:paymentFatura.competencia,valor:paymentFatura.valor,vencimento:paymentFatura.vencimento,pagamento:now,status:'pago',plano:paymentFatura.plano as PlanType},...prev]);
    }
    setShowPaymentModal(false); setPaymentFatura(null);
  }

  function handleConfirmPlano(){
    if(!selectedEmpresa) return;
    const novoValor=PLANO_VALOR[editPlano]??selectedEmpresa.valor;
    setEmpresas(prev=>prev.map(e=>e.id===selectedEmpresa.id?{...e,plano:editPlano as PlanType,status:editStatus as StatusFatura,valor:novoValor,ativo:editStatus!=='cancelado'}:e));
    setShowConfirmPlano(false);setShowSuccessPlano(true);
  }
  function handleConfirmCobranca(){
    if(!selectedEmpresa) return;
    const novaFatura:HistoricoFatura={id:historico.length+1,empresaId:selectedEmpresa.id,empresaNome:selectedEmpresa.nome,competencia:cobrancaCompetencia||competenciaAtual(),valor:selectedEmpresa.valor,vencimento:cobrancaVencimento?cobrancaVencimento.split('-').reverse().join('/'):hoje(),pagamento:null,status:'pendente',plano:selectedEmpresa.plano};
    setHistorico(prev=>[novaFatura,...prev]);
    setEmpresas(prev=>prev.map(e=>e.id===selectedEmpresa.id?{...e,status:'pendente'}:e));
    setShowConfirmCobranca(false);setShowSuccessCobranca(true);
  }
  async function handleExportClick(){
    setExportando(true);
    await new Promise(r=>setTimeout(r,1200));
    setExportando(false);
  }
  function handleDownloadFatura(h:HistoricoFatura){
    setFaturaDownloadNome(`${h.empresaNome} — ${h.competencia}`);setShowSuccessDownload(true);
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>Cobranças & Assinaturas</Title>
          <p style={{margin:'4px 0 0',fontSize:'0.85rem',color:'#999'}}>
            Gerencie as assinaturas e cobranças de todas as clínicas cadastradas
          </p>
        </div>
        <Button variant="outline" loading={exportando} icon={!exportando?IcoExport:undefined} onClick={handleExportClick}>
          {exportando?'Exportando...':'Exportar Relatório'}
        </Button>
      </Header>

      <StatsGrid>
        <StatCard label="MRR (Receita Mensal Recorrente)" value={`R$ ${fmt(totalMRR)}`}    color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} trend={{value:'+3.2% vs mês ant.',positive:true}}/>
        <StatCard label="A Receber (Pendente)"           value={`R$ ${fmt(totalPendente)}`} color="#ca8a04" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}/>
        <StatCard label="Em Atraso"                      value={`R$ ${fmt(totalVencido)}`}  color="#e74c3c" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}/>
        <StatCard label="Empresas Ativas"                value={`${empresasAtivas.length}/${totalEmpresas}`} color="#EBD5B0" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}/>
      </StatsGrid>

      <ChartSection>
        <ChartTitle>MRR — Últimos 6 Meses</ChartTitle>
        <BarChart>
          {receitaMensal.map((d,i)=>(
            <BarItem key={i}>
              <div style={{display:'flex',gap:4,alignItems:'flex-end',height:120}}>
                <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',gap:2}}>
                  <BarFill $height={(d.valor/maxBar)*100} $color="#BBA188" title={`MRR: R$ ${fmt(d.valor)}`}/>
                </div>
              </div>
              <BarLabel>{d.month}</BarLabel>
            </BarItem>
          ))}
        </BarChart>
        <div style={{display:'flex',gap:20,marginTop:12}}>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.8rem',color:'#666'}}>
            <div style={{width:12,height:12,borderRadius:3,background:'#BBA188'}}/>MRR Total
          </div>
        </div>
      </ChartSection>

      <div style={{display:'flex',gap:0,marginBottom:20,background:'white',borderRadius:12,padding:4,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',width:'fit-content'}}>
        {([['visao_geral','Visão Geral'],['historico','Histórico de Faturas']] as [ActiveTab,string][]).map(([tab,label])=>(
          <button key={tab} onClick={()=>{setActiveTab(tab);setCurrentPage(1);}} style={{padding:'8px 20px',borderRadius:9,border:'none',cursor:'pointer',fontWeight:600,fontSize:'0.85rem',transition:'all 0.2s',background:activeTab===tab?'#BBA188':'transparent',color:activeTab===tab?'white':'#888'}}>{label}</button>
        ))}
      </div>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por clínica ou e-mail..." value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1);}}/>
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={()=>toggle('status')}><span>{filterSt}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropdown==='status'&&(<DropdownList>{filterStatus.map(s=>(<DropdownItem key={s} $active={filterSt===s} onClick={()=>{setFilterSt(s);toggle('status');setCurrentPage(1);}}>{s}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={()=>toggle('plano')}><span>{filterPl}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropdown==='plano'&&(<DropdownList>{filterPlanos.map(p=>(<DropdownItem key={p} $active={filterPl===p} onClick={()=>{setFilterPl(p);toggle('plano');setCurrentPage(1);}}>{p}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          {(filterSt!=='Todos'||filterPl!=='Todos')&&(<ClearFilterBtn onClick={()=>{setFilterSt('Todos');setFilterPl('Todos');setCurrentPage(1);}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
        </FilterRow>
      </Controls>

      {activeTab==='visao_geral'&&(
        <div style={{background:'white',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',overflow:'hidden',display:'flex',flexDirection:'column'}}>
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th $width="20%">Empresa</Th><Th $width="13%">Plano</Th><Th $width="7%">Usuários</Th>
                  <Th $width="11%">Valor/mês</Th><Th $width="11%">Vencimento</Th><Th $width="9%">Status</Th>
                  <Th $width="13%">Próx. Cobrança</Th><Th $width="16%">Ações</Th>
                </tr>
              </Thead>
              <Tbody>
                {paginatedEmpresas.length===0?(
                  <tr><Td colSpan={8} style={{textAlign:'center',padding:'48px 0',color:'#bbb'}}>Nenhuma empresa encontrada.</Td></tr>
                ):paginatedEmpresas.map(e=>{
                  const sc=statusConfig[e.status]; const pc=planConfig[e.plano];
                  return (
                    <Tr key={e.id}>
                      <Td>
                        <div style={{fontWeight:600,color:'#1a1a1a',fontSize:'0.82rem'}}>{e.nome}</div>
                        <div style={{fontSize:'0.72rem',color:'#aaa',marginTop:2}}>{e.email}</div>
                      </Td>
                      <Td><Badge $bg={pc.bg} $color={pc.color}>{e.plano}</Badge></Td>
                      <Td style={{color:'#666',fontSize:'0.82rem'}}>{e.usuarios}</Td>
                      <Td style={{fontWeight:700,color:'#BBA188',fontSize:'0.84rem'}}>R$ {fmt(e.valor)}</Td>
                      <Td style={{color:e.status==='vencido'?'#e74c3c':'#666',fontSize:'0.82rem',fontWeight:e.status==='vencido'?700:400}}>{e.vencimento}</Td>
                      <Td><Badge $bg={sc.bg} $color={sc.color}>{sc.label}</Badge></Td>
                      <Td style={{color:'#888',fontSize:'0.8rem'}}>{e.proximaCobranca}</Td>
                      <Td>
                        <ActionGroup>
                          <IconBtn title="Editar plano / status" onClick={()=>openPlanoModal(e)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </IconBtn>
                          {e.status!=='cancelado'&&(
                            <IconBtn title="Registrar cobrança manual" onClick={()=>openCobrancaModal(e)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                            </IconBtn>
                          )}
                          {(e.status==='vencido'||e.status==='pendente')&&(
                            <IconBtn title="Receber pagamento" style={{color:'#00a86b'}} onClick={()=>openPaymentForEmpresa(e)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </IconBtn>
                          )}
                        </ActionGroup>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableWrapper>
          <Pagination currentPage={safePage} totalItems={filteredEmpresas.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage}/>
        </div>
      )}

      {activeTab==='historico'&&(
        <div style={{background:'white',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',overflow:'hidden',display:'flex',flexDirection:'column'}}>
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th $width="18%">Empresa</Th><Th $width="14%">Competência</Th><Th $width="12%">Plano</Th>
                  <Th $width="11%">Valor</Th><Th $width="11%">Vencimento</Th><Th $width="11%">Pagamento</Th>
                  <Th $width="9%">Status</Th><Th $width="14%">Ações</Th>
                </tr>
              </Thead>
              <Tbody>
                {paginatedHistorico.length===0?(
                  <tr><Td colSpan={8} style={{textAlign:'center',padding:'48px 0',color:'#bbb'}}>Nenhuma fatura encontrada.</Td></tr>
                ):paginatedHistorico.map(h=>{
                  const sc=statusConfig[h.status]; const pc=planConfig[h.plano];
                  return (
                    <Tr key={h.id}>
                      <Td><div style={{fontWeight:600,color:'#1a1a1a',fontSize:'0.82rem'}}>{h.empresaNome}</div></Td>
                      <Td style={{color:'#555',fontSize:'0.82rem'}}>{h.competencia}</Td>
                      <Td><Badge $bg={pc.bg} $color={pc.color}>{h.plano}</Badge></Td>
                      <Td style={{fontWeight:700,color:'#BBA188',fontSize:'0.84rem'}}>R$ {fmt(h.valor)}</Td>
                      <Td style={{color:h.status==='vencido'?'#e74c3c':'#666',fontSize:'0.82rem',fontWeight:h.status==='vencido'?700:400}}>{h.vencimento}</Td>
                      <Td style={{color:h.pagamento?'#8a7560':'#ccc',fontSize:'0.82rem'}}>{h.pagamento||'—'}</Td>
                      <Td><Badge $bg={sc.bg} $color={sc.color}>{sc.label}</Badge></Td>
                      <Td>
                        <ActionGroup>
                          <IconBtn title="Baixar fatura PDF" onClick={()=>handleDownloadFatura(h)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          </IconBtn>
                          {(h.status==='vencido'||h.status==='pendente')&&(
                            <IconBtn title="Receber pagamento desta fatura" style={{color:'#00a86b'}} onClick={()=>openPaymentForHistorico(h)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </IconBtn>
                          )}
                        </ActionGroup>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableWrapper>
          <Pagination currentPage={safePage} totalItems={filteredHistorico.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage}/>
        </div>
      )}

      <Modal isOpen={showPlanoModal} onClose={()=>setShowPlanoModal(false)} closeOnOverlayClick={false} title={`Editar assinatura — ${selectedEmpresa?.nome}`} size="md"
        footer={<><Button variant="outline" onClick={()=>setShowPlanoModal(false)}>Cancelar</Button><Button variant="primary" onClick={()=>{setShowPlanoModal(false);setShowConfirmPlano(true);}}>Salvar Alterações</Button></>}>
        <FormGrid>
          <Select label="Plano *" options={planoOptions} placeholder="Selecione..." value={editPlano} onChange={v=>{setEditPlano(v);setEditValor(String(PLANO_VALOR[v]??''));}}/>
          <Select label="Status *" options={statusOptions} placeholder="Selecione..." value={editStatus} onChange={setEditStatus}/>
          <div style={{gridColumn:'span 2'}}>
            <Input label="Valor mensal (R$) *" mask="moeda" value={editValor?`R$ ${Number(editValor).toLocaleString('pt-BR',{minimumFractionDigits:2})}`:''}  inputMode="numeric" maxLength={14} onValueChange={setEditValor}/>
          </div>
          {selectedEmpresa&&(editPlano!==selectedEmpresa.plano||editStatus!==selectedEmpresa.status)&&(
            <div style={{gridColumn:'span 2',padding:'10px 14px',background:'rgba(187,161,136,0.08)',borderRadius:10,border:'1px solid rgba(187,161,136,0.2)',fontSize:'0.8rem',color:'#888'}}>
              {editPlano!==selectedEmpresa.plano&&<div>Plano: <strong style={{color:'#1a1a1a'}}>{selectedEmpresa.plano}</strong> → <strong style={{color:'#BBA188'}}>{editPlano}</strong></div>}
              {editStatus!==selectedEmpresa.status&&<div style={{marginTop:4}}>Status: <strong style={{color:'#1a1a1a'}}>{selectedEmpresa.status}</strong> → <strong style={{color:'#BBA188'}}>{editStatus}</strong></div>}
            </div>
          )}
        </FormGrid>
      </Modal>

      <Modal isOpen={showCobrancaModal} onClose={()=>setShowCobrancaModal(false)} closeOnOverlayClick={false} title={`Registrar cobrança — ${selectedEmpresa?.nome}`} size="md"
        footer={<><Button variant="outline" onClick={()=>setShowCobrancaModal(false)}>Cancelar</Button><Button variant="primary" onClick={()=>{setShowCobrancaModal(false);setShowConfirmCobranca(true);}}>Registrar</Button></>}>
        <FormGrid>
          <div style={{gridColumn:'span 2',padding:'12px 16px',background:'rgba(187,161,136,0.08)',borderRadius:10,border:'1px solid rgba(187,161,136,0.2)'}}>
            <div style={{fontSize:'0.78rem',color:'#999',marginBottom:4}}>Empresa / Plano / Valor</div>
            <div style={{fontSize:'0.92rem',fontWeight:700,color:'#1a1a1a'}}>{selectedEmpresa?.nome} &nbsp;·&nbsp;<span style={{color:'#BBA188'}}>{selectedEmpresa?.plano}</span> &nbsp;·&nbsp; R$ {fmt(selectedEmpresa?.valor??0)}</div>
          </div>
          <Input label="Data de Vencimento *" type="date" value={cobrancaVencimento} onChange={e=>setCobrancaVencimento(e.target.value)}/>
          <Input label="Competência *" placeholder="Ex: Março 2025" value={cobrancaCompetencia} onChange={e=>setCobrancaCompetencia(e.target.value)} maxLength={20}/>
          <div style={{gridColumn:'span 2'}}><Input label="Observações" placeholder="Observações internas..." value={cobrancaObs} onChange={e=>setCobrancaObs(e.target.value)} maxLength={200}/></div>
        </FormGrid>
      </Modal>

      <ConfirmModal isOpen={showConfirmPlano} title="Salvar alterações?" message={`Deseja atualizar a assinatura de "${selectedEmpresa?.nome}" para o plano ${editPlano} com status "${editStatus}"?`} confirmText="Confirmar" cancelText="Voltar" onConfirm={handleConfirmPlano} onCancel={()=>setShowConfirmPlano(false)}/>
      <SucessModal  isOpen={showSuccessPlano} title="Assinatura atualizada!" message="As alterações foram salvas com sucesso." onClose={()=>setShowSuccessPlano(false)} buttonText="Continuar"/>
      <ConfirmModal isOpen={showConfirmCobranca} title="Registrar cobrança?" message={`Confirma a geração de uma nova cobrança para "${selectedEmpresa?.nome}" com vencimento ${cobrancaVencimento?cobrancaVencimento.split('-').reverse().join('/'):hoje()}?`} confirmText="Confirmar" cancelText="Voltar" onConfirm={handleConfirmCobranca} onCancel={()=>setShowConfirmCobranca(false)}/>
      <SucessModal  isOpen={showSuccessCobranca} title="Cobrança registrada!" message="A cobrança foi gerada e aparece agora no Histórico de Faturas." onClose={()=>setShowSuccessCobranca(false)} buttonText="Continuar"/>
      <SucessModal  isOpen={showSuccessDownload} title="Fatura baixada!" message={`A fatura de "${faturaDownloadNome}" foi preparada para download.`} onClose={()=>setShowSuccessDownload(false)} buttonText="Continuar"/>

      <PaymentModal
        isOpen={showPaymentModal}
        fatura={paymentFatura}
        onClose={()=>{setShowPaymentModal(false);setPaymentFatura(null);}}
        onSuccess={handlePaymentSuccess}
      />
    </Container>
  );
}