import { useEffect, useState } from "react";

function getModernRelativeTime(date) {
  const now = new Date();
  const diffInSeconds = (now - new Date(date)) / 1000;

  const intervals = [
    { unit: "y", seconds: 31536000 },
    { unit: "mo", seconds: 2592000 },
    { unit: "w", seconds: 604800 },
    { unit: "d", seconds: 86400 },
    { unit: "h", seconds: 3600 },
    { unit: "m", seconds: 60 },
  ];

  for (const { unit, seconds } of intervals) {
    const delta = Math.floor(diffInSeconds / seconds);
    if (delta >= 1) {
      return `${delta}${unit}`;
    }
  }

  return "now"; // Shorter than "just now"
}

export function useRelativeTime(date) {
  const [relativeTime, setRelativeTime] = useState(() =>
    getModernRelativeTime(date)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(getModernRelativeTime(date));
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [date]);

  return relativeTime;
}
//? import moment from "moment";
// const timeAgo = moment(createdAt).fromNow();
//? function getRelativeTime(date) {
//   const now = new Date();
//   const diff = (now - new Date(date)) / 1000; // in seconds

//   const intervals = {
//     year: 31536000,
//     month: 2592000,
//     week: 604800,
//     day: 86400,
//     hour: 3600,
//     minute: 60,
//   };

//   const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

//   for (const [unit, secondsInUnit] of Object.entries(intervals)) {
//     const delta = Math.floor(diff / secondsInUnit);
//     if (Math.abs(delta) >= 1) {
//       return rtf.format(-delta, unit);
//     }
//   }

//   return "just now";
// }
// const timeAgo = getRelativeTime(createdAt);
