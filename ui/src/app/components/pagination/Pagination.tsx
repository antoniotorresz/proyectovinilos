import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize = 12,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(
    page,
    totalPages
  );

  const start =
    totalElements && totalElements > 0
      ? page * pageSize + 1
      : 0;

  const end =
    totalElements && totalElements > 0
      ? Math.min(
          (page + 1) * pageSize,
          totalElements
        )
      : 0;

  return (
    <div
      className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{
        borderTop:
          "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {totalElements !== undefined && (
        <p
          className="text-[12px]"
          style={{
            color: "#6f7890",
          }}
        >
          Mostrando {start}-{end} de{" "}
          {totalElements} publicaciones
        </p>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 0}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="w-9 h-9 rounded flex items-center justify-center disabled:opacity-30"
          style={{
            background: "#1e2433",
            color: "#c4c8d8",
            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
          aria-label="Página anterior"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((item, index) =>
          item === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="w-9 h-9 flex items-center justify-center text-[12px]"
              style={{
                color: "#6f7890",
              }}
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() =>
                onPageChange(item)
              }
              className="w-9 h-9 rounded text-[12px] font-semibold"
              style={
                page === item
                  ? {
                      background:
                        "#f59e0b",
                      color:
                        "#0f1117",
                    }
                  : {
                      background:
                        "#1e2433",
                      color:
                        "#8892a4",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {item + 1}
            </button>
          )
        )}

        <button
          type="button"
          disabled={
            page >= totalPages - 1
          }
          onClick={() =>
            onPageChange(page + 1)
          }
          className="w-9 h-9 rounded flex items-center justify-center disabled:opacity-30"
          style={{
            background: "#1e2433",
            color: "#c4c8d8",
            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
          aria-label="Página siguiente"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function getVisiblePages(
  current: number,
  total: number
): Array<number | "..."> {
  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, index) => index
    );
  }

  if (current <= 3) {
    return [
      0,
      1,
      2,
      3,
      4,
      "...",
      total - 1,
    ];
  }

  if (current >= total - 4) {
    return [
      0,
      "...",
      total - 5,
      total - 4,
      total - 3,
      total - 2,
      total - 1,
    ];
  }

  return [
    0,
    "...",
    current - 1,
    current,
    current + 1,
    "...",
    total - 1,
  ];
}