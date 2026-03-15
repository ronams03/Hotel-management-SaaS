import { useEffect, useState } from "react";
import { useUiSettings } from "../context/UiSettingsContext";

export function usePagination(totalItems: number, resetDeps: unknown[] = []) {
  const { pageSize } = useUiSettings();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, ...resetDeps]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return {
    page: currentPage,
    setPage,
    totalPages,
    pageSize,
    totalItems,
    start,
  };
}

