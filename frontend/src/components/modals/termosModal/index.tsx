'use client';

import { useState, useEffect } from 'react';
import { listarTermos } from '@/services/consentimentoService';
import * as S from './styles';

interface TermosModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const TERMS_FALLBACK = `Bem-vindo ao sistema de gestão da Clínica Estética.

Ao utilizar esta plataforma, você concorda em:
• Manter a confidencialidade das informações dos pacientes.
• Utilizar o sistema apenas para finalidades profissionais autorizadas.
• Não compartilhar suas credenciais de acesso com terceiros.
• Reportar qualquer acesso não autorizado ou suspeita de violação de segurança.
• Cumprir as normas internas da clínica e a legislação vigente (LGPD).

O uso indevido do sistema poderá resultar em medidas disciplinares e/ou legais.`;

const PRIVACY_FALLBACK = `Esta Política de Privacidade descreve como os dados são tratados nesta plataforma.

• Coleta de dados: coletamos apenas as informações necessárias para a operação do sistema.
• Uso dos dados: os dados são utilizados exclusivamente para gestão clínica interna.
• Armazenamento: as informações são armazenadas com segurança e acesso restrito.
• Compartilhamento: não compartilhamos dados com terceiros sem autorização legal.
• Direitos: você tem direito ao acesso, correção e exclusão de seus dados conforme a LGPD.

Em caso de dúvidas, entre em contato com o responsável pelo sistema.`;

type Tab = 'terms' | 'privacy';

export default function TermosModal({ isOpen, onAccept }: TermosModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('terms');
  const [accepted, setAccepted] = useState(false);
  const [termsText, setTermsText] = useState(TERMS_FALLBACK);
  const [privacyText, setPrivacyText] = useState(PRIVACY_FALLBACK);

  useEffect(() => {
    if (!isOpen) return;
    listarTermos(true).then(data => {
      if (data[0]?.conteudo) setTermsText(data[0].conteudo);
      if (data[1]?.conteudo) setPrivacyText(data[1].conteudo);
    }).catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentText = activeTab === 'terms' ? termsText : privacyText;

  return (
    <S.Overlay>
      <S.ModalContainer>
        <S.Header>
          <S.Title>Termos de Uso e Privacidade</S.Title>
          <S.Subtitle>Leia e aceite para continuar usando o sistema</S.Subtitle>
        </S.Header>

        <S.TabsRow>
          <S.TabBtn $active={activeTab === 'terms'} onClick={() => setActiveTab('terms')}>
            Termos de Uso
          </S.TabBtn>
          <S.TabBtn $active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')}>
            Política de Privacidade
          </S.TabBtn>
        </S.TabsRow>

        <S.ScrollArea key={activeTab}>
          {currentText}
        </S.ScrollArea>

        <S.Footer>
          <S.CheckboxRow>
            <S.Checkbox
              type="checkbox"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
            />
            <S.CheckboxLabel>
              Li e aceito os Termos de Uso e a Política de Privacidade
            </S.CheckboxLabel>
          </S.CheckboxRow>

          <S.AcceptButton
            $enabled={accepted}
            disabled={!accepted}
            onClick={accepted ? onAccept : undefined}
          >
            Aceitar e continuar
          </S.AcceptButton>
        </S.Footer>
      </S.ModalContainer>
    </S.Overlay>
  );
}
