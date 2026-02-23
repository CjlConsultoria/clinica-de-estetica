'use client';

import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface SystemUnavailableModalProps {
  isOpen: boolean;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(32px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(6px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.25s ease;
`;

const Box = styled.div`
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.28);
  animation: ${slideUp} 0.3s ease;
  overflow: hidden;
`;

const TopBar = styled.div`
  background: linear-gradient(135deg, #5a6a7a, #3d4d5c);
  padding: 36px 32px 30px;
  text-align: center;
`;

const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const SpinnerRing = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 1.1s linear infinite;
`;

const TopTitle = styled.h2`
  font-size: 1.3rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: white;
  margin: 0 0 6px;
  font-weight: 700;
  letter-spacing: -0.3px;
`;

const TopSub = styled.p`
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
`;

const Body = styled.div`
  padding: 28px 32px 32px;
`;

const InfoBox = styled.div`
  background: #f7f9fc;
  border: 1.5px solid #e4eaf2;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 22px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const InfoIcon = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: rgba(90, 106, 122, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a6a7a;
`;

const InfoText = styled.div`
  flex: 1;
`;

const InfoTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  margin-bottom: 4px;
`;

const InfoDesc = styled.div`
  font-size: 0.78rem;
  color: #777;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  line-height: 1.55;
`;

const MessageBox = styled.div`
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 22px;
  font-size: 0.82rem;
  color: #666;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  line-height: 1.6;
  text-align: center;
`;

const BtnSecondary = styled.button`
  width: 100%;
  padding: 13px 20px;
  background: transparent;
  color: #5a6a7a;
  border: 1.5px solid #d0d8e0;
  border-radius: 50px;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #5a6a7a;
    color: #3d4d5c;
  }
`;

const SupportNote = styled.div`
  margin-top: 14px;
  text-align: center;
  font-size: 0.74rem;
  color: #bbb;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;

  a {
    color: #BBA188;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;

export default function SystemUnavailableModal({ isOpen }: SystemUnavailableModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <Box onClick={e => e.stopPropagation()}>
        <TopBar>
          <IconCircle>
            <SpinnerRing />
          </IconCircle>
          <TopTitle>Sistema Indisponível</TopTitle>
          <TopSub>Estamos trabalhando para resolver</TopSub>
        </TopBar>

        <Body>
          <InfoBox>
            <InfoIcon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </InfoIcon>
            <InfoText>
              <InfoTitle>Manutenção em andamento</InfoTitle>
              <InfoDesc>
                O sistema está temporariamente fora do ar. Seus dados estão seguros
                e nenhuma informação foi perdida.
              </InfoDesc>
            </InfoText>
          </InfoBox>

          <MessageBox>
            Por favor, aguarde alguns instantes e tente novamente.
            Caso o problema persista, entre em contato com o administrador da clínica.
          </MessageBox>

          <BtnSecondary onClick={() => window.location.href = '/login'}>
            Sair do sistema
          </BtnSecondary>

          <SupportNote>
            Precisa de ajuda? <a href="mailto:suporte@sistema.com">suporte@sistema.com</a>
          </SupportNote>
        </Body>
      </Box>
    </Overlay>
  );
}