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

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #333 !important;
    transition: background-color 5000s ease-in-out 0s;
  }
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
  min-width: 130px;
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
  &:hover { background: #e74c3c; color: white; }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
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
  h3 { font-size: 1rem; color: #555; margin: 0 0 5px; }
  p  { font-size: 0.85rem; color: #999; margin: 0; }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
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
`;

export const PasswordHint = styled.p`
  font-size: 0.78rem;
  color: #aaa;
  margin: 4px 0 0;
`;

export const WizardSteps = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0ebe4;
`;

export const WizardStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  max-width: 120px;
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
`;

export const WizardStepLabel = styled.span<{ $current?: boolean }>`
  margin-top: 6px;
  font-size: 0.68rem;
  text-align: center;
  color: ${({ $current }) => $current ? '#BBA188' : '#bbb'};
  font-weight: ${({ $current }) => $current ? '600' : '400'};
  line-height: 1.3;
  transition: color 0.2s;
`;

export const AreaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 8px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
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
`;

export const AreaIcon = styled.div`
  font-size: 2.4rem;
  line-height: 1;
`;

export const AreaTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
`;

export const AreaDesc = styled.div`
  font-size: 0.78rem;
  color: #aaa;
  line-height: 1.5;
`;

export const WizardNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StepSection = styled.div`
  min-height: 260px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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
`;

export const DetailMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  @media (max-width: 520px) { grid-template-columns: 1fr; }
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