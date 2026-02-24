'use client';

import { useState } from 'react';
import styled from 'styled-components';

/* ─────────────────────────────────────────────────────────────────────────────
   ICONS (stroke-only, no fill backgrounds)
───────────────────────────────────────────────────────────────────────────── */
const Icons = {
  Overview: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Clinic: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Plans: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Anvisa: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Commission: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  Audit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Terms: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Check: () => (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  Camera: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────────
   STYLED COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  @media (max-width: 1024px) { padding: 24px 20px; }
  @media (max-width: 768px) { padding: 20px 16px; }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0;
  font-weight: 600;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(187,161,136,0.12);
  color: #8a7560;
  border: 1px solid rgba(187,161,136,0.25);
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const SideNav = styled.div`
  background: white;
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: sticky;
  top: 24px;
`;

const SideNavSection = styled.div`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: #ccc;
  padding: 10px 14px 4px;
`;

const SideNavDivider = styled.div`
  height: 1px;
  background: #f5f5f5;
  margin: 6px 0;
`;

const SideNavItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => $active ? 'rgba(187,161,136,0.1)' : 'transparent'};
  border-left: 3px solid ${({ $active }) => $active ? '#BBA188' : 'transparent'};
  color: ${({ $active }) => $active ? '#BBA188' : '#666'};
  &:hover { background: rgba(187,161,136,0.07); color: #BBA188; }
`;

const NavLabel = styled.span`
  font-size: 0.84rem;
  font-weight: 600;
`;

const Content = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  min-height: 500px;
  @media (max-width: 768px) { padding: 20px; }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0ebe4;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 4px;
`;

const SectionDesc = styled.p`
  font-size: 0.83rem;
  color: #aaa;
  margin: 0;
  line-height: 1.5;
`;

const SectionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  background: rgba(187,161,136,0.1);
  color: #8a7560;
  white-space: nowrap;
  border: 1px solid rgba(187,161,136,0.2);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const SubTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f0ebe4;
  padding-bottom: 8px;
  margin-bottom: 16px;
`;

/* ── Inputs ── */
const FieldWrapper = styled.div<{ $span2?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: ${({ $span2 }) => $span2 ? 'span 2' : 'span 1'};
  @media (max-width: 640px) { grid-column: span 1; }
`;

const Label = styled.label`
  font-size: 0.76rem;
  font-weight: 600;
  color: #555;
`;

const InputField = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid ${({ $error }) => $error ? '#e74c3c' : '#e8e8e8'};
  border-radius: 10px;
  font-size: 0.87rem;
  background: white;
  color: #333;
  transition: all 0.2s;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #BBA188; box-shadow: 0 0 0 3px rgba(187,161,136,0.15); }
  &::placeholder { color: #ccc; }
`;

const SelectField = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.87rem;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
  &:focus { outline: none; border-color: #BBA188; box-shadow: 0 0 0 3px rgba(187,161,136,0.15); }
`;

const ErrorMsg = styled.span`
  font-size: 0.72rem;
  color: #e74c3c;
`;

/* ── Buttons ── */
const Btn = styled.button<{ $variant?: string; $size?: string; $full?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: ${({ $size }) => $size === 'sm' ? '7px 14px' : '10px 20px'};
  border-radius: 50px;
  font-size: ${({ $size }) => $size === 'sm' ? '0.8rem' : '0.87rem'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid transparent;
  width: ${({ $full }) => $full ? '100%' : 'auto'};
  justify-content: center;
  white-space: nowrap;

  ${({ $variant }) => $variant === 'primary' ? `
    background: linear-gradient(135deg, #BBA188, #a8906f);
    color: white;
    border-color: transparent;
    box-shadow: 0 2px 8px rgba(187,161,136,0.35);
    &:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(187,161,136,0.45); }
  ` : $variant === 'danger' ? `
    background: rgba(231,76,60,0.08);
    color: #e74c3c;
    border-color: rgba(231,76,60,0.25);
    &:hover { background: #e74c3c; color: white; }
  ` : `
    background: white;
    color: #555;
    border-color: #e8e8e8;
    &:hover { border-color: #BBA188; color: #BBA188; }
  `}

  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
`;

const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  background: white;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #BBA188; border-color: #BBA188; color: white; }
`;

/* ── Stats ── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
`;

const StatCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 12px;
  padding: 16px 18px;
  border: 1px solid #f0ebe4;
  border-left: 3px solid ${({ $color }) => $color};
`;

const StatLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

const StatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
`;

/* ── Avatar ── */
const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #fdfaf7, #f9f4ef);
  border: 1.5px solid rgba(187,161,136,0.2);
  border-radius: 14px;
`;

const AvatarCircle = styled.div<{ $color: string }>`
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
  box-shadow: 0 4px 14px ${({ $color }) => $color}55;
`;

/* ── Color Picker ── */
const ColorPickerRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const ColorDot = styled.div<{ $color: string; $selected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  cursor: pointer;
  border: 3px solid ${({ $selected }) => $selected ? '#fff' : 'transparent'};
  box-shadow: ${({ $selected, $color }) => $selected ? `0 0 0 3px ${$color}` : '0 1px 4px rgba(0,0,0,0.14)'};
  transition: all 0.2s;
  &:hover { transform: scale(1.15); }
`;

/* ── Toggle ── */
const ToggleGroup = styled.div`
  border: 1px solid #f0ebe4;
  border-radius: 12px;
  overflow: hidden;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 18px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
  &:last-child { border-bottom: none; }
  &:hover { background: #fdf9f5; }
`;

const ToggleTrack = styled.div<{ $on: boolean }>`
  width: 46px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $on }) => $on ? '#BBA188' : '#e0e0e0'};
  position: relative;
  cursor: pointer;
  transition: background 0.25s;
  flex-shrink: 0;
  box-shadow: ${({ $on }) => $on ? '0 2px 8px rgba(187,161,136,0.4)' : 'none'};
`;

const ToggleKnob = styled.div<{ $on: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: ${({ $on }) => $on ? 'calc(100% - 23px)' : '3px'};
  transition: left 0.25s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
`;

/* ── Table ── */
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #f0ebe4;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

const Th = styled.th<{ $w?: string }>`
  padding: 10px 14px;
  text-align: left;
  font-size: 0.66rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  width: ${({ $w }) => $w || 'auto'};
  white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
  &:hover { background: #fdf9f5; }
  &:last-child { border-bottom: none; }
`;

const Td = styled.td`
  padding: 12px 14px;
  font-size: 0.8rem;
  color: #444;
  vertical-align: middle;
`;

const Pill = styled.span<{ $bg: string; $color: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.67rem;
  font-weight: 700;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 5px;
`;

/* ── Info Box ── */
const InfoBox = styled.div<{ $variant?: 'info' | 'warning' | 'danger' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 16px;
  border-radius: 10px;
  font-size: 0.81rem;
  line-height: 1.5;
  margin-bottom: 20px;

  background: ${({ $variant }) => ({
    info: 'rgba(187,161,136,0.08)',
    warning: 'rgba(234,179,8,0.08)',
    danger: 'rgba(231,76,60,0.07)',
  }[$variant ?? 'info'])};
  border: 1px solid ${({ $variant }) => ({
    info: 'rgba(187,161,136,0.22)',
    warning: 'rgba(234,179,8,0.22)',
    danger: 'rgba(231,76,60,0.18)',
  }[$variant ?? 'info'])};
  color: ${({ $variant }) => ({
    info: '#8a7560',
    warning: '#92730a',
    danger: '#c0392b',
  }[$variant ?? 'info'])};
`;

/* ── Danger Zone ── */
const DangerZone = styled.div`
  margin-top: 32px;
  padding: 22px;
  border: 1.5px solid rgba(231,76,60,0.18);
  border-radius: 12px;
  background: #fff9f9;
`;

const DangerTitle = styled.h4`
  font-size: 0.85rem;
  font-weight: 700;
  color: #e74c3c;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DangerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 0;
  border-bottom: 1px solid rgba(231,76,60,0.08);
  &:last-child { border-bottom: none; padding-bottom: 0; }
`;

const DangerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  strong { font-size: 0.84rem; color: #1a1a1a; font-weight: 600; }
  span { font-size: 0.74rem; color: #aaa; line-height: 1.4; }
`;

/* ── Permissions ── */
const PermMatrix = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PermGroup = styled.div`
  border: 1px solid #f0ebe4;
  border-radius: 12px;
  overflow: hidden;
`;

const PermGroupTitle = styled.div`
  background: #fdf9f5;
  padding: 8px 14px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #f0ebe4;
`;

const PermGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const PermItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  font-size: 0.78rem;
  color: ${({ $active }) => $active ? '#444' : '#ccc'};
  border-bottom: 1px solid #f9f5f0;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: rgba(187,161,136,0.06); }
`;

const PermCheck = styled.div<{ $active: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
  border: 1.5px solid ${({ $active }) => $active ? '#BBA188' : '#ddd'};
  background: ${({ $active }) => $active ? '#BBA188' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
`;

/* ── Activity ── */
const ActivityList = styled.div`
  border: 1px solid #f0ebe4;
  border-radius: 12px;
  overflow: hidden;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
  &:hover { background: #fdf9f5; }
`;

const ActivityDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  margin-top: 6px;
`;

/* ── Save Row ── */
const SaveRow = styled.div`
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f0ebe4;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

/* ── MODAL ── */
const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: ${({ $open }) => $open ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 18px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  overflow: hidden;
  animation: modalIn 0.25s ease;
  @keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0ebe4;
`;

const ModalTitle = styled.h3`
  font-size: 1rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px 20px;
  border-top: 1px solid #f5f5f5;
`;

/* ── Success Toast ── */
const Toast = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: #1a1a1a;
  color: white;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  z-index: 9999;
  transform: ${({ $show }) => $show ? 'translateY(0)' : 'translateY(20px)'};
  opacity: ${({ $show }) => $show ? 1 : 0};
  pointer-events: none;
  transition: all 0.3s ease;
`;

const ToastDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #BBA188;
  flex-shrink: 0;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   REUSABLE SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
function Field({ label, type = 'text', placeholder = '', defaultValue = '', value, onChange, error, disabled }: any) {
  return (
    <FieldWrapper>
      {label && <Label>{label}</Label>}
      <InputField
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        $error={!!error}
        disabled={disabled}
      />
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </FieldWrapper>
  );
}

function SField({ label, options, value, onChange }: any) {
  return (
    <FieldWrapper>
      {label && <Label>{label}</Label>}
      <SelectField value={value} onChange={(e: any) => onChange?.(e.target.value)}>
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </SelectField>
    </FieldWrapper>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <ToggleTrack $on={on} onClick={onToggle}>
      <ToggleKnob $on={on} />
    </ToggleTrack>
  );
}

function Modal({ open, title, children, onClose, footer }: any) {
  if (!open) return null;
  return (
    <Overlay $open={open} onClick={(e: any) => e.target === e.currentTarget && onClose()}>
      <ModalBox>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <IconBtn onClick={onClose}><Icons.X /></IconBtn>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalBox>
    </Overlay>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const accentColors = ['#BBA188', '#EBD5B0', '#1b1b1b', '#a8906f', '#8a7560', '#c9a882', '#e74c3c'];

type NotifKey = 'agendamento' | 'reaplicacao' | 'estoqueBaixo' | 'validade' | 'comissao' | 'relatorio' | 'novaTenant' | 'faturamento';

type Clinic = { id: number; name: string; cnpj: string; plan: string; status: string; users: number; lastAccess: string; };

const INITIAL_CLINICS: Clinic[] = [
  { id: 1, name: 'Clínica Bella Vita',    cnpj: '12.345.678/0001-99', plan: 'Pro',        status: 'ativo',    users: 8,  lastAccess: '20/02/2025' },
  { id: 2, name: 'Studio Ana Rodrigues',  cnpj: '98.765.432/0001-11', plan: 'Starter',    status: 'ativo',    users: 3,  lastAccess: '19/02/2025' },
  { id: 3, name: 'Clínica Derma Saúde',   cnpj: '55.123.456/0001-33', plan: 'Enterprise', status: 'ativo',    users: 22, lastAccess: '20/02/2025' },
  { id: 4, name: 'Instituto Skin Care',   cnpj: '77.890.123/0001-55', plan: 'Pro',        status: 'suspenso', users: 6,  lastAccess: '05/01/2025' },
];

const CARGO_PERMS: Record<string, string[]> = {
  'Técnico':          ['Agenda própria', 'Pacientes próprios', 'Prontuário próprio', 'Fotos', 'Consentimentos'],
  'Recepcionista':    ['Agenda geral', 'Pacientes', 'Agendamentos', 'Dashboard'],
  'Financeiro':       ['Financeiro', 'Relatórios financeiros', 'Comissões'],
  'Gerente / Admin':  ['Dashboard completo', 'Todos os módulos', 'Equipe', 'Relatórios', 'Configurações'],
};

const LOG_COLORS: Record<number, string> = {
  1: '#BBA188', 2: '#8a7560', 3: '#3a7dc9', 4: '#c9a03a', 5: '#e74c3c',
};

const navSections = [
  { section: 'Plataforma', items: [
    { id: 'plataforma', label: 'Visão Geral',          Icon: Icons.Overview },
    { id: 'clinicas',   label: 'Clínicas / Tenants',   Icon: Icons.Clinic   },
    { id: 'planos',     label: 'Planos & Faturamento',  Icon: Icons.Plans    },
  ]},
  { section: 'Sistema', items: [
    { id: 'perfil',       label: 'Minha Conta',          Icon: Icons.User       },
    { id: 'notificacoes', label: 'Notificações',          Icon: Icons.Bell       },
    { id: 'anvisa',       label: 'Configurações ANVISA',  Icon: Icons.Anvisa     },
    { id: 'comissoes',    label: 'Regras de Comissão',    Icon: Icons.Commission },
  ]},
  { section: 'Segurança', items: [
    { id: 'permissoes', label: 'Permissões de Cargo',  Icon: Icons.Shield },
    { id: 'auditoria',  label: 'Auditoria & Logs',     Icon: Icons.Audit  },
    { id: 'seguranca',  label: 'Segurança',             Icon: Icons.Lock   },
    { id: 'termos',     label: 'Termos & Privacidade',  Icon: Icons.Terms  },
  ]},
];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function Configuracoes() {
  const [active,      setActive]      = useState('plataforma');
  const [accentColor, setAccentColor] = useState('#BBA188');
  const [toast,       setToast]       = useState('');
  const [toastShow,   setToastShow]   = useState(false);

  /* ── Clinics state ── */
  const [clinics,        setClinics]        = useState<Clinic[]>(INITIAL_CLINICS);
  const [showNewClinic,  setShowNewClinic]  = useState(false);
  const [showEditClinic, setShowEditClinic] = useState(false);
  const [editClinic,     setEditClinic]     = useState<Clinic | null>(null);
  const [newClinic,      setNewClinic]      = useState({ name: '', cnpj: '', plan: 'Starter' });
  const [clinicErrors,   setClinicErrors]   = useState<Record<string, string>>({});

  /* ── Permissions state ── */
  const [perms, setPerms] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(Object.entries(CARGO_PERMS).map(([k, v]) => [k, [...v]]))
  );

  /* ── Notifications ── */
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    agendamento: true,  reaplicacao: true,   estoqueBaixo: true,
    validade: true,     comissao: false,     relatorio: false,
    novaTenant: true,   faturamento: true,
  });

  /* ── ANVISA toggles ── */
  const [anvisaToggles, setAnvisaToggles] = useState({ lote: true, bloqueio: true, relatorio: false });

  /* ── Security toggles ── */
  const [secToggles, setSecToggles] = useState({ twoFa: false, timeout: true, alertLogin: true, audit: true, twoFaAdmin: false });

  /* ── Plan modal ── */
  const [editPlan, setEditPlan] = useState<{ name: string; price: string } | null>(null);

  /* ── Confirm modal (danger) ── */
  const [confirmModal, setConfirmModal] = useState<{ title: string; msg: string; onConfirm: () => void } | null>(null);

  /* ── Terms modal ── */
  const [editTerms, setEditTerms] = useState<{ label: string; content: string } | null>(null);

  /* ── Perfil form ── */
  const [perfil, setPerfil] = useState({ nome: 'Super Administrador', email: 'super.admin@aestheticos.com.br', telefone: '(11) 99999-0000', senha: '', senhaConfirm: '' });
  const [perfilErrors, setPerfilErrors] = useState<Record<string, string>>({});

  /* ── Platform form ── */
  const [platform, setPlatform] = useState({ nome: 'AestheticOS', dominio: 'app.aestheticos.com.br', email: 'suporte@aestheticos.com.br', telefone: '(11) 99999-0000' });

  /* ── Commission form ── */
  const [comissao, setComissao] = useState({ botox: '20', preenchimento: '20', bioestimulador: '15', fio: '18', skincare: '25', outros: '20', base: 'bruto', periodicidade: 'mensal' });

  /* ─ Toast helper ─ */
  function showToast(msg: string) {
    setToast(msg);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 2800);
  }

  /* ─ Clinic handlers ─ */
  function validateNewClinic() {
    const e: Record<string, string> = {};
    if (!newClinic.name.trim()) e.name = 'Nome é obrigatório';
    if (!newClinic.cnpj.trim()) e.cnpj = 'CNPJ é obrigatório';
    setClinicErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAddClinic() {
    if (!validateNewClinic()) return;
    setClinics(prev => [...prev, { id: Date.now(), ...newClinic, status: 'ativo', users: 0, lastAccess: '—' }]);
    setNewClinic({ name: '', cnpj: '', plan: 'Starter' });
    setShowNewClinic(false);
    showToast('Clínica cadastrada com sucesso!');
  }

  function handleEditClinicSave() {
    if (!editClinic) return;
    setClinics(prev => prev.map(c => c.id === editClinic.id ? editClinic : c));
    setShowEditClinic(false);
    showToast('Clínica atualizada com sucesso!');
  }

  function handleToggleStatus(c: Clinic) {
    setClinics(prev => prev.map(p => p.id === c.id ? { ...p, status: p.status === 'ativo' ? 'suspenso' : 'ativo' } : p));
    showToast(c.status === 'ativo' ? 'Clínica suspensa.' : 'Clínica reativada!');
  }

  /* ─ Perfil handler ─ */
  function handleSavePerfil() {
    const e: Record<string, string> = {};
    if (!perfil.nome.trim()) e.nome = 'Nome obrigatório';
    if (!perfil.email.trim()) e.email = 'E-mail obrigatório';
    if (perfil.senha && perfil.senha !== perfil.senhaConfirm) e.senhaConfirm = 'Senhas não coincidem';
    setPerfilErrors(e);
    if (Object.keys(e).length > 0) return;
    showToast('Conta atualizada com sucesso!');
  }

  return (
    <Container>
      <Header>
        <Title>Configurações</Title>
        <RoleBadge>Super Admin</RoleBadge>
      </Header>

      <Layout>
        {/* ── Side Nav ── */}
        <SideNav>
          {navSections.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <SideNavDivider />}
              <SideNavSection>{group.section}</SideNavSection>
              {group.items.map(({ id, label, Icon }) => (
                <SideNavItem key={id} $active={active === id} onClick={() => setActive(id)}>
                  <Icon />
                  <NavLabel>{label}</NavLabel>
                </SideNavItem>
              ))}
            </div>
          ))}
        </SideNav>

        {/* ── Content ── */}
        <Content>

          {/* ══ VISÃO GERAL ══ */}
          {active === 'plataforma' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Visão Geral da Plataforma</SectionTitle>
                  <SectionDesc>Status geral do sistema multi-tenant e configurações globais.</SectionDesc>
                </div>
                <SectionBadge>Ao vivo</SectionBadge>
              </SectionHeader>

              <StatsGrid>
                <StatCard $color="#BBA188"><StatLabel>Clínicas Ativas</StatLabel><StatValue>{clinics.filter(c => c.status === 'ativo').length}</StatValue></StatCard>
                <StatCard $color="#8a7560"><StatLabel>Usuários Totais</StatLabel><StatValue>{clinics.reduce((a, c) => a + c.users, 0)}</StatValue></StatCard>
                <StatCard $color="#a8906f"><StatLabel>Planos Pro+</StatLabel><StatValue>{clinics.filter(c => c.plan !== 'Starter').length}</StatValue></StatCard>
                <StatCard $color="#e74c3c"><StatLabel>Suspensos</StatLabel><StatValue>{clinics.filter(c => c.status === 'suspenso').length}</StatValue></StatCard>
              </StatsGrid>

              <SubTitle>Configurações Globais do Sistema</SubTitle>
              <FormGrid style={{ marginTop: 16 }}>
                <Field label="Nome da Plataforma" value={platform.nome} onChange={(e: any) => setPlatform(p => ({ ...p, nome: e.target.value }))} />
                <Field label="Domínio Principal" value={platform.dominio} onChange={(e: any) => setPlatform(p => ({ ...p, dominio: e.target.value }))} />
                <Field label="E-mail de Suporte" type="email" value={platform.email} onChange={(e: any) => setPlatform(p => ({ ...p, email: e.target.value }))} />
                <Field label="Telefone de Suporte" value={platform.telefone} onChange={(e: any) => setPlatform(p => ({ ...p, telefone: e.target.value }))} />
              </FormGrid>

              <div style={{ marginTop: 20, padding: '16px 18px', background: '#fafafa', borderRadius: 12, border: '1px solid #f0ebe4' }}>
                <Label>Cor de Destaque Global da Plataforma</Label>
                <ColorPickerRow>
                  {accentColors.map(c => (
                    <ColorDot key={c} $color={c} $selected={accentColor === c} onClick={() => setAccentColor(c)} />
                  ))}
                </ColorPickerRow>
              </div>

              <SaveRow>
                <Btn $variant="primary" onClick={() => showToast('Configurações salvas com sucesso!')}>Salvar Configurações</Btn>
              </SaveRow>
            </div>
          )}

          {/* ══ CLÍNICAS ══ */}
          {active === 'clinicas' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Clínicas / Tenants</SectionTitle>
                  <SectionDesc>Gerencie todas as clínicas cadastradas na plataforma.</SectionDesc>
                </div>
                <Btn $variant="primary" $size="sm" onClick={() => { setNewClinic({ name: '', cnpj: '', plan: 'Starter' }); setClinicErrors({}); setShowNewClinic(true); }}>
                  <Icons.Plus /> Nova Clínica
                </Btn>
              </SectionHeader>

              <TableWrapper>
                <Table>
                  <Thead>
                    <tr>
                      <Th $w="26%">Clínica</Th>
                      <Th $w="20%">CNPJ</Th>
                      <Th $w="12%">Plano</Th>
                      <Th $w="9%">Usuários</Th>
                      <Th $w="13%">Último Acesso</Th>
                      <Th $w="10%">Status</Th>
                      <Th $w="10%">Ações</Th>
                    </tr>
                  </Thead>
                  <tbody>
                    {clinics.map(c => (
                      <Tr key={c.id}>
                        <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{c.name}</Td>
                        <Td style={{ color: '#aaa', fontFamily: 'monospace', fontSize: '0.73rem' }}>{c.cnpj}</Td>
                        <Td>
                          <Pill
                            $bg={c.plan === 'Enterprise' ? '#1b1b1b' : c.plan === 'Pro' ? 'rgba(187,161,136,0.14)' : '#f5f5f5'}
                            $color={c.plan === 'Enterprise' ? '#EBD5B0' : c.plan === 'Pro' ? '#8a7560' : '#888'}
                          >{c.plan}</Pill>
                        </Td>
                        <Td style={{ textAlign: 'center', fontWeight: 600 }}>{c.users}</Td>
                        <Td style={{ color: '#aaa', fontSize: '0.75rem' }}>{c.lastAccess}</Td>
                        <Td>
                          <Pill
                            $bg={c.status === 'ativo' ? 'rgba(138,117,96,0.12)' : 'rgba(231,76,60,0.1)'}
                            $color={c.status === 'ativo' ? '#8a7560' : '#e74c3c'}
                          >{c.status === 'ativo' ? 'Ativo' : 'Suspenso'}</Pill>
                        </Td>
                        <Td>
                          <ActionGroup>
                            <IconBtn title="Editar" onClick={() => { setEditClinic({ ...c }); setShowEditClinic(true); }}>
                              <Icons.Edit />
                            </IconBtn>
                            <IconBtn title={c.status === 'ativo' ? 'Suspender' : 'Reativar'} onClick={() => handleToggleStatus(c)} style={{ color: c.status === 'ativo' ? '#e74c3c' : '#8a7560' }}>
                              <Icons.Lock />
                            </IconBtn>
                          </ActionGroup>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </div>
          )}

          {/* ══ PLANOS ══ */}
          {active === 'planos' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Planos & Faturamento</SectionTitle>
                  <SectionDesc>Configure os planos disponíveis para as clínicas da plataforma.</SectionDesc>
                </div>
              </SectionHeader>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
                {[
                  { name: 'Starter',    price: 'R$ 149', users: '3 usuários',  modules: 'Módulos básicos',  highlight: false },
                  { name: 'Pro',        price: 'R$ 349', users: '10 usuários', modules: 'Todos os módulos', highlight: true  },
                  { name: 'Enterprise', price: 'R$ 749', users: 'Ilimitado',   modules: 'Módulos + API',    highlight: false },
                ].map(plan => (
                  <div key={plan.name} style={{
                    border: plan.highlight ? '2px solid #BBA188' : '1.5px solid #f0ebe4',
                    borderRadius: 14, padding: 22, position: 'relative',
                    background: plan.highlight ? 'linear-gradient(135deg, #fdfaf7, #f9f4ef)' : 'white',
                  }}>
                    {plan.highlight && (
                      <div style={{ position: 'absolute', top: -10, left: 16, background: 'linear-gradient(135deg, #BBA188, #a8906f)', color: 'white', fontSize: '0.64rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                        MAIS POPULAR
                      </div>
                    )}
                    <div style={{ fontFamily: 'var(--font-cabourg-bold), serif', fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{plan.name}</div>
                    <div style={{ fontFamily: 'var(--font-cabourg-bold), serif', fontSize: '1.6rem', fontWeight: 700, color: '#BBA188', marginBottom: 14 }}>
                      {plan.price}<span style={{ fontSize: '0.75rem', color: '#aaa', fontFamily: 'sans-serif', fontWeight: 400 }}>/mês</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: 5 }}>✓ {plan.users}</div>
                    <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: 18 }}>✓ {plan.modules}</div>
                    <Btn $variant={plan.highlight ? 'primary' : 'outline'} $size="sm" $full onClick={() => setEditPlan({ name: plan.name, price: plan.price })}>
                      Editar Plano
                    </Btn>
                  </div>
                ))}
              </div>

              <SubTitle>Configurações de Faturamento</SubTitle>
              <FormGrid style={{ marginTop: 14 }}>
                <SField label="Gateway de Pagamento" options={[{value:'stripe',label:'Stripe'},{value:'asaas',label:'Asaas'},{value:'pagarme',label:'Pagar.me'}]} />
                <SField label="Período de Trial" options={[{value:'7',label:'7 dias'},{value:'14',label:'14 dias'},{value:'30',label:'30 dias'}]} />
                <Field label="Moeda" defaultValue="BRL — Real Brasileiro" />
                <Field label="Chave de API do Gateway" type="password" placeholder="sk_live_••••••••••••••••" />
              </FormGrid>

              <SaveRow>
                <Btn $variant="primary" onClick={() => showToast('Configurações de planos salvas!')}>Salvar Configurações de Planos</Btn>
              </SaveRow>
            </div>
          )}

          {/* ══ PERFIL ══ */}
          {active === 'perfil' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Minha Conta</SectionTitle>
                  <SectionDesc>Dados pessoais e credenciais de acesso do Super Admin.</SectionDesc>
                </div>
                <SectionBadge>Super Admin</SectionBadge>
              </SectionHeader>

              <AvatarSection>
                <AvatarCircle $color={accentColor}>SA</AvatarCircle>
                <div>
                  <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.9rem', marginBottom: 3 }}>Super Administrador</div>
                  <div style={{ fontSize: '0.76rem', color: '#aaa', marginBottom: 12 }}>super.admin@aestheticos.com.br · Acesso total ao sistema</div>
                  <Btn $size="sm" onClick={() => showToast('Funcionalidade de foto disponível em breve.')}>
                    <Icons.Camera /> Alterar Foto
                  </Btn>
                </div>
              </AvatarSection>

              <FormGrid>
                <FieldWrapper $span2>
                  <Field label="Nome Completo" value={perfil.nome} onChange={(e: any) => setPerfil(p => ({ ...p, nome: e.target.value }))} error={perfilErrors.nome} />
                </FieldWrapper>
                <Field label="E-mail de Acesso" type="email" value={perfil.email} onChange={(e: any) => setPerfil(p => ({ ...p, email: e.target.value }))} error={perfilErrors.email} />
                <Field label="Telefone" value={perfil.telefone} onChange={(e: any) => setPerfil(p => ({ ...p, telefone: e.target.value }))} />
                <Field label="Nova Senha" type="password" placeholder="••••••••" value={perfil.senha} onChange={(e: any) => setPerfil(p => ({ ...p, senha: e.target.value }))} />
                <Field label="Confirmar Nova Senha" type="password" placeholder="••••••••" value={perfil.senhaConfirm} onChange={(e: any) => setPerfil(p => ({ ...p, senhaConfirm: e.target.value }))} error={perfilErrors.senhaConfirm} />
              </FormGrid>

              <InfoBox $variant="info" style={{ marginTop: 20 }}>
                <Icons.Info />
                Esta conta possui acesso irrestrito a todos os tenants. Recomendamos ativar a autenticação em dois fatores.
              </InfoBox>

              <SaveRow>
                <Btn $variant="primary" onClick={handleSavePerfil}>Atualizar Conta</Btn>
              </SaveRow>
            </div>
          )}

          {/* ══ NOTIFICAÇÕES ══ */}
          {active === 'notificacoes' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Notificações</SectionTitle>
                  <SectionDesc>Configure os alertas que deseja receber como Super Admin.</SectionDesc>
                </div>
              </SectionHeader>

              <SubTitle style={{ marginBottom: 10 }}>Plataforma</SubTitle>
              <ToggleGroup style={{ marginBottom: 24 }}>
                {([
                  { key: 'novaTenant'  as NotifKey, label: 'Nova Clínica Cadastrada',   sub: 'Notificar quando uma nova clínica for criada na plataforma' },
                  { key: 'faturamento' as NotifKey, label: 'Eventos de Faturamento',    sub: 'Alertas de pagamentos, renovações e inadimplências de planos'  },
                ]).map(n => (
                  <ToggleRow key={n.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{n.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{n.sub}</div>
                    </div>
                    <Toggle on={notifs[n.key]} onToggle={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <SubTitle style={{ marginBottom: 10 }}>Sistema por Clínica</SubTitle>
              <ToggleGroup>
                {([
                  { key: 'agendamento'  as NotifKey, label: 'Confirmação de Agendamentos', sub: 'Cópias de confirmações e cancelamentos de todas as clínicas' },
                  { key: 'reaplicacao'  as NotifKey, label: 'Alertas de Reaplicação',      sub: 'Avisar quando pacientes estiverem próximos do prazo' },
                  { key: 'estoqueBaixo' as NotifKey, label: 'Estoque Baixo',               sub: 'Notificar quando produtos atingirem nível crítico' },
                  { key: 'validade'     as NotifKey, label: 'Validade de Produtos',        sub: 'Alertar 30, 15 e 7 dias antes do vencimento de produtos' },
                  { key: 'comissao'     as NotifKey, label: 'Relatório de Comissões',      sub: 'Receber relatório mensal de comissões consolidado' },
                  { key: 'relatorio'    as NotifKey, label: 'Relatório Semanal',           sub: 'Resumo semanal de desempenho da plataforma por e-mail' },
                ]).map(n => (
                  <ToggleRow key={n.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{n.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{n.sub}</div>
                    </div>
                    <Toggle on={notifs[n.key]} onToggle={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <SaveRow>
                <Btn $variant="primary" onClick={() => showToast('Preferências de notificação salvas!')}>Salvar Preferências</Btn>
              </SaveRow>
            </div>
          )}

          {/* ══ ANVISA ══ */}
          {active === 'anvisa' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Configurações ANVISA</SectionTitle>
                  <SectionDesc>Parâmetros globais de conformidade ANVISA para todas as clínicas.</SectionDesc>
                </div>
                <SectionBadge>Global</SectionBadge>
              </SectionHeader>

              <InfoBox $variant="warning">
                <Icons.AlertTriangle />
                Estes parâmetros são aplicados globalmente. Cada clínica pode sobrescrever em seu painel de admin.
              </InfoBox>

              <FormGrid>
                <Field label="Dias para alerta de validade (padrão)" type="number" defaultValue="30" />
                <Field label="Estoque mínimo global (unidades)" type="number" defaultValue="5" />
                <SField label="Unidade de Controle de Lote" options={[{value:'produto',label:'Por Produto'},{value:'lote',label:'Por Lote'}]} />
                <SField label="Frequência de Relatório ANVISA" options={[{value:'mensal',label:'Mensal'},{value:'trimestral',label:'Trimestral'}]} />
              </FormGrid>

              <SubTitle style={{ marginTop: 24, marginBottom: 12 }}>Regras Obrigatórias</SubTitle>
              <ToggleGroup>
                {[
                  { key: 'lote',      label: 'Rastreamento de Lote Obrigatório', sub: 'Exigir número de lote no cadastro de todos os procedimentos' },
                  { key: 'bloqueio',  label: 'Bloqueio de Produto Vencido',      sub: 'Impedir o uso de produtos com validade expirada nos procedimentos' },
                  { key: 'relatorio', label: 'Relatório ANVISA Automático',      sub: 'Gerar e enviar relatório de conformidade automaticamente' },
                ].map(t => (
                  <ToggleRow key={t.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{t.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{t.sub}</div>
                    </div>
                    <Toggle on={anvisaToggles[t.key as keyof typeof anvisaToggles]} onToggle={() => setAnvisaToggles(p => ({ ...p, [t.key]: !p[t.key as keyof typeof p] }))} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <SaveRow>
                <Btn $variant="primary" onClick={() => showToast('Configurações ANVISA salvas com sucesso!')}>Salvar Configurações ANVISA</Btn>
              </SaveRow>
            </div>
          )}

          {/* ══ COMISSÕES ══ */}
          {active === 'comissoes' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Regras de Comissão</SectionTitle>
                  <SectionDesc>Configure os percentuais padrão de comissão por procedimento.</SectionDesc>
                </div>
                <SectionBadge>Padrão Global</SectionBadge>
              </SectionHeader>

              <FormGrid>
                {[
                  { label: 'Toxina Botulínica (%)', key: 'botox' },
                  { label: 'Preenchimento (%)',      key: 'preenchimento' },
                  { label: 'Bioestimulador (%)',     key: 'bioestimulador' },
                  { label: 'Fio de PDO (%)',          key: 'fio' },
                  { label: 'Skincare / Pele (%)',    key: 'skincare' },
                  { label: 'Outros (%)',              key: 'outros' },
                ].map(f => (
                  <Field key={f.key} label={f.label} type="number" value={comissao[f.key as keyof typeof comissao]} onChange={(e: any) => setComissao(p => ({ ...p, [f.key]: e.target.value }))} />
                ))}
                <SField label="Base de Cálculo" options={[{value:'bruto',label:'Sobre valor bruto'},{value:'liquido',label:'Sobre valor líquido'}]} value={comissao.base} onChange={(v: string) => setComissao(p => ({ ...p, base: v }))} />
                <SField label="Periodicidade do Pagamento" options={[{value:'mensal',label:'Mensal'},{value:'quinzenal',label:'Quinzenal'},{value:'semanal',label:'Semanal'}]} value={comissao.periodicidade} onChange={(v: string) => setComissao(p => ({ ...p, periodicidade: v }))} />
              </FormGrid>

              <InfoBox $variant="info" style={{ marginTop: 20 }}>
                <Icons.Info />
                Estes são os valores padrão. Cada admin de clínica pode personalizar os percentuais em seu painel.
              </InfoBox>

              <SaveRow>
                <Btn $variant="primary" onClick={() => showToast('Regras de comissão salvas com sucesso!')}>Salvar Regras Padrão</Btn>
              </SaveRow>
            </div>
          )}

          {/* ══ PERMISSÕES ══ */}
          {active === 'permissoes' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Permissões de Cargo</SectionTitle>
                  <SectionDesc>Ajuste o conjunto padrão de permissões por cargo em toda a plataforma.</SectionDesc>
                </div>
                <SectionBadge>Sistema</SectionBadge>
              </SectionHeader>

              <InfoBox $variant="warning">
                <Icons.AlertTriangle />
                Alterações nas permissões padrão afetam todos os usuários sem permissões personalizadas. Proceda com atenção.
              </InfoBox>

              <PermMatrix>
                {Object.entries(perms).map(([cargo, items]) => (
                  <PermGroup key={cargo}>
                    <PermGroupTitle>{cargo}</PermGroupTitle>
                    <PermGrid>
                      {CARGO_PERMS[cargo].map(perm => {
                        const active = items.includes(perm);
                        return (
                          <PermItem key={perm} $active={active} onClick={() => setPerms(p => ({
                            ...p,
                            [cargo]: active ? p[cargo].filter(x => x !== perm) : [...p[cargo], perm]
                          }))}>
                            <PermCheck $active={active}>{active && <Icons.Check />}</PermCheck>
                            {perm}
                          </PermItem>
                        );
                      })}
                    </PermGrid>
                  </PermGroup>
                ))}
              </PermMatrix>

              <SaveRow>
                <Btn $variant="primary" onClick={() => showToast('Permissões padrão atualizadas!')}>Salvar Permissões Padrão</Btn>
              </SaveRow>
            </div>
          )}

          {/* ══ AUDITORIA ══ */}
          {active === 'auditoria' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Auditoria & Logs</SectionTitle>
                  <SectionDesc>Histórico de todas as ações críticas realizadas na plataforma.</SectionDesc>
                </div>
                <Btn $size="sm" onClick={() => showToast('Exportando logs... Download iniciado.')}>
                  <Icons.Download /> Exportar Logs
                </Btn>
              </SectionHeader>

              <ActivityList>
                {[
                  { id: 1, action: 'Login realizado',                     user: 'Super Admin', time: 'Hoje, 09:14'  },
                  { id: 2, action: 'Clínica "Bella Vita" criada',          user: 'Super Admin', time: 'Ontem, 15:32' },
                  { id: 3, action: 'Plano Pro ativado — tenant #3',        user: 'Sistema',     time: 'Ontem, 11:20' },
                  { id: 4, action: 'Termos de uso atualizados',            user: 'Super Admin', time: '18/02/2025'   },
                  { id: 5, action: 'Usuário suspenso: Instituto Skin Care', user: 'Super Admin', time: '15/01/2025'  },
                ].map(log => (
                  <ActivityItem key={log.id}>
                    <ActivityDot $color={LOG_COLORS[log.id] || '#BBA188'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.83rem', color: '#333', marginBottom: 2 }}>
                        <strong style={{ color: '#1a1a1a' }}>{log.action}</strong>{' — '}por {log.user}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#bbb' }}>
                        <Icons.Clock /> {log.time}
                      </div>
                    </div>
                  </ActivityItem>
                ))}
              </ActivityList>
            </div>
          )}

          {/* ══ SEGURANÇA ══ */}
          {active === 'seguranca' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Segurança</SectionTitle>
                  <SectionDesc>Gerencie as configurações de segurança da plataforma e da sua conta.</SectionDesc>
                </div>
              </SectionHeader>

              <SubTitle style={{ marginBottom: 10 }}>Segurança da Conta</SubTitle>
              <ToggleGroup style={{ marginBottom: 24 }}>
                {[
                  { key: 'twoFa',      label: 'Autenticação em Dois Fatores (2FA)', sub: 'Adicionar camada extra com código por app ou SMS' },
                  { key: 'timeout',    label: 'Timeout de Sessão Automático',       sub: 'Desconectar automaticamente após 30 min de inatividade' },
                  { key: 'alertLogin', label: 'Alertas de Login Suspeito',          sub: 'Notificar por e-mail ao detectar acesso de IP não reconhecido' },
                ].map(t => (
                  <ToggleRow key={t.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{t.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{t.sub}</div>
                    </div>
                    <Toggle on={secToggles[t.key as keyof typeof secToggles]} onToggle={() => setSecToggles(p => ({ ...p, [t.key]: !p[t.key as keyof typeof p] }))} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <SubTitle style={{ marginBottom: 10 }}>Segurança da Plataforma</SubTitle>
              <ToggleGroup>
                {[
                  { key: 'audit',      label: 'Registro de Atividades (Audit Log)', sub: 'Registrar todas as ações críticas realizadas na plataforma' },
                  { key: 'twoFaAdmin', label: '2FA Obrigatório para Admins',        sub: 'Exigir autenticação em dois fatores para todos os admins de clínicas' },
                ].map(t => (
                  <ToggleRow key={t.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{t.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{t.sub}</div>
                    </div>
                    <Toggle on={secToggles[t.key as keyof typeof secToggles]} onToggle={() => setSecToggles(p => ({ ...p, [t.key]: !p[t.key as keyof typeof p] }))} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <DangerZone>
                <DangerTitle><Icons.AlertTriangle /> Zona de Perigo</DangerTitle>
                {[
                  { label: 'Exportar todos os dados da plataforma', sub: 'Baixar backup completo de todos os tenants, usuários e transações', action: () => showToast('Exportação iniciada. Arquivo disponível em instantes.'), variant: 'outline', btn: 'Exportar' },
                  { label: 'Limpar dados de ambiente de teste', sub: 'Remover todos os registros marcados como ambiente sandbox', action: () => setConfirmModal({ title: 'Limpar dados de teste?', msg: 'Esta ação é irreversível. Todos os dados de sandbox serão permanentemente removidos.', onConfirm: () => { setConfirmModal(null); showToast('Dados de teste removidos.'); } }), variant: 'danger', btn: 'Limpar' },
                  { label: 'Forçar logout de todos os usuários', sub: 'Invalidar todas as sessões ativas na plataforma imediatamente', action: () => setConfirmModal({ title: 'Forçar logout global?', msg: 'Todos os usuários serão desconectados imediatamente. Isso inclui todas as clínicas e admins ativos.', onConfirm: () => { setConfirmModal(null); showToast('Sessões invalidadas com sucesso.'); } }), variant: 'danger', btn: 'Forçar Logout' },
                ].map(item => (
                  <DangerItem key={item.label}>
                    <DangerText>
                      <strong>{item.label}</strong>
                      <span>{item.sub}</span>
                    </DangerText>
                    <Btn $variant={item.variant as any} $size="sm" onClick={item.action}>{item.btn}</Btn>
                  </DangerItem>
                ))}
              </DangerZone>
            </div>
          )}

          {/* ══ TERMOS ══ */}
          {active === 'termos' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Termos & Privacidade</SectionTitle>
                  <SectionDesc>Gerencie os documentos legais exibidos para os usuários da plataforma.</SectionDesc>
                </div>
              </SectionHeader>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Termos de Uso',          last: '20/02/2025', content: 'Bem-vindo ao AestheticOS. Ao utilizar nossa plataforma, você concorda com estes termos...' },
                  { label: 'Política de Privacidade', last: '15/01/2025', content: 'Sua privacidade é importante. Esta política descreve como coletamos e usamos seus dados...' },
                ].map(doc => (
                  <div key={doc.label} style={{ border: '1.5px solid #f0ebe4', borderRadius: 14, padding: 20, background: 'linear-gradient(135deg, #fdfaf7, #f9f4ef)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontFamily: 'var(--font-cabourg-bold), serif', fontSize: '0.95rem', fontWeight: 700, color: '#1a1a1a' }}>{doc.label}</div>
                    <div style={{ fontSize: '0.73rem', color: '#aaa' }}>Última atualização: {doc.last}</div>
                    <Btn $size="sm" onClick={() => setEditTerms({ label: doc.label, content: doc.content })}>
                      <Icons.Edit /> Editar Documento
                    </Btn>
                  </div>
                ))}
              </div>

              <InfoBox $variant="info">
                <Icons.Info />
                Ao atualizar estes documentos, todos os usuários serão solicitados a aceitar os novos termos no próximo acesso.
              </InfoBox>
            </div>
          )}

        </Content>
      </Layout>

      {/* ════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════ */}

      {/* Nova Clínica */}
      <Modal
        open={showNewClinic}
        title="Nova Clínica"
        onClose={() => setShowNewClinic(false)}
        footer={
          <>
            <Btn onClick={() => setShowNewClinic(false)}>Cancelar</Btn>
            <Btn $variant="primary" onClick={handleAddClinic}>Cadastrar Clínica</Btn>
          </>
        }
      >
        <Field label="Nome da Clínica *" placeholder="Ex: Clínica Bella Vita" value={newClinic.name} onChange={(e: any) => setNewClinic(p => ({ ...p, name: e.target.value }))} error={clinicErrors.name} />
        <Field label="CNPJ *" placeholder="00.000.000/0001-00" value={newClinic.cnpj} onChange={(e: any) => setNewClinic(p => ({ ...p, cnpj: e.target.value }))} error={clinicErrors.cnpj} />
        <SField label="Plano" options={[{value:'Starter',label:'Starter'},{value:'Pro',label:'Pro'},{value:'Enterprise',label:'Enterprise'}]} value={newClinic.plan} onChange={(v: string) => setNewClinic(p => ({ ...p, plan: v }))} />
      </Modal>

      {/* Editar Clínica */}
      <Modal
        open={showEditClinic && !!editClinic}
        title="Editar Clínica"
        onClose={() => setShowEditClinic(false)}
        footer={
          <>
            <Btn onClick={() => setShowEditClinic(false)}>Cancelar</Btn>
            <Btn $variant="primary" onClick={handleEditClinicSave}>Salvar Alterações</Btn>
          </>
        }
      >
        {editClinic && (
          <>
            <Field label="Nome da Clínica" value={editClinic.name} onChange={(e: any) => setEditClinic(p => p ? { ...p, name: e.target.value } : p)} />
            <Field label="CNPJ" value={editClinic.cnpj} onChange={(e: any) => setEditClinic(p => p ? { ...p, cnpj: e.target.value } : p)} />
            <SField label="Plano" options={[{value:'Starter',label:'Starter'},{value:'Pro',label:'Pro'},{value:'Enterprise',label:'Enterprise'}]} value={editClinic.plan} onChange={(v: string) => setEditClinic(p => p ? { ...p, plan: v } : p)} />
          </>
        )}
      </Modal>

      {/* Editar Plano */}
      <Modal
        open={!!editPlan}
        title={editPlan ? `Editar Plano — ${editPlan.name}` : ''}
        onClose={() => setEditPlan(null)}
        footer={
          <>
            <Btn onClick={() => setEditPlan(null)}>Cancelar</Btn>
            <Btn $variant="primary" onClick={() => { setEditPlan(null); showToast(`Plano ${editPlan?.name} atualizado com sucesso!`); }}>Salvar Plano</Btn>
          </>
        }
      >
        {editPlan && (
          <>
            <Field label="Nome do Plano" defaultValue={editPlan.name} />
            <Field label="Preço Mensal (R$)" defaultValue={editPlan.price.replace('R$ ', '')} type="number" />
            <Field label="Limite de Usuários" type="number" defaultValue="10" />
            <Field label="Módulos Incluídos" defaultValue="Todos os módulos" />
          </>
        )}
      </Modal>

      {/* Editar Termos */}
      <Modal
        open={!!editTerms}
        title={editTerms?.label || ''}
        onClose={() => setEditTerms(null)}
        footer={
          <>
            <Btn onClick={() => setEditTerms(null)}>Cancelar</Btn>
            <Btn $variant="primary" onClick={() => { setEditTerms(null); showToast('Documento atualizado! Usuários serão notificados.'); }}>Salvar Documento</Btn>
          </>
        }
      >
        {editTerms && (
          <FieldWrapper>
            <Label>Conteúdo do Documento</Label>
            <textarea
              defaultValue={editTerms.content}
              rows={8}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.85rem', color: '#333', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }}
              onFocus={(e) => (e.target.style.borderColor = '#BBA188')}
              onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
            />
          </FieldWrapper>
        )}
      </Modal>

      {/* Confirm (Danger) */}
      <Modal
        open={!!confirmModal}
        title={confirmModal?.title || ''}
        onClose={() => setConfirmModal(null)}
        footer={
          <>
            <Btn onClick={() => setConfirmModal(null)}>Cancelar</Btn>
            <Btn $variant="danger" onClick={confirmModal?.onConfirm}>Confirmar</Btn>
          </>
        }
      >
        {confirmModal && (
          <div style={{ fontSize: '0.87rem', color: '#555', lineHeight: 1.6 }}>{confirmModal.msg}</div>
        )}
      </Modal>

      {/* Toast */}
      <Toast $show={toastShow}>
        <ToastDot />
        {toast}
      </Toast>
    </Container>
  );
}