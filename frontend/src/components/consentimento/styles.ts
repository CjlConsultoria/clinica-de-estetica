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

export const AlertBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff3cd;
  border: 1.5px solid #ffc107;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 24px;
`;

export const AlertBannerIcon = styled.div`
  color: #856404;
  flex-shrink: 0;
  margin-top: 1px;
`;

export const AlertBannerText = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #533f03;
  line-height: 1.5;
  strong { font-weight: 700; }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  margin-bottom: 28px;
`;

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
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

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

export const Th = styled.th<{ $width?: string }>`
  padding: 11px 10px;
  text-align: left;
  font-size: 0.69rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  width: ${({ $width }) => $width || 'auto'};
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
  &:hover { background: #fdf9f5; }
  &:last-child { border-bottom: none; }
`;

export const Td = styled.td`
  padding: 10px 10px;
  font-size: 0.78rem;
  color: #444;
  vertical-align: middle;
`;

export const Badge = styled.span<{ $bg?: string; $color?: string }>`
  display: inline-block;
  padding: 3px 7px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 600;
  background: ${({ $bg }) => $bg || '#f0ebe4'};
  color: ${({ $color }) => $color || '#BBA188'};
  white-space: nowrap;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 4px;
`;

export const IconBtn = styled.button`
  width: 30px;
  height: 30px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  background: white;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  &:hover { background: #BBA188; border-color: #BBA188; color: white; }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

export const TermoViewer = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 4px;
`;

export const TermoTitle = styled.h2`
  font-size: 1.1rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 8px;
`;

export const TermoSection = styled.div`
  margin-bottom: 20px;
  h4 {
    font-size: 0.9rem;
    color: #BBA188;
    margin: 0 0 10px;
    font-weight: 700;
    border-bottom: 1px solid #f0ebe4;
    padding-bottom: 6px;
  }
  p { margin: 4px 0; font-size: 0.88rem; color: #444; }
`;

export const TermoBody = styled.p`
  font-size: 0.86rem;
  color: #555;
  line-height: 1.7;
  margin: 0 0 10px;
  text-align: justify;
`;

export const TermoText = styled.p`
  font-size: 0.88rem;
  color: #666;
  margin: 0 0 8px;
`;

export const SignatureBox = styled.div`
  margin-top: 8px;
`;

export const SignatureLabel = styled.div`
  font-size: 0.84rem;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
`;

export const SignatureCanvas = styled.div`
  width: 100%;
  height: 140px;
  border: 2px dashed #e0d4c8;
  border-radius: 12px;
  background: #fdf9f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
  transition: all 0.2s;
  &:hover { border-color: #BBA188; background: #fdf5ef; }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   ESTILOS — Abas e Texto do Consentimento
───────────────────────────────────────────────────────────────────────────── */

export const ConsentimentoTabsRow = styled.div`
  display: flex;
  align-items: flex-end;
  padding-left: 0;
  position: relative;
  z-index: 2;
  margin-top: 8px;
`;

export const ConsentimentoTabButton = styled.button<{ $active?: boolean }>`
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  font-weight: 700;
  font-size: 1rem;
  padding: 13px 36px;
  border: none;
  border-top-left-radius: 1000px;
  border-top-right-radius: 1000px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  cursor: ${({ $active }) => ($active ? 'default' : 'pointer')};
  position: relative;
  z-index: ${({ $active }) => ($active ? 3 : 1)};
  outline: none;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;

  background: ${({ $active }) => ($active ? '#ffffff' : '#e8e3dd')};
  color: ${({ $active }) => ($active ? '#BBA188' : '#a8906f')};
  box-shadow: ${({ $active }) => ($active
    ? '0 -3px 10px rgba(187,161,136,0.15), 2px -2px 6px rgba(0,0,0,0.06)'
    : 'none')};
`;

export const ConsentimentoCard = styled.div<{ $activeFirst?: boolean }>`
  width: 100%;
  background: #ffffff;
  border-radius: ${({ $activeFirst }) =>
    $activeFirst ? '0 16px 16px 16px' : '16px'};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.09);
  padding: 28px 42px 24px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  z-index: 1;
  height: 725px;
  margin-bottom: 28px;
`;

export const ConsentimentoContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const ConsentimentoScrollWrapper = styled.div`
  flex: 1;
  height: 600px;
  position: relative;
  display: flex;
  align-items: stretch;
`;

export const ConsentimentoTextDisplay = styled.div`
  width: 100%;
  height: 600px;
  min-height: 600px;
  max-height: 600px;
  padding: 14px 16px;
  font-family: 'Inter', var(--font-inter-variable-regular), sans-serif;
  font-weight: 400;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #444;
  background: transparent;
  border-radius: 12px;
  border: 1.5px solid #e8e3dd;
  outline: none;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  white-space: pre-wrap;

  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const ConsentimentoEditableTextarea = styled.textarea`
  width: 100%;
  height: 600px;
  min-height: 600px;
  max-height: 600px;
  padding: 14px 16px;
  font-family: 'Inter', var(--font-inter-variable-regular), sans-serif;
  font-weight: 400;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #444;
  background: transparent;
  resize: none;
  border-radius: 12px;
  border: 1.5px solid #BBA188;
  outline: none;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #BBA188;
    box-shadow: 0 0 0 3px rgba(187, 161, 136, 0.15);
    outline: none;
  }

  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const ConsentimentoCustomScrollbar = styled.div`
  position: absolute;
  right: -14px;
  top: 0;
  width: 6px;
  height: 100%;
  background: #f0ebe4;
  border-radius: 4px;
  z-index: 10;
`;

export const ConsentimentoScrollThumb = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #BBA188;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #a8906f; }
`;

export const ConsentimentoEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600px;
  gap: 14px;
  color: #bbb;
`;

export const ConsentimentoEmptyIconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f5f0ea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #BBA188;
`;

export const ConsentimentoEmptyText = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: #999;
  margin: 0;
  text-align: center;
`;

export const ConsentimentoFooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0ebe4;
`;

export const ConsentimentoLastUpdateWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: auto;
`;

export const ConsentimentoLastUpdateLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  color: #888;
  white-space: nowrap;
`;

export const ConsentimentoLastUpdateDate = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #aaa;
  white-space: nowrap;
`;