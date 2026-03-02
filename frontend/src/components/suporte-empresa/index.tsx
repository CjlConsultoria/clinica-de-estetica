'use client';

import { useState, useEffect } from 'react';
import { useRoleRedirect } from '@/components/ui/hooks/useRoleRedirect';
import { listarTicketsPorUsuario, criarTicket, listarMensagens, criarMensagem, atualizarStatusTicket, SuporteTicketAPI, TicketMensagemAPI } from '@/services/suporteService';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import SucessModal from '@/components/modals/sucessModal';
import ConfirmModal from '@/components/modals/confirmModal';
import CancelModal from '@/components/modals/cancelModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';

import {
  Container, Header, Title, Subtitle,
  StatsRow, StatBox, StatBoxValue, StatBoxLabel,
  TabRow, TabBtn,
  Badge, PrioridadeBadge,
  TicketList, TicketCard, TicketCardHeader, TicketCardTitle,
  TicketCardMeta, TicketCardBody,
  DetailWrap, DetailTopBar, DetailTopLeft, DetailTopTitle, DetailTopMeta, BackBtn,
  ChatArea, MsgRow, MsgBubble, MsgAuthor, MsgTime,
  ReplyBox, ReplyTextarea, ReplyFooter,
  FormGrid,
  Btn,
  EmptyState, EmptyIcon,
} from './styles';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type TicketStatus     = 'aberto' | 'em_andamento' | 'resolvido';
type TicketPrioridade = 'alta' | 'media' | 'baixa';
type TicketCategoria  = 'financeiro' | 'tecnico' | 'duvida' | 'bug' | 'outro';
type NovoTicketField  = 'assunto' | 'descricao';

interface Mensagem {
  id: number;
  autor: string;
  fromSupport: boolean;
  texto: string;
  hora: string;
}

interface Ticket {
  id: number;
  assunto: string;
  categoria: TicketCategoria;
  prioridade: TicketPrioridade;
  status: TicketStatus;
  descricao: string;
  data: string;
  mensagens: Mensagem[];
}

// ─── Validações sequenciais (padrão do projeto) ───────────────────────────────

const TICKET_VALIDATION = [
  {
    key:      'assunto' as NovoTicketField,
    validate: (v: string) => !v.trim() ? 'Assunto é obrigatório' : null,
  },
  {
    key:      'descricao' as NovoTicketField,
    validate: (v: string) => !v.trim() ? 'Descrição detalhada é obrigatória' : null,
  },
];

// ─── Configs visuais ──────────────────────────────────────────────────────────

const statusConfig: Record<TicketStatus, { bg: string; color: string; label: string }> = {
  aberto:       { bg: 'rgba(231,76,60,0.1)',   color: '#e74c3c', label: 'Aberto'       },
  em_andamento: { bg: 'rgba(214,138,0,0.1)',   color: '#d68a00', label: 'Em andamento' },
  resolvido:    { bg: 'rgba(138,117,96,0.12)', color: '#8a7560', label: 'Resolvido'    },
};

const prioridadeConfig: Record<TicketPrioridade, { color: string; label: string }> = {
  alta:  { color: '#e74c3c', label: 'Alta'  },
  media: { color: '#d68a00', label: 'Média' },
  baixa: { color: '#8a7560', label: 'Baixa' },
};

const categoriaLabels: Record<TicketCategoria, string> = {
  financeiro: 'Financeiro',
  tecnico:    'Técnico',
  duvida:     'Dúvida',
  bug:        'Bug / Erro',
  outro:      'Outro',
};

const categoriaOptions = [
  { value: 'duvida',     label: 'Dúvida'     },
  { value: 'bug',        label: 'Bug / Erro'  },
  { value: 'financeiro', label: 'Financeiro'  },
  { value: 'tecnico',    label: 'Técnico'     },
  { value: 'outro',      label: 'Outro'       },
];

const prioridadeOptions = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta',  label: 'Alta'  },
];

// ─── Form inicial ─────────────────────────────────────────────────────────────

interface NovoTicketForm {
  assunto:    string;
  categoria:  TicketCategoria;
  prioridade: TicketPrioridade;
  descricao:  string;
}

const FORM_INITIAL: NovoTicketForm = {
  assunto:    '',
  categoria:  'duvida',
  prioridade: 'media',
  descricao:  '',
};

