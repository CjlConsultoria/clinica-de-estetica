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

export const FiltersRow = styled.div`
  display: flex;
  gap: 12px;
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
  min-width: 160px;
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
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(187, 161, 136, 0.08);
    color: #BBA188;
  }
`;

export const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

export const ReportCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.25s;
  border: 1.5px solid transparent;

  &:hover {
    border-color: ${({ $color }) => $color};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${({ $color }) => $color}22;
  }
`;

export const ReportIcon = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $color }) => $color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
`;

export const ReportInfo = styled.div`
  flex: 1;
`;

export const ReportTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  margin-bottom: 4px;
`;

export const ReportDesc = styled.div`
  font-size: 0.78rem;
  color: #999;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  line-height: 1.4;
`;

export const ReportAction = styled.button<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1.5px solid ${({ $color }) => $color};
  border-radius: 8px;
  background: transparent;
  color: ${({ $color }) => $color};
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;

  &:hover {
    background: ${({ $color }) => $color};
    color: white;
  }
`;

export const ChartSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
`;

export const ChartTitle = styled.h3`
  font-size: 0.95rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 20px;
  font-weight: 700;
`;

export const PieChart = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: 0 auto 20px;
`;

export const PieSlice = styled.div``;

export const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PieLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #555;

  strong {
    margin-left: auto;
    color: #1a1a1a;
  }
`;

export const LegendDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

export const Th = styled.th<{ $width?: string }>`
  padding: 13px 20px;
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

export const Td = styled.td`
  padding: 13px 20px;
  font-size: 0.88rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #444;
  vertical-align: middle;
`;

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