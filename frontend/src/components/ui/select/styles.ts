import styled, { keyframes } from 'styled-components';

const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const SelectWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  position: relative;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  font-family: var(--font-metropolis-semibold), 'Metropolis', sans-serif;
`;

export const DropdownBtn = styled.button<{
  $hasError?: boolean;
  $disabled?: boolean;
  $hasValue?: boolean;
}>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 16px;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? '#ab031d' : '#e0e0e0')};
  border-radius: 1000px;
  font-size: 0.92rem;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;
  background: ${({ $disabled }) => ($disabled ? '#f5f5f5' : 'white')};
  color: ${({ $hasValue }) => ($hasValue ? '#1a1a1a' : '#bbb')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.25s ease;
  text-align: left;

  &:hover:not([disabled]) { border-color: #BBA188; }

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#ab031d' : '#BBA188')};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? 'rgba(171,3,29,0.1)' : 'rgba(187,161,136,0.15)'};
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
`;

export const ChevronIcon = styled.div<{ $open?: boolean }>`
  color: #999;
  pointer-events: none;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  display: flex;
  align-items: center;
`;

export const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 300;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  animation: ${dropIn} 0.18s ease;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
`;

export const DropdownItem = styled.div<{ $active?: boolean }>`
  padding: 11px 18px;
  font-size: 0.88rem;
  font-family: var(--font-metropolis-regular), 'Metropolis', sans-serif;
  color: ${({ $active }) => ($active ? '#BBA188' : '#444')};
  background: ${({ $active }) => ($active ? 'rgba(187,161,136,0.1)' : 'white')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.15s;
  border-bottom: 1px solid #f5f5f5;

  &:last-child { border-bottom: none; }
  &:first-child { border-radius: 12px 12px 0 0; }
  &:last-child { border-radius: 0 0 12px 12px; }

  &:hover {
    background: rgba(187, 161, 136, 0.08);
    color: #BBA188;
  }
`;

export const ErrorText = styled.div`
  padding: 8px 12px;
  background-color: transparent;
  border-left: 3px solid #ab031d;
  border-radius: 8px;
  color: #ab031d;
  font-size: 0.82rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  animation: ${fadeInDown} 0.3s ease;
  font-family: var(--font-inter-variable-regular), 'Inter', sans-serif;

  svg { flex-shrink: 0; }
`;