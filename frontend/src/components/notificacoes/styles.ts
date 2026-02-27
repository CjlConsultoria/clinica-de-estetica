import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
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

  @media (max-width: 768px) { margin-bottom: 20px; }
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

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 768px)  { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px)  { gap: 10px; }
`;

export const StatBox = styled.div<{ $color?: string }>`
  background: white;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border-left: 4px solid ${p => p.$color ?? '#BBA188'};

  @media (max-width: 480px) { padding: 14px 12px; }
`;

export const StatBoxValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-cabourg-bold), serif;

  @media (max-width: 480px) { font-size: 1.3rem; }
`;

export const StatBoxLabel = styled.div`
  font-size: 0.72rem;
  color: #aaa;
  font-weight: 600;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.4px;

  @media (max-width: 480px) { font-size: 0.65rem; }
`;

export const TabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const TabBtn = styled.button<{ $active: boolean; $small?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${p => p.$small ? '6px 14px' : '8px 18px'};
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: ${p => p.$small ? '0.78rem' : '0.82rem'};
  transition: all 0.2s;
  font-family: inherit;
  background: ${p => p.$active ? '#BBA188' : 'transparent'};
  color: ${p => p.$active ? 'white' : '#888'};

  &:hover {
    background: ${p => p.$active ? '#BBA188' : 'rgba(187,161,136,0.1)'};
    color: ${p => p.$active ? 'white' : '#BBA188'};
  }
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 180px;
  max-width: 340px;

  @media (max-width: 768px) { max-width: 100%; }
`;

export const SearchIconWrap = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #bbb;
  display: flex;
  align-items: center;
`;

export const SearchInputStyled = styled.input`
  width: 100%;
  padding: 9px 12px 9px 36px;
  border-radius: 10px;
  border: 1.5px solid #eee;
  font-size: 0.82rem;
  background: white;
  color: #1a1a1a;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus    { outline: none; border-color: #BBA188; }
  &::placeholder { color: #ccc; }
`;

export const NotifList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const NotifCard = styled.div<{ $lida: boolean }>`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1.5px solid ${p => p.$lida ? 'transparent' : 'rgba(187,161,136,0.25)'};
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
  position: relative;
  animation: ${slideIn} 0.25s ease;
  cursor: pointer;

  ${p => !p.$lida && `
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

  &:hover { box-shadow: 0 4px 16px rgba(187,161,136,0.12); }
`;

export const NotifCardInner = styled.div`
  padding: 18px 22px;
  display: flex;
  align-items: flex-start;
  gap: 14px;

  @media (max-width: 480px) { padding: 14px 16px; gap: 10px; }
`;

export const NotifIconWrap = styled.div<{ $bg: string; $color?: string }>`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${p => p.$bg};
  border: 1.5px solid ${p => p.$color ? `${p.$color}22` : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${p => p.$color ?? '#8a7560'};

  svg {
    display: block;
    flex-shrink: 0;
  }
`;

export const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotifHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
`;

export const NotifTitle = styled.div<{ $lida: boolean }>`
  font-size: 0.88rem;
  font-weight: ${p => p.$lida ? 600 : 700};
  color: ${p => p.$lida ? '#555' : '#1a1a1a'};
  line-height: 1.4;
`;

export const NotifMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

export const NotifBody = styled.div<{ $lida: boolean }>`
  font-size: 0.80rem;
  color: ${p => p.$lida ? '#aaa' : '#666'};
  line-height: 1.5;
`;

export const NotifTime = styled.span`
  font-size: 0.72rem;
  color: #bbb;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const UnreadDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #e74c3c;
  flex-shrink: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 700;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  white-space: nowrap;
`;

export const BadgeNova = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 700;
  background: rgba(231,76,60,0.1);
  color: #e74c3c;
  white-space: nowrap;
`;

export const BadgeEmpresa = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  background: rgba(187,161,136,0.1);
  color: #8a7560;
  white-space: nowrap;
`;

export const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 7px;
  border: 1.5px solid #eee;
  background: white;
  font-size: 0.73rem;
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

export const DetailOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.2);
  z-index: 100;
  animation: ${fadeUp} 0.2s ease;
`;

export const DetailPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  max-width: 95vw;
  background: white;
  box-shadow: -4px 0 24px rgba(0,0,0,0.1);
  z-index: 101;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.25s ease;
  overflow: hidden;
`;

export const DetailHeader = styled.div`
  padding: 24px 24px 18px;
  border-bottom: 1px solid #f0ebe4;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const DetailTitle = styled.div`
  font-size: 0.98rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
`;

export const DetailClose = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover { background: #eee; color: #555; }
`;

export const DetailBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const DetailSection = styled.div`
  background: #faf9f7;
  border-radius: 12px;
  padding: 16px;
`;

export const DetailSectionTitle = styled.div`
  font-size: 0.70rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #f0ebe4;

  &:last-child { border-bottom: none; }
`;

export const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  font-weight: 600;
  flex-shrink: 0;
`;

export const InfoValue = styled.div`
  font-size: 0.81rem;
  color: #1a1a1a;
  font-weight: 600;
  text-align: right;
`;

export const DetailFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f0ebe4;
  display: flex;
  gap: 8px;
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
  opacity: 0.7;
  margin-bottom: 4px;
  line-height: 1;
`;

export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9px;
  border: 1.5px solid #eee;
  background: white;
  color: #888;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover { border-color: #BBA188; color: #BBA188; }
`;

export const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 1px solid #f0ebe4;
  z-index: 50;
  min-width: 160px;
  overflow: hidden;
`;

export const DropdownItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 9px 14px;
  border: none;
  background: ${p => p.$active ? 'rgba(187,161,136,0.08)' : 'white'};
  color: ${p => p.$active ? '#BBA188' : '#555'};
  font-size: 0.8rem;
  font-weight: ${p => p.$active ? 700 : 500};
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover { background: rgba(187,161,136,0.06); }
`;