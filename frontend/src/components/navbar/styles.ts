import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface NavbarContainerProps {
  $isOpen: boolean;
  $collapsed: boolean;
}

export const NavbarContainer = styled.div<NavbarContainerProps>`
  width: ${({ $collapsed }) => ($collapsed ? '64px' : '240px')};
  min-width: ${({ $collapsed }) => ($collapsed ? '64px' : '240px')};
  height: 100vh;
  padding: 24px 0 24px 0;
  background-color: #0f0f0f;
  border-right: 1px solid #2a2a2a;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
  overflow-y: auto;
  z-index: 1000;
  will-change: width;
  transition:
    width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    min-width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }

  @media (min-width: 1025px) and (max-width: 1440px) {
    padding: 14px 0;
    overflow-y: auto;
  }

  @media (max-width: 1024px) {
    width: 240px;
    min-width: 240px;
    padding: 24px 0;
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    will-change: transform;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1100;
  background-color: #BBA188;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: background 0.3s;

  &:hover { background-color: #a8906f; }

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Overlay = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 999;
  }
`;

export const CollapseButton = styled.button<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: none;
  background: #1e1e1e;
  border-radius: 10px;
  cursor: pointer;
  color: #95A5A6;
  transition: background 0.25s ease, color 0.25s ease;
  position: absolute;
  left: 12px;
  top: 24px;
  z-index: 10;

  &:hover {
    background: #2a2a2a;
    color: #BBA188;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    width: 34px;
    height: 34px;
    left: 15px;
    top: 14px;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const LogoButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
`;

export const TopSection = styled.div<{ $collapsed: boolean }>`
  overflow: hidden;
  white-space: nowrap;
  max-width: ${({ $collapsed }) => ($collapsed ? '0' : '240px')};
  opacity: ${({ $collapsed }) => ($collapsed ? '0' : '1')};
  padding-left: ${({ $collapsed }) => ($collapsed ? '0' : '20px')};
  margin-top: 52px;
  transition:
    max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity ${({ $collapsed }) => ($collapsed ? '0.15s' : '0.25s')} ${({ $collapsed }) => ($collapsed ? '0s' : '0.15s')} ease,
    padding-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: max-width, opacity;

  @media (min-width: 1025px) and (max-width: 1440px) {
    max-width: ${({ $collapsed }) => ($collapsed ? '0' : '210px')};
    margin-top: 38px;
  }

  @media (max-width: 1024px) {
    max-width: 240px;
    opacity: 1;
    padding-left: 20px;
    margin-top: 52px;
  }
`;

export const TitleText = styled.h1`
  font-size: 28px;
  color: #BBA188;
  text-align: left;
  margin: 10px 0 4px 0;
  font-weight: 700;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  white-space: nowrap;

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 18px;
    margin: 4px 0 2px 0;
  }
`;

export const GreetingText = styled.p`
  font-size: 16px;
  color: #95A5A6;
  margin: 0 0 30px 0;
  white-space: nowrap;

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 11px;
    margin: 0 0 6px 0;
  }
