import styled from 'styled-components';

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  @media (max-width: 1024px) { padding: 24px 20px; }
  @media (max-width: 768px)  { padding: 20px 16px; }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0;
  font-weight: 600;
`;

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 380px;
  @media (max-width: 768px) { max-width: 100%; }
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
  &:focus { outline: none; border-color: #BBA188; box-shadow: 0 0 0 3px rgba(187,161,136,0.15); }
  &::placeholder { color: #bbb; }
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

export const DropdownWrapper = styled.div`
  position: relative;
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
  min-width: 150px;
  justify-content: space-between;
  transition: all 0.2s;
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
  animation: dropIn 0.18s ease;
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export const DropdownItem = styled.div<{ $active?: boolean }>`
  padding: 11px 18px;
  font-size: 0.87rem;
  color: ${({ $active }) => ($active ? '#BBA188' : '#444')};
  background: ${({ $active }) => ($active ? 'rgba(187,161,136,0.1)' : 'white')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
  &:hover { background: rgba(187,161,136,0.08); color: #BBA188; }
`;

export const ClearFilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border: 1.5px solid #e74c3c;
  border-radius: 50px;
  background: white;
  color: #e74c3c;
  font-size: 0.84rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #e74c3c; color: white; }
`;

export const Badge = styled.span<{ $bg?: string; $color?: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  background: ${({ $bg }) => $bg || '#f0ebe4'};
  color: ${({ $color }) => $color || '#BBA188'};
`;

/* ─── Grid e Cards ─── */

export const PatientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  /* altura fixa equivalente a 2 linhas de cards — não muda com quantidade */
  height: 720px;
  align-items: stretch;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); height: auto; }
  @media (max-width: 640px) { grid-template-columns: 1fr; height: auto; }
`;

export const PatientFotoCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  /* ocupa 100% da célula do grid para todas as linhas terem a mesma altura */
  height: 100%;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
`;

export const PatientCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f5f5f5;
  flex-shrink: 0;
`;

export const PatientAvatar = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const PatientName = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
`;

export const PatientSub = styled.div`
  font-size: 0.78rem;
  color: #999;
  margin-top: 2px;
`;

export const PatientCardBody = styled.div`
  padding: 12px 16px;
  flex: 1;
  /* scroll vertical interno — card não cresce, usuário rola as fotos */
  overflow-y: auto;
  overflow-x: hidden;
  /* scrollbar discreta no tema do sistema */
  scrollbar-width: thin;
  scrollbar-color: #e0d4c8 transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #e0d4c8; border-radius: 4px; }
`;

export const PatientCardFooter = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 16px;
  border-top: 1px solid #f5f5f5;
  flex-shrink: 0;
  background: white;
`;

export const FotoGrid = styled.div`
  display: grid;
  /* exatamente 3 colunas iguais */
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
`;

export const FotoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  /* largura controlada pelo grid, não pelo item */
  min-width: 0;
`;

export const FotoImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

export const FotoLabel = styled.div`
  font-size: 0.65rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FotoDate = styled.div`
  font-size: 0.62rem;
  color: #bbb;
`;

export const FotoEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 120px;
  color: #ccc;
  font-size: 0.82rem;
  svg { color: #ddd; }
`;

/* ─── Modais ─── */

export const SectionLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f0ebe4;
  padding-bottom: 6px;
`;

export const WizardNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

/* ─── Upload ─── */

export const UploadZone = styled.div`
  border: 2px dashed #e0d4c8;
  border-radius: 14px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  background: #fdf9f5;
  transition: all 0.2s;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  &:hover { border-color: #BBA188; background: #fdf5ef; }
`;

export const UploadPreview = styled.img`
  max-height: 200px;
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

export const UploadIcon = styled.div`
  color: #BBA188;
  margin-bottom: 12px;
  opacity: 0.7;
`;

export const UploadText = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

export const UploadHint = styled.div`
  font-size: 0.78rem;
  color: #bbb;
  margin-top: 4px;
`;

/* ─── Comparar ─── */

export const CompareSection = styled.div``;

export const CompareGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  gap: 16px;
  align-items: start;
`;

export const CompareSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CompareSideLabel = styled.div<{ $tipo: string }>`
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  background: ${({ $tipo }) => $tipo === 'antes' ? '#fff3cd' : '#f0ebe4'};
  color: ${({ $tipo }) => $tipo === 'antes' ? '#856404' : '#8a7560'};
`;

export const CompareImg = styled.div<{ $color: string; $hasImage?: boolean }>`
  width: 100%;
  aspect-ratio: 3/4;
  background: ${({ $color, $hasImage }) => $hasImage ? 'transparent' : `${$color}11`};
  border: ${({ $hasImage, $color }) => $hasImage ? 'none' : `2px dashed ${$color}44`};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${({ $color }) => $color};
  opacity: ${({ $hasImage }) => $hasImage ? 1 : 0.6};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  &:hover { opacity: 1; background: ${({ $color, $hasImage }) => $hasImage ? 'transparent' : `${$color}18`}; }
`;

export const SavedBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0faf0;
  border: 1.5px solid #6fcf6f;
  border-radius: 10px;
  padding: 10px 16px;
  color: #2d7a2d;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* ─────────────── Paginação ─────────────── */

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid #f0ebe4;
  /* sempre visível mesmo com 1 página */
  min-height: 56px;
  flex-shrink: 0;
`;

export const PaginationInfo = styled.span`
  font-size: 0.8rem;
  color: #999;
  font-weight: 400;
  white-space: nowrap;
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $active }) => ($active ? '#BBA188' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#888')};

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#BBA188' : 'rgba(187,161,136,0.12)')};
    color: ${({ $active }) => ($active ? '#ffffff' : '#BBA188')};
  }
`;

export const PageEllipsis = styled.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: #bbb;
  user-select: none;
`;

export const PaginationArrow = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #BBA188;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(187,161,136,0.12);
  }

  &:disabled {
    color: #ddd;
    cursor: not-allowed;
  }
`;