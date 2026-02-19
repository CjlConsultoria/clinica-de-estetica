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

export const ProfGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
`;

export const ProfCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition: all 0.25s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const ProfAvatar = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  flex-shrink: 0;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
`;

export const ProfName = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
`;

export const ProfRole = styled.div`
  font-size: 0.78rem;
  color: #999;
  margin-top: 2px;
`;

export const ProfStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

export const ProfStat = styled.div`
  background: #f8f8f8;
  border-radius: 10px;
  padding: 10px;
`;

export const ProfStatLabel = styled.div`
  font-size: 0.7rem;
  color: #999;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  margin-bottom: 4px;
`;

export const ProfStatValue = styled.div<{ $highlight?: boolean }>`
  font-size: ${({ $highlight }) => ($highlight ? '1rem' : '0.88rem')};
  font-weight: 700;
  color: ${({ $highlight }) => ($highlight ? '#BBA188' : '#1a1a1a')};
  font-family: var(--font-roboto-medium), 'Roboto', sans-serif;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  border-radius: 3px;
  transition: width 0.6s ease;
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
  min-width: 220px;
  background: white;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  animation: dropIn 0.18s ease;

  @keyframes dropIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownItem = styled.div<{ $active?: boolean }>`
  padding: 11px 18px;
  font-size: 0.87rem;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  color: ${({ $active }) => ($active ? '#BBA188' : '#444')};
  background: ${({ $active }) =>
    $active ? 'rgba(187,161,136,0.1)' : 'white'};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(187,161,136,0.08);
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

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

export const Th = styled.th<{ $width?: string }>`
  padding: 13px 14px;
  text-align: left;
  font-size: 0.77rem;
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
  padding: 13px 14px;
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

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;

  h3 {
    color: #555;
    margin: 0 0 6px;
  }

  p {
    color: #999;
    margin: 0;
  }
`;
