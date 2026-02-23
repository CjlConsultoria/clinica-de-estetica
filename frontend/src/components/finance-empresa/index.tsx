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
import PaymentModal from '@/components/modals/paymentModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { usePaymentStatus } from '@/components/ui/hooks/usePaymentStatus';
import AccessDenied from '@/components/ui/AccessDenied';
import { MOCK_COMPANIES } from '@/types/auth';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  FormGrid, TypeBadge, ChartSection, ChartTitle, BarChart, BarItem, BarFill, BarLabel,
  FaturaSection, FaturaCard, FaturaHeader, FaturaStatus, FaturaInfo, FaturaRow,
  FaturaLabel, FaturaValue, FaturaActions,
} from '@/components/finance/styles';

const typeOptions      = [{value:'receita',label:'Receita'},{value:'despesa',label:'Despesa'}];
const categoryOptions  = [{value:'procedimento',label:'Procedimento'},{value:'produto',label:'Produto'},{value:'aluguel',label:'Aluguel'},{value:'insumo',label:'Insumo'},{value:'comissao',label:'Comissão'},{value:'outros',label:'Outros'}];
const pagamentoOptions = [{value:'pix',label:'Pix'},{value:'cartao_cred',label:'Cartão de Crédito'},{value:'cartao_deb',label:'Cartão de Débito'},{value:'dinheiro',label:'Dinheiro'},{value:'transferencia',label:'Transferência Bancária'}];
const filterTypes      = ['Todos','Receita','Despesa'];
const filterMonths     = ['Todos','Janeiro','Fevereiro','Março','Abril','Maio','Junho'];

const mockFinance = [
  {id:1, date:'18/02/2025',description:'Botox Facial - Ana Costa',         type:'receita' as const,category:'Procedimento',value:800, patient:'Ana Costa'     },
  {id:2, date:'18/02/2025',description:'Preenchimento Labial - Carla M.',  type:'receita' as const,category:'Procedimento',value:1200,patient:'Carla Mendonça'},
  {id:3, date:'17/02/2025',description:'Reposição de Insumos ANVISA',      type:'despesa' as const,category:'Insumo',      value:2340,patient:null            },
  {id:4, date:'16/02/2025',description:'Bioestimulador - Fernanda Lima',   type:'receita' as const,category:'Procedimento',value:2500,patient:'Fernanda Lima' },
  {id:5, date:'15/02/2025',description:'Aluguel do Espaço',                type:'despesa' as const,category:'Aluguel',     value:3500,patient:null            },
  {id:6, date:'14/02/2025',description:'Fio PDO - Marina Souza',           type:'receita' as const,category:'Procedimento',value:1800,patient:'Marina Souza'  },
  {id:7, date:'13/02/2025',description:'Comissão Profissional - Fevereiro',type:'despesa' as const,category:'Comissão',    value:1280,patient:null            },
  {id:8, date:'12/02/2025',description:'Microagulhamento - Patrícia A.',   type:'receita' as const,category:'Procedimento',value:450, patient:'Patrícia Alves'},
  {id:9, date:'10/02/2025',description:'Toxina Botulínica - Juliana R.',   type:'receita' as const,category:'Procedimento',value:600, patient:'Juliana Rocha' },
  {id:10,date:'08/02/2025',description:'Material de Escritório',           type:'despesa' as const,category:'Outros',      value:180, patient:null            },
  {id:11,date:'08/02/2025',description:'Material de Escritório',           type:'despesa' as const,category:'Outros',      value:180, patient:null            },
  {id:12,date:'08/02/2025',description:'Material de Escritório',           type:'despesa' as const,category:'Outros',      value:180, patient:null            },
];

const monthlyData = [
  {month:'Set',receita:32000,despesa:12000},{month:'Out',receita:35000,despesa:14000},
  {month:'Nov',receita:28000,despesa:11000},{month:'Dez',receita:42000,despesa:15000},
  {month:'Jan',receita:38000,despesa:13500},{month:'Fev',receita:38450,despesa:14300},
];

