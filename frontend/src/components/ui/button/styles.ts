import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const variants = {
  primary: css`
    background: linear-gradient(135deg, #a37c5b, #a37c5b);
    color: white;
    border: none;
    &:hover:not(:disabled) { background: linear-gradient(135deg, #aa7c50, #aa7c50); box-shadow: 0 6px 20px rgba(104, 74, 29, 0.23); }
  `,
  secondary: css`
    background: linear-gradient(135deg, #BBA188, #a8906f);
    color: white;
    border: none;
    &:hover:not(:disabled) { background: linear-gradient(135deg, #a8906f, #8f7a5e); box-shadow: 0 6px 20px rgba(187,161,136,0.35); }
  `,
  danger: css`
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    &:hover:not(:disabled) { background: linear-gradient(135deg, #c0392b, #a93226); box-shadow: 0 6px 20px rgba(231,76,60,0.35); }
  `,
  ghost: css`
    background: transparent;
    color: #b49476;
    border: none;
    &:hover:not(:disabled) { background: rgba(109, 87, 55, 0.08); }
  `,
  outline: css`
    background: transparent;
    color: #b49476;
    border: 1.5px solid #b49476;
    &:hover:not(:disabled) { background: rgba(109, 87, 55, 0.08); box-shadow: 0 4px 12px rgba(109, 87, 55, 0.08); }
  `,
};

const sizes = {
  sm: css`padding: 8px 16px; font-size: 0.82rem; gap: 6px;`,
  md: css`padding: 11px 22px; font-size: 0.92rem; gap: 8px;`,
  lg: css`padding: 14px 28px; font-size: 1rem; gap: 10px;`,
};

export const StyledButton = styled.button<{
  $variant: string;
  $size: string;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  ${({ $variant }) => variants[$variant as keyof typeof variants]}
  ${({ $size }) => sizes[$size as keyof typeof sizes]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    display: flex;
    align-items: center;
  }

  .spin {
    animation: ${spin} 0.8s linear infinite;
  }
`;