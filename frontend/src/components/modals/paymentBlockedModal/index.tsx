'use client';

import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '@/components/ui/button';

interface PaymentBlockedModalProps {
  isOpen:       boolean;
  companyName?: string | null;
  onPayNow?:    () => void;
}

const fadeIn  = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(32px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}`;
const pulse   = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.06)}`;

const Overlay = styled.div`
  position:fixed;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(6px);
  z-index:9998;display:flex;align-items:center;justify-content:center;
  padding:20px;animation:${fadeIn} 0.25s ease;
`;
const Box = styled.div`
  background:white;border-radius:24px;width:100%;max-width:480px;
  box-shadow:0 32px 80px rgba(0,0,0,0.28);animation:${slideUp} 0.3s ease;overflow:hidden;
`;
const TopBar = styled.div`
  background:linear-gradient(135deg,#e74c3c,#c0392b);
  padding:32px 32px 28px;text-align:center;position:relative;
`;
const IconCircle = styled.div`
  width:72px;height:72px;background:rgba(255,255,255,0.15);border-radius:50%;
  display:flex;align-items:center;justify-content:center;margin:0 auto 16px;
  animation:${pulse} 2.4s ease-in-out infinite;border:2px solid rgba(255,255,255,0.25);
`;
const TopTitle = styled.h2`
  font-size:1.35rem;font-family:var(--font-cabourg-bold),'Cabourg',serif;
  color:white;margin:0 0 6px;font-weight:700;letter-spacing:-0.3px;
`;
const TopSub = styled.p`
  font-size:0.85rem;color:rgba(255,255,255,0.8);margin:0;
  font-family:var(--font-metropolis-regular),'Metropolis',sans-serif;
`;
const Body = styled.div`padding:28px 32px;`;
const AlertBox = styled.div`
  background:#fff8f7;border:1.5px solid rgba(231,76,60,0.2);border-radius:12px;
  padding:16px 18px;margin-bottom:24px;display:flex;gap:12px;align-items:flex-start;
`;
const AlertIcon = styled.div`
  flex-shrink:0;width:36px;height:36px;background:rgba(231,76,60,0.1);
  border-radius:8px;display:flex;align-items:center;justify-content:center;color:#e74c3c;
`;
const AlertText  = styled.div`flex:1;`;
const AlertTitle = styled.div`
  font-size:0.85rem;font-weight:700;color:#1a1a1a;
  font-family:var(--font-metropolis-semibold),'Metropolis',sans-serif;margin-bottom:4px;
`;
const AlertDesc = styled.div`
  font-size:0.78rem;color:#777;
  font-family:var(--font-inter-variable-regular),'Inter',sans-serif;line-height:1.55;
`;
const StepList = styled.div`display:flex;flex-direction:column;gap:10px;margin-bottom:24px;`;
const Step     = styled.div`
  display:flex;align-items:center;gap:12px;padding:10px 14px;
  background:#fafafa;border-radius:10px;border:1px solid #f0f0f0;
`;
const StepNum  = styled.div`
  width:24px;height:24px;background:#BBA188;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:0.72rem;font-weight:700;color:white;flex-shrink:0;
  font-family:var(--font-metropolis-semibold),'Metropolis',sans-serif;
`;
const StepText = styled.div`
  font-size:0.82rem;color:#555;
  font-family:var(--font-inter-variable-regular),'Inter',sans-serif;
`;
const Footer = styled.div`display:flex;gap:10px;`;
const SupportNote = styled.div`
  margin-top:16px;text-align:center;font-size:0.74rem;color:#bbb;
  font-family:var(--font-inter-variable-regular),'Inter',sans-serif;
  a{color:#BBA188;text-decoration:none;font-weight:600;&:hover{text-decoration:underline;}}
`;

const IcoCard = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

export default function PaymentBlockedModal({ isOpen, companyName, onPayNow }: PaymentBlockedModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow='hidden';
    else document.body.style.overflow='unset';
    return ()=>{ document.body.style.overflow='unset'; };
  },[isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <Box onClick={e=>e.stopPropagation()}>
        <TopBar>
          <IconCircle>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              <line x1="12" y1="15" x2="12" y2="17"/>
            </svg>
          </IconCircle>
          <TopTitle>Acesso Suspenso</TopTitle>
          <TopSub>{companyName?`Assinatura de ${companyName} está vencida`:'Assinatura da sua clínica está vencida'}</TopSub>
        </TopBar>

        <Body>
          <AlertBox>
            <AlertIcon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </AlertIcon>
            <AlertText>
              <AlertTitle>Fatura em atraso</AlertTitle>
              <AlertDesc>
                O acesso ao sistema foi suspenso por falta de pagamento.
                Seus dados estão salvos e seguros — nenhuma informação foi perdida.
                Regularize o pagamento para restaurar o acesso completo.
              </AlertDesc>
            </AlertText>
          </AlertBox>

          <StepList>
            <Step><StepNum>1</StepNum><StepText>Clique em <strong>&quot;Regularizar Pagamento&quot;</strong> e acesse a fatura em aberto</StepText></Step>
            <Step><StepNum>2</StepNum><StepText>Efetue o pagamento via boleto, PIX ou cartão de crédito</StepText></Step>
            <Step><StepNum>3</StepNum><StepText>O acesso é restaurado automaticamente em até <strong>15 minutos</strong> após a confirmação</StepText></Step>
          </StepList>

          <Footer>
            {/* Danger não existe no Button — usamos primary com estilo override via style */}
            <Button
              variant="danger"
              fullWidth
              icon={IcoCard}
              onClick={onPayNow}
            >
              Regularizar Pagamento
            </Button>
            <Button
              variant="outline"
              onClick={()=>window.location.href='/login'}
            >
              Sair
            </Button>
          </Footer>

          <SupportNote>
            Dúvidas? Fale com o suporte: <a href="mailto:suporte@sistema.com">suporte@sistema.com</a>
          </SupportNote>
        </Body>
      </Box>
    </Overlay>
  );
}