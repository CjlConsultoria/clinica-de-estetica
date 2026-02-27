import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

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
  animation: ${fadeUp} 0.35s ease;
  @media (max-width: 1024px) { padding: 72px 20px 24px; }
  @media (max-width: 768px)  { padding: 72px 14px 20px; }
  @media (max-width: 480px)  { padding: 68px 12px 20px; }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0;
  font-weight: 700;
  @media (max-width: 768px) { font-size: 1.6rem; }
  @media (max-width: 480px) { font-size: 1.4rem; }
`;

export const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #aaa;
  margin: 5px 0 0;
  text-transform: capitalize;
`;

export const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(187,161,136,0.1);
  border: 1.5px solid rgba(187,161,136,0.3);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #BBA188;
  letter-spacing: 0.5px;
  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #BBA188;
    box-shadow: 0 0 0 3px rgba(187,161,136,0.25);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(187,161,136,0.25); }
    50%       { box-shadow: 0 0 0 6px rgba(187,161,136,0.1); }
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

export const StatCard = styled.div<{ $accent: string }>`
  background: white;
  border-radius: 16px;
  padding: 22px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-left: 4px solid ${p => p.$accent};
  position: relative;
  overflow: hidden;
`;

export const StatIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${p => p.$color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$color};
  margin-bottom: 14px;
`;

export const StatLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

export const StatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-cabourg-bold), serif;
  margin-bottom: 6px;
  @media (max-width: 480px) { font-size: 1.3rem; }
`;

export const StatTrend = styled.div<{ $positive: boolean }>`
  font-size: 0.72rem;
  color: ${p => p.$positive ? '#8a7560' : '#e74c3c'};
  font-weight: 600;
`;

export const SectionTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 14px;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px)  { grid-template-columns: 1fr; & > * { grid-column: 1 / -1 !important; } }
`;

export const Card = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  overflow: hidden;
  min-width: 0;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 14px;
  border-bottom: 1px solid #f5f5f5;
`;

export const CardTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
`;

export const CardBody = styled.div`
  padding: 20px 22px;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: #fdf9f5;
`;

export const Th = styled.th`
  padding: 11px 14px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-top: 1px solid #f8f8f8;
  transition: background 0.15s;
  &:hover { background: rgba(187,161,136,0.03); }
`;

export const Td = styled.td`
  padding: 12px 14px;
  font-size: 0.83rem;
  color: #333;
  vertical-align: middle;
`;

export const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  white-space: nowrap;
`;

export const ChartArea = styled.div`
  padding: 8px 0 0;
`;

export const ChartBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 140px;
  padding-bottom: 24px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    height: 1px;
    background: #f0ebe4;
  }
`;

export const ChartBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
  justify-content: flex-end;
`;

export const ChartBarFill = styled.div<{ $height: number; $current: boolean }>`
  width: 100%;
  height: ${p => p.$height}%;
  background: ${p => p.$current ? 'linear-gradient(180deg, #BBA188, #a8906f)' : '#f0ebe4'};
  border-radius: 6px 6px 0 0;
  transition: height 0.6s ease;
  min-height: 4px;
`;

export const ChartBarLabel = styled.div`
  font-size: 0.68rem;
  color: #aaa;
  font-weight: 600;
  position: absolute;
  bottom: 6px;
`;

export const ChartBarValue = styled.div`
  font-size: 0.65rem;
  color: #888;
  font-weight: 600;
  margin-bottom: 2px;
`;

export const AlertList = styled.div``;

export const AlertItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid #f8f8f8;
  &:last-child { border-bottom: none; }
`;

export const AlertDot = styled.div<{ $tipo: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
  background: ${p =>
    p.$tipo === 'danger'  ? '#e74c3c' :
    p.$tipo === 'warning' ? '#d68a00' :
    p.$tipo === 'success' ? '#8a7560' : '#3b82f6'};
`;

export const AlertText = styled.div`
  flex: 1;
  font-size: 0.8rem;
  color: #444;
  line-height: 1.4;
`;

export const AlertTime = styled.div`
  font-size: 0.7rem;
  color: #bbb;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

export const QuickCard = styled(Link)<{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 10px;
  background: #fdf9f5;
  border-radius: 14px;
  border: 1.5px solid transparent;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    border-color: ${p => p.$color};
    background: white;
    box-shadow: 0 4px 14px ${p => p.$color}22;
    transform: translateY(-2px);
  }
`;

export const QuickIcon = styled.div<{ $color: string }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${p => p.$color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$color};
`;

export const QuickLabel = styled.div`
  font-size: 0.73rem;
  font-weight: 700;
  color: #444;
  text-align: center;
`;

export const CompanyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CompanyAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #BBA188, #a8906f);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const CompanyInfo = styled.div``;

export const CompanyName = styled.div`
  font-size: 0.83rem;
  font-weight: 600;
  color: #1a1a1a;
`;

export const CompanySub = styled.div`
  font-size: 0.7rem;
  color: #aaa;
`;

export const MRRBlock = styled.div`
  text-align: right;
`;

export const MRRValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #BBA188;
  font-family: var(--font-cabourg-bold), serif;
`;

export const MRRSub = styled.div`
  font-size: 0.7rem;
  color: #aaa;
`;

export const PlanDistGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

export const PlanItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PlanDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`;

export const PlanName = styled.div`
  flex: 1;
  font-size: 0.83rem;
  font-weight: 600;
  color: #333;
`;

export const PlanCount = styled.div`
  font-size: 0.78rem;
  color: #888;
`;