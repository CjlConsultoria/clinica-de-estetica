import React from 'react';
import styled from 'styled-components';

/* ─── Layout ─────────────────────────────────────────────────────────────── */

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;

  @media (max-width: 1024px) {
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

/* ─── Layout Grid ─────────────────────────────────────────────────────────── */

export const SettingsLayout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* ─── Side Navigation ─────────────────────────────────────────────────────── */

export const SideNav = styled.div`
  background: white;
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: sticky;
  top: 24px;

  @media (max-width: 900px) {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }
`;

export const SideNavItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? 'rgba(187, 161, 136, 0.12)' : 'transparent')};
  border-left: ${({ $active }) => ($active ? '3px solid #BBA188' : '3px solid transparent')};

  @media (max-width: 900px) {
    flex: 1;
    min-width: 130px;
    border-left: none;
    border-bottom: ${({ $active }) => ($active ? '2px solid #BBA188' : '2px solid transparent')};
    border-radius: 8px;
  }

  &:hover {
    background: rgba(187, 161, 136, 0.08);
  }
`;

export const SideNavIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
`;

export const SideNavLabel = styled.span<{ $active?: boolean }>`
  font-size: 0.84rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#BBA188' : '#555')};
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  transition: color 0.2s;

  @media (max-width: 900px) {
    font-size: 0.78rem;
  }
`;

export const SideNavDivider = styled.div`
  height: 1px;
  background: #f5f5f5;
  margin: 6px 0;
`;

export const SideNavSection = styled.div`
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #ccc;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  padding: 8px 14px 4px;
`;

/* ─── Settings Content Panel ──────────────────────────────────────────────── */

export const SettingsContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  min-height: 500px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Section = styled.div``;

/* ─── Section Header ──────────────────────────────────────────────────────── */

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0ebe4;
  gap: 16px;
`;

export const SectionHeaderLeft = styled.div`
  flex: 1;
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 4px;
  font-weight: 700;
`;

export const SectionDesc = styled.p`
  font-size: 0.83rem;
  color: #999;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  margin: 0;
  line-height: 1.5;
`;

export const SectionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  background: rgba(187, 161, 136, 0.12);
  color: #8a7560;
  white-space: nowrap;
  margin-top: 2px;
`;

/* ─── Form Grid ───────────────────────────────────────────────────────────── */

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormSubTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  border-bottom: 1px solid #f0ebe4;
  padding-bottom: 8px;
  margin-bottom: 4px;
`;

/* ─── Avatar / Logo Section ───────────────────────────────────────────────── */

export const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #fdfaf7 0%, #f9f4ef 100%);
  border: 1.5px solid rgba(187, 161, 136, 0.2);
  border-radius: 14px;
`;

export const AvatarCircle = styled.div<{ $color: string }>`
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: ${({ $color }) => $color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  flex-shrink: 0;
  box-shadow: 0 4px 12px ${({ $color }) => $color}55;
`;

export const AvatarInfo = styled.div`
  flex: 1;
`;

export const AvatarTitle = styled.div`
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  margin-bottom: 4px;
`;

export const AvatarSubtitle = styled.div`
  font-size: 0.76rem;
  color: #aaa;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  margin-bottom: 12px;
`;

export const AvatarBtn = styled.button`
  padding: 8px 18px;
  border: 1.5px solid #BBA188;
  border-radius: 50px;
  background: white;
  color: #BBA188;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #BBA188;
    color: white;
  }
`;

/* ─── Color Picker ────────────────────────────────────────────────────────── */

export const ColorPickerSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0ebe4;
`;

export const ColorPickerLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #555;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  margin-bottom: 12px;
`;

export const ColorPicker = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ColorOption = styled.div<{ $color: string; $selected: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  cursor: pointer;
  border: 3px solid ${({ $selected }) => ($selected ? '#fff' : 'transparent')};
  box-shadow: ${({ $selected, $color }) =>
    $selected ? `0 0 0 3px ${$color}, 0 2px 8px ${$color}66` : '0 2px 4px rgba(0,0,0,0.12)'};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.18);
  }
`;

/* ─── Toggle Rows ─────────────────────────────────────────────────────────── */

export const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #f0ebe4;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 4px;
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fdf9f5;
  }
`;

export const ToggleInfo = styled.div`
  flex: 1;
`;

export const ToggleLabel = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  margin-bottom: 3px;
`;

export const ToggleSubLabel = styled.div`
  font-size: 0.78rem;
  color: #999;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  line-height: 1.4;
`;

export const ToggleSwitch = styled.div<{ $active: boolean }>`
  width: 48px;
  height: 27px;
  border-radius: 13.5px;
  background: ${({ $active }) => ($active ? '#BBA188' : '#e0e0e0')};
  position: relative;
  cursor: pointer;
  transition: background 0.25s;
  flex-shrink: 0;
  box-shadow: ${({ $active }) => ($active ? '0 2px 8px rgba(187,161,136,0.4)' : 'none')};
`;

export const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: ${({ $active }) => ($active ? 'calc(100% - 24px)' : '3px')};
  transition: left 0.25s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
`;

/* ─── Save Row ────────────────────────────────────────────────────────────── */

export const SaveRow = styled.div`
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f0ebe4;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

/* ─── Info Cards (Super Admin Stats) ─────────────────────────────────────── */

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
`;

export const StatCard = styled.div<{ $color?: string }>`
  background: white;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border-left: 4px solid ${({ $color }) => $color || '#BBA188'};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StatCardLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
`;

