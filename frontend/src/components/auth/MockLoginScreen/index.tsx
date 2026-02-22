'use client';

import { useState } from 'react';
import { MOCK_USERS, ROLE_LABELS, ROLE_COLORS } from '@/types/auth';
import { useCurrentUser } from '@/components/ui/hooks/useCurrentUser';
import {
  Overlay, Panel, PanelHeader, LogoMark, PanelTitle, PanelSubtitle,
  DevBanner, UserGrid, UserCard, UserAvatar, UserInfo, UserName, UserEmail,
  UserRoleBadge, LoginBtn,
} from './styles';

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export default function MockLoginScreen({ onClose }: { onClose: () => void }) {
  const { currentUser, switchUser } = useCurrentUser();
  const [selected, setSelected] = useState<number>(currentUser?.id ?? 0);

  function handleConfirm() {
    switchUser(selected);
    onClose();
  }

  const selectedUser = MOCK_USERS.find(u => u.id === selected);

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={e => e.stopPropagation()}>
        <PanelHeader>
          <LogoMark>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </LogoMark>
          <PanelTitle>Simular Acesso</PanelTitle>
          <PanelSubtitle>Escolha um perfil para testar as permissões</PanelSubtitle>
        </PanelHeader>

        <DevBanner>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Modo desenvolvedor — sem autenticação real
        </DevBanner>

        <UserGrid>
          {MOCK_USERS.map(user => {
            const colors = ROLE_COLORS[user.role];
            return (
              <UserCard key={user.id} $active={selected === user.id} onClick={() => setSelected(user.id)}>
                <UserAvatar $color={colors.color}>{getInitials(user.name)}</UserAvatar>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserInfo>
                <UserRoleBadge $bg={colors.bg} $color={colors.color}>
                  {ROLE_LABELS[user.role]}
                </UserRoleBadge>
              </UserCard>
            );
          })}
        </UserGrid>

        <LoginBtn onClick={handleConfirm}>
          Entrar como {selectedUser ? ROLE_LABELS[selectedUser.role] : '—'}
        </LoginBtn>
      </Panel>
    </Overlay>
  );
}