'use client';

import React from 'react';
import { InputWrapper, Label, StyledInput, ErrorText, HintText, IconLeft, IconRight } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Input({ label, error, hint, iconLeft, iconRight, fullWidth = true, id, ...rest }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div style={{ position: 'relative' }}>
        {iconLeft && <IconLeft>{iconLeft}</IconLeft>}
        <StyledInput
          id={inputId}
          $hasError={!!error}
          $hasIconLeft={!!iconLeft}
          $hasIconRight={!!iconRight}
          {...rest}
        />
        {iconRight && <IconRight>{iconRight}</IconRight>}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      {hint && !error && <HintText>{hint}</HintText>}
    </InputWrapper>
  );
}