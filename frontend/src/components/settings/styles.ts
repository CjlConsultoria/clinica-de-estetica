import styled from 'styled-components';

export const Container = styled.div`
  padding: 40px;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;

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
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
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
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(187,161,136,0.12);
  color: #8a7560;
  border: 1px solid rgba(187,161,136,0.25);
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const SideNav = styled.div`
  background: white;
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: sticky;
  top: 24px;

  @media (max-width: 900px) {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px;
  }
`;

export const SideNavSection = styled.div`
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: #ccc;
  padding: 10px 14px 4px;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const SideNavDivider = styled.div`
  height: 1px;
  background: #f5f5f5;
  margin: 6px 0;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const SideNavItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => $active ? 'rgba(187,161,136,0.1)' : 'transparent'};
  border-left: 3px solid ${({ $active }) => $active ? '#BBA188' : 'transparent'};
  color: ${({ $active }) => $active ? '#BBA188' : '#666'};

  @media (max-width: 900px) {
    flex: 1;
    min-width: 120px;
    border-left: none;
    border-bottom: ${({ $active }) => $active ? '2px solid #BBA188' : '2px solid transparent'};
    border-radius: 8px;
    padding: 9px 12px;
  }

  @media (max-width: 480px) {
    min-width: 100px;
    padding: 8px 10px;
  }

  &:hover {
    background: rgba(187,161,136,0.07);
    color: #BBA188;
  }
`;

export const NavLabel = styled.span`
  font-size: 0.84rem;
  font-weight: 600;

  @media (max-width: 900px) {
    font-size: 0.78rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

export const Content = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  min-height: 500px;

  @media (max-width: 768px) {
    padding: 20px 18px;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 16px 14px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0ebe4;
  gap: 16px;

  @media (max-width: 480px) {
    flex-wrap: wrap;
    margin-bottom: 18px;
    padding-bottom: 16px;
    gap: 12px;

    & > button {
      width: 100%;
    }
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 4px;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 1.05rem;
  }
`;

export const SectionDesc = styled.p`
  font-size: 0.83rem;
  color: #aaa;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.78rem;
  }
`;

export const SectionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  background: rgba(187,161,136,0.1);
  color: #8a7560;
  white-space: nowrap;
  border: 1px solid rgba(187,161,136,0.2);
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const SubTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f0ebe4;
  padding-bottom: 8px;
  margin-bottom: 16px;
`;

export const FieldWrapper = styled.div<{ $span2?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: ${({ $span2 }) => $span2 ? 'span 2' : 'span 1'};

  @media (max-width: 640px) {
    grid-column: span 1;
  }
`;

export const Label = styled.label`
  font-size: 0.76rem;
  font-weight: 600;
  color: #555;
`;

export const InputField = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid ${({ $error }) => $error ? '#e74c3c' : '#e8e8e8'};
  border-radius: 10px;
  font-size: 0.87rem;
  background: white;
  color: #333;
  transition: all 0.2s;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #BBA188; box-shadow: 0 0 0 3px rgba(187,161,136,0.15); }
  &::placeholder { color: #ccc; }
`;

export const SelectField = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.87rem;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
  &:focus { outline: none; border-color: #BBA188; box-shadow: 0 0 0 3px rgba(187,161,136,0.15); }
`;

export const ErrorMsg = styled.span`
  font-size: 0.72rem;
  color: #e74c3c;
`;

export const Btn = styled.button<{ $variant?: string; $size?: string; $full?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: ${({ $size }) => $size === 'sm' ? '7px 14px' : '10px 20px'};
  border-radius: 50px;
  font-size: ${({ $size }) => $size === 'sm' ? '0.8rem' : '0.87rem'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid transparent;
  width: ${({ $full }) => $full ? '100%' : 'auto'};
  justify-content: center;
  white-space: nowrap;

  ${({ $variant }) => $variant === 'primary' ? `
    background: linear-gradient(135deg, #BBA188, #a8906f);
    color: white;
    border-color: transparent;
    box-shadow: 0 2px 8px rgba(187,161,136,0.35);
    &:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(187,161,136,0.45); }
  ` : $variant === 'danger' ? `
    background: rgba(231,76,60,0.08);
    color: #e74c3c;
    border-color: rgba(231,76,60,0.25);
    &:hover { background: #e74c3c; color: white; }
  ` : `
    background: white;
    color: #555;
    border-color: #e8e8e8;
    &:hover { border-color: #BBA188; color: #BBA188; }
  `}

  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  @media (max-width: 480px) {
    font-size: ${({ $size }) => $size === 'sm' ? '0.76rem' : '0.84rem'};
  }
`;

export const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  background: white;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #BBA188; border-color: #BBA188; color: white; }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const StatCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 12px;
  padding: 16px 18px;
  border: 1px solid #f0ebe4;
  border-left: 3px solid ${({ $color }) => $color};

  @media (max-width: 480px) {
    padding: 14px 16px;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;

  @media (max-width: 480px) {
    font-size: 0.62rem;
  }
`;

export const StatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

export const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #fdfaf7, #f9f4ef);
  border: 1.5px solid rgba(187,161,136,0.2);
  border-radius: 14px;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 14px;
    padding: 16px;
  }
`;

export const AvatarCircle = styled.div<{ $color: string }>`
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: ${({ $color }) => $color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  flex-shrink: 0;
  box-shadow: 0 4px 14px ${({ $color }) => $color}55;

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    font-size: 1.2rem;
  }
`;

export const ColorPickerRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const ColorDot = styled.div<{ $color: string; $selected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  cursor: pointer;
  border: 3px solid ${({ $selected }) => $selected ? '#fff' : 'transparent'};
  box-shadow: ${({ $selected, $color }) => $selected ? `0 0 0 3px ${$color}` : '0 1px 4px rgba(0,0,0,0.14)'};
  transition: all 0.2s;
  &:hover { transform: scale(1.15); }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

export const ToggleGroup = styled.div`
  border: 1px solid #f0ebe4;
  border-radius: 12px;
  overflow: hidden;
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 18px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
  &:last-child { border-bottom: none; }
  &:hover { background: #fdf9f5; }

  @media (max-width: 480px) {
    padding: 13px 14px;
    gap: 14px;
  }
`;

export const ToggleTrack = styled.div<{ $on: boolean }>`
  width: 46px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $on }) => $on ? '#BBA188' : '#e0e0e0'};
  position: relative;
  cursor: pointer;
  transition: background 0.25s;
  flex-shrink: 0;
  box-shadow: ${({ $on }) => $on ? '0 2px 8px rgba(187,161,136,0.4)' : 'none'};
