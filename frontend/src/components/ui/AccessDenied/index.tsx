'use client';

import { ROLE_COLORS } from '@/types/auth';
import { useCurrentUser } from '@/components/ui/hooks/useCurrentUser';
import { Wrapper, IconWrap, Title, Description, RoleBadge } from './styles';

export default function AccessDenied() {
  const { currentUser, roleLabel, roleColors } = useCurrentUser();

  return (
    <Wrapper>
      <IconWrap>
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <line x1="12" y1="15" x2="12" y2="17" />
        </svg>
      </IconWrap>

      <Title>Acesso Restrito</Title>

      <Description>
        Você não tem permissão para acessar este módulo.
        Entre em contato com o administrador do sistema se precisar de acesso.
      </Description>

      {currentUser && roleColors && (
        <RoleBadge $bg={roleColors.bg} $color={roleColors.color}>
          {roleLabel} — acesso limitado
        </RoleBadge>
      )}
    </Wrapper>
  );
}