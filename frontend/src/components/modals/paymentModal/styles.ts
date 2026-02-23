import styled, { keyframes } from 'styled-components';

// ─── Keyframes ───────────────────────────────────────────────────────────────
export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const slideUp = keyframes`
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

export const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const checkPop = keyframes`
  0%   { transform: scale(0); }
  60%  { transform: scale(1.18); }
  100% { transform: scale(1); }
`;

export const pixPulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0   rgba(0,168,107,0.3); }
  50%      { box-shadow: 0 0 0 10px rgba(0,168,107,0);   }
`;

// ─── Layout ──────────────────────────────────────────────────────────────────
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`;

export const Box = styled.div`
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.22);
  animation: ${slideUp} 0.28s ease;
  overflow: hidden;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
`;

// ─── Header ──────────────────────────────────────────────────────────────────
export const Header = styled.div`
  background: linear-gradient(135deg,#1b1b1b 0%,#2d2d2d 100%);
  padding: 24px 28px 20px;
  position: relative;
`;

export const HeaderTitle = styled.div`
  font-size: 1.1rem;
  font-family: var(--font-cabourg-bold), serif;
  color: #BBA188;
  font-weight: 700;
`;

export const HeaderSub = styled.div`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.45);
  margin-top: 2px;
  font-family: var(--font-inter-variable-regular), sans-serif;
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 20px;
  background: rgba(255,255,255,0.08);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.15);
    color: #fff;
  }
`;

export const FaturaBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(187,161,136,0.1);
  border: 1px solid rgba(187,161,136,0.2);
  border-radius: 10px;
  padding: 10px 14px;
  margin-top: 14px;
`;

export const FaturaValor = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #BBA188;
  font-family: var(--font-metropolis-semibold), sans-serif;
`;

export const FaturaDetalhe = styled.div`
  font-size: 0.72rem;
  color: rgba(255,255,255,0.45);
  text-align: right;
  font-family: var(--font-inter-variable-regular), sans-serif;
`;

// ─── Body ─────────────────────────────────────────────────────────────────────
export const Body = styled.div`
  padding: 24px 28px 28px;
  overflow-y: auto;
  flex: 1;
`;

// ─── Method Selection ─────────────────────────────────────────────────────────
export const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
`;

export const MethodCard = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px 12px;
  border-radius: 14px;
  border: 2px solid ${p => p.$active ? p.$color : '#f0f0f0'};
  background: ${p => p.$active ? `${p.$color}10` : '#fafafa'};
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-metropolis-semibold), sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: ${p => p.$active ? p.$color : '#666'};

  &:hover {
    border-color: ${p => p.$color};
    background: ${p => p.$color}08;
    color: ${p => p.$color};
  }
`;

export const MethodIcon = styled.div<{ $color: string; $active: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${p => p.$active ? p.$color : '#f0f0f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  svg {
    color: ${p => p.$active ? '#fff' : '#999'};
    transition: color 0.2s;
  }
`;

// ─── PIX ──────────────────────────────────────────────────────────────────────
export const QRBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const QRFrame = styled.div`
  width: 180px;
  height: 180px;
  border: 3px solid #00a86b;
  border-radius: 16px;
  padding: 12px;
  background: white;
  animation: ${pixPulse} 2.5s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PixKeyBox = styled.div`
  width: 100%;
  background: #f7fdf9;
  border: 1.5px solid rgba(0,168,107,0.2);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PixKeyText = styled.div`
  font-size: 0.78rem;
  font-family: monospace;
  color: #1a1a1a;
  word-break: break-all;
  flex: 1;
`;

export const CopyBtn = styled.button<{ $copied: boolean }>`
  padding: 6px 14px;
  background: ${p => p.$copied ? '#00a86b' : '#1b1b1b'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;
  margin-left: 10px;
  font-family: var(--font-metropolis-semibold), sans-serif;
`;

export const PixTimer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #888;
  font-family: var(--font-inter-variable-regular), sans-serif;
`;

// ─── Boleto ───────────────────────────────────────────────────────────────────
export const BoletoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const BoletoCodeBox = styled.div`
  background: #fafafa;
  border: 1.5px solid #e8e8e8;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BoletoCode = styled.div`
  font-size: 0.72rem;
  font-family: monospace;
  color: #444;
  word-break: break-all;
  flex: 1;
  line-height: 1.6;
`;

export const BoletoInfo = styled.div`
  background: rgba(234,179,8,0.08);
  border: 1px solid rgba(234,179,8,0.25);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.78rem;
  color: #92670a;
  font-family: var(--font-inter-variable-regular), sans-serif;
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

// ─── Card Form ────────────────────────────────────────────────────────────────
export const CardForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 5px;
  font-family: var(--font-metropolis-semibold), sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const FieldInput = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid ${p => p.$error ? '#e74c3c' : '#e8e8e8'};
  border-radius: 10px;
  font-size: 0.88rem;
  font-family: var(--font-inter-variable-regular), sans-serif;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;

  &:focus { border-color: #BBA188; }
  &::placeholder { color: #bbb; }
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const ErrorMsg = styled.div`
  font-size: 0.72rem;
  color: #e74c3c;
  margin-top: 3px;
  font-family: var(--font-inter-variable-regular), sans-serif;
`;

// ─── Processing / Success ─────────────────────────────────────────────────────
export const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  gap: 16px;
  text-align: center;
`;

export const Spinner = styled.div`
  width: 52px;
  height: 52px;
  border: 3px solid #f0f0f0;
  border-top-color: #BBA188;
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`;

export const CheckCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a86b, #00c37f);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${checkPop} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

// ─── Misc ─────────────────────────────────────────────────────────────────────
export const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 16px 0;
`;

export const StepLabel = styled.div`
  font-size: 0.72rem;
  color: #bbb;
  text-align: center;
  margin-bottom: 16px;
  font-family: var(--font-inter-variable-regular), sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f0f0f0;
  }
`;

export const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;

  & > * {
    flex: 1;
    min-width: 0;
  }

  & button {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: clamp(0.72rem, 1.5vw, 0.92rem);
    padding-left: 10px;
    padding-right: 10px;
  }
`;