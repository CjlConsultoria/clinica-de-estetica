import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); }`;

const sizes = { sm: '420px', md: '560px', lg: '720px', xl: '900px' };

export const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`;

export const ModalBox = styled.div<{ $size: string }>`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: ${({ $size }) => sizes[$size as keyof typeof sizes]};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0,0,0,0.2);
  animation: ${slideUp} 0.25s ease;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #f0f0f0;
`;

export const ModalTitle = styled.h2`
  font-size: 1.15rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0;
  font-weight: 700;
`;

export const CloseButton = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border: none; border-radius: 10px;
  background: #f5f5f5; color: #666; cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #fee; color: #e74c3c; }
`;

export const ModalBody = styled.div`
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  padding: 20px 28px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: center;

    & > div {
      width: 100%;
      justify-content: center;
    }
  }
`;