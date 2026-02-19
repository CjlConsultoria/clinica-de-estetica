import styled from 'styled-components';

export const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
`;

export const StyledInput = styled.input<{ $hasError: boolean; $hasIconLeft: boolean; $hasIconRight: boolean }>`
  width: 100%;
  padding: 11px ${({ $hasIconRight }) => $hasIconRight ? '42px' : '16px'} 11px ${({ $hasIconLeft }) => $hasIconLeft ? '42px' : '16px'};
  border: 1.5px solid ${({ $hasError }) => $hasError ? '#e74c3c' : '#e0e0e0'};
  border-radius: 1000px;
  font-size: 0.92rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  background: white;
  color: #1a1a1a;
  transition: all 0.25s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => $hasError ? '#a8906f' : '#a8906f'};
    box-shadow: 0 0 0 3px ${({ $hasError }) => $hasError ? 'rgba(231,76,60,0.1)' : 'rgba(182, 140, 61, 0.12)'};
  }

  &::placeholder { color: #aaa; }
  &:disabled { background: #f5f5f5; cursor: not-allowed; opacity: 0.7; }
`;

export const ErrorText = styled.span`
  font-size: 0.78rem;
  color: #e74c3c;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
`;

export const HintText = styled.span`
  font-size: 0.78rem;
  color: #999;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
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