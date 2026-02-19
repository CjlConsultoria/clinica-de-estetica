'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as S from './styles';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
}

export default function ErrorModal({
  isOpen, title = 'Erro', message, onClose, buttonText = 'Entendi'
}: ErrorModalProps) {
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

  const content = (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.Header><S.Title>{title}</S.Title></S.Header>
        <S.Content><S.Subtitle>{message}</S.Subtitle></S.Content>
        <S.Footer><S.BackButton onClick={onClose}>{buttonText}</S.BackButton></S.Footer>
      </S.ModalContainer>
    </S.Overlay>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}