export const StatCardValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
`;

/* ─── Danger Zone ─────────────────────────────────────────────────────────── */

export const DangerZone = styled.div`
  margin-top: 32px;
  padding: 24px;
  border: 1.5px solid rgba(231, 76, 60, 0.2);
  border-radius: 14px;
  background: linear-gradient(135deg, #fff9f9 0%, #fff5f5 100%);
`;

export const DangerZoneTitle = styled.h4`
  font-size: 0.88rem;
  font-weight: 700;
  color: #e74c3c;
  margin: 0 0 16px;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DangerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(231, 76, 60, 0.1);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const DangerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 0.85rem;
    color: #1a1a1a;
    font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
    font-weight: 600;
  }

  span {
    font-size: 0.76rem;
    color: #999;
    font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
    line-height: 1.4;
  }
`;

/* ─── Super Admin: Tenant Table ───────────────────────────────────────────── */

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid #f0ebe4;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

export const Th = styled.th<{ $width?: string }>`
  padding: 11px 14px;
  text-align: left;
  font-size: 0.68rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
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

  &:hover {
    background: #fdf9f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Td = styled.td`
  padding: 12px 14px;
  font-size: 0.8rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #444;
  vertical-align: middle;
`;

export const Badge = styled.span<{ $bg?: string; $color?: string }>`
  display: inline-block;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 600;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  background: ${({ $bg }) => $bg || 'rgba(187,161,136,0.12)'};
  color: ${({ $color }) => $color || '#BBA188'};
  white-space: nowrap;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 6px;
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

  &:hover {
    background: #BBA188;
    border-color: #BBA188;
    color: white;
  }
`;

/* ─── Permission Matrix ───────────────────────────────────────────────────── */

export const PermMatrix = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PermGroup = styled.div`
  border: 1px solid #f0ebe4;
  border-radius: 12px;
  overflow: hidden;
`;

export const PermGroupTitle = styled.div`
  background: #fdf9f5;
  padding: 8px 14px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  border-bottom: 1px solid #f0ebe4;
`;

export const PermGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

export const PermItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  font-size: 0.78rem;
  color: ${({ $active }) => ($active ? '#444' : '#bbb')};
  border-bottom: 1px solid #f9f5f0;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(187, 161, 136, 0.06);
  }
`;

export const PermCheckbox = styled.div<{ $active?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
  border: 1.5px solid ${({ $active }) => ($active ? '#BBA188' : '#ddd')};
  background: ${({ $active }) => ($active ? '#BBA188' : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
`;

/* ─── Plan / Billing Cards ────────────────────────────────────────────────── */

export const PlanCard = styled.div<{ $highlight?: boolean }>`
  border: ${({ $highlight }) => ($highlight ? '2px solid #BBA188' : '1.5px solid #f0ebe4')};
  border-radius: 16px;
  padding: 24px;
  background: ${({ $highlight }) =>
    $highlight ? 'linear-gradient(135deg, #fdfaf7 0%, #f9f4ef 100%)' : 'white'};
  position: relative;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(187, 161, 136, 0.15);
  }
`;

export const PlanBadge = styled.span`
  position: absolute;
  top: -10px;
  left: 20px;
  background: linear-gradient(135deg, #BBA188, #a8906f);
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  padding: 3px 12px;
  border-radius: 20px;
  letter-spacing: 0.4px;
`;

export const PlanName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  margin-bottom: 6px;
`;

export const PlanPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin-bottom: 16px;

  span {
    font-size: 0.85rem;
    color: #aaa;
    font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
    font-weight: 400;
  }
`;

export const PlanFeatureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

export const PlanFeatureItem = styled.li`
  font-size: 0.8rem;
  color: #555;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #BBA188;
    flex-shrink: 0;
  }
`;

/* ─── Audit Log / Activity ────────────────────────────────────────────────── */

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #f0ebe4;
  border-radius: 14px;
  overflow: hidden;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fdf9f5;
  }
`;

export const ActivityIcon = styled.div<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $color }) => ($color ? `${$color}18` : 'rgba(187,161,136,0.1)')};
  color: ${({ $color }) => $color || '#BBA188'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ActivityInfo = styled.div`
  flex: 1;
`;

export const ActivityText = styled.div`
  font-size: 0.83rem;
  color: #333;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  line-height: 1.4;
  margin-bottom: 3px;

  strong {
    color: #1a1a1a;
    font-weight: 600;
  }
`;

export const ActivityTime = styled.div`
  font-size: 0.72rem;
  color: #bbb;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
`;

/* ─── Empty State ─────────────────────────────────────────────────────────── */

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 20px;
  text-align: center;
  color: #bbb;

  svg {
    margin-bottom: 16px;
    opacity: 0.3;
  }

  h3 {
    font-size: 1rem;
    color: #555;
    margin: 0 0 6px;
    font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  }

  p {
    font-size: 0.84rem;
    color: #999;
    margin: 0;
  }
`;

/* ─── Alert / Info Boxes ──────────────────────────────────────────────────── */

export const InfoBox = styled.div<{ $variant?: 'info' | 'warning' | 'success' | 'error' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 0.82rem;
  line-height: 1.5;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;

  background: ${({ $variant }) => ({
    info:    'rgba(187,161,136,0.1)',
    warning: 'rgba(234,179,8,0.1)',
    success: 'rgba(138,117,96,0.1)',
    error:   'rgba(231,76,60,0.08)',
  }[$variant ?? 'info'])};

  border: 1px solid ${({ $variant }) => ({
    info:    'rgba(187,161,136,0.25)',
    warning: 'rgba(234,179,8,0.25)',
    success: 'rgba(138,117,96,0.25)',
    error:   'rgba(231,76,60,0.2)',
  }[$variant ?? 'info'])};

  color: ${({ $variant }) => ({
    info:    '#8a7560',
    warning: '#ca8a04',
    success: '#6b5b47',
    error:   '#c0392b',
  }[$variant ?? 'info'])};
`;