`;

export const ToggleKnob = styled.div<{ $on: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: ${({ $on }) => $on ? 'calc(100% - 23px)' : '3px'};
  transition: left 0.25s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #f0ebe4;
  overflow: hidden;

  @media (max-width: 768px) {
    -webkit-overflow-scrolling: touch;
    border-radius: 10px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #BBA188, #a8906f);
`;

export const Th = styled.th<{ $w?: string }>`
  padding: 10px 14px;
  text-align: left;
  font-size: 0.66rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  width: ${({ $w }) => $w || 'auto'};
  white-space: nowrap;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
  &:hover { background: #fdf9f5; }
  &:last-child { border-bottom: none; }
`;

export const Td = styled.td`
  padding: 12px 14px;
  font-size: 0.8rem;
  color: #444;
  vertical-align: middle;
`;

export const Pill = styled.span<{ $bg: string; $color: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.67rem;
  font-weight: 700;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 5px;
`;

export const InfoBox = styled.div<{ $variant?: 'info' | 'warning' | 'danger' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 16px;
  border-radius: 10px;
  font-size: 0.81rem;
  line-height: 1.5;
  margin-bottom: 20px;

  background: ${({ $variant }) => ({
    info: 'rgba(187,161,136,0.08)',
    warning: 'rgba(234,179,8,0.08)',
    danger: 'rgba(231,76,60,0.07)',
  }[$variant ?? 'info'])};
  border: 1px solid ${({ $variant }) => ({
    info: 'rgba(187,161,136,0.22)',
    warning: 'rgba(234,179,8,0.22)',
    danger: 'rgba(231,76,60,0.18)',
  }[$variant ?? 'info'])};
  color: ${({ $variant }) => ({
    info: '#8a7560',
    warning: '#92730a',
    danger: '#c0392b',
  }[$variant ?? 'info'])};

  @media (max-width: 480px) {
    font-size: 0.78rem;
    padding: 12px 14px;
  }
`;

export const DangerZone = styled.div`
  margin-top: 32px;
  padding: 22px;
  border: 1.5px solid rgba(231,76,60,0.18);
  border-radius: 12px;
  background: #fff9f9;

  @media (max-width: 480px) {
    padding: 18px 16px;
  }
`;

export const DangerTitle = styled.h4`
  font-size: 0.85rem;
  font-weight: 700;
  color: #e74c3c;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DangerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 0;
  border-bottom: 1px solid rgba(231,76,60,0.08);
  &:last-child { border-bottom: none; padding-bottom: 0; }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    & > button {
      width: 100%;
    }
  }
`;

export const DangerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  strong { font-size: 0.84rem; color: #1a1a1a; font-weight: 600; }
  span { font-size: 0.74rem; color: #aaa; line-height: 1.4; }
`;

export const PermMatrix = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PermGroup = styled.div`
  border: 1px solid #f0ebe4;
  border-radius: 12px;
  overflow: hidden;
`;

export const PermGroupTitle = styled.div`
  background: #fdf9f5;
  padding: 8px 14px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #BBA188;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #f0ebe4;
`;

export const PermGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const PermItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  font-size: 0.78rem;
  color: ${({ $active }) => $active ? '#444' : '#ccc'};
  border-bottom: 1px solid #f9f5f0;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: rgba(187,161,136,0.06); }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 8px 10px;
  }
`;

export const PermCheck = styled.div<{ $active: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
  border: 1.5px solid ${({ $active }) => $active ? '#BBA188' : '#ddd'};
  background: ${({ $active }) => $active ? '#BBA188' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
`;

export const ActivityList = styled.div`
  border: 1px solid #f0ebe4;
  border-radius: 12px;
  overflow: hidden;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
  &:hover { background: #fdf9f5; }

  @media (max-width: 480px) {
    padding: 12px 14px;
    gap: 10px;
  }
`;

export const ActivityDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  margin-top: 6px;
`;

export const SaveRow = styled.div`
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f0ebe4;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 480px) {
    margin-top: 20px;

    & > button {
      width: 100%;
    }
  }
`;

export const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: ${({ $open }) => $open ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ModalBox = styled.div`
  background: white;
  border-radius: 18px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  overflow: hidden;
  animation: modalIn 0.25s ease;
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.96) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0ebe4;
`;

export const ModalTitle = styled.h3`
  font-size: 1rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0;
`;

export const ModalBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px 20px;
  border-top: 1px solid #f5f5f5;
`;

export const Toast = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: #1a1a1a;
  color: white;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  z-index: 9999;
  transform: ${({ $show }) => $show ? 'translateY(0)' : 'translateY(20px)'};
  opacity: ${({ $show }) => $show ? 1 : 0};
  pointer-events: none;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    bottom: 20px;
    right: 12px;
    left: 12px;
    font-size: 0.8rem;
  }
`;

export const ToastDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #BBA188;
  flex-shrink: 0;
`;