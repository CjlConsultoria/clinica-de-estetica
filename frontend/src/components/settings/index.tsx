'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import {
  Container, Header, Title, SettingsLayout, SideNav, SideNavItem,
  SideNavIcon, SideNavLabel, SettingsContent, Section, SectionTitle, SectionDesc,
  FormGrid, ToggleRow, ToggleInfo, ToggleLabel, ToggleSubLabel, ToggleSwitch,
  ToggleKnob, DangerZone, DangerItem, DangerText, SaveRow, AvatarSection,
  AvatarCircle, AvatarBtn, ColorPicker, ColorOption,
} from './styles';

const navSections = [
  { id: 'perfil', label: 'Perfil da Clínica', icon: '🏥' },
  { id: 'conta', label: 'Minha Conta', icon: '👤' },
  { id: 'notificacoes', label: 'Notificações', icon: '🔔' },
  { id: 'comissoes', label: 'Regras de Comissão', icon: '💰' },
  { id: 'anvisa', label: 'Configurações ANVISA', icon: '🏛️' },
  { id: 'seguranca', label: 'Segurança', icon: '🔒' },
];

const accentColors = ['#BBA188', '#EBD5B0', '#1b1b1b', '#a8906f', '#8a7560', '#e74c3c'];

type NotifKey = 'agendamento' | 'reaplicacao' | 'estoqueBaixo' | 'validade' | 'comissao' | 'relatorio';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('perfil');
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    agendamento: true, reaplicacao: true, estoqueBaixo: true,
    validade: true, comissao: false, relatorio: false,
  });
  const [accentColor, setAccentColor] = useState('#BBA188');

  const toggleNotif = (key: NotifKey) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <Container>
      <Header>
        <Title>Configurações</Title>
      </Header>

      <SettingsLayout>
        <SideNav>
          {navSections.map(s => (
            <SideNavItem key={s.id} $active={activeSection === s.id} onClick={() => setActiveSection(s.id)}>
              <SideNavIcon>{s.icon}</SideNavIcon>
              <SideNavLabel>{s.label}</SideNavLabel>
            </SideNavItem>
          ))}
        </SideNav>

        <SettingsContent>
          {activeSection === 'perfil' && (
            <Section>
              <SectionTitle>Perfil da Clínica</SectionTitle>
              <SectionDesc>Informações gerais da clínica exibidas no sistema.</SectionDesc>
              <AvatarSection>
                <AvatarCircle $color={accentColor}>CL</AvatarCircle>
                <div>
                  <AvatarBtn>Alterar Logo</AvatarBtn>
                  <div style={{ fontSize: '0.78rem', color: '#999', marginTop: 6 }}>PNG, JPG até 2MB</div>
                </div>
              </AvatarSection>
              <FormGrid>
                <Input label="Nome da Clínica" defaultValue="Clínica Estética" />
                <Input label="CNPJ" defaultValue="00.000.000/0001-00" />
                <Input label="Telefone Principal" defaultValue="(11) 99999-9999" />
                <Input label="E-mail de Contato" type="email" defaultValue="contato@clinica.com" />
                <div style={{ gridColumn: 'span 2' }}>
                  <Input label="Endereço Completo" defaultValue="Rua das Flores, 123 – Jardim América, São Paulo – SP" />
                </div>
                <Input label="Horário de Abertura" type="time" defaultValue="08:00" />
                <Input label="Horário de Fechamento" type="time" defaultValue="19:00" />
              </FormGrid>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444', marginBottom: 12, fontFamily: "var(--font-metropolis-semibold)" }}>Cor de Destaque do Sistema</div>
                <ColorPicker>
                  {accentColors.map(c => (
                    <ColorOption key={c} $color={c} $selected={accentColor === c} onClick={() => setAccentColor(c)} />
                  ))}
                </ColorPicker>
              </div>
              <SaveRow>
                <Button variant="primary">Salvar Alterações</Button>
              </SaveRow>
            </Section>
          )}

          {activeSection === 'conta' && (
            <Section>
              <SectionTitle>Minha Conta</SectionTitle>
              <SectionDesc>Dados pessoais e de acesso ao sistema.</SectionDesc>
              <FormGrid>
                <Input label="Nome Completo" defaultValue="Administrador" />
                <Input label="E-mail" type="email" defaultValue="admin@clinica.com" />
                <Input label="Cargo / Função" defaultValue="Administrador" />
                <Input label="Telefone" defaultValue="(11) 99999-9999" />
                <Input label="Nova Senha" type="password" placeholder="••••••••" />
                <Input label="Confirmar Nova Senha" type="password" placeholder="••••••••" />
              </FormGrid>
              <SaveRow>
                <Button variant="primary">Atualizar Conta</Button>
              </SaveRow>
            </Section>
          )}

          {activeSection === 'notificacoes' && (
            <Section>
              <SectionTitle>Notificações</SectionTitle>
              <SectionDesc>Configure quais alertas deseja receber no sistema.</SectionDesc>
              {([
                { key: 'agendamento' as NotifKey, label: 'Confirmação de Agendamentos', sub: 'Notificar quando um agendamento for confirmado ou cancelado' },
                { key: 'reaplicacao' as NotifKey, label: 'Alertas de Reaplicação', sub: 'Avisar quando pacientes estiverem próximos do prazo de reaplicação' },
                { key: 'estoqueBaixo' as NotifKey, label: 'Estoque Baixo', sub: 'Notificar quando produtos atingirem nível crítico de estoque' },
                { key: 'validade' as NotifKey, label: 'Validade de Produtos', sub: 'Alertar 30, 15 e 7 dias antes do vencimento de produtos ANVISA' },
                { key: 'comissao' as NotifKey, label: 'Relatório de Comissões', sub: 'Receber relatório mensal de comissões por e-mail' },
                { key: 'relatorio' as NotifKey, label: 'Relatório Semanal', sub: 'Receber resumo semanal de desempenho por e-mail' },
              ]).map(n => (
                <ToggleRow key={n.key}>
                  <ToggleInfo>
                    <ToggleLabel>{n.label}</ToggleLabel>
                    <ToggleSubLabel>{n.sub}</ToggleSubLabel>
                  </ToggleInfo>
                  <ToggleSwitch $active={notifs[n.key]} onClick={() => toggleNotif(n.key)}>
                    <ToggleKnob $active={notifs[n.key]} />
                  </ToggleSwitch>
                </ToggleRow>
              ))}
              <SaveRow>
                <Button variant="primary">Salvar Preferências</Button>
              </SaveRow>
            </Section>
          )}

          {activeSection === 'comissoes' && (
            <Section>
              <SectionTitle>Regras de Comissão</SectionTitle>
              <SectionDesc>Configure as porcentagens de comissão por tipo de procedimento.</SectionDesc>
              <FormGrid>
                <Input label="Comissão — Toxina Botulínica (%)" type="number" defaultValue="20" />
                <Input label="Comissão — Preenchimento (%)" type="number" defaultValue="20" />
                <Input label="Comissão — Bioestimulador (%)" type="number" defaultValue="15" />
                <Input label="Comissão — Fio de PDO (%)" type="number" defaultValue="18" />
                <Input label="Comissão — Skincare/Pele (%)" type="number" defaultValue="25" />
                <Input label="Comissão — Outros (%)" type="number" defaultValue="20" />
                <Select label="Cálculo da Comissão" options={[{ value: 'bruto', label: 'Sobre valor bruto' }, { value: 'liquido', label: 'Sobre valor líquido' }]} />
                <Select label="Periodicidade do Pagamento" options={[{ value: 'mensal', label: 'Mensal' }, { value: 'quinzenal', label: 'Quinzenal' }, { value: 'semanal', label: 'Semanal' }]} />
              </FormGrid>
              <SaveRow>
                <Button variant="primary">Salvar Regras</Button>
              </SaveRow>
            </Section>
          )}

          {activeSection === 'anvisa' && (
            <Section>
              <SectionTitle>Configurações ANVISA</SectionTitle>
              <SectionDesc>Parâmetros de controle de conformidade ANVISA para produtos e insumos.</SectionDesc>
              <FormGrid>
                <Input label="Dias para alerta de validade" type="number" defaultValue="30" />
                <Input label="Estoque mínimo (unidades)" type="number" defaultValue="5" />
                <Select label="Unidade de Controle de Lote" options={[{ value: 'produto', label: 'Por Produto' }, { value: 'lote', label: 'Por Lote' }]} />
                <Select label="Frequência de Relatório ANVISA" options={[{ value: 'mensal', label: 'Mensal' }, { value: 'trimestral', label: 'Trimestral' }]} />
              </FormGrid>
              <ToggleRow style={{ marginTop: 16 }}>
                <ToggleInfo>
                  <ToggleLabel>Rastreamento de Lote Obrigatório</ToggleLabel>
                  <ToggleSubLabel>Exigir número de lote no cadastro de todos os procedimentos</ToggleSubLabel>
                </ToggleInfo>
                <ToggleSwitch $active={true}><ToggleKnob $active={true} /></ToggleSwitch>
              </ToggleRow>
              <SaveRow>
                <Button variant="primary">Salvar Configurações</Button>
              </SaveRow>
            </Section>
          )}

          {activeSection === 'seguranca' && (
            <Section>
              <SectionTitle>Segurança</SectionTitle>
              <SectionDesc>Gerencie permissões e segurança do sistema.</SectionDesc>
              <ToggleRow>
                <ToggleInfo>
                  <ToggleLabel>Autenticação em Dois Fatores</ToggleLabel>
                  <ToggleSubLabel>Adicionar camada extra de segurança ao login</ToggleSubLabel>
                </ToggleInfo>
                <ToggleSwitch $active={false}><ToggleKnob $active={false} /></ToggleSwitch>
              </ToggleRow>
              <ToggleRow>
                <ToggleInfo>
                  <ToggleLabel>Registro de Atividades (Audit Log)</ToggleLabel>
                  <ToggleSubLabel>Registrar todas as ações realizadas no sistema</ToggleSubLabel>
                </ToggleInfo>
                <ToggleSwitch $active={true}><ToggleKnob $active={true} /></ToggleSwitch>
              </ToggleRow>
              <ToggleRow>
                <ToggleInfo>
                  <ToggleLabel>Timeout de Sessão Automático</ToggleLabel>
                  <ToggleSubLabel>Desconectar automaticamente após 30 minutos inativo</ToggleSubLabel>
                </ToggleInfo>
                <ToggleSwitch $active={true}><ToggleKnob $active={true} /></ToggleSwitch>
              </ToggleRow>
              <DangerZone>
                <h4 style={{ color: '#e74c3c', margin: '0 0 16px', fontSize: '0.95rem' }}>⚠️ Zona de Perigo</h4>
                <DangerItem>
                  <DangerText>
                    <strong>Exportar todos os dados</strong>
                    <span>Baixar backup completo de pacientes, procedimentos e finanças</span>
                  </DangerText>
                  <Button variant="outline" size="sm">Exportar</Button>
                </DangerItem>
                <DangerItem>
                  <DangerText>
                    <strong>Limpar dados de teste</strong>
                    <span>Remover todos os registros de pacientes e transações em ambiente de teste</span>
                  </DangerText>
                  <Button variant="danger" size="sm">Limpar</Button>
                </DangerItem>
              </DangerZone>
            </Section>
          )}
        </SettingsContent>
      </SettingsLayout>
    </Container>
  );
}