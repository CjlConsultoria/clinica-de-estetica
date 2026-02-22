import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '@/types/auth';

export function useCurrentUser() {
  const { currentUser, isAuthenticated, logout, switchUser } = useAuth();
  const roleLabel  = currentUser?.role ? ROLE_LABELS[currentUser.role]  : null;
  const roleColors = currentUser?.role ? ROLE_COLORS[currentUser.role]  : null;

  function getInitials(name: string) {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  return {
    currentUser, isAuthenticated, roleLabel, roleColors,
    initials: currentUser ? getInitials(currentUser.name) : '',
    logout, switchUser,
  };
}