'use client';

import { useState, useEffect } from 'react';
import { useRoleRedirect } from '@/components/ui/hooks/useRoleRedirect';
import { listarComunicados, ComunicadoAPI } from '@/services/comunicadoService';
import {
  Container, Header, Title, Subtitle,
  StatsRow, StatBox, StatBoxValue, StatBoxLabel,
  TabRow, TabBtn,
  ComunicadoList,
  ComunicadoCard, ComunicadoCardInner,
  ComunicadoHeader, ComunicadoTitle, ComunicadoMeta,
  ComunicadoBody, ComunicadoFooter,
  BadgeTipo, BadgeNovo,
  UnreadDot,
  EmptyState, EmptyIcon,
  MarkBtn,
} from './styles';

type Tipo = 'manutencao' | 'novidade' | 'alerta' | 'cobranca';

interface Comunicado {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: Tipo;
  dataEnvio: string;
  lido: boolean;
}

const TipoIcon = ({ tipo }: { tipo: Tipo }) => {
  if (tipo === 'manutencao') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
  if (tipo === 'novidade') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
  if (tipo === 'alerta') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
};

const tipoConfig: Record<Tipo, { label: string }> = {
  manutencao: { label: 'Manutenção' },
  novidade:   { label: 'Novidade'   },
  alerta:     { label: 'Alerta'     },
  cobranca:   { label: 'Cobrança'   },
};


export default function ComunicadosEmpresa() {
  const allowed = useRoleRedirect({
    permission: 'comunicados.read',
    blockSuperAdmin: true,
  });

  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [filtro, setFiltro]           = useState<'todos' | 'nao_lidos' | 'lidos'>('todos');

  useEffect(() => {
    listarComunicados().then((data: ComunicadoAPI[]) => {
      const mapped: Comunicado[] = data.filter(c => c.ativo).map(c => ({
        id:       c.id,
        titulo:   c.titulo,
        mensagem: c.conteudo,
        tipo:     (['manutencao', 'novidade', 'alerta', 'cobranca'].includes((c.tipo || '').toLowerCase())
                    ? (c.tipo || '').toLowerCase()
                    : 'novidade') as Tipo,
        dataEnvio: c.criadoEm ? new Date(c.criadoEm).toLocaleDateString('pt-BR') : '—',
        lido:      false,
      }));
      if (mapped.length > 0) setComunicados(mapped);
    }).catch(() => {});

  }, []);

  if (!allowed) return null;

  const naoLidos = comunicados.filter(c => !c.lido).length;
  const lidos    = comunicados.filter(c =>  c.lido).length;

  const filtrados =
    filtro === 'todos'     ? comunicados :
    filtro === 'nao_lidos' ? comunicados.filter(c => !c.lido) :
                             comunicados.filter(c =>  c.lido);

  function marcarComoLido(id: number) {
    setComunicados(prev => prev.map(c => c.id === id ? { ...c, lido: true } : c));
  }

  function marcarTodosComoLidos() {
    setComunicados(prev => prev.map(c => ({ ...c, lido: true })));
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>Comunicados</Title>
          <Subtitle>Avisos e notificações enviados pela equipe CJL</Subtitle>
        </div>
        {naoLidos > 0 && (
          <MarkBtn onClick={marcarTodosComoLidos}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Marcar todos como lidos
          </MarkBtn>
        )}
      </Header>

      <StatsRow>
        <StatBox $color="#e74c3c">
          <StatBoxValue>{naoLidos}</StatBoxValue>
          <StatBoxLabel>Não lidos</StatBoxLabel>
        </StatBox>
        <StatBox $color="#8a7560">
          <StatBoxValue>{lidos}</StatBoxValue>
          <StatBoxLabel>Lidos</StatBoxLabel>
        </StatBox>
        <StatBox $color="#BBA188">
          <StatBoxValue>{comunicados.length}</StatBoxValue>
          <StatBoxLabel>Total recebidos</StatBoxLabel>
        </StatBox>
      </StatsRow>

      <TabRow>
        {([
          { key: 'todos',     label: 'Todos'                   },
          { key: 'nao_lidos', label: `Não lidos (${naoLidos})` },
          { key: 'lidos',     label: `Lidos (${lidos})`        },
        ] as const).map(({ key, label }) => (
          <TabBtn key={key} $active={filtro === key} onClick={() => setFiltro(key)}>
            {label}
          </TabBtn>
        ))}
      </TabRow>

      {filtrados.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </EmptyIcon>
          <div style={{ fontWeight: 700, color: '#888' }}>
            {filtro === 'nao_lidos' ? 'Nenhum comunicado não lido' : 'Nenhum comunicado encontrado'}
          </div>
          <div>
            {filtro === 'nao_lidos'
              ? 'Você está em dia! Todos os comunicados foram lidos.'
              : 'Nenhum comunicado foi enviado ainda.'}
          </div>
        </EmptyState>
      ) : (
        <ComunicadoList>
          {filtrados.map(c => (
            <ComunicadoCard key={c.id} $lido={c.lido}>
              <ComunicadoCardInner>
                {!c.lido && <UnreadDot />}

                <ComunicadoHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      border: '1.5px solid #e8e0d8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#8a7560',
                    }}>
                      <TipoIcon tipo={c.tipo} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <ComunicadoTitle $lido={c.lido}>{c.titulo}</ComunicadoTitle>
                      <ComunicadoMeta>
                        <BadgeTipo $bg="rgba(138,117,96,0.08)" $color="#8a7560">{tipoConfig[c.tipo].label}</BadgeTipo>
                        {!c.lido && <BadgeNovo>Novo</BadgeNovo>}
                        <span style={{ fontSize: '0.72rem', color: '#bbb' }}>{c.dataEnvio}</span>
                      </ComunicadoMeta>
                    </div>
                  </div>
                </ComunicadoHeader>

                <ComunicadoBody $lido={c.lido}>{c.mensagem}</ComunicadoBody>

                {!c.lido && (
                  <ComunicadoFooter>
                    <MarkBtn $small onClick={() => marcarComoLido(c.id)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Marcar como lido
                    </MarkBtn>
                  </ComunicadoFooter>
                )}
              </ComunicadoCardInner>
            </ComunicadoCard>
          ))}
        </ComunicadoList>
      )}
    </Container>
  );
}