'use client';

import React from 'react';
import { Card, IconWrapper, Info, CardLabel, CardValue, CardTrend } from './styles';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: { value: string; positive: boolean };
}

export default function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  return (
    <Card>
      <IconWrapper $color={color}>{icon}</IconWrapper>
      <Info>
        <CardLabel>{label}</CardLabel>
        <CardValue>{value}</CardValue>
        {trend && (
          <CardTrend $positive={trend.positive}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </CardTrend>
        )}
      </Info>
    </Card>
  );
}