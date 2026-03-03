import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  overflow-x: hidden;
  animation: ${fadeUp} 0.35s ease;

  @media (max-width: 1024px) { padding: 72px 20px 24px; }
  @media (max-width: 768px)  { padding: 72px 14px 20px; }
  @media (max-width: 480px)  { padding: 68px 12px 20px; }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  gap: 16px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 12px;
    row-gap: 10px;
    margin-bottom: 20px;
    align-items: center;

    & > button {
      grid-column: 1 / -1;
      grid-row: 2;
      width: 100%;
      justify-content: center;
    }
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
  gap: 18px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 16px;
  }
`;

export const StatBox = styled.div<{ $color?: string }>`
  background: white;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border-left: 4px solid ${p => p.$color ?? '#BBA188'};

  @media (max-width: 480px) {
    padding: 14px 12px;
  }
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
  padding: ${p => p.$small ? '7px 14px' : '9px 20px'};
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: ${p => p.$small ? '0.78rem' : '0.85rem'};
  transition: all 0.2s;
  background: ${p => p.$active ? '#BBA188' : 'transparent'};
  color: ${p => p.$active ? 'white' : '#888'};
  font-family: inherit;

  &:hover {
    background: ${p => p.$active ? '#BBA188' : 'rgba(187,161,136,0.1)'};
    color: ${p => p.$active ? 'white' : '#BBA188'};
  }

  @media (max-width: 480px) {
    padding: ${p => p.$small ? '6px 10px' : '7px 12px'};
    font-size: 0.72rem;
  }
`;

export const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  white-space: nowrap;
`;

export const PrioridadeBadge = styled.span<{ $color: string }>`
  font-size: 0.68rem;
  font-weight: 700;
  color: ${p => p.$color};
  background: ${p => p.$color}18;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
`;

export const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TicketCard = styled.div<{ $clickable?: boolean }>`
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 20px 22px;
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
  border: 1.5px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: ${p => p.$clickable ? '#BBA18855' : 'transparent'};
    box-shadow: ${p => p.$clickable ? '0 4px 16px rgba(187,161,136,0.12)' : '0 2px 8px rgba(0,0,0,0.05)'};
  }

  @media (max-width: 480px) { padding: 16px; }
`;

export const TicketCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const TicketCardTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
  flex: 1;
`;

export const TicketCardMeta = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  margin-bottom: 10px;
`;

export const TicketCardBody = styled.div`
  font-size: 0.82rem;
  color: #555;
  line-height: 1.5;
`;

export const DetailWrap = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
`;

export const DetailTopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 22px 16px;
  border-bottom: 1px solid #f5f5f5;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    padding: 16px 16px 14px;
  }
`;

export const DetailTopLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DetailTopTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
`;

export const DetailTopMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9px;
  border: 1.5px solid #e8e8e8;
  background: white;
  font-size: 0.78rem;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;
  font-family: inherit;

  &:hover { border-color: #BBA188; color: #BBA188; }
`;

export const ChatArea = styled.div`
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 260px;
  max-height: 400px;
  overflow-y: auto;
  background: #fafafa;

  @media (max-width: 480px) { padding: 14px; }
`;

export const MsgRow = styled.div<{ $fromSupport?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${p => p.$fromSupport ? 'flex-start' : 'flex-end'};
`;

export const MsgBubble = styled.div<{ $fromSupport?: boolean }>`
  background: ${p => p.$fromSupport ? 'white' : 'rgba(187,161,136,0.14)'};
  border: 1.5px solid ${p => p.$fromSupport ? '#e8e8e8' : 'rgba(187,161,136,0.3)'};
  color: #333;
  border-radius: ${p => p.$fromSupport ? '4px 14px 14px 14px' : '14px 4px 14px 14px'};
  padding: 11px 15px;
  font-size: 0.83rem;
  line-height: 1.55;
  max-width: 75%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);

  @media (max-width: 480px) {
    max-width: 90%;
    font-size: 0.8rem;
  }
`;

export const MsgAuthor = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  color: #BBA188;
  margin-bottom: 3px;
`;

export const MsgTime = styled.div`
  font-size: 0.65rem;
  color: #ccc;
  margin-top: 4px;
`;

export const ReplyBox = styled.div`
  padding: 16px 22px 20px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 480px) { padding: 12px 14px 16px; }
`;

export const ReplyTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.875rem;
  color: #333;
  background: white;
  resize: none;
  outline: none;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.2s;

  &:focus { border-color: #BBA188; }
  &::placeholder { color: #bbb; }
`;

export const ReplyFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    & > * { grid-column: 1 !important; }
  }
`;

export const Btn = styled.button<{ $variant?: 'primary' | 'danger' | 'ghost'; $size?: 'sm'; $full?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: ${p => p.$size === 'sm' ? '8px 14px' : '10px 20px'};
  border-radius: 10px;
  font-size: ${p => p.$size === 'sm' ? '0.78rem' : '0.83rem'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: ${p => p.$full ? '100%' : 'auto'};
  justify-content: center;
  font-family: inherit;

  ${p => {
    if (p.$variant === 'primary') return `
      background: #1a1a1a; color: white; border: 1.5px solid transparent;
      &:hover { background: #333; }
    `;
    if (p.$variant === 'danger') return `
      background: rgba(231,76,60,0.08); color: #e74c3c; border: 1.5px solid rgba(231,76,60,0.25);
      &:hover { background: rgba(231,76,60,0.14); }
    `;
    return `
      background: white; color: #555; border: 1.5px solid #e8e8e8;
      &:hover { border-color: #BBA188; color: #BBA188; }
    `;
  }}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  background: white;
  border-radius: 16px;
  gap: 12px;
  color: #bbb;
  font-size: 0.85rem;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 2.5rem;
  opacity: 0.4;
`;