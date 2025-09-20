import { daysOfWeek, monthsOfYear } from "@/constants/date-constants";
import { useState } from "react";

export function useGetCurrentDateTime() {
  const [dateTime, setDateTime] = useState(getDateTime());

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setDateTime(getDateTime());
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }, []);

  return dateTime;
}

function getDateTime() {
  const now = new Date();

  const day = daysOfWeek[now.getDay()];
  const date = now.getDate();
  const month = monthsOfYear[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const time = `${hours}:${minutes}:${seconds}`;
  return { day, date, month, year, time };
}
