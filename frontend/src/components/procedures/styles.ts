import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    padding: 72px 20px 24px;
  }

  @media (max-width: 768px) {
    padding: 72px 14px 20px;
  }

  @media (max-width: 480px) {
    padding: 68px 12px 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  gap: 16px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;
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

  @media (max-width: 768px) {
    font-size: 1.6rem;
    grid-column: 1;
    grid-row: 1;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;

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

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 10px 14px 10px 40px;
  }
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DropdownWrapper = styled.div`
  position: relative;

  @media (max-width: 768px) {
    flex: 1;
  }
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
  min-width: 160px;
  justify-content: space-between;
  transition: all 0.2s;
  width: 100%;

  &:hover { border-color: #BBA188; }

  @media (max-width: 480px) {
    font-size: 0.84rem;
    padding: 9px 14px;
    min-width: unset;
  }
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
  transition: all 0.15s;
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
  white-space: nowrap;
  flex-shrink: 0;

  &:hover { background: #e74c3c; color: white; }

  @media (max-width: 480px) {
    font-size: 0.78rem;
    padding: 8px 12px;
  }
`;

export const ToggleGroup = styled.div`
  display: flex;
  background: white;
  border-radius: 10px;
  border: 1.5px solid #e8e8e8;
  overflow: hidden;
  margin-left: auto;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-left: 0;
    align-self: flex-end;
  }
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

export const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 596px;

  @media (max-width: 768px) {
    height: auto;
    border-radius: 12px;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  min-height: 540px;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    min-height: unset;
    overflow-y: auto;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;

  @media (max-width: 768px) {
    table-layout: auto;
    min-width: 580px;
  }
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

export const Th = styled.th<{ $width?: string }>`
  padding: 11px 10px;
  text-align: left;
  font-size: 0.69rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
  overflow: hidden;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;

  &:hover { background: #fdf9f5; }
  &:last-child { border-bottom: none; }
`;

export const Td = styled.td<{ colSpan?: number }>`
  padding: 10px 10px;
  font-size: 0.78rem;
  color: #444;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ActionGroup = styled.div`
  display: flex;
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

export const CardsContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 640px;

  @media (max-width: 768px) {
    height: auto;
    border-radius: 12px;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const ProcCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  transition: all 0.25s;

  &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

export const ProcCardHeader = styled.div<{ $color: string }>`
  padding: 20px;
  background: ${({ $color }) => $color}0d;
  border-bottom: 2px solid ${({ $color }) => $color}22;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  @media (max-width: 480px) {
    padding: 14px;
    gap: 10px;
  }
`;

export const ProcCode = styled.div`
  font-size: 0.72rem;
  color: #999;
  margin-bottom: 4px;
`;

export const ProcName = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;

  @media (max-width: 480px) {
    font-size: 0.88rem;
  }
`;

export const ProcDetails = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 480px) {
    padding: 12px 14px;
    gap: 6px;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DetailLabel = styled.span`
  font-size: 0.82rem;
  color: #888;

  @media (max-width: 480px) {
    font-size: 0.76rem;
  }
`;

export const DetailValue = styled.span<{ $highlight?: boolean }>`
  font-size: ${({ $highlight }) => ($highlight ? '1rem' : '0.88rem')};
  font-weight: ${({ $highlight }) => ($highlight ? '700' : '600')};
  color: ${({ $highlight }) => ($highlight ? '#1a1a1a' : '#444')};

  @media (max-width: 480px) {
    font-size: ${({ $highlight }) => ($highlight ? '0.92rem' : '0.82rem')};
  }
`;

export const ProcActions = styled.div`
  padding: 14px 20px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    padding: 10px 14px;
  }
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

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;

    & > * {
      grid-column: 1 !important;
    }
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid #f0ebe4;
  min-height: 56px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: 8px;
    padding: 12px 14px;
    justify-content: space-between;
  }
`;

export const PaginationInfo = styled.span`
  font-size: 0.8rem;
  color: #999;
  font-weight: 400;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.72rem;
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 480px) {
    gap: 2px;
  }
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

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 0.74rem;
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

  @media (max-width: 480px) {
    width: 24px;
    height: 28px;
    font-size: 0.75rem;
  }
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

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;