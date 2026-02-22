import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const Panel = styled.div`
  background: white;
  border-radius: 24px;
  padding: 36px 32px 28px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
`;

export const PanelHeader = styled.div`
  text-align: center;
  margin-bottom: 28px;
`;

export const LogoMark = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #BBA188, #8a7560);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
`;

export const PanelTitle = styled.h2`
  font-size: 1.3rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 6px;
`;

export const PanelSubtitle = styled.p`
  font-size: 0.83rem;
  color: #aaa;
  margin: 0;
`;

export const DevBanner = styled.div`
  background: #fdf9f5;
  border: 1.5px solid #f0ebe4;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #BBA188;
  font-weight: 600;
`;

export const UserGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const UserCard = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1.5px solid ${({ $active }) => ($active ? '#BBA188' : '#e8e8e8')};
  border-radius: 14px;
  background: ${({ $active }) => ($active ? 'rgba(187,161,136,0.06)' : 'white')};
  cursor: pointer;
  transition: all 0.18s;
  text-align: left;
  width: 100%;
  box-shadow: ${({ $active }) => $active ? '0 0 0 3px rgba(187,161,136,0.15)' : 'none'};

  &:hover {
    border-color: #BBA188;
    background: rgba(187,161,136,0.04);
  }
`;

export const UserAvatar = styled.div<{ $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserEmail = styled.div`
  font-size: 0.73rem;
  color: #aaa;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserRoleBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-block;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 0.66rem;
  font-weight: 700;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const LoginBtn = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #BBA188, #8a7560);
  color: white;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const SwitchUserBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #fdf9f5;
  border-radius: 12px;
  border: 1px solid #f0ebe4;
  margin-bottom: 20px;
  gap: 12px;
`;

export const SwitchLabel = styled.span`
  font-size: 0.78rem;
  color: #999;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SwitchBtn = styled.button`
  font-size: 0.75rem;
  font-weight: 600;
  color: #BBA188;
  background: none;
  border: 1.5px solid #BBA188;
  border-radius: 8px;
  padding: 5px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #BBA188;
    color: white;
  }
`;