const FATURAS: Record<string,{
  plano:string;valor:number;vencimento:string;
  status:'pendente'|'pago'|'vencido';competencia:string;
  historico:{mes:string;valor:number;vencimento:string;pago:string;status:'pago'|'vencido'|'pendente'}[];
}> = {
  empresa_a:{
    plano:'Profissional',valor:297.00,vencimento:'05/03/2025',
    status:'pendente',competencia:'Fevereiro 2025',
    historico:[
      {mes:'Janeiro 2025', valor:297.00,vencimento:'05/02/2025',pago:'03/02/2025',status:'pago'   },
      {mes:'Dezembro 2024',valor:297.00,vencimento:'05/01/2025',pago:'04/01/2025',status:'pago'   },
      {mes:'Novembro 2024',valor:297.00,vencimento:'05/12/2024',pago:'07/12/2024',status:'pago'   },
      {mes:'Outubro 2024', valor:297.00,vencimento:'05/11/2024',pago:'—',         status:'vencido'},
      {mes:'Setembro 2024',valor:297.00,vencimento:'05/10/2024',pago:'02/10/2024',status:'pago'   },
    ],
  },
  empresa_b:{
    plano:'Starter',valor:97.00,vencimento:'10/01/2025',
    status:'vencido',competencia:'Janeiro 2025',
    historico:[
      {mes:'Dezembro 2024',valor:97.00,vencimento:'10/01/2025',pago:'—',         status:'vencido'},
      {mes:'Novembro 2024',valor:97.00,vencimento:'10/12/2024',pago:'08/12/2024',status:'pago'   },
      {mes:'Outubro 2024', valor:97.00,vencimento:'10/11/2024',pago:'09/11/2024',status:'pago'   },
      {mes:'Setembro 2024',valor:97.00,vencimento:'10/10/2024',pago:'10/10/2024',status:'pago'   },
      {mes:'Agosto 2024',  valor:97.00,vencimento:'10/09/2024',pago:'08/09/2024',status:'pago'   },
    ],
  },
};

const DEFAULT_FATURA = FATURAS['empresa_a'];
const fmt = (v:number)=>v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

type LancamentoField = 'tipo'|'categoria'|'descricao'|'valor'|'data'|'pagamento';
interface LancamentoForm{tipo:string;categoria:string;descricao:string;valor:string;data:string;paciente:string;pagamento:string;}
const LANCAMENTO_INITIAL:LancamentoForm={tipo:'',categoria:'',descricao:'',valor:'',data:'',paciente:'',pagamento:''};
const LANCAMENTO_VALIDATION_FIELDS=[
  {key:'tipo'      as LancamentoField,validate:(v:string)=>!v?'Selecione o tipo (Receita ou Despesa)':null},
  {key:'categoria' as LancamentoField,validate:(v:string)=>!v?'Selecione uma categoria':null},
  {key:'descricao' as LancamentoField,validate:(v:string)=>!v.trim()?'Descrição é obrigatória':null},
  {key:'valor'     as LancamentoField,validate:(v:string)=>!v.trim()||v==='R$ 0,00'?'Informe o valor do lançamento':null},
  {key:'data'      as LancamentoField,validate:(v:string)=>!v?'Data é obrigatória':null},
  {key:'pagamento' as LancamentoField,validate:(v:string)=>!v?'Selecione a forma de pagamento':null},
];
const ITEMS_PER_PAGE   = 10;
const TABLE_MIN_HEIGHT = 540;

function isLancFormDirty(form:LancamentoForm){
  return form.tipo!==''||form.categoria!==''||form.descricao.trim()!==''||form.valor.trim()!==''||form.data!==''||form.paciente.trim()!==''||form.pagamento!=='';
}

const statusConfig={
  pago:    {label:'Pago',    bg:'rgba(138,117,96,0.12)', color:'#8a7560'},
  pendente:{label:'Pendente',bg:'rgba(234,179,8,0.12)',  color:'#ca8a04'},
  vencido: {label:'Vencido', bg:'rgba(231,76,60,0.12)',  color:'#e74c3c'},
};

const IcoExport = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IcoPlus   = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>;
const IcoCard   = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const IcoDown   = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

