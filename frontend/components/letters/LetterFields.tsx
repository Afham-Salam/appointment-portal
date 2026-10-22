"use client";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export type LetterFieldsValue = { date: string };
export default function LetterFields({
  value,
  onChange,
}: {
  value: LetterFieldsValue;
  onChange: (value: LetterFieldsValue) => void;
}) {
  return (
    <div className="letter-fields w-full sm:max-w-xs">
      <label>
        <span>Date</span>
        <DatePicker
          allowClear={false}
          className="w-full"
          value={dayjs(value.date)}
          format="DD MMM YYYY"
          onChange={(date) =>
            date && onChange({ ...value, date: date.format("YYYY-MM-DD") })
          }
        />
      </label>
    </div>
  );
}
