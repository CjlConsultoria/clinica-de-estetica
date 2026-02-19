import React from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

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

  @media (max-width: 1024px) {
    width: 100%;
    padding: 24px 20px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const DashHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const DashTitle = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0;
  font-weight: 700;
`;

export const DateText = styled.p`
  font-size: 0.88rem;
  color: #999;
  margin: 4px 0 0;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
`;

export const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
`;

export const QuickAction = styled(Link)<{ $color: string }>`
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

  &:hover {
    border-color: ${({ $color }) => $color};
    box-shadow: 0 8px 24px ${({ $color }) => $color}22;
    transform: translateY(-3px);
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

  svg {
    color: ${({ $color }) => $color};
  }
`;

export const QuickActionLabel = styled.span`
  font-size: 0.82rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const BigCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: hidden;

  @media (max-width: 1200px) {
    &[style*="span 2"] {
      grid-column: span 1;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f5f5f5;
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0;
  font-weight: 700;
`;

export const CardBody = styled.div`
  padding: 8px 0;
`;

export const AppointmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid #f8f8f8;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fdf9f5;
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const AppointmentTime = styled.span`
  font-size: 0.85rem;
  font-family: var(--font-roboto-medium), 'Roboto', sans-serif;
  color: #BBA188;
  font-weight: 700;
  min-width: 48px;
`;

export const AppointmentInfo = styled.div`
  flex: 1;
`;

export const AppointmentName = styled.div`
  font-size: 0.9rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  color: #1a1a1a;
  font-weight: 600;
`;

export const AppointmentProcedure = styled.div`
  font-size: 0.78rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #999;
  margin-top: 2px;
`;

export const AppointmentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  color: #666;
  white-space: nowrap;
`;

export const StatusDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const AlertsList = styled.div`
  padding: 8px 0;
`;

export const AlertItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 24px;
  border-left: 3px solid ${({ $color }) => $color};
  margin: 6px 16px;
  border-radius: 8px;
  background: ${({ $color }) => $color}08;
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
`;

export const ChartRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ChartLabelText = styled.span`
  font-size: 0.78rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  color: #999;
  min-width: 30px;
`;

export const ChartBar = styled.div`
  height: 26px;
  background: linear-gradient(90deg, #BBA188, #a8906f);
  border-radius: 6px;
  transition: width 0.8s ease;
  min-width: 4px;
`;

export const ChartLabel = styled.div``;

export const ChartValue = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: #BBA188;
  min-width: 20px;
`;

export const RecentPatientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 24px;
  border-bottom: 1px solid #f8f8f8;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fdf9f5;
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
`;

export const PatientName = styled.div`
  font-size: 0.88rem;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
  color: #1a1a1a;
  font-weight: 600;
`;

export const PatientSub = styled.div`
  font-size: 0.76rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  color: #999;
  margin-top: 2px;
`;