import styled, { keyframes } from 'styled-components';

const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

/* ─── Layout ─────────────────────────────────────────────────── */

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

export const LeftPanel = styled.div`
  width: 45%;
  background-image: url("/fundo.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 968px) {
    width: 100%;
    height: 22vh;
    min-height: 100px;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    height: 16vh;
  }
`;

export const PatternOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.08;
    background-image: repeating-linear-gradient(
      45deg, transparent, transparent 35px,
      rgba(212, 175, 55, 0.07) 35px, rgba(212, 175, 55, 0.07) 70px
    );
  }
`;

export const LeftContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 20px;
  text-align: center;
  z-index: 2;

  @media (max-width: 968px) {
    display: none;
  }
`;

export const LeftTitle = styled.h2`
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  font-size: clamp(1.4rem, 2.5vw, 2.2rem);
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
`;

export const LeftSubtitle = styled.p`
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  color: rgba(255,255,255,0.75);
  margin: 0;
  line-height: 1.6;
  max-width: 340px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.3);
`;

export const TrialBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(187, 161, 136, 0.25);
  border: 1.5px solid rgba(187, 161, 136, 0.5);
  border-radius: 40px;
  padding: 8px 18px;
  color: #f0d9c0;
  font-size: 0.82rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
`;

/* RightPanel: centralizado verticalmente, scroll interno apenas se necessário */
export const RightPanel = styled.div`
  width: 55%;
  background-color: #1b1b1b;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(12px, 2.5vh, 32px) clamp(16px, 3vw, 48px);

  @media (max-width: 968px) {
    width: 100%;
    flex: 1;
    min-height: 0;
    align-items: flex-start;
    padding: clamp(10px, 2.5vh, 24px) clamp(14px, 4vw, 28px);
  }
`;

export const FormWrapper = styled.div`
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 968px) {
    padding: 0;
    max-width: 100%;
  }
`;

/* ─── Header ─────────────────────────────────────────────────── */

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: clamp(2px, 0.8vh, 8px);
`;

export const LogoImg = styled.img`
  width: clamp(80px, 20vw, 300px);
  height: auto;
  max-width: 100%;
  object-fit: contain;

  @media (max-width: 968px) {
    width: clamp(110px, 30vw, 200px);
  }
`;

export const Title = styled.h1`
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  font-size: clamp(1rem, 1.8vw, 1.6rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px;
  text-align: center;
  line-height: 1.2;
  letter-spacing: -0.5px;

  @media (max-width: 968px) {
    font-size: clamp(1rem, 4vw, 1.4rem);
  }
`;

export const Subtitle = styled.p`
  font-size: clamp(0.72rem, 1vw, 0.88rem);
  color: #9ca3af;
  margin: 0 0 clamp(8px, 1.8vh, 20px);
  text-align: center;
  line-height: 1.5;

  @media (max-width: 968px) {
    font-size: clamp(0.7rem, 2.5vw, 0.85rem);
  }
`;

/* ─── Wizard Steps ───────────────────────────────────────────── */

export const WizardSteps = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: clamp(12px, 2vh, 20px);
  padding-bottom: clamp(10px, 1.5vh, 16px);
  border-bottom: 1px solid #2d2d2d;
`;

export const WizardStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  max-width: 120px;
`;

export const WizardStepLine = styled.div<{ $done?: boolean }>`
  position: absolute;
  top: 13px;
  left: calc(-50%);
  right: calc(50% + 13px);
  height: 2px;
  background: ${({ $done }) => $done ? '#BBA188' : '#333'};
  transition: background 0.3s;
  z-index: 0;
`;

export const WizardStepCircle = styled.div<{ $done?: boolean; $current?: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.74rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
  transition: all 0.25s;
  background: ${({ $done }) => $done ? '#BBA188' : '#252525'};
  color: ${({ $done, $current }) => $done ? 'white' : $current ? '#BBA188' : '#555'};
  border: 2px solid ${({ $done, $current }) => ($done || $current) ? '#BBA188' : '#333'};
  box-shadow: ${({ $current }) => $current ? '0 0 0 4px rgba(187,161,136,0.15)' : 'none'};

  @media (max-width: 600px) {
    width: 22px;
    height: 22px;
    font-size: 0.65rem;
  }
`;

export const WizardStepLabel = styled.span<{ $current?: boolean }>`
  margin-top: 5px;
  font-size: 0.62rem;
  text-align: center;
  color: ${({ $current }) => $current ? '#BBA188' : '#555'};
  font-weight: ${({ $current }) => $current ? '600' : '400'};
  line-height: 1.3;
  transition: color 0.2s;

  @media (max-width: 420px) {
    display: none;
  }
`;

/* ─── Step content ───────────────────────────────────────────── */

export const StepSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.8vh, 14px);
  animation: ${fadeInDown} 0.25s ease;
`;

export const SectionLabel = styled.p`
  font-size: 0.72rem;
  font-weight: 600;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #2d2d2d;
  padding-bottom: 6px;
  margin: 0 0 2px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(10px, 1.5vh, 14px);

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    & > * { grid-column: 1 !important; }
  }
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const PlanCard = styled.div<{ $selected?: boolean; $color: string }>`
  border: 1.5px solid ${({ $selected, $color }) => $selected ? $color : '#2d2d2d'};
  border-radius: 14px;
  padding: 12px 14px;
  cursor: pointer;
  background: ${({ $selected }) => $selected ? 'rgba(187,161,136,0.08)' : '#252525'};
  box-shadow: ${({ $selected, $color }) => $selected ? `0 0 0 3px ${$color}28` : 'none'};
  transition: all 0.18s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ $color }) => $color};
    background: rgba(187,161,136,0.05);
  }
