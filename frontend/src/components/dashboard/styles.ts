import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  animation: ${fadeUp} 0.35s ease;
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

export const DashHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

export const DashTitle = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const DateText = styled.p`
  font-size: 0.88rem;
  color: #999;
  margin: 4px 0 0;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;

  @media (max-width: 480px) {
    font-size: 0.78rem;
  }
`;

export const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 18px;
  }
`;

export const QuickAction = styled('a')<{ $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: white;
  border-radius: 16px;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.25s;
  border: 1.5px solid transparent;
  cursor: pointer;
  min-width: 0;
  overflow: hidden;

  &:hover {
    border-color: ${({ $color }) => $color};
    box-shadow: 0 8px 24px ${({ $color }) => $color}22;
    transform: translateY(-3px);
  }

  @media (max-width: 768px) {
    padding: 16px 10px;
    gap: 8px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 14px 8px;
    gap: 6px;
    border-radius: 10px;
  }
`;

export const QuickActionIcon = styled.div<{ $color: string }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${({ $color }) => $color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    color: ${({ $color }) => $color};
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    svg { width: 18px; height: 18px; }
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    svg { width: 16px; height: 16px; }
  }
`;

export const QuickActionLabel = styled.span`
  font-size: 0.82rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  font-weight: 600;
  color: #333;
  text-align: center;
  word-break: break-word;
  hyphens: auto;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr !important;
    gap: 14px;

    & > * {
      grid-column: 1 / -1 !important;
    }
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const BigCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  min-width: 0;
  width: 100%;

  &[style*="span 2"] {
    grid-column: span 2;
  }

  @media (max-width: 1200px) {
    &[style*="span 2"] {
      grid-column: span 1;
    }
  }

  @media (max-width: 768px) {
    border-radius: 14px;
    grid-column: 1 / -1 !important;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f5f5f5;

  @media (max-width: 768px) {
    padding: 14px 16px 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px 10px;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 0.92rem;
  }
`;

export const CardBody = styled.div`
  padding: 8px 0;
`;

export const AppointmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border-bottom: 1px solid #f8f8f8;
  min-width: 0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fdf9f5;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    gap: 8px;
    flex-wrap: wrap;
  }
`;

export const AppointmentTime = styled.span`
  font-size: 0.85rem;
  font-family: var(--font-roboto-medium), 'Roboto', sans-serif;
  color: #BBA188;
  font-weight: 700;
  min-width: 44px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 0.78rem;
    min-width: 38px;
  }
`;

export const AppointmentInfo = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

export const AppointmentName = styled.div`
  font-size: 0.9rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  color: #1a1a1a;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.82rem;
    white-space: normal;
  }
`;

export const AppointmentProcedure = styled.div`
  font-size: 0.78rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #999;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

export const AppointmentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 0.68rem;
  }
`;

export const StatusDot = styled.div<{ $color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const AlertsList = styled.div`
  padding: 8px 0;
`;

export const AlertItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-left: 3px solid ${({ $color }) => $color};
  margin: 5px 12px;
  border-radius: 8px;
  background: ${({ $color }) => $color}08;
  min-width: 0;

  @media (max-width: 480px) {
    padding: 10px 12px;
    margin: 4px 10px;
    gap: 8px;
  }
`;

export const AlertIcon = styled.div<{ $color: string }>`
  flex-shrink: 0;
  margin-top: 1px;

  svg {
    color: ${({ $color }) => $color};
  }
`;

export const AlertText = styled.div`
  font-size: 0.84rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #444;
  line-height: 1.4;
  min-width: 0;
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 0.76rem;
  }
`;

export const AlertTime = styled.div`
  font-size: 0.75rem;
  color: #bbb;
  margin-top: 3px;
`;

export const ChartBars = styled.div`
  padding: 8px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 8px 16px 14px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px 12px;
    gap: 8px;
  }
`;

export const ChartRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const ChartLabelText = styled.span`
  font-size: 0.78rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  color: #999;
  min-width: 28px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    min-width: 24px;
  }
`;

export const ChartBar = styled.div`
  height: 24px;
  background: linear-gradient(90deg, #BBA188, #a8906f);
  border-radius: 6px;
  transition: width 0.8s ease;
  min-width: 4px;
  flex: 1 1 auto;
  max-width: calc(100% - 60px);

  @media (max-width: 480px) {
    height: 20px;
  }
`;

export const ChartLabel = styled.div``;

export const ChartValue = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: #BBA188;
  min-width: 18px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

export const RecentPatientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 24px;
  border-bottom: 1px solid #f8f8f8;
  min-width: 0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fdf9f5;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    gap: 8px;
  }
`;

export const PatientAvatar = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    font-size: 0.76rem;
  }
`;

export const PatientName = styled.div`
  font-size: 0.88rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  color: #1a1a1a;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const PatientSub = styled.div`
  font-size: 0.76rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #999;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.68rem;
  }
`;