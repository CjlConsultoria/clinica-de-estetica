import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.25s ease;
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 450px;
  min-height: 200px;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  @media (max-width: 576px) { max-width: 95%; }
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #a8906f 0%, #a8906f 100%);
  padding: 20px;
  flex-shrink: 0;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
  @media (max-width: 576px) { font-size: 1.15rem; }
`;

export const Content = styled.div`
  padding: 28px 20px;
  background-color: #ffffff;
  flex: 1;
  display: flex;
  align-items: flex-start;
`;

export const ContentWithTitle = styled.div`
  padding: 28px 20px;
  background-color: #ffffff;
  flex: 1;
`;

export const Message = styled.p`
  font-size: 0.95rem;
  color: #374151;
  margin: 0;
  line-height: 1.6;
  @media (max-width: 576px) { font-size: 0.9rem; }
`;

export const MessageAsTitle = styled.p`
  font-size: 0.95rem;
  color: #374151;
  margin: 0;
  line-height: 1.6;
`;

export const Footer = styled.div`
  padding: 0;
  background-color: #ffffff;
  border-top: 1px solid #d0d0d0;
  display: flex;
  flex-shrink: 0;
`;

export const CancelButton = styled.button`
  flex: 1;
  height: 56px;
  border: none;
  border-radius: 0 0 0 16px;
  background-color: #ffffff;
  color: #757575;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-right: 1px solid #d0d0d0;
  &:hover { background-color: #f8f9fa; }
  @media (max-width: 576px) { height: 52px; font-size: 0.95rem; }
`;

export const ConfirmButton = styled.button`
  flex: 1;
  height: 56px;
  border: none;
  border-radius: 0 0 16px 0;
  background-color: #fff3e0;
  color: #a8906f;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover { background-color: #f8f9fa; }
  @media (max-width: 576px) { height: 52px; font-size: 0.95rem; }
`;
