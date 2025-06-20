import React from 'react';
import { PaginationButton } from './PaginationButton';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center mt-6 gap-2">
      <PaginationButton
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Previous
      </PaginationButton>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <PaginationButton
          key={p}
          onClick={() => p !== page && onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
          active={p === page}
          disabled={p === page}
        >
          {p}
        </PaginationButton>
      ))}
      <PaginationButton
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </PaginationButton>
    </div>
  );
}
