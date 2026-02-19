'use client';

import { useEffect } from 'react';
import * as S from './styles';

interface CancelModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CancelModal({ isOpen, title, message, onConfirm, onCancel }: CancelModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onCancel(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onCancel}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.Header><S.Title>{title}</S.Title></S.Header>
        <S.Content><S.Message>{message}</S.Message></S.Content>
        <S.Footer>
          <S.CancelButton onClick={onCancel}>Voltar</S.CancelButton>
          <S.ConfirmButton onClick={onConfirm}>Cancelar</S.ConfirmButton>
        </S.Footer>
      </S.ModalContainer>
    </S.Overlay>
  );
}
