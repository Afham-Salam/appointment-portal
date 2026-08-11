"use client";

import { ConfigProvider, Input, Select, DatePicker } from "antd";
import { FiSearch } from "react-icons/fi";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const themeConfig = {
  token: {
    colorPrimary: "#144229",
    colorLink: "#144229",
    borderRadius: 6,
    fontFamily: "var(--font-manrope), system-ui, sans-serif",
  },
  components: {
    Input: {
      colorBgContainer: "#fcfdfc",
      colorBorder: "#c1c9c0",
      hoverBorderColor: "#2d5a3f",
      activeBorderColor: "#144229",
    },
    Select: {
      colorBgContainer: "#ffffff",
      colorBorder: "#c1c9c0",
      hoverBorderColor: "#2d5a3f",
      activeBorderColor: "#144229",
      optionSelectedBg: "#bceecb",
      optionSelectedColor: "#144229",
    },
  },
};

export interface StatusOption {
  value: string;
  label: string;
}

interface FilterHeaderProps {
  /** Current search query value */
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  /** Current status filter value */
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  statusOptions: StatusOption[];

  /** Current date range value */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  onDateRangeChange: (range: [Dayjs | null, Dayjs | null] | null) => void;
}

export function FilterHeader({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  selectedStatus,
  onStatusChange,
  statusOptions,
  dateRange,
  onDateRangeChange,
}: FilterHeaderProps) {
  return (
    <ConfigProvider theme={themeConfig}>
      <div className="mb-6 flex flex-col gap-4 rounded-md border border-[#c1c9c0] bg-white p-4 shadow-[0_5px_20px_rgba(23,32,42,0.03)] sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search */}
        <div className="w-full sm:max-w-72">
          <Input
            placeholder={searchPlaceholder}
            prefix={<FiSearch className="mr-1.5 h-4 w-4 text-[#414942]" />}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10"
            allowClear
          />
        </div>

        {/* Right: Status + Date Range */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={selectedStatus}
            onChange={onStatusChange}
            className="h-10 min-w-32"
            options={statusOptions}
          />

          <RangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            className="h-10 w-full sm:w-64"
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
