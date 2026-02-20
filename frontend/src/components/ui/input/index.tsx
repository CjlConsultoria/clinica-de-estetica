'use client';

import React from 'react';
import { InputWrapper, Label, StyledInput, ErrorText, HintText, IconLeft, IconRight } from './styles';

// ─── Tipos de máscara suportados ─────────────────────────────────────────────
export type InputMask =
  | 'telefone'    // (00) 00000-0000
  | 'cpf'         // 000.000.000-00
  | 'cnpj'        // 00.000.000/0000-00
  | 'cep'         // 00000-000
  | 'data'        // 00/00/0000
  | 'moeda'       // R$ 0,00
  | 'rg';         // 00.000.000-0

// ─── Funções de máscara ───────────────────────────────────────────────────────

function applyTelefone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }
  return d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function applyCpf(v: string): string {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function applyCnpj(v: string): string {
  return v.replace(/\D/g, '').slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function applyCep(v: string): string {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

function applyDataMask(v: string): string {
  return v.replace(/\D/g, '').slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

function applyMoeda(v: string): string {
  const digits = v.replace(/\D/g, '');
  if (!digits) return '';
  const num = (parseInt(digits, 10) / 100).toFixed(2);
  return 'R$ ' + num.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function applyRg(v: string): string {
  return v.replace(/\D/g, '').slice(0, 9)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1})$/, '$1-$2');
}

export function applyMask(value: string, mask: InputMask): string {
  switch (mask) {
    case 'telefone': return applyTelefone(value);
    case 'cpf':      return applyCpf(value);
    case 'cnpj':     return applyCnpj(value);
    case 'cep':      return applyCep(value);
    case 'data':     return applyDataMask(value);
    case 'moeda':    return applyMoeda(value);
    case 'rg':       return applyRg(value);
    default:         return value;
  }
}

const MASK_PLACEHOLDER: Record<InputMask, string> = {
  telefone: '(00) 00000-0000',
  cpf:      '000.000.000-00',
  cnpj:     '00.000.000/0000-00',
  cep:      '00000-000',
  data:     '00/00/0000',
  moeda:    'R$ 0,00',
  rg:       '00.000.000-0',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  mask?: InputMask;
  /**
   * Quando há máscara, use onValueChange para receber a string mascarada diretamente.
   * Quando não há máscara, use onChange normalmente (evento nativo).
   */
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Input({
  label,
  error,
  hint,
  iconLeft,
  iconRight,
  fullWidth = true,
  id,
  mask,
  onChange,
  onValueChange,
  placeholder,
  value,
  ...rest
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  const resolvedPlaceholder = placeholder ?? (mask ? MASK_PLACEHOLDER[mask] : undefined);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (mask) {
      // Com máscara: aplica a máscara e entrega a string via onValueChange
      const masked = applyMask(e.target.value, mask);
      onValueChange?.(masked);
    } else {
      // Sem máscara: repassa o evento nativo normalmente
      onChange?.(e);
    }
  }

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
          placeholder={resolvedPlaceholder}
          value={value}
          onChange={handleChange}
          {...rest}
        />
        {iconRight && <IconRight>{iconRight}</IconRight>}
      </div>
      {error && (
        <ErrorText>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </ErrorText>
      )}
      {hint && !error && <HintText>{hint}</HintText>}
    </InputWrapper>
  );
}