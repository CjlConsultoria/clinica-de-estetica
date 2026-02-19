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
  overflow-y: ${({ $collapsed }) => ($collapsed ? 'hidden' : 'auto')};
  z-index: 1000;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              min-width 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    width: 240px;
    min-width: 240px;
    padding: 24px 0;
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s ease;
    overflow-y: auto;
    .close-btn { display: block !important; }
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 999;
  background-color: #BBA188;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: all 0.3s;
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
  transition: background 0.3s, color 0.3s;
  margin: 0 0 0 12px;

  &:hover {
    background: #2a2a2a;
    color: #BBA188;
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
  transition: max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.25s ease,
              padding-left 0.35s ease;

  @media (max-width: 1024px) {
    max-width: 240px;
    opacity: 1;
    padding-left: 20px;
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
`;

export const GreetingText = styled.p`
  font-size: 16px;
  color: #95A5A6;
  margin: 0 0 30px 0;
  white-space: nowrap;
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
  margin-top: ${({ $collapsed }) => ($collapsed ? '-110px' : '0')};
  transition: opacity 0.25s ease, max-height 0.35s ease, margin-top 0.35s ease;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const DividerTop = styled.div<{ $collapsed?: boolean }>`
  width: 85%;
  height: 1px;
  background-color: #645642;
  margin-top: ${({ $collapsed }) => ($collapsed ? '45px' : '15px')};
  margin-bottom: 8px;
`;

export const Nav = styled.nav<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? '100%' : 'calc(100% + 0px)')};
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
  padding-left: 0;

  @media (max-width: 1024px) {
    width: 100%;
    gap: 2px;
  }
`;

interface NavProps {
  $selected: boolean;
  $collapsed?: boolean;
}

export const NavLinkIcon = styled.div<NavProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg { color: ${({ $selected }) => ($selected ? '#BBA188' : '#95A5A6')}; transition: all 0.3s; }
`;

export const NavLinkText = styled.span<NavProps>`
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? '600' : '400')};
  color: ${({ $selected }) => ($selected ? '#BBA188' : '#95A5A6')};
  white-space: nowrap;
  overflow: hidden;
  max-width: ${({ $collapsed }) => ($collapsed ? '0' : '170px')};
  opacity: ${({ $collapsed }) => ($collapsed ? '0' : '1')};
  transition: opacity 0.2s ease, max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s ease, font-weight 0.3s ease;

  @media (max-width: 1024px) {
    opacity: 1;
    max-width: 170px;
  }
`;

export const NavTooltip = styled.span`
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
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
  transition: opacity 0.15s ease;
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
  text-decoration: none;
  transition: all 0.3s;

  /* FECHADO */
  ${({ $collapsed, $selected }) => $collapsed && `
    width: 90%;
    margin-left: 0;
    padding: 10px 0;
    justify-content: center;
    border-radius: 0 102px 102px 0;
    background: ${$selected ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
    gap: 0;
  `}

  /* ABERTO */
  ${({ $collapsed, $selected }) => !$collapsed && `
    width: calc(100% + 0px);
    margin-left: -0px;
    padding: 10px 20px 10px 28px;
    justify-content: flex-start;
    border-radius: 0 25px 25px 0;
    background: ${$selected ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
    gap: 11px;
  `}

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background-color: ${({ $selected }) => ($selected ? '#BBA188' : 'transparent')};
    border-radius: 0 4px 4px 0;
    transition: all 0.3s;
  }

  &:hover {
    background: rgba(212, 175, 55, 0.07);
    &::before { background-color: #BBA188; }
    ${NavLinkText} { color: #BBA188; font-weight: 600; }
    ${NavLinkIcon} svg { color: #BBA188; }
    ${NavTooltip} { opacity: 1; }
  }
`;

export const LogoutDivider = styled.div<{ $collapsed: boolean }>`
  width: 85%;
  height: 1px;
  background-color: #645642;
  margin: 8px 0;
`;

export const LogoutButton = styled.button<{ $collapsed?: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? '90%' : '100%')};
  margin-left: 0;
  border: none;
  background: transparent;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 0' : '10px 20px 10px 28px')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 12px;
  font-size: 13px;
  font-weight: 400;
  color: #95A5A6;
  border-radius: ${({ $collapsed }) => ($collapsed ? '0 12px 12px 0' : '0')};
  transition: all 0.3s;
  position: relative;
  overflow: visible;

  svg {
    color: #95A5A6;
    transition: all 0.3s;
    flex-shrink: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background-color: transparent;
    border-radius: 0 4px 4px 0;
    transition: all 0.3s;
  }

  &:hover {
    background: rgba(119, 64, 64, 0.07);
    color: #E74C3C;
    &::before { background-color: #E74C3C; }
    svg { color: #E74C3C; }
    ${NavTooltip} { opacity: 1; }
    border-radius: 0 102px 102px 0;
  }
`;

export const LogoutText = styled.span<{ $collapsed: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  max-width: ${({ $collapsed }) => ($collapsed ? '0' : '170px')};
  opacity: ${({ $collapsed }) => ($collapsed ? '0' : '1')};
  transition: opacity 0.2s ease, max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    opacity: 1;
    max-width: 170px;
  }
`;