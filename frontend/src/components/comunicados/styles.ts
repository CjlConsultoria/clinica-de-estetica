import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  overflow-x: hidden;
  animation: ${fadeUp} 0.35s ease;

  @media (max-width: 1024px) { padding: 72px 20px 24px; }
  @media (max-width: 768px)  { padding: 72px 14px 20px; }
  @media (max-width: 480px)  { padding: 68px 12px 20px; }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  gap: 16px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 12px;
    row-gap: 10px;
    margin-bottom: 20px;
    align-items: center;

    & > button {
      grid-column: 1 / -1;
      grid-row: 2;
      width: 100%;
      justify-content: center;
    }
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0;
  font-weight: 600;

  @media (max-width: 768px) { font-size: 1.6rem; }
  @media (max-width: 480px) { font-size: 1.4rem; }
`;

export const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #aaa;
  margin: 5px 0 0;
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 28px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const StatBox = styled.div<{ $highlight?: boolean }>`
  background: white;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border-left: 4px solid ${p => p.$highlight ? '#BBA188' : '#e8e0d8'};

  @media (max-width: 480px) { padding: 14px 12px; }
`;

export const StatBoxValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-cabourg-bold), serif;

  @media (max-width: 480px) { font-size: 1.3rem; }
`;

export const StatBoxLabel = styled.div`
  font-size: 0.72rem;
  color: #aaa;
  font-weight: 600;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.4px;

  @media (max-width: 480px) { font-size: 0.65rem; }
`;

export const TabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  padding: 9px 20px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
  font-family: inherit;
  background: ${p => p.$active ? '#BBA188' : 'transparent'};
  color: ${p => p.$active ? 'white' : '#888'};

  &:hover {
    background: ${p => p.$active ? '#BBA188' : 'rgba(187,161,136,0.1)'};
    color: ${p => p.$active ? 'white' : '#BBA188'};
  }

  @media (max-width: 480px) {
    padding: 7px 14px;
    font-size: 0.78rem;
  }
`;

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 380px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

export const SearchIconWrap = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #bbb;
  pointer-events: none;
  display: flex;
`;

export const SearchInputStyled = styled.input`
  width: 100%;
  padding: 11px 16px 11px 42px;
  border: 1.5px solid #e8e8e8;
  border-radius: 50px;
  font-size: 0.9rem;
  background: white;
  color: #333;
  transition: all 0.25s;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #BBA188;
    box-shadow: 0 0 0 3px rgba(187,161,136,0.15);
  }
  &::placeholder { color: #bbb; }

  @media (max-width: 480px) { font-size: 0.84rem; }
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) { width: 100%; }
`;

export const DropdownWrapper = styled.div`
  position: relative;

  @media (max-width: 768px) { flex: 1; }
`;

export const DropdownBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border: 1.5px solid #e8e8e8;
  border-radius: 50px;
  background: white;
  color: #444;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  min-width: 130px;
  justify-content: space-between;
  transition: all 0.2s;
  width: 100%;
  font-family: inherit;

  &:hover { border-color: #BBA188; }
`;

export const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 100%;
  background: white;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  z-index: 100;
  overflow: hidden;
`;

export const DropdownItem = styled.div<{ $active?: boolean }>`
  padding: 10px 18px;
  font-size: 0.87rem;
  color: ${({ $active }) => ($active ? '#BBA188' : '#444')};
  background: ${({ $active }) => ($active ? 'rgba(187,161,136,0.1)' : 'white')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(187,161,136,0.08); color: #BBA188; }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    & > * { grid-column: 1 !important; }
  }
`;

export const ComunicadoCard = styled.div`
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 20px 22px;
  border: 1.5px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #BBA18822;
    box-shadow: 0 4px 14px rgba(187,161,136,0.1);
  }

  @media (max-width: 480px) { padding: 16px; }
`;

export const ComunicadoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 6px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const ComunicadoTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a1a1a;
  flex: 1;
`;

export const ComunicadoMeta = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  margin-bottom: 10px;
`;

export const ComunicadoBody = styled.div`
  font-size: 0.83rem;
  color: #555;
  line-height: 1.55;
`;

export const ComunicadoFooter = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
`;

const BadgeBase = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  white-space: nowrap;
`;

export const BadgeTipo   = styled(BadgeBase)``;
export const BadgeStatus = styled(BadgeBase)``;

export const EmpresaChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const EmpresaChip = styled.div<{ $selected: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid ${p => p.$selected ? '#BBA188' : '#e8e8e8'};
  background: ${p => p.$selected ? 'rgba(187,161,136,0.12)' : 'white'};
  color: ${p => p.$selected ? '#8a7560' : '#666'};
  user-select: none;

  &:hover { border-color: #BBA188; color: #8a7560; }
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
`;

export const CheckboxBox = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 2px solid ${p => p.$checked ? '#BBA188' : '#ddd'};
  background: ${p => p.$checked ? '#BBA188' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
`;

export const CheckboxLabel = styled.div`
  font-size: 0.83rem;
  color: #444;
  font-weight: 500;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  text-align: center;
  color: #bbb;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  font-size: 0.85rem;
`;

export const PreviewSection = styled.div``;

export const PreviewLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 10px;
`;

export const PreviewBox = styled.div<{ $tipo: string }>`
  border-radius: 12px;
  padding: 18px 20px;
  background: ${p =>
    p.$tipo === 'manutencao' ? 'rgba(107,114,128,0.06)' :
    p.$tipo === 'novidade'   ? 'rgba(59,130,246,0.06)'  :
    p.$tipo === 'alerta'     ? 'rgba(214,138,0,0.06)'   :
    'rgba(231,76,60,0.06)'};
  border: 1.5px solid ${p =>
    p.$tipo === 'manutencao' ? 'rgba(107,114,128,0.2)' :
    p.$tipo === 'novidade'   ? 'rgba(59,130,246,0.2)'  :
    p.$tipo === 'alerta'     ? 'rgba(214,138,0,0.2)'   :
    'rgba(231,76,60,0.2)'};
`;

export const PreviewTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

export const PreviewBody = styled.div`
  font-size: 0.82rem;
  color: #555;
  line-height: 1.55;
`;