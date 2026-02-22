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

export const PatientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const PatientFotoCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  transition: all 0.25s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
`;

export const PatientCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f5f5f5;
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
  padding: 16px 20px;
  min-height: 120px;
`;

export const FotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

export const FotoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  height: 80px;
  color: #ccc;
  font-size: 0.82rem;
  svg { color: #ddd; }
`;

export const CompareSection = styled.div``;

export const CompareTitle = styled.h4`
  font-size: 0.88rem;
  font-weight: 700;
  color: #BBA188;
  margin: 0 0 12px;
`;

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

export const CompareImg = styled.div<{ $color: string }>`
  width: 100%;
  aspect-ratio: 3/4;
  background: ${({ $color }) => $color}11;
  border: 2px dashed ${({ $color }) => $color}44;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${({ $color }) => $color};
  opacity: 0.6;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { opacity: 1; background: ${({ $color }) => $color}18; }
`;

/* ── Upload ── */
export const UploadZone = styled.div`
  border: 2px dashed #e0d4c8;
  border-radius: 14px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  background: #fdf9f5;
  transition: all 0.2s;
  &:hover { border-color: #BBA188; background: #fdf5ef; }
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

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;