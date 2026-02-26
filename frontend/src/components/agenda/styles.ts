import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  overflow-x: hidden;

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
  gap: 16px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    column-gap: 12px;
    row-gap: 10px;
    margin-bottom: 16px;
    align-items: center;
    & > button:last-of-type,
    & > a:last-of-type {
      grid-column: 1 / -1;
      grid-row: 2;
      width: 100%;
    }
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
    grid-column: 1;
    grid-row: 1;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    display: contents;
  }
`;

export const ToggleGroup = styled.div`
  display: flex;
  background: white;
  border-radius: 50px;
  border: 1.5px solid #e8e8e8;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 768px) {
    grid-column: 2;
    grid-row: 1;
    align-self: center;
    justify-self: end;
  }
`;

export const ToggleBtn = styled.button<{ $active: boolean }>`
  padding: 9px 20px;
  border: none;
  cursor: pointer;
  font-size: 0.88rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  font-weight: 600;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? '#BBA188' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : '#666')};

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 0.82rem;
  }
`;


export const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  justify-content: center;

  .nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1.5px solid #e8e8e8;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
      border-color: #BBA188;
      color: #BBA188;
    }
  }

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 10px;
  }
`;

export const CalendarTitle = styled.span`
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  min-width: 240px;
  text-align: center;

  @media (max-width: 768px) {
    min-width: 0;
    flex: 1;
    font-size: 0.88rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const Legend = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 12px;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #666;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

export const LegendDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};

  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

export const DayHeader = styled.div`
  padding: 12px 8px;
  text-align: center;
  font-size: 0.78rem;
  font-weight: 700;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 480px) {
    padding: 8px 2px;
    font-size: 0.6rem;
    letter-spacing: 0;
  }
`;

export const DayCell = styled.div<{ $isToday?: boolean; $isEmpty?: boolean }>`
  min-height: 100px;
  padding: 8px;
  border: 1px solid #f0f0f0;
  background: ${({ $isEmpty }) => ($isEmpty ? '#fafafa' : 'white')};
  cursor: ${({ $isEmpty }) => ($isEmpty ? 'default' : 'pointer')};
  transition: background 0.15s;

  &:hover:not(:empty) {
    background: #fdf9f5;
  }

  @media (max-width: 768px) {
    min-height: 72px;
    padding: 4px;
  }

  @media (max-width: 480px) {
    min-height: 52px;
    padding: 3px 2px;
  }
`;

export const DayNumber = styled.div<{ $isToday?: boolean }>`
  font-size: 0.88rem;
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '500')};
  color: ${({ $isToday }) => ($isToday ? 'white' : '#333')};
  background: ${({ $isToday }) => ($isToday ? '#BBA188' : 'transparent')};
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-roboto-medium), 'Roboto', sans-serif;

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    font-size: 0.68rem;
  }
`;

export const EventsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 4px;

  @media (max-width: 480px) {
    gap: 2px;
    margin-top: 2px;
  }
`;

export const EventChip = styled.div<{ $color: string }>`
  font-size: 0.68rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  font-weight: 600;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 0.55rem;
    padding: 1px 3px;
    border-radius: 3px;
  }
`;

export const WeekView = styled.div`
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  width: 100%;

  @media (max-width: 768px) {
    border-radius: 10px;
  }
`;

export const SlotRow = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 36px repeat(7, 1fr);
  }
`;

export const TimeLabel = styled.div`
  padding: 8px 8px;
  font-size: 0.7rem;
  color: #bbb;
  font-family: var(--font-roboto-medium), 'Roboto', sans-serif;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  border-right: 1px solid #f5f5f5;

  @media (max-width: 768px) {
    font-size: 0.55rem;
    padding: 6px 2px;
  }
`;

export const TimeSlot = styled.div`
  border-right: 1px solid #f5f5f5;
  min-height: 52px;
  padding: 3px;
  position: relative;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: #fdf9f5;
  }

  @media (max-width: 768px) {
    min-height: 44px;
    padding: 2px;
  }
`;

export const EventBlock = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color}18;
  border-left: 3px solid ${({ $color }) => $color};
  border-radius: 0 6px 6px 0;
  padding: 4px 6px;
  height: 100%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1px;

  &:hover {
    background: ${({ $color }) => $color}30;
  }

  strong {
    font-size: 0.7rem;
    color: ${({ $color }) => $color};
    font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  }

  span {
    font-size: 0.65rem;
    color: #888;
    font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  }

  @media (max-width: 768px) {
    padding: 2px 3px;
    border-left-width: 2px;
    strong { font-size: 0.6rem; }
    span   { display: none; }
  }
`;

export const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  background: #BBA188;
  border-radius: 14px 14px 0 0;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 36px repeat(7, 1fr);
    border-radius: 10px 10px 0 0;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;