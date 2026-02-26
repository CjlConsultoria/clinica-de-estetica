import styled from 'styled-components';

export const PageWrapper = styled.div`
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

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #BBA188;
  margin: 0 0 28px 0;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 16px;
  }
`;

export const TabsRow = styled.div`
  display: flex;
  align-items: flex-end;
  padding-left: 0;
  position: relative;
  z-index: 2;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  font-weight: 700;
  font-size: 1rem;
  padding: 13px 36px;
  border: none;
  border-top-left-radius: 1000px;
  border-top-right-radius: 1000px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  cursor: pointer;
  position: relative;
  z-index: ${({ $active }) => ($active ? 3 : 1)};
  outline: none;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;

  background: ${({ $active }) => ($active ? '#ffffff' : '#e8e3dd')};
  color: ${({ $active }) => ($active ? '#BBA188' : '#a8906f')};
  box-shadow: ${({ $active }) =>
    $active
      ? '0 -3px 10px rgba(187,161,136,0.15), 2px -2px 6px rgba(0,0,0,0.06)'
      : 'none'};

  &:hover {
    background: ${({ $active }) => ($active ? '#ffffff' : '#ddd7d0')};
    color: #BBA188;
  }

  &:not(:first-child) {
    margin-left: -1px;
  }

  @media (max-width: 768px) {
    font-size: 0.88rem;
    padding: 11px 24px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 10px 16px;
    flex: 1;
    text-align: center;
  }
`;

export const Card = styled.div<{ $activeFirst?: boolean }>`
  width: 100%;
  background: #ffffff;
  border-radius: ${({ $activeFirst }) =>
    $activeFirst ? '0 16px 16px 16px' : '16px'};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.09);
  padding: 28px 28px 24px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  z-index: 1;
  min-height: 560px;

  @media (max-width: 768px) {
    padding: 20px 18px 18px;
    min-height: 480px;
  }

  @media (max-width: 480px) {
    padding: 16px 14px 14px;
    min-height: 420px;
    border-radius: 0 16px 16px 16px;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const ScrollWrapper = styled.div`
  flex: 1;
  height: 420px;
  position: relative;
  display: flex;
  align-items: stretch;

  @media (max-width: 768px) {
    height: 360px;
  }

  @media (max-width: 480px) {
    height: 300px;
  }
`;

export const TextDisplay = styled.div`
  width: 100%;
  height: 420px;
  min-height: 420px;
  max-height: 420px;
  padding: 14px 16px;
  font-family: 'Inter', var(--font-inter-variable-regular), sans-serif;
  font-weight: 400;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #444;
  background: transparent;
  border-radius: 12px;
  border: 1.5px solid #e8e3dd;
  outline: none;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  white-space: pre-wrap;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;

  @media (max-width: 768px) {
    height: 360px;
    min-height: 360px;
    max-height: 360px;
    font-size: 0.88rem;
  }

  @media (max-width: 480px) {
    height: 300px;
    min-height: 300px;
    max-height: 300px;
    font-size: 0.84rem;
    padding: 12px 14px;
  }
`;

export const EditableTextarea = styled.textarea`
  width: 100%;
  height: 420px;
  min-height: 420px;
  max-height: 420px;
  padding: 14px 16px;
  font-family: 'Inter', var(--font-inter-variable-regular), sans-serif;
  font-weight: 400;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #444;
  background: transparent;
  resize: none;
  border-radius: 12px;
  border: 1.5px solid #BBA188;
  outline: none;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #BBA188;
    box-shadow: 0 0 0 3px rgba(187, 161, 136, 0.15);
    outline: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;

  @media (max-width: 768px) {
    height: 360px;
    min-height: 360px;
    max-height: 360px;
    font-size: 0.88rem;
  }

  @media (max-width: 480px) {
    height: 300px;
    min-height: 300px;
    max-height: 300px;
    font-size: 0.84rem;
    padding: 12px 14px;
  }
`;

export const CustomScrollbar = styled.div`
  position: absolute;
  right: -14px;
  top: 0;
  width: 6px;
  height: 100%;
  background: #f0ebe4;
  border-radius: 4px;
  z-index: 10;

  @media (max-width: 768px) {
    right: -10px;
    width: 4px;
  }
`;

export const ScrollThumb = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #BBA188;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #a8906f;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 420px;
  gap: 14px;
  color: #bbb;

  @media (max-width: 768px) {
    height: 360px;
  }

  @media (max-width: 480px) {
    height: 300px;
    gap: 10px;
  }
`;

export const EmptyIconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f5f0ea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #BBA188;

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

export const EmptyText = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: #999;
  margin: 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.82rem;
  }
`;

export const ErrorText = styled(EmptyText)`
  color: #e74c3c;
`;

export const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0ebe4;

  @media (max-width: 480px) {
    gap: 10px;
    margin-top: 16px;
    padding-top: 14px;
    flex-wrap: wrap;

    & > button {
      flex: 1;
    }
  }
`;

export const LastUpdateWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: auto;

  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
    flex-wrap: wrap;
    gap: 4px;
  }
`;

export const LastUpdateLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  color: #888;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.72rem;
  }
`;

export const LastUpdateDate = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #aaa;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.72rem;
  }
`;

export const SkeletonBlock = styled.div`
  width: 100%;
  height: 420px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f5f0ea 25%, #ede8e2 50%, #f5f0ea 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 768px) {
    height: 360px;
  }

  @media (max-width: 480px) {
    height: 300px;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`;

export const ModalCard = styled.div`
  width: 460px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 28px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 24px 20px 20px;
    border-radius: 14px;
    gap: 10px;
  }
`;

export const ModalIconWrap = styled.div<{ $variant?: 'success' | 'warning' | 'error' }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $variant }) =>
    $variant === 'error'
      ? 'rgba(231,76,60,0.12)'
      : $variant === 'success'
      ? 'rgba(187,161,136,0.15)'
      : 'rgba(187,161,136,0.12)'};
  color: ${({ $variant }) =>
    $variant === 'error' ? '#e74c3c' : '#BBA188'};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
  }
`;

export const ModalTitle = styled.h2`
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const ModalText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  color: #666;
  margin: 0;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 0.82rem;
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const ModalPrimaryBtn = styled.button<{ $variant?: 'success' | 'error' | 'default' }>`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: ${({ $variant }) =>
    $variant === 'error' ? '#e74c3c' : '#BBA188'};
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.88; }

  @media (max-width: 480px) {
    height: 42px;
    font-size: 0.84rem;
  }
`;

export const ModalSecondaryBtn = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: 1.5px solid #e8e3dd;
  background: transparent;
  color: #888;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;

  &:hover { border-color: #BBA188; color: #BBA188; }

  @media (max-width: 480px) {
    height: 42px;
    font-size: 0.84rem;
  }
`;