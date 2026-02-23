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

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  margin-bottom: 28px;
`;

export const ChartSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  margin-bottom: 28px;
`;

export const ChartTitle = styled.h3`
  font-size: 0.95rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 20px;
  font-weight: 700;
`;

export const BarChart = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  @media (max-width: 600px) { gap: 8px; }
`;

export const BarItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
`;

export const BarFill = styled.div<{ $height: number; $color: string }>`
  width: 100%;
  max-width: 32px;
  height: ${({ $height }) => $height * 1.2}px;
  background: ${({ $color }) => $color};
  border-radius: 4px 4px 0 0;
  transition: height 0.6s ease;
  cursor: pointer;
  &:hover { opacity: 0.8; }
`;

export const BarLabel = styled.div`
  font-size: 0.75rem;
  color: #999;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
`;

export const BarValue = styled.div`
  font-size: 0.7rem;
  color: #aaa;
`;

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
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
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  &:focus { outline: none; border-color: #BBA188; box-shadow: 0 0 0 3px rgba(187, 161, 136, 0.15); }
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
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  font-weight: 500;
  cursor: pointer;
  min-width: 140px;
  justify-content: space-between;
  transition: all 0.2s;
  &:hover { border-color: #BBA188; }
`;

export const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
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
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
  &:hover { background: rgba(187, 161, 136, 0.08); color: #BBA188; }
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
  &:hover { background: #e74c3c; color: white; }
`;

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
  padding: 11px 10px;
  text-align: left;
  font-size: 0.69rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
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

export const Td = styled.td`
  padding: 10px 10px;
  font-size: 0.78rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #444;
  vertical-align: middle;
`;

export const Badge = styled.span<{ $bg?: string; $color?: string }>`
  display: inline-block;
  padding: 3px 7px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 600;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  background: ${({ $bg }) => $bg || '#f0ebe4'};
  color: ${({ $color }) => $color || '#BBA188'};
  white-space: nowrap;
`;

export const TypeBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 3px 9px;
  min-width: 80px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  white-space: nowrap;
  background: ${({ $type }) =>
    $type === 'receita' ? 'rgba(187, 161, 136, 0.15)' : 'rgba(231, 76, 60, 0.1)'};
  color: ${({ $type }) => ($type === 'receita' ? '#BBA188' : '#e74c3c')};
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

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
  color: #bbb;
  h3 { font-size: 1.1rem; color: #555; margin: 0 0 6px; }
  p { font-size: 0.88rem; color: #999; margin: 0; }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Novos componentes — Seção Fatura (view empresa)
───────────────────────────────────────────────────────────────────────────── */

export const FaturaSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  margin-bottom: 28px;
  border-left: 4px solid #BBA188;
`;

export const FaturaCard = styled.div<{ $highlight?: boolean }>`
  background: ${({ $highlight }) => $highlight ? 'linear-gradient(135deg, #fdfaf7 0%, #f9f4ef 100%)' : '#fafafa'};
  border: 1.5px solid ${({ $highlight }) => $highlight ? 'rgba(187,161,136,0.35)' : '#f0f0f0'};
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    grid-column: span 2;
  }
`;

export const FaturaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const FaturaStatus = styled.span<{ $status: 'pago' | 'pendente' | 'vencido' | 'cancelado' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  background: ${({ $status }) => ({
    pago:      'rgba(138,117,96,0.12)',
    pendente:  'rgba(234,179,8,0.12)',
    vencido:   'rgba(231,76,60,0.12)',
    cancelado: 'rgba(150,150,150,0.12)',
  }[$status])};
  color: ${({ $status }) => ({
    pago:      '#8a7560',
    pendente:  '#ca8a04',
    vencido:   '#e74c3c',
    cancelado: '#888',
  }[$status])};
`;

export const FaturaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  border-top: 1px solid rgba(187,161,136,0.15);
  border-bottom: 1px solid rgba(187,161,136,0.15);
  margin-bottom: 16px;
`;

export const FaturaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FaturaLabel = styled.span`
  font-size: 0.78rem;
  color: #999;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
`;

export const FaturaValue = styled.span<{ $alert?: boolean }>`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ $alert }) => ($alert ? '#e74c3c' : '#444')};
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
`;

export const FaturaActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;