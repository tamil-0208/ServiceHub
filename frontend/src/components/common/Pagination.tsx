import React from 'react';

interface PaginationProps {
  page: number;           // 0-indexed (Spring Page)
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderTop: '1px solid var(--border)',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <span>
        Showing {start}–{end} of {totalElements}
      </span>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        <button
          className="btn btn-outline btn-sm"
          disabled={page === 0}
          onClick={() => onPageChange(0)}
        >
          «
        </button>
        <button
          className="btn btn-outline btn-sm"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </button>
        {/* Page number pills — show at most 5 around current */}
        {Array.from({ length: totalPages }, (_, i) => i)
          .filter(i => Math.abs(i - page) <= 2)
          .map(i => (
            <button
              key={i}
              className={`btn btn-sm ${i === page ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onPageChange(i)}
            >
              {i + 1}
            </button>
          ))}
        <button
          className="btn btn-outline btn-sm"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </button>
        <button
          className="btn btn-outline btn-sm"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};
