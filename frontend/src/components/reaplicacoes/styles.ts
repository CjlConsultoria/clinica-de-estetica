import styled from 'styled-components';

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  @media (max-width: 1024px) { width: 100%; padding: 24px 20px; }
  @media (max-width: 768px)  { padding: 20px 16px; }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0;
  font-weight: 600;
`;

export const AlertBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff3cd;
  border: 1.5px solid #ffc107;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 24px;
`;

export const AlertBannerIcon = styled.div`
  color: #856404;
  flex-shrink: 0;
  margin-top: 1px;
`;

export const AlertBannerText = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #533f03;
  line-height: 1.5;
  strong { font-weight: 700; }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  margin-bottom: 28px;
`;

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 380px;
  @media (max-width: 768px) { max-width: 100%; }
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
  &:focus { outline: none; border-color: #BBA188; box-shadow: 0 0 0 3px rgba(187,161,136,0.15); }
  &::placeholder { color: #bbb; }
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

export const DropdownWrapper = styled.div`
  position: relative;
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
  min-width: 150px;
  justify-content: space-between;
  transition: all 0.2s;
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
  animation: dropIn 0.18s ease;
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export const DropdownItem = styled.div<{ $active?: boolean }>`
  padding: 11px 18px;
  font-size: 0.87rem;
  color: ${({ $active }) => ($active ? '#BBA188' : '#444')};
  background: ${({ $active }) => ($active ? 'rgba(187,161,136,0.1)' : 'white')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
  &:hover { background: rgba(187,161,136,0.08); color: #BBA188; }
`;

export const ClearFilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border: 1.5px solid #e74c3c;
  border-radius: 50px;
  background: white;
  color: #e74c3c;
  font-size: 0.84rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #e74c3c; color: white; }
`;

export const ToggleGroup = styled.div`
  display: flex;
  background: white;
  border-radius: 10px;
  border: 1.5px solid #e8e8e8;
  overflow: hidden;
  margin-left: auto;
`;

export const ToggleBtn = styled.button<{ $active: boolean }>`
  padding: 9px 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? '#BBA188' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : '#888')};
  display: flex;
  align-items: center;
`;

/* ─────────────── Tabela ─────────────── */
/*
 * TableContainer — altura fixa para exatamente 10 linhas (padrão Estoque).
 *
 * Estoque usa TABLE_MIN_HEIGHT = 540px para a área da tabela (TableWrapper).
 * Paginação: 56px (min-height do PaginationWrapper).
 * Total container: 540 + 56 = 596px.
 */
export const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 596px;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  min-height: 540px;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

/* Padrão Estoque: padding 11px 10px, font-size 0.69rem */
export const Th = styled.th<{ $width?: string }>`
  padding: 11px 10px;
  text-align: left;
  font-size: 0.69rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  width: ${({ $width }) => $width || 'auto'};
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
  &:hover { background: #fdf9f5; }
  &:last-child { border-bottom: none; }
`;

/* Padrão Estoque: padding 10px 10px, font-size 0.78rem */
export const Td = styled.td<{ colSpan?: number }>`
  padding: 10px 10px;
  font-size: 0.78rem;
  color: #444;
  vertical-align: middle;
`;

/* Padrão Estoque: padding 3px 7px, font-size 0.68rem */
export const Badge = styled.span<{ $bg?: string; $color?: string }>`
  display: inline-block;
  padding: 3px 7px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 600;
  background: ${({ $bg }) => $bg || '#f0ebe4'};
  color: ${({ $color }) => $color || '#BBA188'};
  white-space: nowrap;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 4px;
`;

/* Padrão Estoque: 30px × 30px */
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

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
  color: #bbb;
  h3 { font-size: 1.1rem; font-family: var(--font-cabourg-bold), 'Cabourg', serif; color: #555; margin: 0 0 6px; }
  p  { font-size: 0.88rem; color: #999; margin: 0; }
`;

export const CardsContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 690px;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const ReapCard = styled.div<{ $urgente?: boolean }>`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  border: 1.5px solid ${({ $urgente }) => ($urgente ? '#fdecea' : 'transparent')};
  transition: all 0.25s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
`;

export const ReapCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 18px 14px;
  border-bottom: 1px solid #f5f5f5;
`;

export const ReapAvatar = styled.div<{ $color: string }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const ReapPatientName = styled.div`
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a1a1a;
`;

export const ReapPatientSub = styled.div`
  font-size: 0.76rem;
  color: #999;
  margin-top: 2px;
`;

export const ReapDaysTag = styled.div<{ $color: string; $bg: string }>`
  flex-shrink: 0;
  padding: 6px 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
`;

export const ReapCardBody = styled.div`
  padding: 14px 18px;
`;

export const ProgressBarOuter = styled.div`
  height: 6px;
  background: #f0f0f0;
  border-radius: 99px;
  overflow: hidden;
`;

export const ProgressBarInner = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 99px;
  transition: width 0.5s ease;
`;

export const ReapRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  &:last-child { margin-bottom: 0; }
`;

export const ReapLabel = styled.span`
  font-size: 0.78rem;
  color: #999;
`;

export const ReapValue = styled.span`
  font-size: 0.84rem;
  color: #333;
  font-weight: 600;
`;

export const ReapCardFooter = styled.div`
  padding: 12px 18px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

/* ─────────────── Paginação ─────────────── */

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid #f0ebe4;
  min-height: 56px;
  flex-shrink: 0;
`;

export const PaginationInfo = styled.span`
  font-size: 0.8rem;
  color: #999;
  font-weight: 400;
  white-space: nowrap;
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $active }) => ($active ? '#BBA188' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#888')};
  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#BBA188' : 'rgba(187,161,136,0.12)')};
    color: ${({ $active }) => ($active ? '#ffffff' : '#BBA188')};
  }
`;

export const PageEllipsis = styled.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: #bbb;
  user-select: none;
`;

export const PaginationArrow = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #BBA188;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover:not(:disabled) { background: rgba(187,161,136,0.12); }
  &:disabled { color: #ddd; cursor: not-allowed; }
`;