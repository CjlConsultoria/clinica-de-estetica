'use client';

import { useEffect } from 'react';
import * as S from './styles';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen, title, message, onConfirm, onCancel,
  confirmText = 'Confirmar', cancelText = 'Cancelar'
}: ConfirmModalProps) {
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
        {title ? (
          <>
            <S.Header><S.Title>{title}</S.Title></S.Header>
            <S.Content><S.Message>{message}</S.Message></S.Content>
          </>
        ) : (
          <S.ContentWithTitle><S.MessageAsTitle>{message}</S.MessageAsTitle></S.ContentWithTitle>
        )}
        <S.Footer>
          <S.CancelButton onClick={onCancel}>{cancelText}</S.CancelButton>
          <S.ConfirmButton onClick={onConfirm}>{confirmText}</S.ConfirmButton>
        </S.Footer>
      </S.ModalContainer>
    </S.Overlay>
  );
}
