import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "hotel_page_size";
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;
const DEFAULT_PAGE_SIZE = 10;

type UiSettingsContextType = {
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizeOptions: number[];
};

const UiSettingsContext = createContext<UiSettingsContextType | null>(null);

function loadPageSize(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? Number(raw) : NaN;
    if (PAGE_SIZE_OPTIONS.includes(parsed as (typeof PAGE_SIZE_OPTIONS)[number])) {
      return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_PAGE_SIZE;
}

export function UiSettingsProvider({ children }: { children: ReactNode }) {
  const [pageSize, setPageSizeState] = useState<number>(() => loadPageSize());

  const setPageSize = (size: number) => {
    if (!PAGE_SIZE_OPTIONS.includes(size as (typeof PAGE_SIZE_OPTIONS)[number])) return;
    setPageSizeState(size);
  };

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(pageSize)); } catch {}
  }, [pageSize]);

  return (
    <UiSettingsContext.Provider value={{ pageSize, setPageSize, pageSizeOptions: [...PAGE_SIZE_OPTIONS] }}>
      {children}
    </UiSettingsContext.Provider>
  );
}

export function useUiSettings() {
  const ctx = useContext(UiSettingsContext);
  if (!ctx) throw new Error("useUiSettings must be used within UiSettingsProvider");
  return ctx;
}

