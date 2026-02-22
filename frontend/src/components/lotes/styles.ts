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
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
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
  max-width: 420px;
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
  width: 100%;
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

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 900px;
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

export const Td = styled.td<{ colSpan?: number }>`
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

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 8px;
`;

export const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
`;

export const TimelineDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #BBA188;
  flex-shrink: 0;
  margin-top: 5px;
`;

export const TimelineContent = styled.div`
  flex: 1;
`;

export const TimelineDate = styled.div`
  font-size: 0.76rem;
  color: #999;
  margin-bottom: 2px;
`;

export const TimelineText = styled.div`
  font-size: 0.88rem;
  color: #333;
  line-height: 1.4;
`;

export const DetailSection = styled.div`
  margin-bottom: 28px;
  &:last-child { margin-bottom: 0; }
`;

export const DetailSectionTitle = styled.h3`
  font-size: 0.95rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid #f0ebe4;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

export const DetailItem = styled.div`
  background: #f8f8f8;
  border-radius: 10px;
  padding: 12px;
`;

export const DetailLabel = styled.div`
  font-size: 0.72rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const DetailValue = styled.div<{ $highlight?: boolean; $warn?: boolean }>`
  font-size: ${({ $highlight }) => ($highlight ? '1rem' : '0.88rem')};
  font-weight: ${({ $highlight }) => ($highlight ? '700' : '600')};
  color: ${({ $warn, $highlight }) => $warn ? '#d68a00' : $highlight ? '#BBA188' : '#1a1a1a'};
`;

export const UsageTh = styled.th`
  padding: 10px 14px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const UsageTr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
  &:hover { background: #fdf9f5; }
`;

export const UsageTd = styled.td`
  padding: 10px 14px;
  font-size: 0.86rem;
  color: #444;
  vertical-align: middle;
`;