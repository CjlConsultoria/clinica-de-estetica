import styled from 'styled-components';

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid #f0ebe4;
`;

export const PaginationInfo = styled.span`
  font-size: 0.8rem;
  color: #999;
  font-weight: 400;
  white-space: nowrap;
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $active }) => ($active ? '#6B4F3A' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#888')};

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#6B4F3A' : 'rgba(107, 79, 58, 0.1)')};
    color: ${({ $active }) => ($active ? '#ffffff' : '#6B4F3A')};
  }
`;

export const PageEllipsis = styled.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: #bbb;
  user-select: none;
`;

export const PaginationArrow = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6B4F3A;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(107, 79, 58, 0.1);
  }

  &:disabled {
    color: #ddd;
    cursor: not-allowed;
  }
`;