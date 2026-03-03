import styled from 'styled-components';

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    padding: 72px 20px 24px;
  }

  @media (max-width: 768px) {
    padding: 72px 14px 20px;
  }

  @media (max-width: 480px) {
    padding: 68px 12px 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  gap: 16px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;
    column-gap: 12px;
    row-gap: 10px;
    margin-bottom: 20px;
    align-items: center;

    & > button,
    & > div > button {
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

  @media (max-width: 768px) {
    font-size: 1.6rem;
    grid-column: 1;
    grid-row: 1;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;

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

  &:focus {
    outline: none;
    border-color: #BBA188;
    box-shadow: 0 0 0 3px rgba(187,161,136,0.15);
  }
  &::placeholder { color: #bbb; }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #333 !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 10px 14px 10px 40px;
  }
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DropdownWrapper = styled.div`
  position: relative;

  @media (max-width: 768px) {
    flex: 1;
  }
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

  &:hover { border-color: #BBA188; }

  @media (max-width: 480px) {
    font-size: 0.84rem;
    padding: 9px 14px;
    min-width: unset;
  }
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
  white-space: nowrap;
  flex-shrink: 0;

  &:hover { background: #e74c3c; color: white; }

  @media (max-width: 480px) {
    font-size: 0.78rem;
    padding: 8px 12px;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  @media (max-width: 768px) {
    table-layout: auto;
    min-width: 700px;
  }
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

export const Th = styled.th<{ $width?: string; $center?: boolean }>`
  padding: 11px 10px;
  text-align: ${({ $center }) => $center ? 'center' : 'left'};
  font-size: 0.69rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;

  &:hover { background: #fdf9f5; }
  &:last-child { border-bottom: none; }
`;

export const Td = styled.td<{ $center?: boolean; $bold?: boolean; $muted?: boolean }>`
  padding: 10px 10px;
  font-size: 0.78rem;
  color: ${({ $muted }) => $muted ? '#777' : '#444'};
  font-weight: ${({ $bold }) => $bold ? '700' : '400'};
  text-align: ${({ $center }) => $center ? 'center' : 'left'};
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

export const RoleTag = styled.span<{ $bg?: string; $color?: string }>`
  display: inline-block;
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 0.68rem;
  font-weight: 600;
  background: ${({ $bg }) => $bg || '#f5f5f5'};
  color: ${({ $color }) => $color || '#888'};
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

export const Avatar = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const ProfissionalInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

export const ProfissionalName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProfissionalEmail = styled.div`
  font-size: 0.7rem;
  color: #aaa;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  text-align: center;
  color: #bbb;

  svg { margin-bottom: 14px; opacity: 0.35; }
  h3  { font-size: 1rem; color: #555; margin: 0 0 5px; }
  p   { font-size: 0.85rem; color: #999; margin: 0; }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    & > * {
      grid-column: 1 !important;
    }
  }
`;

export const SectionLabel = styled.div`
  grid-column: span 2;
  font-size: 0.78rem;
  font-weight: 600;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f0ebe4;
  padding-bottom: 6px;
  margin-bottom: 4px;

  @media (max-width: 560px) {
    grid-column: 1;
  }
`;

export const PasswordHint = styled.p`
  font-size: 0.78rem;
  color: #aaa;
  margin: 4px 0 0;
`;

/* ─────────────── Wizard ─────────────── */

export const WizardSteps = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0ebe4;

  @media (max-width: 600px) {
    margin-bottom: 20px;
    padding-bottom: 16px;
    gap: 0;
  }
`;

export const WizardStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  max-width: 120px;

  @media (max-width: 600px) {
    max-width: 64px;
  }
`;

export const WizardStepLine = styled.div<{ $done?: boolean }>`
  position: absolute;
  top: 14px;
  left: calc(-50%);
  right: calc(50% + 14px);
  height: 2px;
  background: ${({ $done }) => $done ? '#BBA188' : '#e8e8e8'};
  transition: background 0.3s;
  z-index: 0;
`;

export const WizardStepCircle = styled.div<{ $done?: boolean; $current?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
  transition: all 0.25s;
  background: ${({ $done }) => $done ? '#BBA188' : 'white'};
  color: ${({ $done, $current }) => $done ? 'white' : $current ? '#BBA188' : '#ccc'};
  border: 2px solid ${({ $done, $current }) => ($done || $current) ? '#BBA188' : '#e8e8e8'};
  box-shadow: ${({ $current }) => $current ? '0 0 0 4px rgba(187,161,136,0.15)' : 'none'};

  @media (max-width: 600px) {
    width: 24px;
    height: 24px;
    font-size: 0.68rem;
  }
`;

export const WizardStepLabel = styled.span<{ $current?: boolean }>`
  margin-top: 6px;
  font-size: 0.68rem;
  text-align: center;
  color: ${({ $current }) => $current ? '#BBA188' : '#bbb'};
  font-weight: ${({ $current }) => $current ? '600' : '400'};
  line-height: 1.3;
  transition: color 0.2s;

  @media (max-width: 600px) {
    font-size: 0.58rem;
    margin-top: 4px;
  }

  @media (max-width: 400px) {
    display: none;
  }
`;

export const AreaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 8px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const AreaCard = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 28px 20px;
  border: 2px solid ${({ $active }) => $active ? '#BBA188' : '#e8e8e8'};
  border-radius: 16px;
  background: ${({ $active }) => $active ? 'rgba(187,161,136,0.06)' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${({ $active }) => $active ? '0 0 0 4px rgba(187,161,136,0.12)' : 'none'};

  &:hover { border-color: #BBA188; background: rgba(187,161,136,0.04); }

  @media (max-width: 480px) {
    padding: 20px 16px;
    gap: 8px;
    border-radius: 12px;
  }
`;

export const AreaIcon = styled.div`
  font-size: 2.4rem;
  line-height: 1;
`;

export const AreaTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const AreaDesc = styled.div`
  font-size: 0.78rem;
  color: #aaa;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.72rem;
  }
`;

export const WizardNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 480px) {
    gap: 10px;

    & > button {
      flex: 1;
      justify-content: center;
    }
  }
`;

export const StepSection = styled.div`
  min-height: 260px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 480px) {
    min-height: 200px;
  }
`;

export const DetailModal = styled.div`
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 4px;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0ebe4;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }
`;

export const DetailAvatar = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ $color }) => $color}22;
  border: 2.5px solid ${({ $color }) => $color}55;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
`;

export const DetailName = styled.h2`
  font-size: 1.2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 8px;

  @media (max-width: 480px) {
    font-size: 1.05rem;
  }
`;

export const DetailMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 480px) {
    align-items: center;
  }
`;

export const DetailMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.83rem;
  color: #666;

  svg { color: #BBA188; flex-shrink: 0; }
`;

export const DetailSection = styled.div`
  margin-top: 4px;
`;

export const DetailSectionTitle = styled.h3`
  font-size: 0.9rem;
  color: #BBA188;
  margin: 0 0 14px;
  font-weight: 700;
  border-bottom: 1px solid #f0ebe4;
  padding-bottom: 8px;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

export const StatPill = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${({ $color }) => $color}18;
  color: ${({ $color }) => $color};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  background: #fdf9f5;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #f0ebe4;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    padding: 14px;
    gap: 12px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const InfoValue = styled.span`
  font-size: 0.88rem;
  color: #444;
  font-weight: 500;
`;

export const ObsBox = styled.div`
  background: #fdf9f5;
  border-radius: 10px;
  padding: 12px 16px;
  border: 1px solid #f0ebe4;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;

  strong { color: #BBA188; }
`;

export const UserSwitcherBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: white;
  border-radius: 12px;
  border: 1.5px solid #f0ebe4;
  margin-bottom: 20px;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  @media (max-width: 480px) {
    padding: 8px 12px;
    border-radius: 10px;
    gap: 8px;
    margin-bottom: 14px;
  }
`;

export const UserSwitcherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  color: #BBA188;
  font-size: 0.82rem;

  @media (max-width: 480px) {
    gap: 6px;
    font-size: 0.76rem;
  }
`;

export const UserSwitcherName = styled.span`
  font-size: 0.82rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  strong {
    color: #1a1a1a;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    font-size: 0.74rem;
  }
`;

export const UserSwitcherBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 480px) {
    display: none;
  }
`;

export const UserSwitcherBtn = styled.button`
  font-size: 0.75rem;
  font-weight: 600;
  color: #BBA188;
  background: none;
  border: 1.5px solid #BBA188;
  border-radius: 8px;
  padding: 5px 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #BBA188;
    color: white;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 5px 10px;
    border-radius: 6px;
  }
`;