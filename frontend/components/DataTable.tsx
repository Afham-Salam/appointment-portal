"use client";

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface Column<T> {
  title: string;
  key: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize: initialPageSize = 10,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(initialPageSize);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / sizePerPage) || 1;

  // Safeguard: Compute active page to avoid issues if the dataset is filtered
  const activePage = Math.min(currentPage, totalPages) || 1;
  const startIndex = (activePage - 1) * sizePerPage;
  const endIndex = Math.min(startIndex + sizePerPage, totalItems);
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div className="min-w-0">
      <div className="w-full overflow-x-auto overscroll-x-contain px-3 py-4 [-webkit-overflow-scrolling:touch] sm:px-6 sm:py-5">
        <p className="mb-2 text-[11px] text-[#69746d] sm:hidden">
          Swipe sideways to see all columns
        </p>
        <table className="w-full min-w-170 border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-[#fafafa]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap border-b border-[#c1c9c0] px-3 py-3 font-semibold text-[#1a1c1a] sm:px-4 sm:py-3.5"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-[#fafdfb]">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="border-b border-[#c1c9c0] px-3 py-3 text-[#1a1c1a] sm:px-4 sm:py-3.5"
                    >
                      {col.render
                        ? col.render(row, startIndex + rowIndex)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-[#414942]"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="flex flex-col gap-4 border-t border-[#c1c9c0] px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#414942]">
              <span>Show</span>
              <select
                value={sizePerPage}
                onChange={(e) => {
                  setSizePerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 cursor-pointer appearance-none rounded-md border border-[#c1c9c0] bg-white pr-7 pl-2 text-xs font-semibold text-[#414942] outline-none transition-colors hover:border-[#2d5a3f] focus:border-[#144229]"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23414942' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.2' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 0.35rem center",
                  backgroundSize: "1.25rem",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
              <span>entries</span>
            </div>

            <span className="text-xs text-[#414942]">
              Showing{" "}
              <strong className="font-semibold text-[#1a1c1a]">
                {totalItems === 0 ? 0 : startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong className="font-semibold text-[#1a1c1a]">{endIndex}</strong>{" "}
              of{" "}
              <strong className="font-semibold text-[#1a1c1a]">{totalItems}</strong>{" "}
              entries
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={() => setCurrentPage(activePage - 1)}
                disabled={activePage === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#c1c9c0] bg-white text-[#414942] transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
                aria-label="Previous Page"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                      activePage === page
                        ? "bg-[#144229] text-white"
                        : "border border-[#c1c9c0] bg-white text-[#414942] hover:bg-neutral-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => setCurrentPage(activePage + 1)}
                disabled={activePage === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#c1c9c0] bg-white text-[#414942] transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
                aria-label="Next Page"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
