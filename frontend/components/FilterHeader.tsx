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
      optionActiveBg: "#e8f7ee",
    },
  },
};

export interface StatusOption {
  value: string;
  label: string;
}

interface FilterHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  statusOptions: StatusOption[];
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
      <div className="mb-5 flex flex-col gap-3 rounded-md border border-[#c1c9c0] bg-white p-3 shadow-[0_5px_20px_rgba(23,32,42,0.03)] sm:mb-6 sm:gap-4 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-72">
          <Input
            placeholder={searchPlaceholder}
            prefix={<FiSearch className="mr-1.5 h-4 w-4 text-[#414942]" />}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full"
            allowClear
          />
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <Select
            value={selectedStatus}
            onChange={onStatusChange}
            className="h-10 w-full sm:min-w-40 sm:flex-1 lg:w-40 lg:flex-none"
            options={statusOptions}
            getPopupContainer={() => document.body}
            classNames={{
              popup: {
                root: "[&_.ant-select-item-option-active]:bg-[#e8f7ee]! [&_.ant-select-item-option-selected]:bg-[#bceecb]! [&_.ant-select-item-option-selected]:text-[#144229]! [&_.ant-select-item-option-selected]:font-semibold!",
              },
            }}
          />

          <RangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            inputReadOnly
            placement="bottomLeft"
            getPopupContainer={() => document.body}
            className="h-10! w-full! min-w-0! sm:min-w-64 sm:flex-1 lg:w-64! lg:flex-none"
            classNames={{
              popup: {
                root: [
                  "z-1100!",
                  "max-w-[calc(100vw-1rem)]!",
                  "[&_.ant-picker-panel-container]:max-w-[calc(100vw-1rem)]!",
                  "[&_.ant-picker-panels]:flex-col!",
                  "sm:[&_.ant-picker-panels]:flex-row!",
                ].join(" "),
              },
            }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
