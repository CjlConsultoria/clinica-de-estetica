'use client';

import {
  PaginationWrapper,
  PaginationInfo,
  PaginationControls,
  PageButton,
  PageEllipsis,
  PaginationArrow,
} from './styles';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  function getVisiblePages(): (number | '...')[] {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

    if (currentPage <= half + 1) {
      end = Math.min(totalPages - 1, maxVisiblePages - 1);
    }
    if (currentPage >= totalPages - half) {
      start = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }

  const visiblePages = getVisiblePages();
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <PaginationWrapper>
      <PaginationInfo>
        {totalItems === 0
          ? 'Nenhum registro'
          : `Mostrando ${startItem} de ${endItem}`
        }
      </PaginationInfo>

      <PaginationControls>
        <PaginationArrow
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </PaginationArrow>

        {visiblePages.map((page, idx) =>
          page === '...' ? (
            <PageEllipsis key={`ellipsis-${idx}`}>…</PageEllipsis>
          ) : (
            <PageButton
              key={page}
              $active={page === currentPage}
              onClick={() => onPageChange(page as number)}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PageButton>
          )
        )}

        <PaginationArrow
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Próxima página"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </PaginationArrow>
      </PaginationControls>
    </PaginationWrapper>
  );
}