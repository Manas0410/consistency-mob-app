import { daysOfWeek, monthsOfYear } from "@/constants/date-constants";
import { useMemo } from "react";

export function useGetLastThirtyDays() {
  return useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push({
        day: daysOfWeek[d.getDay()],
        dayNo: String(d.getDate()).padStart(2, "0"),
        Month: monthsOfYear[d.getMonth()],
        year: d.getFullYear(),
      });
    }
    return arr;
  }, []);
}