export default function FinanceEmpresa() {
  const {can,isSuperAdmin,companyId} = usePermissions();
  const {isBlocked}                  = usePaymentStatus();

  const [search,        setSearch]        = useState('');
  const [filterType,    setFilterType]    = useState('Todos');
  const [filterMonth,   setFilterMonth]   = useState('Todos');
  const [openDropdown,  setOpenDropdown]  = useState<string|null>(null);
  const [isModalOpen,   setIsModalOpen]   = useState(false);
  const [exporting,     setExporting]     = useState(false);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [showCancelModal,        setShowCancelModal]        = useState(false);
  const [showConfirmModal,       setShowConfirmModal]       = useState(false);
  const [showSuccessModal,       setShowSuccessModal]       = useState(false);
  const [showExportConfirmModal, setShowExportConfirmModal] = useState(false);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [lancForm,      setLancForm]      = useState<LancamentoForm>(LANCAMENTO_INITIAL);
  const [showFaturaSection,setShowFaturaSection]=useState(true);
  const [paidNow,       setPaidNow]       = useState(false);
  const [showPaymentModal,setShowPaymentModal]=useState(false);

  const {errors:lancErrors,validate:lancValidate,clearError:lancClearError,clearAll:lancClearAll}=
    useSequentialValidation<LancamentoField>(LANCAMENTO_VALIDATION_FIELDS);

  if (isSuperAdmin) return null;
  if (!can('financeiro.read')) return <AccessDenied/>;

  const canCreate  = can('financeiro.create');
  const fatura     = (companyId&&FATURAS[companyId])?FATURAS[companyId]:DEFAULT_FATURA;
  const faturaStatus=paidNow?'pago':fatura.status;
  const statusCfg  = statusConfig[faturaStatus];
  const empresaNome= MOCK_COMPANIES.find(c=>c.id===companyId)?.name??'Minha Clínica';

  const totalReceita=mockFinance.filter(f=>f.type==='receita').reduce((a,f)=>a+f.value,0);
  const totalDespesa=mockFinance.filter(f=>f.type==='despesa').reduce((a,f)=>a+f.value,0);
  const saldo       =totalReceita-totalDespesa;
  const maxBar      =Math.max(...monthlyData.map(d=>d.receita));

  const filtered=mockFinance.filter(f=>{
    const matchSearch=f.description.toLowerCase().includes(search.toLowerCase())||(f.patient||'').toLowerCase().includes(search.toLowerCase());
    const matchType  =filterType==='Todos'||f.type===filterType.toLowerCase();
    return matchSearch&&matchType;
  });

  const totalFiltered=filtered.length;
  const totalPages   =Math.max(1,Math.ceil(totalFiltered/ITEMS_PER_PAGE));
  const safePage     =Math.min(currentPage,totalPages);
  const paginatedData=filtered.slice((safePage-1)*ITEMS_PER_PAGE,safePage*ITEMS_PER_PAGE);

  function handleLancChange(field:LancamentoField|'paciente',value:string){
    setLancForm(prev=>({...prev,[field]:value}));
    if(field!=='paciente') lancClearError(field as LancamentoField);
  }
  function handleLancDataChange(raw:string){
    if(!raw){handleLancChange('data','');return;}
    const [yearStr,month,day]=raw.split('-');
    handleLancChange('data',`${(yearStr||'').slice(0,4)}-${month??''}-${day??''}`);
  }
  function handleCancelClick(){isLancFormDirty(lancForm)?setShowCancelModal(true):forceClose();}
  function forceClose(){setLancForm(LANCAMENTO_INITIAL);lancClearAll();setIsModalOpen(false);setShowCancelModal(false);}
  function handleSaveLancClick(){
    const isValid=lancValidate({tipo:lancForm.tipo,categoria:lancForm.categoria,descricao:lancForm.descricao,valor:lancForm.valor,data:lancForm.data,pagamento:lancForm.pagamento});
    if(!isValid)return;
    setShowConfirmModal(true);
  }
  function handleConfirmSave(){setShowConfirmModal(false);setIsModalOpen(false);setLancForm(LANCAMENTO_INITIAL);lancClearAll();setShowSuccessModal(true);}
  const toggle=(name:string)=>setOpenDropdown(prev=>prev===name?null:name);
  const handleExportClick=()=>setShowExportConfirmModal(true);
  const handleConfirmExport=async()=>{
    setShowExportConfirmModal(false);
    try{
      setExporting(true);
      const response=await fetch('/api/relatorios/financeiro',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({transactions:mockFinance,monthlyData,month:'Fevereiro 2025',totalReceita,totalDespesa,saldo})});
      if(!response.ok) throw new Error('Falha ao gerar PDF');
      const blob=await response.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;a.download='relatorio-financeiro-fevereiro-2025.pdf';a.click();
      URL.revokeObjectURL(url);
      setShowExportSuccessModal(true);
    }catch(err){console.error('[Exportar PDF]',err);alert('Erro ao exportar o PDF. Tente novamente.');}finally{setExporting(false);}
  };

  return (
    <Container>
      <Header>
        <Title>Financeiro</Title>
        <div style={{display:'flex',gap:12}}>
          <Button variant="outline" loading={exporting} icon={!exporting?IcoExport:undefined} onClick={handleExportClick}>
            {exporting?'Exportando...':'Exportar PDF'}
          </Button>
          {canCreate&&(
            <Button variant="primary" icon={IcoPlus} onClick={()=>setIsModalOpen(true)}>
              Novo Lançamento
            </Button>
          )}
        </div>
      </Header>

      <FaturaSection style={faturaStatus==='vencido'?{borderLeftColor:'#e74c3c'}:{}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div>
            <h2 style={{margin:0,fontSize:'1rem',fontWeight:700,color:'#1a1a1a',display:'flex',alignItems:'center',gap:8}}>
              Minha Assinatura
              {faturaStatus==='vencido'&&(
                <span style={{fontSize:'0.68rem',fontWeight:700,padding:'2px 8px',borderRadius:20,background:'rgba(231,76,60,0.12)',color:'#e74c3c',fontFamily:'var(--font-metropolis-semibold)'}}>
                  ⚠ Pagamento em atraso
                </span>
              )}
            </h2>
            <p style={{margin:'2px 0 0',fontSize:'0.8rem',color:'#999'}}>Acompanhe sua fatura e histórico de pagamentos do sistema</p>
          </div>
          <button onClick={()=>setShowFaturaSection(v=>!v)} style={{background:'none',border:'none',cursor:'pointer',color:'#BBA188',fontSize:'0.82rem',fontWeight:600,display:'flex',alignItems:'center',gap:6}}>
            {showFaturaSection?'Recolher':'Expandir'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{transform:showFaturaSection?'rotate(180deg)':'none',transition:'0.2s'}}><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>

        {faturaStatus==='vencido'&&(
          <div style={{background:'rgba(231,76,60,0.08)',border:'1.5px solid rgba(231,76,60,0.2)',borderRadius:12,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:12}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" style={{flexShrink:0}}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div style={{flex:1}}>
              <div style={{fontSize:'0.85rem',fontWeight:700,color:'#e74c3c',marginBottom:2}}>Fatura vencida — acesso suspenso</div>
              <div style={{fontSize:'0.78rem',color:'#888'}}>Regularize o pagamento para restaurar o acesso completo ao sistema. Seus dados estão protegidos.</div>
            </div>
            <Button variant="danger" size="sm" onClick={()=>setShowPaymentModal(true)}>
              Pagar Agora
            </Button>
          </div>
        )}

        {showFaturaSection&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <FaturaCard $highlight>
              <FaturaHeader>
                <div>
                  <div style={{fontSize:'0.7rem',color:'#999',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4}}>Fatura Atual</div>
                  <div style={{fontSize:'1rem',fontWeight:700,color:'#1a1a1a'}}>{fatura.competencia}</div>
                </div>
                <FaturaStatus $status={faturaStatus}>{statusCfg.label}</FaturaStatus>
              </FaturaHeader>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:'2rem',fontWeight:800,color:'#BBA188',letterSpacing:'-0.5px'}}>R$ {fmt(fatura.valor)}</div>
                <div style={{fontSize:'0.75rem',color:'#999',marginTop:2}}>Plano {fatura.plano}</div>
              </div>
              <FaturaInfo>
                <FaturaRow><FaturaLabel>Vencimento</FaturaLabel><FaturaValue $alert={faturaStatus==='vencido'}>{fatura.vencimento}</FaturaValue></FaturaRow>
                <FaturaRow><FaturaLabel>Plano</FaturaLabel><FaturaValue>{fatura.plano}</FaturaValue></FaturaRow>
                <FaturaRow><FaturaLabel>Usuários inclusos</FaturaLabel><FaturaValue>Ilimitados</FaturaValue></FaturaRow>
                <FaturaRow><FaturaLabel>Suporte</FaturaLabel><FaturaValue>Prioritário</FaturaValue></FaturaRow>
              </FaturaInfo>
              <FaturaActions>
                {faturaStatus!=='pago'&&(
                  <Button variant="primary" fullWidth icon={IcoCard} onClick={()=>setShowPaymentModal(true)}>
                    Pagar Agora
                  </Button>
                )}
                <Button variant="outline" fullWidth={faturaStatus==='pago'} icon={IcoDown} onClick={()=>setShowPaymentModal(true)}>
                  {faturaStatus==='pago'?'Baixar Comprovante':'Baixar Boleto'}
                </Button>
              </FaturaActions>
            </FaturaCard>

            <FaturaCard>
              <div style={{fontSize:'0.85rem',fontWeight:700,color:'#1a1a1a',marginBottom:14}}>Histórico de Pagamentos</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {fatura.historico.map((h,i)=>{
                  const cfg=statusConfig[h.status];
                  return (
                    <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',background:'#fafafa',borderRadius:10,border:'1px solid #f0f0f0'}}>
                      <div>
                        <div style={{fontSize:'0.8rem',fontWeight:600,color:'#1a1a1a'}}>{h.mes}</div>
                        <div style={{fontSize:'0.7rem',color:'#aaa',marginTop:1}}>Venc. {h.vencimento}{h.status==='pago'?` · Pago em ${h.pago}`:''}</div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <span style={{fontSize:'0.82rem',fontWeight:700,color:'#555'}}>R$ {fmt(h.valor)}</span>
                        <span style={{fontSize:'0.68rem',fontWeight:700,padding:'3px 8px',borderRadius:20,background:cfg.bg,color:cfg.color}}>{cfg.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FaturaCard>
          </div>
        )}
      </FaturaSection>

      <StatsGrid>
        <StatCard label="Receita do Mês"  value={`R$ ${fmt(totalReceita)}`} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} trend={{value:'+8.5% vs mês ant.',positive:true}}/>
        <StatCard label="Despesas do Mês" value={`R$ ${fmt(totalDespesa)}`} color="#e74c3c" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>} trend={{value:'+2.1% vs mês ant.',positive:false}}/>
        <StatCard label="Saldo do Mês"    value={`R$ ${fmt(saldo)}`}        color={saldo>=0?'#8a7560':'#e74c3c'} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}/>
        <StatCard label="Transações"      value={mockFinance.length}         color="#EBD5B0" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}/>
      </StatsGrid>

      <ChartSection>
        <ChartTitle>Receitas vs Despesas — Últimos 6 Meses</ChartTitle>
        <BarChart>
          {monthlyData.map((d,i)=>(
            <BarItem key={i}>
              <div style={{display:'flex',gap:4,alignItems:'flex-end',height:120}}>
                <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',gap:2}}>
                  <BarFill $height={(d.receita/maxBar)*100} $color="#BBA188" title={`Receita: R$ ${fmt(d.receita)}`}/>
                  <BarFill $height={(d.despesa/maxBar)*100} $color="#e74c3c" title={`Despesa: R$ ${fmt(d.despesa)}`}/>
                </div>
              </div>
              <BarLabel>{d.month}</BarLabel>
            </BarItem>
          ))}
        </BarChart>
        <div style={{display:'flex',gap:20,marginTop:12}}>
          {[{label:'Receita',color:'#BBA188'},{label:'Despesa',color:'#e74c3c'}].map(l=>(
            <div key={l.label} style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.8rem',color:'#666'}}>
              <div style={{width:12,height:12,borderRadius:3,background:l.color}}/>{l.label}
            </div>
          ))}
        </div>
      </ChartSection>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por descrição ou paciente..." value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1);}}/>
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={()=>toggle('type')}><span>{filterType}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropdown==='type'&&(<DropdownList>{filterTypes.map(t=>(<DropdownItem key={t} $active={filterType===t} onClick={()=>{setFilterType(t);toggle('type');setCurrentPage(1);}}>{t}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={()=>toggle('month')}><span>{filterMonth}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropdown==='month'&&(<DropdownList>{filterMonths.map(m=>(<DropdownItem key={m} $active={filterMonth===m} onClick={()=>{setFilterMonth(m);toggle('month');setCurrentPage(1);}}>{m}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          {(filterType!=='Todos'||filterMonth!=='Todos')&&(<ClearFilterBtn onClick={()=>{setFilterType('Todos');setFilterMonth('Todos');setCurrentPage(1);}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
        </FilterRow>
      </Controls>

      <div style={{background:'white',borderRadius:16,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <TableWrapper style={{minHeight:TABLE_MIN_HEIGHT}}>
          <Table>
            <Thead>
              <tr><Th $width="12%">Data</Th><Th $width="32%">Descrição</Th><Th $width="15%">Categoria</Th><Th $width="10%">Tipo</Th><Th $width="14%">Valor</Th><Th $width="11%">Paciente</Th><Th $width="6%">Ações</Th></tr>
            </Thead>
            <Tbody>
              {paginatedData.length===0?(
                <tr><Td colSpan={7} style={{textAlign:'center',padding:'48px 0',color:'#bbb'}}>Nenhum lançamento encontrado.</Td></tr>
              ):paginatedData.map(f=>(
                <Tr key={f.id}>
                  <Td style={{color:'#888'}}>{f.date}</Td>
                  <Td style={{fontWeight:500,color:'#1a1a1a'}}>{f.description}</Td>
                  <Td><Badge $bg="rgba(187,161,136,0.12)" $color="#a8906f">{f.category}</Badge></Td>
                  <Td><TypeBadge $type={f.type}><span style={{fontSize:'0.72rem'}}>{f.type==='receita'?'↑':'↓'}</span>{f.type==='receita'?' Receita':' Despesa'}</TypeBadge></Td>
                  <Td style={{fontWeight:700,color:f.type==='receita'?'#BBA188':'#e74c3c',fontSize:'0.85rem'}}>{f.type==='receita'?'+':'-'} R$ {fmt(f.value)}</Td>
                  <Td style={{color:'#777'}}>{f.patient||'—'}</Td>
                  <Td><ActionGroup>{canCreate&&<IconBtn><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></IconBtn>}</ActionGroup></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage}/>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCancelClick} closeOnOverlayClick={false} title="Novo Lançamento" size="md"
        footer={<><Button variant="outline" onClick={handleCancelClick}>Cancelar</Button><Button variant="primary" onClick={handleSaveLancClick}>Salvar</Button></>}>
        <FormGrid>
          <Select label="Tipo *" options={typeOptions} placeholder="Selecione..." value={lancForm.tipo} onChange={v=>handleLancChange('tipo',v)} error={lancErrors.tipo}/>
          <Select label="Categoria *" options={categoryOptions} placeholder="Selecione..." value={lancForm.categoria} onChange={v=>handleLancChange('categoria',v)} error={lancErrors.categoria}/>
          <div style={{gridColumn:'span 2'}}><Input label="Descrição *" placeholder="Descreva o lançamento..." value={lancForm.descricao} onChange={e=>handleLancChange('descricao',e.target.value)} maxLength={150} error={lancErrors.descricao}/></div>
          <Input label="Valor (R$) *" mask="moeda" value={lancForm.valor} inputMode="numeric" maxLength={14} onValueChange={v=>handleLancChange('valor',v)} error={lancErrors.valor}/>
          <Input label="Data *" type="date" value={lancForm.data} onChange={e=>handleLancDataChange(e.target.value)} error={lancErrors.data}/>
          <Select label="Forma de Pagamento *" options={pagamentoOptions} placeholder="Selecione..." value={lancForm.pagamento} onChange={v=>handleLancChange('pagamento',v)} error={lancErrors.pagamento}/>
          <Input label="Paciente (opcional)" placeholder="Nome do paciente..." value={lancForm.paciente} onChange={e=>handleLancChange('paciente',e.target.value)} maxLength={80}/>
        </FormGrid>
      </Modal>

      <CancelModal isOpen={showCancelModal} title="Deseja cancelar?" message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas." onConfirm={forceClose} onCancel={()=>setShowCancelModal(false)}/>
      <ConfirmModal isOpen={showConfirmModal} title="Salvar lançamento?" message={`Deseja registrar este lançamento de ${lancForm.tipo==='receita'?'receita':'despesa'}${lancForm.descricao?`: "${lancForm.descricao}"`:''}}?`} confirmText="Confirmar" cancelText="Voltar" onConfirm={handleConfirmSave} onCancel={()=>setShowConfirmModal(false)}/>
      <SucessModal isOpen={showSuccessModal} title="Sucesso!" message="Lançamento registrado com sucesso!" onClose={()=>setShowSuccessModal(false)} buttonText="Continuar"/>
      <ConfirmModal isOpen={showExportConfirmModal} title="Exportar PDF?" message="Deseja exportar o relatório financeiro em PDF?" confirmText="Exportar" cancelText="Cancelar" onConfirm={handleConfirmExport} onCancel={()=>setShowExportConfirmModal(false)}/>
      <SucessModal isOpen={showExportSuccessModal} title="PDF exportado!" message="Relatório financeiro exportado com sucesso!" onClose={()=>setShowExportSuccessModal(false)} buttonText="Continuar"/>

      <PaymentModal
        isOpen={showPaymentModal}
        fatura={{
          empresaId:   companyId??'empresa_a',
          empresaNome: empresaNome,
          plano:       fatura.plano,
          valor:       fatura.valor,
          competencia: fatura.competencia,
          vencimento:  fatura.vencimento,
        }}
        onClose={()=>setShowPaymentModal(false)}
        onSuccess={(_method)=>{setPaidNow(true);setShowPaymentModal(false);}}
      />
    </Container>
  );
}