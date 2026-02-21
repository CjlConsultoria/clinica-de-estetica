import styled, { keyframes } from 'styled-components';

const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
`;

export const StyledInput = styled.input<{
  $hasError: boolean;
  $hasIconLeft: boolean;
  $hasIconRight: boolean;
}>`
  width: 100%;
  height: 48px;
  padding: 0 ${({ $hasIconRight }) => ($hasIconRight ? '44px' : '18px')} 0
    ${({ $hasIconLeft }) => ($hasIconLeft ? '44px' : '18px')};
  border: 1.5px solid ${({ $hasError }) => ($hasError ? '#ab031d' : '#e0e0e0')};
  border-radius: 1000px;
  font-size: 0.92rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  background: white;
  color: #1a1a1a;
  transition: all 0.25s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#ab031d' : '#BBA188')};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? 'rgba(171,3,29,0.1)' : 'rgba(187,161,136,0.15)'};
  }

  &::placeholder { color: #bbb; }
  &:disabled { background: #f5f5f5; cursor: not-allowed; opacity: 0.7; }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #1a1a1a !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

/* ── Texto de erro: mesma cor da borda (#ab031d), ícone, borda esquerda ── */
export const ErrorText = styled.div`
  padding: 8px 12px;
  background-color: transparent;
  border-left: 3px solid #ab031d;
  border-radius: 8px;
  color: #ab031d;
  font-size: 0.82rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  animation: ${fadeInDown} 0.3s ease;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;

  svg { flex-shrink: 0; }
`;

export const HintText = styled.span`
  font-size: 0.78rem;
  color: #999;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  padding-left: 4px;
`;

export const IconLeft = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  display: flex;
  pointer-events: none;
`;

export const IconRight = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  display: flex;
`;