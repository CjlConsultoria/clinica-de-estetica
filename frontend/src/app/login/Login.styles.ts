import styled, { keyframes } from 'styled-components';
import { theme } from '@/styles/theme';

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const LoginContainer = styled.div`
  display: grid;
  grid-template-columns: 55% 45%;
  min-height: 100vh;
  background: ${theme.colors.background};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const LeftPanel = styled.div`
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

export const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 50%, ${theme.colors.accent} 100%);
`;

export const LeftOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  background: rgba(0,0,0,0.3);
`;

export const RightPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${theme.colors.backgroundSecondary};
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${fadeSlide} 0.4s ease;
`;

export const LogoArea = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

export const LogoIcon = styled.div`
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  border-radius: ${theme.borderRadius.lg};
  margin: 0 auto 1rem;
`;

export const LogoTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  color: ${theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const LogoSubtitle = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;
