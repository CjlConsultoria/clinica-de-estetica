'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  SelectWrapper, Label, ErrorText,
  DropdownBtn, DropdownList, DropdownItem, ChevronIcon,
} from './styles';

interface SelectOption { value: string; label: string; }
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
  label, error, options, placeholder, fullWidth = true, value, onChange, disabled, id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

  const selected = options.find(o => o.value === value);
  const displayLabel = selected ? selected.label : placeholder || 'Selecione...';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SelectWrapper $fullWidth={fullWidth} ref={ref}>
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <div style={{ position: 'relative' }}>
        <DropdownBtn
          type="button"
          $hasError={!!error}
          $disabled={!!disabled}
          $hasValue={!!selected}
          onClick={() => !disabled && setOpen(prev => !prev)}
        >
          <span>{displayLabel}</span>
          <ChevronIcon $open={open}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </ChevronIcon>
        </DropdownBtn>

        {open && (
          <DropdownList>
            {options.map(opt => (
              <DropdownItem
                key={opt.value}
                $active={opt.value === value}
                onClick={() => { onChange?.(opt.value); setOpen(false); }}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </DropdownList>
        )}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </SelectWrapper>
  );
}