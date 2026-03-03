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
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen, title, message, onConfirm, onCancel,
  confirmText = 'Confirmar', cancelText = 'Cancelar', loading = false
}: ConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen && !loading) onCancel(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel, loading]);

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={loading ? undefined : onCancel}>
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
          <S.CancelButton onClick={onCancel} disabled={loading}>{cancelText}</S.CancelButton>
          <S.ConfirmButton onClick={onConfirm} disabled={loading}>
            {loading ? 'Aguarde...' : confirmText}
          </S.ConfirmButton>
        </S.Footer>
      </S.ModalContainer>
    </S.Overlay>
  );
}