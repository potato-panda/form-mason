import { ReactNode } from 'react';

export function Paginator({
  page,
  pageSize,
  totalPages,
  totalItems,
  changePage,
  table,
}: {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  changePage: (page: number) => void;
  table: ReactNode;
}) {
  return (
    <div className="paginator flex column">
      <div>
        <div className="flex gap-2 align-items-center justify-content-between">
          <button
            type="button"
            className="button"
            onClick={() => changePage(0)}
            disabled={page === 0}
          >
            First
          </button>
          <button
            type="button"
            className="button"
            onClick={() => changePage(page - 1)}
            disabled={page === 0}
          >
            Prev
          </button>
          <button
            type="button"
            className="button"
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages - 1}
          >
            Next
          </button>
          <button
            type="button"
            className="button"
            onClick={() => changePage(totalPages - 1)}
            disabled={page === totalPages - 1}
          >
            Last
          </button>
        </div>
        <div>
          Showing {page * pageSize + 1} - {page * pageSize + pageSize}
        </div>
      </div>
      <div>{table}</div>
    </div>
  );
}
