import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: all 0.3s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
`;

export const IconWrapper = styled.div<{ $color: string }>`
  width: 56px; height: 56px;
  border-radius: 14px;
  background: ${({ $color }) => $color}18;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  svg { color: ${({ $color }) => $color}; }
`;

export const Info = styled.div`flex: 1;`;

export const CardLabel = styled.div`
  font-size: 0.82rem;
  color: #888;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  margin-bottom: 4px;
  font-weight: 500;
`;

export const CardValue = styled.div`
  font-size: 1.35rem;
  font-family: var(--font-roboto-medium), 'Roboto', sans-serif;
  color: #1a1a1a;
  font-weight: 700;
  line-height: 1;
`;

export const CardTrend = styled.div<{ $positive: boolean }>`
  font-size: 0.78rem;
  color: ${({ $positive }) => $positive ? '#a8906f' : '#a8906f'};
  margin-top: 6px;
  font-weight: 600;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
`;