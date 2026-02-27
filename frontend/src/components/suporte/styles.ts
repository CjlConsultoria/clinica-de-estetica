import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Layout base (idêntico ao Pacientes) ──────────────────────────────────────

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
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 20px;
    gap: 4px;
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

// ─── Barra de impersonação ────────────────────────────────────────────────────

export const ImpersonateBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(59,130,246,0.1);
  border: 1.5px solid rgba(59,130,246,0.3);
  border-radius: 12px;
  padding: 12px 18px;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ImpersonateText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.83rem;
  color: #3b82f6;
  font-weight: 500;
  svg { flex-shrink: 0; }
`;

export const ImpersonateBtn = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  border: 1.5px solid rgba(59,130,246,0.4);
  background: white;
  font-size: 0.78rem;
  font-weight: 600;
  color: #3b82f6;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  &:hover { background: rgba(59,130,246,0.08); }
`;

// ─── Stats (idêntico ao Pacientes) ───────────────────────────────────────────

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 28px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const StatBox = styled.div<{ $alert?: boolean }>`
  background: white;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border-left: 4px solid ${p => p.$alert ? '#e74c3c' : '#BBA188'};
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

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const TabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 4px;
    & > button { flex: 1; }
  }
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
    padding: ${p => p.$small ? '7px 10px' : '8px 14px'};
    font-size: 0.75rem;
    text-align: center;
  }
`;

// ─── Controls / Search / Filtros (idêntico ao Pacientes) ─────────────────────

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 380px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

export const SearchIconWrap = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #bbb;
  pointer-events: none;
  display: flex;
`;

export const SearchInputStyled = styled.input`
  width: 100%;
  padding: 11px 16px 11px 42px;
  border: 1.5px solid #e8e8e8;
  border-radius: 50px;
  font-size: 0.9rem;
  background: white;
  color: #333;
  transition: all 0.25s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #BBA188;
    box-shadow: 0 0 0 3px rgba(187,161,136,0.15);
  }
  &::placeholder { color: #bbb; }
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) { width: 100%; }
`;

export const DropdownWrapper = styled.div`
  position: relative;

  @media (max-width: 768px) { flex: 1; }
`;

export const DropdownBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border: 1.5px solid #e8e8e8;
  border-radius: 50px;
  background: white;
  color: #444;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  min-width: 130px;
  justify-content: space-between;
  transition: all 0.2s;
  width: 100%;

  &:hover { border-color: #BBA188; }
`;

export const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 100%;
  background: white;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  z-index: 100;
  overflow: hidden;
`;

export const DropdownItem = styled.div<{ $active?: boolean }>`
  padding: 10px 18px;
  font-size: 0.87rem;
  color: ${({ $active }) => ($active ? '#BBA188' : '#444')};
  background: ${({ $active }) => ($active ? 'rgba(187,161,136,0.1)' : 'white')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(187,161,136,0.08); color: #BBA188; }
`;

// ─── Tabela (header gradient igual ao Pacientes) ──────────────────────────────

export const TableWrapper = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  @media (max-width: 768px) {
    table-layout: auto;
    min-width: 540px;
  }
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

export const Th = styled.th<{ $width?: string; $center?: boolean }>`
  padding: 11px 10px;
  text-align: ${({ $center }) => $center ? 'center' : 'left'};
  font-size: 0.69rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;

  &:hover { background: #fdf9f5; }
  &:last-child { border-bottom: none; }
`;

export const Td = styled.td<{ $center?: boolean; $bold?: boolean; $muted?: boolean }>`
  padding: 10px 10px;
  font-size: 0.78rem;
  color: ${({ $muted }) => $muted ? '#777' : '#333'};
  font-weight: ${({ $bold }) => $bold ? '700' : '400'};
  text-align: ${({ $center }) => $center ? 'center' : 'left'};
  vertical-align: middle;
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

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const IconBtn = styled.button`
  width: 30px;
  height: 30px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  background: white;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover { background: #BBA188; border-color: #BBA188; color: white; }
`;

export const Btn = styled.button<{ $variant?: string; $size?: string; $full?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: ${p => p.$size === 'sm' ? '8px 14px' : '10px 20px'};
  border-radius: 10px;
  font-size: ${p => p.$size === 'sm' ? '0.78rem' : '0.83rem'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid transparent;
  width: ${p => p.$full ? '100%' : 'auto'};
  justify-content: center;
  ${p => p.$variant === 'primary' ? `
    background: #1a1a1a; color: white;
    &:hover { background: #333; }
  ` : `
    background: white; color: #555; border-color: #e8e8e8;
    &:hover { border-color: #BBA188; color: #BBA188; }
  `}
`;

// ─── Painel de detalhe lateral ────────────────────────────────────────────────

export const DetailPanel = styled.div`
  width: 320px;
  flex-shrink: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  overflow: hidden;
  align-self: flex-start;

  @media (max-width: 1024px) { display: none; }
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 14px;
  border-bottom: 1px solid #f5f5f5;
`;

export const DetailClose = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1.5px solid #e8e8e8;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #888;
  transition: all 0.15s;
  flex-shrink: 0;
  &:hover { border-color: #e74c3c; color: #e74c3c; }
`;

export const DetailTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
`;

export const DetailSub = styled.div`
  font-size: 0.72rem;
  color: #aaa;
  margin-top: 2px;
`;

export const DetailSection = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
`;

export const DetailSectionTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  gap: 8px;
`;

export const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  font-weight: 500;
  flex-shrink: 0;
`;

export const InfoValue = styled.div`
  font-size: 0.78rem;
  color: #333;
  font-weight: 600;
  text-align: right;
`;

export const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LogItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const LogDot = styled.div<{ $tipo: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
  background: ${p =>
    p.$tipo === 'danger'  ? '#e74c3c' :
    p.$tipo === 'warning' ? '#d68a00' :
    p.$tipo === 'success' ? '#8a7560' : '#3b82f6'};
`;

export const LogText = styled.div`
  flex: 1;
  font-size: 0.75rem;
  color: #555;
  line-height: 1.4;
`;

export const LogTime = styled.div`
  font-size: 0.68rem;
  color: #ccc;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  text-align: center;
  color: #bbb;

  svg { margin-bottom: 14px; opacity: 0.35; }
  h3  { font-size: 1rem; color: #555; margin: 0 0 5px; }
  p   { font-size: 0.85rem; color: #999; margin: 0; }
`;

// ─── Tickets ──────────────────────────────────────────────────────────────────

export const TicketCard = styled.div`
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 20px 22px;

  @media (max-width: 480px) { padding: 16px; }
`;

export const TicketHeader = styled.div`
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

export const TicketTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
  flex: 1;
`;

export const TicketMeta = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  margin-bottom: 10px;
`;

export const TicketBody = styled.div`
  font-size: 0.82rem;
  color: #555;
  line-height: 1.5;
`;

export const TicketBadge = styled.span<{ $color: string }>`
  font-size: 0.68rem;
  font-weight: 700;
  color: ${p => p.$color};
  background: ${p => p.$color}18;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
`;