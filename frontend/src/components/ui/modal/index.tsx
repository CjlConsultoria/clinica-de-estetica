'use client';

import React, { useEffect } from 'react';
import { Overlay, ModalBox, ModalHeader, ModalTitle, CloseButton, ModalBody, ModalFooter } from './styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md', closeOnOverlayClick = true }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={closeOnOverlayClick ? onClose : undefined}>
      <ModalBox $size={size} onClick={e => e.stopPropagation()}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </CloseButton>
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalBox>
    </Overlay>
  );
}