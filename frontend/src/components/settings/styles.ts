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
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0;
  font-weight: 600;
`;

export const SettingsLayout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const SideNav = styled.div`
  background: white;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }
`;

export const SideNavItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? 'rgba(187, 161, 136, 0.15)' : 'transparent')};

  @media (max-width: 900px) {
    flex: 1;
    min-width: 120px;
  }

  &:hover {
    background: rgba(187, 161, 136, 0.1);
  }
`;

export const SideNavIcon = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
`;

export const SideNavLabel = styled.span<{ $active?: boolean }>`
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;

  @media (max-width: 900px) {
    font-size: 0.78rem;
  }
`;

export const SettingsContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Section = styled.div``;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 6px;
  font-weight: 700;
`;

export const SectionDesc = styled.p`
  font-size: 0.88rem;
  color: #999;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  margin: 0 0 28px;
  line-height: 1.5;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 14px;
`;

export const AvatarCircle = styled.div<{ $color: string }>`
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: ${({ $color }) => $color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  flex-shrink: 0;
`;

export const AvatarBtn = styled.button`
  padding: 9px 18px;
  border: 1.5px solid #BBA188;
  border-radius: 10px;
  background: white;
  color: #BBA188;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #BBA188;
    color: white;
  }
`;

export const ColorPicker = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ColorOption = styled.div<{ $color: string; $selected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  cursor: pointer;
  border: 3px solid ${({ $selected }) => ($selected ? '#fff' : 'transparent')};
  box-shadow: ${({ $selected, $color }) => ($selected ? `0 0 0 3px ${$color}` : 'none')};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.15);
  }
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const ToggleInfo = styled.div`
  flex: 1;
`;

export const ToggleLabel = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: #1a1a1a;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  margin-bottom: 3px;
`;

export const ToggleSubLabel = styled.div`
  font-size: 0.8rem;
  color: #999;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
`;

export const ToggleSwitch = styled.div<{ $active: boolean }>`
  width: 46px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $active }) => ($active ? '#BBA188' : '#ddd')};
  position: relative;
  cursor: pointer;
  transition: background 0.25s;
  flex-shrink: 0;
`;

export const ToggleKnob = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: ${({ $active }) => ($active ? 'calc(100% - 23px)' : '3px')};
  transition: left 0.25s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
`;

export const SaveRow = styled.div`
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
`;

export const DangerZone = styled.div`
  margin-top: 32px;
  padding: 24px;
  border: 1.5px solid #fee;
  border-radius: 14px;
  background: #fff8f8;
`;

export const DangerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #fee2e2;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const DangerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  strong {
    font-size: 0.88rem;
    color: #1a1a1a;
    font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  }

  span {
    font-size: 0.78rem;
    color: #999;
    font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  }
`;