import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  total: number;
  perPage: number;
  loading: boolean;
  onChange: (page: number) => void;
}

export default function Pagination({ currentPage, total, perPage, loading, onChange }: PaginationProps) {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / perPage)), [total, perPage]);

  const start = useMemo(() => total === 0 ? 0 : (currentPage - 1) * perPage + 1, [total, currentPage, perPage]);
  const end = useMemo(() => Math.min(currentPage * perPage, total), [currentPage, perPage, total]);

  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 1) return pages;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
      const rangeStart = Math.max(2, currentPage - 2);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 2);
      for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="scanner-card-frame rounded-lg bg-[#0d1321] border border-[#1e293b] px-4 py-3">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            className="btn btn-sm bg-[#111827] border border-[#1e293b] text-[#94a3b8] hover:border-[#00f0ff]/30 hover:text-[#00f0ff] gap-1 font-mono text-xs"
            disabled={currentPage <= 1 || loading}
            onClick={() => onChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>ANTERIOR</span>
          </button>

          <div className="flex items-center gap-1">
            {visiblePages.map((p, i) =>
              p === '...' ? (
                <button
                  key={`ellipsis-${i}`}
                  className="btn btn-sm btn-ghost btn-disabled px-1 min-w-6 font-mono text-xs text-[#94a3b8]/40"
                  disabled
                >
                  …
                </button>
              ) : (
                <button
                  key={p}
                  className={`btn btn-sm min-w-8 font-mono text-xs ${
                    p === currentPage
                      ? 'bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff]'
                      : 'bg-[#111827] border border-[#1e293b] text-[#94a3b8] hover:border-[#00f0ff]/30 hover:text-[#00f0ff]'
                  }`}
                  onClick={() => onChange(p as number)}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            className="btn btn-sm bg-[#111827] border border-[#1e293b] text-[#94a3b8] hover:border-[#00f0ff]/30 hover:text-[#00f0ff] gap-1 font-mono text-xs"
            disabled={currentPage >= totalPages || loading}
            onClick={() => onChange(currentPage + 1)}
            aria-label="Next page"
          >
            <span>SIGUIENTE</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-[#00f0ff]/40"></div>
        <span className="text-xs font-mono text-[#94a3b8]/50">
          REGISTROS {start} - {end} DE {total}
        </span>
        <div className="w-1 h-1 rounded-full bg-[#00f0ff]/40"></div>
      </div>
    </div>
  );
}