`;

export const PlanName = styled.div<{ $color: string }>`
  font-size: 0.76rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
  margin-bottom: 5px;
`;

export const PlanPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 2px;

  span {
    font-size: 0.62rem;
    color: #666;
    font-weight: 400;
  }
`;

export const PlanDesc = styled.div`
  font-size: 0.66rem;
  color: #666;
`;

export const PlanBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #BBA188;
  color: #1a1a1a;
  font-size: 0.56rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(187,161,136,0.07);
  border: 1.5px solid rgba(187,161,136,0.2);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.76rem;
  color: #BBA188;
  line-height: 1.6;
  svg { flex-shrink: 0; margin-top: 2px; }
  strong { font-weight: 700; }
  /* o conteúdo de texto fica em um parágrafo contínuo */
  & > span {
    flex: 1;
    min-width: 0;
  }
`;

export const WarningBox = styled(InfoBox)`
  background: rgba(234,179,8,0.07);
  border-color: rgba(234,179,8,0.25);
  color: #ca8a04;
`;

/* ─── Resumo (step 4) ────────────────────────────────────────── */

export const ResumoBox = styled.div`
  background: #252525;
  border-radius: 14px;
  padding: clamp(12px, 2vh, 18px);
  border: 1px solid #2d2d2d;
`;

export const ResumoSection = styled.div`
  & + & {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #2d2d2d;
  }
`;

export const ResumoSectionTitle = styled.div`
  font-size: 0.66rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

export const ResumoGrid = styled.div`
  display: grid;
  /* Duas colunas simétricas; cada item empilha label+value */
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
  align-items: start;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ResumoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
  min-width: 0;
`;

export const ResumoLabel = styled.span`
  font-size: 0.60rem;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
`;

export const ResumoValue = styled.span`
  font-size: 0.82rem;
  color: #e0e0e0;
  font-weight: 600;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

/* ─── Termos / Checkbox ──────────────────────────────────────── */

/**
 * Wrapper que reserva espaço fixo para o erro (min-height),
 * impedindo que a página "empurre" conteúdo para baixo e
 * acione a barra de rolagem.
 */
export const TermosArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const TermosErrorSlot = styled.div`
  /* Reserva sempre o espaço do erro — sem reflow */
  min-height: 28px;
  display: flex;
  align-items: flex-start;
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  user-select: none;
`;

export const CheckboxBox = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 2px solid ${p => p.$checked ? '#BBA188' : '#444'};
  background: ${p => p.$checked ? '#BBA188' : '#252525'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: all 0.2s;
`;

export const CheckboxLabel = styled.div`
  font-size: 0.78rem;
  color: #9ca3af;
  font-weight: 400;
  line-height: 1.4;

  a {
    color: #BBA188;
    text-decoration: underline;
    cursor: pointer;
    &:hover { color: #d4a97a; }
  }

  @media (max-width: 480px) {
    font-size: 0.72rem;
  }
`;

/* ─── Nav buttons ────────────────────────────────────────────── */

export const WizardNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: clamp(10px, 1.8vh, 20px);
  padding-top: clamp(10px, 1.5vh, 16px);
  border-top: 1px solid #2d2d2d;

  @media (max-width: 480px) {
    gap: 8px;
    flex-direction: column;
    & > button { width: 100%; justify-content: center; }
  }
`;

export const BackToLogin = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: clamp(0.72rem, 1vw, 0.82rem);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: clamp(8px, 1.5vh, 14px);
  align-self: center;

  span {
    color: #BBA188;
    font-weight: 600;
  }
`;

/* ─── Success ────────────────────────────────────────────────── */

export const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  padding: 20px 0;
  animation: ${fadeInDown} 0.4s ease;
`;

export const SuccessIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(187,161,136,0.15);
  border: 2px solid #BBA188;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SuccessTitle = styled.h2`
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  color: #ffffff;
  margin: 0;
`;

export const SuccessText = styled.p`
  font-size: clamp(0.8rem, 1.1vw, 0.9rem);
  color: #9ca3af;
  margin: 0;
  line-height: 1.6;
  max-width: 380px;
`;

export const SuccessBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(59,130,246,0.12);
  border: 1.5px solid rgba(59,130,246,0.25);
  border-radius: 40px;
  padding: 8px 18px;
  color: #60a5fa;
  font-size: 0.8rem;
  font-weight: 600;
`;

/* ─── Input overrides ────────────────────────────────────────── */

export const InputOverride = styled.div`
  input {
    background-color: #252525 !important;
    color: #ffffff !important;
    border-color: #2d2d2d !important;
    box-shadow: none !important;

    &:focus {
      border-color: #BBA188 !important;
      background-color: #2a2a2a !important;
      box-shadow: none !important;
    }

    &::placeholder {
      color: #5a5a5a !important;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: #ffffff !important;
      box-shadow: inset 0 0 20px 20px #252525 !important;
    }
  }

  &:has(input[aria-invalid="true"]) input,
  &:has(input.error) input,
  &[data-error="true"] input {
    border-color: #ab031d !important;
    box-shadow: none !important;

    &:focus {
      border-color: #ab031d !important;
      box-shadow: none !important;
    }
  }
`;

export const FieldErrorText = styled.div`
  padding: clamp(3px, 0.5vh, 6px) 12px;
  border-left: 3px solid #ab031d;
  border-radius: 8px;
  color: #ff5c77;
  font-size: clamp(0.68rem, 0.9vw, 0.78rem);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  animation: ${fadeInDown} 0.2s ease;
  svg { flex-shrink: 0; }
`;

export const SaveErrorBox = styled.div`
  color: #ff5c77;
  font-size: 0.78rem;
  border-left: 3px solid #ab031d;
  padding: 6px 12px;
  background: rgba(171,3,29,0.06);
  border-radius: 8px;
  flex: 1;
`;