function isFormDirty(form: NovoTicketForm): boolean {
  return form.assunto.trim() !== '' || form.descricao.trim() !== '';
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function SuporteEmpresa() {
  // ── Todos os hooks PRIMEIRO — nunca depois de return ──
  const allowed = useRoleRedirect({ permission: 'suporte.read', blockSuperAdmin: true });
  const { currentUser } = useAuth();

  // ── Estado principal ──
  const [tickets,         setTickets]         = useState<Ticket[]>([]);
  const [filterStatus,    setFilterStatus]    = useState<TicketStatus | 'todos'>('todos');
  const [ticketAberto,    setTicketAberto]    = useState<Ticket | null>(null);
  const [replyText,       setReplyText]       = useState('');

  // ── Modal novo chamado ──
  const [isNovoOpen,      setIsNovoOpen]      = useState(false);
  const [form,            setForm]            = useState<NovoTicketForm>(FORM_INITIAL);
  const [showCancelNovo,  setShowCancelNovo]  = useState(false);
  const [showConfirmNovo, setShowConfirmNovo] = useState(false);

  // ── Validação sequencial — mesmo padrão do historico-paciente ──
  const {
    errors:     ticketErrors,
    validate:   validateTicket,
    clearError: clearTicketError,
    clearAll:   clearTicketAll,
  } = useSequentialValidation<NovoTicketField>(TICKET_VALIDATION);

  // ── Abre ticket e carrega mensagens da API ──
  function abrirTicket(t: Ticket) {
    setTicketAberto(t);
    listarMensagens(t.id).then((data: TicketMensagemAPI[]) => {
      const msgs: Mensagem[] = data.map(m => ({
        id:          m.id,
        autor:       m.autor,
        fromSupport: m.fromSupport,
        texto:       m.texto,
        hora:        m.criadoEm ? new Date(m.criadoEm).toLocaleString('pt-BR') : '—',
      }));
      const atualizado = { ...t, mensagens: msgs.length > 0 ? msgs : t.mensagens };
      setTickets(prev => prev.map(tk => tk.id === t.id ? atualizado : tk));
      setTicketAberto(atualizado);
    }).catch(() => {});
  }

  // ── Modal encerrar ticket ──
  const [confirmFechar, setConfirmFechar] = useState<Ticket | null>(null);

  // ── Modal sucesso ──
  const [sucessModal, setSucessModal] = useState<{ title: string; message: string } | null>(null);

  // ── Carrega tickets do usuário logado ──
  useEffect(() => {
    if (!currentUser?.id) return;
    listarTicketsPorUsuario(currentUser.id).then((data: SuporteTicketAPI[]) => {
      const mapped: Ticket[] = data.map(t => {
        const rawStatus = (t.status || 'aberto').toLowerCase().replace(/\s+/g, '_');
        const status: TicketStatus = rawStatus === 'resolvido' ? 'resolvido' : rawStatus === 'em_andamento' ? 'em_andamento' : 'aberto';
        const rawPrio = (t.prioridade || 'media').toLowerCase();
        const prioridade: TicketPrioridade = rawPrio === 'alta' ? 'alta' : rawPrio === 'baixa' ? 'baixa' : 'media';
        const rawCat = (t.categoria || 'outro').toLowerCase();
        const categoria: TicketCategoria = (['financeiro','tecnico','duvida','bug','outro'] as string[]).includes(rawCat) ? rawCat as TicketCategoria : 'outro';
        return {
          id: t.id,
          assunto: t.titulo,
          categoria,
          prioridade,
          status,
          descricao: t.descricao,
          data: t.criadoEm ? new Date(t.criadoEm).toLocaleDateString('pt-BR') : '—',
          mensagens: [{ id: 1, autor: t.nomeAutor || 'Você', fromSupport: false, texto: t.descricao, hora: t.criadoEm ? new Date(t.criadoEm).toLocaleString('pt-BR') : '—' }],
        };
      });
      setTickets(mapped);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  // ── Guard: só redireciona após o contexto carregar ──
  if (!allowed) return null;

  // ── Derivados ──
  const ticketsFiltrados = filterStatus === 'todos'
    ? tickets
    : tickets.filter(t => t.status === filterStatus);

  const abertos     = tickets.filter(t => t.status === 'aberto').length;
  const emAndamento = tickets.filter(t => t.status === 'em_andamento').length;
  const resolvidos  = tickets.filter(t => t.status === 'resolvido').length;

  // ── Handlers do formulário ──
  function handleFormChange(field: keyof NovoTicketForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    // Limpa o erro do campo ao digitar — idêntico ao padrão do projeto
    if (field === 'assunto' || field === 'descricao') {
      clearTicketError(field as NovoTicketField);
    }
  }

  function handleCancelNovoClick() {
    if (isFormDirty(form)) setShowCancelNovo(true);
    else forceCloseNovo();
  }

  function forceCloseNovo() {
    setForm(FORM_INITIAL);
    clearTicketAll();
    setIsNovoOpen(false);
    setShowCancelNovo(false);
    setShowConfirmNovo(false);
  }

  function handleSaveNovoClick() {
    // validateTicket retorna false e popula errors se inválido
    const ok = validateTicket({
      assunto:   form.assunto,
      descricao: form.descricao,
    });
    if (!ok) return;
    setShowConfirmNovo(true);
  }

  async function handleConfirmNovo() {
    const novo: Ticket = {
      id:         tickets.length + 10,
      assunto:    form.assunto,
      categoria:  form.categoria,
      prioridade: form.prioridade,
      status:     'aberto',
      descricao:  form.descricao,
      data:       'Agora',
      mensagens: [
        {
          id:          1,
          autor:       currentUser?.name ?? 'Você',
          fromSupport: false,
          texto:       form.descricao,
          hora:        'Agora',
        },
      ],
    };
    try {
      const criado = await criarTicket({ titulo: form.assunto, descricao: form.descricao, categoria: form.categoria, prioridade: form.prioridade });
      novo.id = criado.id;
    } catch {}
    setTickets(prev => [novo, ...prev]);
    setShowConfirmNovo(false);
    setIsNovoOpen(false);
    setForm(FORM_INITIAL);
    clearTicketAll();
    setSucessModal({
      title:   'Chamado aberto com sucesso!',
      message: 'Nossa equipe de suporte irá responder em breve. Você pode acompanhar o status aqui.',
    });
  }

  // ── Enviar resposta no chat ──
  function handleReply() {
    if (!replyText.trim() || !ticketAberto) return;
    const texto = replyText.trim();
    const novaMsg: Mensagem = {
      id:          ticketAberto.mensagens.length + 1,
      autor:       currentUser?.name ?? 'Você',
      fromSupport: false,
      texto,
      hora:        'Agora',
    };
    const atualizado = { ...ticketAberto, mensagens: [...ticketAberto.mensagens, novaMsg] };
    setTickets(prev => prev.map(t => t.id === atualizado.id ? atualizado : t));
    setTicketAberto(atualizado);
    setReplyText('');
    criarMensagem(ticketAberto.id, { texto, fromSupport: false }).catch(() => {});
  }

  // ── Fechar ticket ──
  function confirmarFechar() {
    if (!confirmFechar) return;
    const atualizado = { ...confirmFechar, status: 'resolvido' as TicketStatus };
    setTickets(prev => prev.map(t => t.id === atualizado.id ? atualizado : t));
    if (ticketAberto?.id === atualizado.id) setTicketAberto(atualizado);
    setConfirmFechar(null);
    setSucessModal({ title: 'Ticket encerrado', message: 'O ticket foi marcado como resolvido.' });
    atualizarStatusTicket(confirmFechar.id, 'resolvido').catch(() => {});
  }

  // ── View: detalhe do ticket (chat) ──
  if (ticketAberto) {
    const sc = statusConfig[ticketAberto.status];
    const pc = prioridadeConfig[ticketAberto.prioridade];
    return (
      <Container>
        <Header>
          <div>
            <Title>Suporte</Title>
            <Subtitle>Ticket #{ticketAberto.id} · {categoriaLabels[ticketAberto.categoria]}</Subtitle>
          </div>
        </Header>

        <DetailWrap>
          <DetailTopBar>
            <DetailTopLeft>
              <DetailTopTitle>{ticketAberto.assunto}</DetailTopTitle>
              <DetailTopMeta>
                <Badge $bg={sc.bg} $color={sc.color}>{sc.label}</Badge>
                <PrioridadeBadge $color={pc.color}>Prioridade {pc.label}</PrioridadeBadge>
                <span style={{ fontSize: '0.72rem', color: '#bbb' }}>{ticketAberto.data}</span>
              </DetailTopMeta>
            </DetailTopLeft>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexShrink: 0 }}>
              {ticketAberto.status !== 'resolvido' && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmFechar(ticketAberto)}
                >
                  Encerrar ticket
                </Button>
              )}
              <BackBtn onClick={() => setTicketAberto(null)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Voltar
              </BackBtn>
            </div>
          </DetailTopBar>

          <ChatArea>
            {ticketAberto.mensagens.map(msg => (
              <MsgRow key={msg.id} $fromSupport={msg.fromSupport}>
                {msg.fromSupport && <MsgAuthor>Suporte CJL</MsgAuthor>}
                <MsgBubble $fromSupport={msg.fromSupport}>{msg.texto}</MsgBubble>
                <MsgTime>{msg.hora}</MsgTime>
              </MsgRow>
            ))}
          </ChatArea>

          {ticketAberto.status !== 'resolvido' && (
            <ReplyBox>
              <ReplyTextarea
                rows={3}
                placeholder="Escreva sua resposta ou adicione mais informações..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              <ReplyFooter>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  icon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  }
                >
                  Enviar resposta
                </Button>
              </ReplyFooter>
            </ReplyBox>
          )}

          {ticketAberto.status === 'resolvido' && (
            <div style={{ padding: '14px 22px', background: 'rgba(138,117,96,0.06)', textAlign: 'center', fontSize: '0.82rem', color: '#8a7560', fontWeight: 600 }}>
              ✓ Ticket encerrado — obrigado pelo contato!
            </div>
          )}
        </DetailWrap>

        <ConfirmModal
          isOpen={!!confirmFechar}
          title="Encerrar ticket?"
          message="Ao encerrar, o ticket será marcado como resolvido e não poderá mais receber respostas."
          confirmText="Encerrar"
          cancelText="Cancelar"
          onConfirm={confirmarFechar}
          onCancel={() => setConfirmFechar(null)}
        />

        <SucessModal
          isOpen={!!sucessModal}
          title={sucessModal?.title ?? ''}
          message={sucessModal?.message ?? ''}
          onClose={() => setSucessModal(null)}
        />
      </Container>
    );
  }

  // ── View: lista de tickets ──
  return (
    <Container>
      <Header>
        <div>
          <Title>Suporte</Title>
          <Subtitle>Abra chamados e acompanhe o status das suas solicitações</Subtitle>
        </div>
        {currentUser && (currentUser.role === 'company_admin' || currentUser.role === 'gerente') && (
          <Button
            type="button"
            variant="primary"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            }
            onClick={() => setIsNovoOpen(true)}
          >
            Novo chamado
          </Button>
        )}
      </Header>

      <StatsRow>
        <StatBox $color="#e74c3c">
          <StatBoxValue>{abertos}</StatBoxValue>
          <StatBoxLabel>Abertos</StatBoxLabel>
        </StatBox>
        <StatBox $color="#d68a00">
          <StatBoxValue>{emAndamento}</StatBoxValue>
          <StatBoxLabel>Em andamento</StatBoxLabel>
        </StatBox>
        <StatBox $color="#8a7560">
          <StatBoxValue>{resolvidos}</StatBoxValue>
          <StatBoxLabel>Resolvidos</StatBoxLabel>
        </StatBox>
      </StatsRow>

      <TabRow>
        {(['todos', 'aberto', 'em_andamento', 'resolvido'] as const).map(s => (
          <TabBtn
            key={s}
            $active={filterStatus === s}
            $small
            onClick={() => setFilterStatus(s)}
          >
            {s === 'todos'
              ? 'Todos'
              : s === 'aberto'
              ? `Abertos (${abertos})`
              : s === 'em_andamento'
              ? `Em andamento (${emAndamento})`
              : `Resolvidos (${resolvidos})`}
          </TabBtn>
        ))}
      </TabRow>

      {ticketsFiltrados.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎉</EmptyIcon>
          <div style={{ fontWeight: 700, color: '#888' }}>Nenhum ticket encontrado</div>
          <div>Tudo certo por aqui! Se precisar de ajuda, abra um novo chamado.</div>
        </EmptyState>
      ) : (
        <TicketList>
          {ticketsFiltrados.map(t => {
            const sc = statusConfig[t.status];
            const pc = prioridadeConfig[t.prioridade];
            const semResposta = t.mensagens[t.mensagens.length - 1]?.fromSupport === false;
            return (
              <TicketCard key={t.id} $clickable onClick={() => abrirTicket(t)}>
                <TicketCardHeader>
                  <TicketCardTitle>
                    {t.assunto}
                    {semResposta && t.status !== 'resolvido' && (
                      <span style={{
                        display: 'inline-block', marginLeft: 8,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#e74c3c', verticalAlign: 'middle',
                      }} title="Aguardando resposta do suporte" />
                    )}
                  </TicketCardTitle>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <PrioridadeBadge $color={pc.color}>{pc.label}</PrioridadeBadge>
                    <Badge $bg={sc.bg} $color={sc.color}>{sc.label}</Badge>
                  </div>
                </TicketCardHeader>
                <TicketCardMeta>
                  {categoriaLabels[t.categoria]} · {t.data} · {t.mensagens.length} mensagem{t.mensagens.length !== 1 ? 's' : ''}
                </TicketCardMeta>
                <TicketCardBody>{t.descricao}</TicketCardBody>
                <div style={{ marginTop: 12 }}>
                  <Btn $size="sm">Ver conversa →</Btn>
                </div>
              </TicketCard>
            );
          })}
        </TicketList>
      )}

      {/* ── Modal: Novo Chamado ── */}
      <Modal
        isOpen={isNovoOpen}
        onClose={handleCancelNovoClick}
        closeOnOverlayClick={false}
        title="Abrir novo chamado"
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Button type="button" variant="outline" onClick={handleCancelNovoClick}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveNovoClick}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              }
            >
              Enviar chamado
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', maxHeight: '65vh', paddingRight: 4 }}>
          <div>
            <div style={{
              fontSize: '0.78rem', fontWeight: 600, color: '#BBA188',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12,
            }}>
              Dados do chamado
            </div>

            <FormGrid>
              {/* Assunto — campo obrigatório com erro sequencial */}
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Assunto *"
                  placeholder="Ex: Não consigo exportar o relatório de comissões"
                  value={form.assunto}
                  onChange={e => handleFormChange('assunto', e.target.value)}
                  error={ticketErrors.assunto}
                />
              </div>

              {/* Categoria — sem validação obrigatória */}
              <Select
                label="Categoria"
                options={categoriaOptions}
                value={form.categoria}
                onChange={v => handleFormChange('categoria', v as TicketCategoria)}
              />

              {/* Prioridade — sem validação obrigatória */}
              <Select
                label="Prioridade"
                options={prioridadeOptions}
                value={form.prioridade}
                onChange={v => handleFormChange('prioridade', v as TicketPrioridade)}
              />

              {/* Descrição — campo obrigatório com erro sequencial */}
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Descrição detalhada *"
                  placeholder="Descreva o problema com detalhes: o que estava fazendo, qual erro apareceu, em qual parte do sistema..."
                  value={form.descricao}
                  onChange={e => handleFormChange('descricao', e.target.value)}
                  error={ticketErrors.descricao}
                />
              </div>
            </FormGrid>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Cancelar novo chamado ── */}
      <CancelModal
        isOpen={showCancelNovo}
        title="Deseja cancelar?"
        message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas."
        onConfirm={forceCloseNovo}
        onCancel={() => setShowCancelNovo(false)}
      />

      {/* ── Modal: Confirmar envio do chamado ── */}
      <ConfirmModal
        isOpen={showConfirmNovo}
        title="Enviar chamado?"
        message={`Tem certeza que deseja abrir o chamado "${form.assunto || 'este chamado'}"?`}
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmNovo}
        onCancel={() => setShowConfirmNovo(false)}
      />

      {/* ── Modal: Sucesso ── */}
      <SucessModal
        isOpen={!!sucessModal}
        title={sucessModal?.title ?? ''}
        message={sucessModal?.message ?? ''}
        onClose={() => setSucessModal(null)}
      />
    </Container>
  );
}