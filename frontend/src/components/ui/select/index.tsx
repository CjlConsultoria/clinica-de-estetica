'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  SelectWrapper,
  Label,
  ErrorText,
  DropdownBtn,
  DropdownList,
  DropdownItem,
  ChevronIcon,
} from './styles';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

export default function Select({
  label,
  error,
  options,
  placeholder = 'Selecione...',
  fullWidth = true,
  value,
  onChange,
  disabled,
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : placeholder;
  const hasValue = !!selected;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(optValue: string) {
    onChange?.(optValue);
    setOpen(false);
  }

  return (
    <SelectWrapper $fullWidth={fullWidth} ref={ref}>
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <div style={{ position: 'relative' }}>
        <DropdownBtn
          type="button"
          id={selectId}
          $hasError={!!error}
          $disabled={!!disabled}
          $hasValue={hasValue}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span>{displayLabel}</span>
          <ChevronIcon $open={open}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </ChevronIcon>
        </DropdownBtn>

        {open && (
          <DropdownList role="listbox">
            {options.map((opt) => (
              <DropdownItem
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                $active={opt.value === value}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </DropdownList>
        )}
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
    </SelectWrapper>
  );
}