`;

export const LogoCollapsed = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: ${({ $collapsed }) => ($collapsed ? '1' : '0')};
  max-height: ${({ $collapsed }) => ($collapsed ? '80px' : '0')};
  overflow: hidden;
  pointer-events: ${({ $collapsed }) => ($collapsed ? 'auto' : 'none')};
  visibility: ${({ $collapsed }) => ($collapsed ? 'visible' : 'hidden')};
  margin-top: ${({ $collapsed }) => ($collapsed ? '-80px' : '0')};
  transform: ${({ $collapsed }) => ($collapsed ? 'scale(1)' : 'scale(0.85)')};
  transition:
    opacity ${({ $collapsed }) => ($collapsed ? '0.25s' : '0.15s')} ${({ $collapsed }) => ($collapsed ? '0.2s' : '0s')} ease,
    max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0.4s ease,
    transform ${({ $collapsed }) => ($collapsed ? '0.35s' : '0.15s')} ${({ $collapsed }) => ($collapsed ? '0.15s' : '0s')} cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: opacity, transform;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const DividerTop = styled.div<{ $collapsed?: boolean }>`
  width: 85%;
  height: 1px;
  background-color: #645642;
  margin-top: ${({ $collapsed }) => ($collapsed ? '45px' : '0')};
  margin-bottom: ${({ $collapsed }) => ($collapsed ? '8px' : '0')};
  transform-origin: left center;
  transform: scaleX(${({ $collapsed }) => ($collapsed ? 1 : 0)});
  opacity: ${({ $collapsed }) => ($collapsed ? 1 : 0)};
  pointer-events: none;
  transition:
    transform ${({ $collapsed }) => ($collapsed ? '0.65s' : '0.2s')} cubic-bezier(0.25, 0.46, 0.45, 0.94) ${({ $collapsed }) => ($collapsed ? '0.15s' : '0s')},
    opacity ${({ $collapsed }) => ($collapsed ? '0.4s' : '0.15s')} ease ${({ $collapsed }) => ($collapsed ? '0.15s' : '0s')},
    margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    margin-bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;

  @media (min-width: 1025px) and (max-width: 1440px) {
    margin-top: ${({ $collapsed }) => ($collapsed ? '6px' : '0')};
    margin-bottom: ${({ $collapsed }) => ($collapsed ? '2px' : '0')};
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const Nav = styled.nav<{ $collapsed: boolean }>`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0px;
  margin-top: 4px;
  padding-left: 0;

  @media (min-width: 1025px) and (max-width: 1440px) {
    gap: 0px;
    margin-top: 1px;
  }

  @media (max-width: 1024px) {
    width: 100%;
    gap: 2px;
  }
`;

interface NavProps {
  $selected: boolean;
  $collapsed?: boolean;
}

interface SectionDividerWrapProps {
  $collapsed: boolean;
  $first?: boolean;
  $isBottom?: boolean;
}

export const SectionDividerWrap = styled.div<SectionDividerWrapProps>`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;

  max-height: ${({ $collapsed, $isBottom }) => {
    if ($isBottom) return $collapsed ? '0' : '26px';
    return '26px';
  }};

  margin-top: ${({ $first, $isBottom }) => {
    if ($isBottom) return '0';
    return $first ? '2px' : '8px';
  }};

  margin-bottom: ${({ $isBottom }) => ($isBottom ? '0' : '2px')};

  transition:
    max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    margin-bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 1025px) and (max-width: 1440px) {
    max-height: ${({ $collapsed, $isBottom }) => {
      if ($isBottom) return $collapsed ? '0' : '18px';
      return '18px';
    }};
    margin-top: ${({ $first, $isBottom }) => {
      if ($isBottom) return '0';
      return $first ? '1px' : '4px';
    }};
    margin-bottom: ${({ $isBottom }) => ($isBottom ? '0' : '1px')};
  }

  @media (max-width: 1024px) {
    max-height: 26px;
    margin-top: ${({ $first }) => ($first ? '2px' : '8px')};
    margin-bottom: 2px;
  }
`;

export const SectionDividerLine = styled.div<{ $collapsed: boolean }>`
  flex: 1;
  height: 1px;
  background-color: #645642;
  transform: scaleX(${({ $collapsed }) => ($collapsed ? 0 : 1)});
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition:
    transform ${({ $collapsed }) => ($collapsed ? '0.2s' : '0.65s')} cubic-bezier(0.25, 0.46, 0.45, 0.94) ${({ $collapsed }) => ($collapsed ? '0s' : '0.15s')},
    opacity ${({ $collapsed }) => ($collapsed ? '0.15s' : '0.4s')} ease ${({ $collapsed }) => ($collapsed ? '0s' : '0.15s')};
  will-change: transform, opacity;

  &:first-child { margin-left: 16px; transform-origin: left center; }
  &:last-child  { margin-right: 16px; transform-origin: right center; }

  @media (max-width: 1024px) {
    transform: scaleX(1);
    opacity: 1;
  }
`;

export const SectionDividerLabel = styled.span<{ $collapsed: boolean }>`
  font-size: 9px;
  font-weight: 600;
  color: #8a6e58;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 0 8px;
  flex-shrink: 0;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transform: translateY(${({ $collapsed }) => ($collapsed ? '-5px' : '0')});
  transition:
    opacity ${({ $collapsed }) => ($collapsed ? '0.12s' : '0.35s')} ease ${({ $collapsed }) => ($collapsed ? '0s' : '0.3s')},
    transform ${({ $collapsed }) => ($collapsed ? '0.12s' : '0.4s')} cubic-bezier(0.34, 1.4, 0.64, 1) ${({ $collapsed }) => ($collapsed ? '0s' : '0.28s')};
  will-change: opacity, transform;

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 8px;
  }

  @media (max-width: 1024px) {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const NavLinkIcon = styled.div<NavProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  min-width: 64px;
  flex-shrink: 0;

  svg {
    color: ${({ $selected }) => ($selected ? '#BBA188' : '#95A5A6')};
    transition: color 0.25s ease, transform 0.25s ease;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    width: 52px;
    min-width: 52px;
  }

  @media (max-width: 1024px) {
    width: 56px;
    min-width: 56px;
  }
`;

export const NavLinkText = styled.span<NavProps>`
  font-size: 12px;
  font-weight: ${({ $selected }) => ($selected ? '600' : '400')};
  color: ${({ $selected }) => ($selected ? '#BBA188' : '#95A5A6')};
  white-space: nowrap;
  overflow: hidden;
  max-width: ${({ $collapsed }) => ($collapsed ? '0' : '170px')};
  opacity: ${({ $collapsed }) => ($collapsed ? '0' : '1')};
  transition:
    opacity ${({ $collapsed }) => ($collapsed ? '0.1s' : '0.2s')} ${({ $collapsed }) => ($collapsed ? '0s' : '0.2s')} ease,
    max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.25s ease,
    font-weight 0.25s ease;
  will-change: opacity, max-width;

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 11px;
  }

  @media (max-width: 1024px) {
    opacity: 1;
    max-width: 170px;
    font-size: 13px;
  }
`;

export const NavTooltip = styled.span`
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
  background: #1e1e1e;
  color: #BBA188;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  border: 1px solid #2a2a2a;
  box-shadow: 4px 4px 16px rgba(0,0,0,0.4);
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 9999;

  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: #2a2a2a;
  }
`;

export const NavLink = styled(Link)<NavProps>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 16px 8px 0;
  width: 100%;
  justify-content: flex-start;
  text-decoration: none;
  border-radius: 0 25px 25px 0;
  background: ${({ $selected }) => ($selected ? 'rgba(212, 175, 55, 0.1)' : 'transparent')};
  transition:
    background 0.25s ease,
    border-radius 0.25s ease;

  @media (min-width: 1025px) and (max-width: 1440px) {
    padding: 6px 12px 6px 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background-color: ${({ $selected }) => ($selected ? '#BBA188' : 'transparent')};
    border-radius: 0 4px 4px 0;
    transition: background-color 0.25s ease;
  }

  &:hover {
    background: rgba(212, 175, 55, 0.07);

    &::before { background-color: #BBA188; }
    ${NavLinkText} { color: #BBA188; font-weight: 600; }
    ${NavLinkIcon} svg { color: #BBA188; transform: scale(1.1); }
    ${NavTooltip} { opacity: 1; transform: translateY(-50%) translateX(0px); }
  }
`;

export const LogoutDivider = styled.div<{ $collapsed: boolean }>`
  width: 85%;
  height: 1px;
  background-color: #645642;
  margin: ${({ $collapsed }) => ($collapsed ? '8px 0' : '0')};
  transform-origin: left center;
  transform: scaleX(${({ $collapsed }) => ($collapsed ? 1 : 0)});
  opacity: ${({ $collapsed }) => ($collapsed ? 1 : 0)};
  pointer-events: none;
  transition:
    transform ${({ $collapsed }) => ($collapsed ? '0.65s' : '0.2s')} cubic-bezier(0.25, 0.46, 0.45, 0.94) ${({ $collapsed }) => ($collapsed ? '0.15s' : '0s')},
    opacity ${({ $collapsed }) => ($collapsed ? '0.4s' : '0.15s')} ease ${({ $collapsed }) => ($collapsed ? '0.15s' : '0s')},
    margin 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;

  @media (min-width: 1025px) and (max-width: 1440px) {
    margin: ${({ $collapsed }) => ($collapsed ? '3px 0' : '0')};
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const LogoutButton = styled.button<{ $collapsed?: boolean }>`
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 16px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0;
  font-size: 12px;
  font-weight: 400;
  color: #95A5A6;
  border-radius: 0 25px 25px 0;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-radius 0.25s ease;
  position: relative;
  overflow: visible;

  svg {
    flex-shrink: 0;
    width: 64px;
    min-width: 64px;
    color: #95A5A6;
    transition: color 0.25s ease, transform 0.25s ease;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    padding: 6px 12px 6px 0;
    font-size: 11px;
    svg { width: 52px; min-width: 52px; }
  }

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 10px 16px 10px 0;
    svg { width: 56px; min-width: 56px; }
  }

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background-color: transparent;
    border-radius: 0 4px 4px 0;
    transition: background-color 0.25s ease;
  }

  &:hover {
    background: rgba(119, 64, 64, 0.07);
    color: #E74C3C;
    border-radius: 0 25px 25px 0;

    &::before { background-color: #E74C3C; }
    svg { color: #E74C3C; transform: scale(1.1); }
    ${NavTooltip} { opacity: 1; transform: translateY(-50%) translateX(0px); }
  }
`;

export const LogoutText = styled.span<{ $collapsed: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  max-width: ${({ $collapsed }) => ($collapsed ? '0' : '170px')};
  opacity: ${({ $collapsed }) => ($collapsed ? '0' : '1')};
  transition:
    opacity ${({ $collapsed }) => ($collapsed ? '0.1s' : '0.2s')} ${({ $collapsed }) => ($collapsed ? '0s' : '0.2s')} ease,
    max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, max-width;

  @media (max-width: 1024px) {
    opacity: 1;
    max-width: 170px;
  }
`;