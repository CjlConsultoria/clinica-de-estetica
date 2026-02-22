'use client';

import { useEffect } from 'react';
import * as S from './styles';

interface SucessModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
}

export default function SucessModal({
  isOpen, title, message, onClose, buttonText = 'Continuar'
}: SucessModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        {title ? (
          <>
            <S.Header><S.Title>{title}</S.Title></S.Header>
            <S.Content><S.Subtitle>{message}</S.Subtitle></S.Content>
          </>
        ) : (
          <S.ContentWithTitle><S.MessageAsTitle>{message}</S.MessageAsTitle></S.ContentWithTitle>
        )}
        <S.Footer><S.ConfirmButton onClick={onClose}>{buttonText}</S.ConfirmButton></S.Footer>
      </S.ModalContainer>
    </S.Overlay>
  );
}