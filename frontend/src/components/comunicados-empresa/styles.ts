import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  animation: ${fadeUp} 0.35s ease;

  @media (max-width: 1024px) { padding: 72px 20px 24px; }
  @media (max-width: 768px)  { padding: 72px 14px 20px; }
  @media (max-width: 480px)  { padding: 68px 12px 20px; }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
    gap: 12px;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0;
  font-weight: 600;

  @media (max-width: 768px) { font-size: 1.6rem; }
  @media (max-width: 480px) { font-size: 1.4rem; }
`;

export const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #aaa;
  margin: 5px 0 0;
`;


export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { gap: 10px; }
`;

export const StatBox = styled.div<{ $color?: string }>`
  background: white;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border-left: 4px solid ${p => p.$color ?? '#BBA188'};
`;

export const StatBoxValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-cabourg-bold), serif;
`;

export const StatBoxLabel = styled.div`
  font-size: 0.72rem;
  color: #aaa;
  font-weight: 600;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;


export const TabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  padding: 8px 18px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.82rem;
  transition: all 0.2s;
  font-family: inherit;
  background: ${p => p.$active ? '#BBA188' : 'transparent'};
  color: ${p => p.$active ? 'white' : '#888'};

  &:hover {
    background: ${p => p.$active ? '#BBA188' : 'rgba(187,161,136,0.1)'};
    color: ${p => p.$active ? 'white' : '#BBA188'};
  }
`;


export const ComunicadoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ComunicadoCard = styled.div<{ $lido: boolean }>`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1.5px solid ${p => p.$lido ? 'transparent' : 'rgba(187,161,136,0.35)'};
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
  position: relative;
  ${p => !p.$lido && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #BBA188;
      border-radius: 16px 0 0 16px;
    }
  `}

  &:hover {
    box-shadow: 0 4px 16px rgba(187,161,136,0.12);
  }
`;

export const ComunicadoCardInner = styled.div`
  padding: 20px 22px;
  position: relative;

  @media (max-width: 480px) { padding: 16px 16px; }
`;

export const UnreadDot = styled.div`
  position: absolute;
  top: 20px;
  right: 22px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e74c3c;
  animation: ${pulse} 2s ease-in-out infinite;

  @media (max-width: 480px) { top: 16px; right: 16px; }
`;

export const ComunicadoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const ComunicadoTitle = styled.div<{ $lido: boolean }>`
  font-size: 0.92rem;
  font-weight: ${p => p.$lido ? 600 : 700};
  color: ${p => p.$lido ? '#555' : '#1a1a1a'};
  line-height: 1.4;
  margin-bottom: 6px;

  @media (max-width: 480px) { font-size: 0.86rem; }
`;

export const ComunicadoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const ComunicadoBody = styled.div<{ $lido: boolean }>`
  font-size: 0.83rem;
  color: ${p => p.$lido ? '#999' : '#555'};
  line-height: 1.6;

  @media (max-width: 480px) { font-size: 0.79rem; }
`;

export const ComunicadoFooter = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;


export const BadgeTipo = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  white-space: nowrap;
`;

export const BadgeNovo = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  background: rgba(231,76,60,0.1);
  color: #e74c3c;
  white-space: nowrap;
`;


export const MarkBtn = styled.button<{ $small?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${p => p.$small ? '7px 14px' : '9px 18px'};
  border-radius: 9px;
  border: 1.5px solid #eee;
  background: white;
  font-size: ${p => p.$small ? '0.76rem' : '0.82rem'};
  font-weight: 600;
  color: #8a7560;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  white-space: nowrap;

  &:hover {
    border-color: #BBA188;
    color: #BBA188;
    background: rgba(187,161,136,0.06);
  }
`;


export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  background: white;
  border-radius: 16px;
  gap: 10px;
  color: #bbb;
  font-size: 0.85rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

export const EmptyIcon = styled.div`
  font-size: 2.5rem;
  opacity: 0.5;
  margin-bottom: 4px;
`;