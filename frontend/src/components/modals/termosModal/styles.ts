import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.25s ease;
  padding: 16px;
  box-sizing: border-box;
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 580px;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
  max-height: 90vh;

  @media (max-width: 576px) {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 14px;
  }
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #a8906f 0%, #BBA188 100%);
  padding: 20px 24px;
  flex-shrink: 0;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px 0;
  letter-spacing: -0.01em;

  @media (max-width: 576px) {
    font-size: 1.1rem;
  }
`;

export const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.82);
  margin: 0;
`;

export const TabsRow = styled.div`
  display: flex;
  border-bottom: 1px solid #f0ebe4;
  flex-shrink: 0;
`;

export const TabBtn = styled.button<{ $active?: boolean }>`
  flex: 1;
  height: 40px;
  border: none;
  background: ${({ $active }) => ($active ? '#ffffff' : '#faf9f8')};
  color: ${({ $active }) => ($active ? '#BBA188' : '#aaa')};
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  cursor: pointer;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#BBA188' : 'transparent')};
  transition: color 0.2s, border-color 0.2s, background 0.2s;

  &:hover {
    color: #BBA188;
    background: #ffffff;
  }
`;

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  line-height: 1.7;
  color: #444;
  white-space: pre-wrap;
  min-height: 200px;
  max-height: 320px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f5f0ea;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #BBA188;
    border-radius: 4px;
  }

  @media (max-width: 576px) {
    max-height: 260px;
    font-size: 0.84rem;
    padding: 16px 18px;
  }
`;

export const Footer = styled.div`
  padding: 16px 24px 20px;
  background-color: #ffffff;
  border-top: 1px solid #f0ebe4;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-shrink: 0;

  @media (max-width: 576px) {
    padding: 14px 18px 18px;
    gap: 12px;
  }
`;

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #BBA188;
  cursor: pointer;
  flex-shrink: 0;
`;

export const CheckboxLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #555;
  line-height: 1.4;
`;

export const AcceptButton = styled.button<{ $enabled?: boolean }>`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: ${({ $enabled }) => ($enabled ? '#BBA188' : '#e8e3dd')};
  color: ${({ $enabled }) => ($enabled ? '#ffffff' : '#bbb')};
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'not-allowed')};
  transition: background 0.2s, color 0.2s, opacity 0.2s;

  &:hover {
    opacity: ${({ $enabled }) => ($enabled ? '0.9' : '1')};
  }

  @media (max-width: 576px) {
    height: 44px;
    font-size: 0.9rem;
  }
`;
