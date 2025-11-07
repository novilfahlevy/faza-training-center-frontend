"use client";
import React from "react";
import {
  Button,
  IconButton,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({
  limit,
  setLimit,
  activePage,
  setActivePage,
  totalPages,
  prev,
  next,
}) {
  const renderPageNumbers = () => {
    const maxVisible = 5;
    const pages = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (activePage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (activePage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        activePage - 1,
        activePage,
        activePage + 1,
        "...",
        totalPages
      );
    }

    return pages.map((page, idx) =>
      page === "..." ? (
        <span
          key={`ellipsis-${idx}`}
          className="px-1 text-gray-500 text-sm md:text-base"
        >
          ...
        </span>
      ) : (
        <IconButton
          key={page}
          variant={activePage === page ? "filled" : "text"}
          color="gray"
          size="sm"
          className="!p-2 md:!p-3"
          onClick={() => setActivePage(page)}
        >
          {page}
        </IconButton>
      )
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-3 gap-3 md:gap-4 border-t border-blue-gray-50 sticky bottom-0 bg-white z-10">
      {/* Bagian kiri - Jumlah data per halaman */}
      <div className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2">
        <div className="w-full md:w-[120px]">
          <Select
            label="Jumlah data per halaman"
            value={String(limit)}
            onChange={(value) => {
              setLimit(Number(value));
              setActivePage(1);
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <Option key={n} value={String(n)}>
                {n}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Bagian kanan - Navigasi halaman */}
      <div className="w-full md:w-auto flex items-center justify-center gap-6 md:gap-2 flex-wrap">
        <Button
          variant="outlined"
          size="sm"
          className="flex items-center gap-1 md:gap-2 px-2 md:px-3"
          onClick={prev}
          disabled={activePage === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
          <span className="hidden md:inline">Sebelumnya</span>
        </Button>

        <div className="flex items-center gap-1 md:gap-2">{renderPageNumbers()}</div>

        <Button
          variant="outlined"
          size="sm"
          className="flex items-center gap-1 md:gap-2 px-2 md:px-3"
          onClick={next}
          disabled={activePage === totalPages}
        >
          <span className="hidden md:inline">Berikutnya</span>
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
