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
  margin-bottom: 24px;
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
  min-width: 140px;
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

/* ✅ 2 colunas fixas para exibir exatamente 4 cards (2x2) por página */
export const PatientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  @media (max-width: 840px) { grid-template-columns: 1fr; }
`;

export const PatientCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s;
  &:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(187,161,136,0.18); }
`;

export const PatientCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f5f5f5;
`;

export const PatientAvatar = styled.div<{ $color: string }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${({ $color }) => $color}22;
  border: 2px solid ${({ $color }) => $color}44;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
`;

export const PatientInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PatientName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PatientSub = styled.div`
  font-size: 0.78rem;
  color: #999;
  margin-bottom: 8px;
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

export const PatientCardBody = styled.div`
  padding: 16px 20px;
`;

export const TimelineWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f8f8f8;
  &:last-child { border-bottom: none; }
`;

export const TimelineDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  margin-top: 5px;
  flex-shrink: 0;
`;

export const TimelineContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TimelineDate = styled.div`
  font-size: 0.72rem;
  color: #bbb;
  margin-bottom: 1px;
`;

export const TimelineTitle = styled.div`
  font-size: 0.84rem;
  font-weight: 700;
  color: #333;
`;

export const TimelineDesc = styled.div`
  font-size: 0.76rem;
  color: #888;
  margin-top: 1px;
`;

export const TimelineTag = styled.span<{ $color: string }>`
  display: inline-block;
  margin-top: 3px;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 0.67rem;
  font-weight: 600;
  background: ${({ $color }) => $color}14;
  color: ${({ $color }) => $color};
  letter-spacing: 0.3px;
`;

export const PatientCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid #f5f5f5;
  background: #fdf9f5;
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

export const FullTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 16px;
    bottom: 0;
    width: 2px;
    background: #f0ebe4;
  }
`;

export const FullTimelineItem = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 20px;
  position: relative;
  &:last-child { padding-bottom: 0; }
`;

export const FullDot = styled.div<{ $color: string; $first?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 3px solid white;
  box-shadow: 0 0 0 2px ${({ $color }) => $color}44;
  flex-shrink: 0;
  margin-top: 4px;
  z-index: 1;
`;

export const FullContent = styled.div`
  flex: 1;
  background: #fdf9f5;
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #f0ebe4;
`;

export const FullDate = styled.div`
  font-size: 0.74rem;
  color: #bbb;
  margin-bottom: 2px;
`;

export const FullTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

export const FullDesc = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 0.82rem;
  color: #666;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

export const FullTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const FullTag = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${({ $color }) => $color}18;
  color: ${({ $color }) => $color};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  text-align: center;
  color: #bbb;
  h3 { font-size: 1.1rem; font-family: var(--font-cabourg-bold), 'Cabourg', serif; color: #555; margin: 0 0 6px; }
  p  { font-size: 0.88rem; color: #999; margin: 0; }
`;

/* ─────────────── Paginação ─────────────── */

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid #f0ebe4;
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
  &:hover:not(:disabled) { background: rgba(187,161,136,0.12); }
  &:disabled { color: #ddd; cursor: not-allowed; }
`;