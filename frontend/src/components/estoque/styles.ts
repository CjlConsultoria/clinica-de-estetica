import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    width: 100%;
    padding: 24px 20px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

/* ── Alert Banner ── */
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
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  color: #533f03;
  line-height: 1.5;

  strong {
    font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  }
`;

/* ── Stats ── */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 18px;
  margin-bottom: 28px;
`;

/* ── Controls ── */
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

  @media (max-width: 768px) {
    max-width: 100%;
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
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #BBA188;
    box-shadow: 0 0 0 3px rgba(187, 161, 136, 0.15);
  }

  &::placeholder {
    color: #bbb;
  }
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
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  font-weight: 500;
  cursor: pointer;
  min-width: 140px;
  justify-content: space-between;
  transition: all 0.2s;

  &:hover {
    border-color: #BBA188;
  }
`;

export const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 200px;
  background: white;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  animation: dropIn 0.18s ease;

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const DropdownItem = styled.div<{ $active?: boolean }>`
  padding: 11px 18px;
  font-size: 0.87rem;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  color: ${({ $active }) => ($active ? '#BBA188' : '#444')};
  background: ${({ $active }) => ($active ? 'rgba(187, 161, 136, 0.1)' : 'white')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.15s;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(187, 161, 136, 0.08);
    color: #BBA188;
  }
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
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e74c3c;
    color: white;
  }
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

export const SectionDivider = styled.div`
  height: 1px;
  background: #ececec;
  margin: 24px 0;
`;

/* ── Tabela ── */
export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 750px;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

export const Th = styled.th<{ $width?: string }>`
  padding: 13px 16px;
  text-align: left;
  font-size: 0.78rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: ${({ $width }) => $width || 'auto'};
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;

  &:hover {
    background: #fdf9f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Td = styled.td<{ colSpan?: number }>`
  padding: 13px 16px;
  font-size: 0.88rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #444;
  vertical-align: middle;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 6px;
`;

export const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  background: white;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #BBA188;
    border-color: #BBA188;
    color: white;
  }
`;

/* ── Badge ── */
export const Badge = styled.span<{ $bg?: string; $color?: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.74rem;
  font-weight: 600;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  background: ${({ $bg }) => $bg || '#f0ebe4'};
  color: ${({ $color }) => $color || '#BBA188'};
`;

/* ── Cards ── */
export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StockCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  transition: all 0.25s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const StockCardTop = styled.div<{ $color: string }>`
  padding: 18px 20px;
  background: ${({ $color }) => $color}0d;
  border-bottom: 2px solid ${({ $color }) => $color}22;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

export const StockCardCategory = styled.div`
  font-size: 0.72rem;
  color: #999;
  font-family: var(--font-roboto-medium), 'Roboto', sans-serif;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StockCardName = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  margin-bottom: 4px;
`;

export const StockAlertBadge = styled.span<{ $bg?: string; $color?: string }>`
  flex-shrink: 0;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  background: ${({ $bg }) => $bg || '#f0ebe4'};
  color: ${({ $color }) => $color || '#BBA188'};
`;

export const StockCardBody = styled.div`
  padding: 16px 20px;
`;

export const StockDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const StockDetailLabel = styled.span`
  font-size: 0.82rem;
  color: #888;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
`;

export const StockDetailValue = styled.span<{ $highlight?: boolean; $color?: string }>`
  font-size: ${({ $highlight }) => ($highlight ? '1rem' : '0.88rem')};
  font-weight: ${({ $highlight }) => ($highlight ? '700' : '600')};
  color: ${({ $color, $highlight }) => $color || ($highlight ? '#1a1a1a' : '#444')};
  font-family: var(--font-roboto-medium), 'Roboto', sans-serif;
`;

export const ProgressBarWrapper = styled.div`
  height: 6px;
  background: #f0f0f0;
  border-radius: 99px;
  margin: 10px 0 4px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 99px;
  transition: width 0.4s ease;
`;

export const StockCardFooter = styled.div`
  padding: 14px 20px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

/* ── Modal Form ── */
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Empty State ── */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
  color: #bbb;
  grid-column: 1 / -1;

  h3 {
    font-size: 1.1rem;
    font-family: var(--font-cabourg-bold), 'Cabourg', serif;
    color: #555;
    margin: 0 0 6px;
  }

  p {
    font-size: 0.88rem;
    color: #999;
    margin: 0;
  }
`;