export function Paginator({
  page = 0,
  pageSize = 10,
  totalPages = 0,
  totalItems = 0,
  changePage,
  children,
}: {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  changePage: (page: number) => void;
  children: any;
}) {
  function generatePaginatorPageButtons({
    limit,
    page,
    totalPages,
  }: {
    limit: number;
    page: number;
    totalPages: number;
  }) {
    let start = Math.ceil(Math.max(1, page - limit / 2));
    let end = Math.min(totalPages, start + limit - 1);
    if (end - start + 1 < end) {
      start = Math.max(1, end - limit + 1);
    }
    const buttons = [];
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={`page-${i}-btn`}
          type="button"
          role="button"
          onClick={() => changePage(i)}
        >
          {i}
        </button>
      );
    }
    if (buttons.length === 0) {
      buttons.push(
        <button
          key={`page-1-btn`}
          type="button"
          role="button"
          className=""
          disabled={true}
        >
          1
        </button>
      );
    }
    return buttons;
  }

  return (
    <div className="paginator flex column">
      <div>
        <div className="flex gap-2 align-items-center justify-content-between">
          <button
            type="button"
            role="button"
            className=""
            onClick={() => changePage(1)}
            disabled={page <= 1}
          >
            First
          </button>
          <button
            type="button"
            role="button"
            className=""
            onClick={() => changePage(page - 1)}
            disabled={page <= 1}
          >
            Prev
          </button>
          {generatePaginatorPageButtons({ limit: 5, page, totalPages })}
          <button
            type="button"
            role="button"
            className=""
            onClick={() => changePage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </button>
          <button
            type="button"
            role="button"
            className=""
            onClick={() => changePage(totalPages)}
            disabled={page >= totalPages}
          >
            Last
          </button>
        </div>
      </div>
      <div>
        Showing {Math.min((page - 1) * pageSize + 1, totalItems)} -{' '}
        {Math.min(page * pageSize, totalItems)} of {totalItems} items
      </div>
      <div>{children}</div>
    </div>
  );
}
