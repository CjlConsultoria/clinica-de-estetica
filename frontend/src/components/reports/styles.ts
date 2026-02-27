import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;

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
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
    gap: 12px;
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

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    gap: 10px;

    & > button {
      flex: 1;
    }
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
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  font-weight: 500;
  cursor: pointer;
  min-width: 160px;
  justify-content: space-between;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    border-color: #BBA188;
  }

  @media (max-width: 480px) {
    min-width: 0;
    padding: 9px 14px;
    font-size: 0.82rem;
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

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
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

  @media (max-width: 480px) {
    padding: 16px;
    gap: 10px;
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

  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
    font-size: 1.1rem;
  }
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

  @media (max-width: 480px) {
    font-size: 0.84rem;
  }
`;

export const ReportDesc = styled.div`
  font-size: 0.78rem;
  color: #999;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 0.72rem;
  }
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

  @media (max-width: 480px) {
    font-size: 0.74rem;
    padding: 7px 12px;
  }
`;

export const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 480px) {
    margin-top: 16px;
    gap: 14px;
  }
`;

export const ChartSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);

  @media (max-width: 480px) {
    padding: 18px 16px;
  }
`;

export const ChartTitle = styled.h3`
  font-size: 0.95rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 20px;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 0.88rem;
    margin-bottom: 14px;
  }
`;

export const PieChart = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: 0 auto 20px;

  @media (max-width: 480px) {
    width: 110px;
    height: 110px;
    margin-bottom: 14px;
  }
`;

export const PieSlice = styled.div``;

export const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
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

  @media (max-width: 480px) {
    font-size: 0.72rem;
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

  @media (max-width: 768px) {
    -webkit-overflow-scrolling: touch;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;
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

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.68rem;
  }
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

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.78rem;
  }
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