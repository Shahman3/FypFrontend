// import moment from "moment";
const fileFormat = async (url = "") => {
  const fileExt = url.split(".").pop().toLowerCase();

  if (fileExt === "mp4") return "video";
  if (["mp3", "wav"].includes(fileExt)) return "audio";
  if (["png", "jpg", "jpeg", "gif"].includes(fileExt)) return "image";

  // Handle webm and ogg dynamically
  if (["webm", "ogg"].includes(fileExt)) {
    return await checkWebmOrOggType(url);
  }

  return "file"; // Default case
};

// Helper function to determine if .webm/.ogg is audio or video
const checkWebmOrOggType = (url) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = url;
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      resolve(video.videoWidth > 0 ? "video" : "audio");
    };

    video.onerror = () => resolve("audio"); // If it can't load as a video, assume audio
  });
};

const transformImage = (url = "", width = 200) => {
  if (!url || typeof url !== "string") return "";

  if (url.includes("upload/")) {
    return url.replace("upload/", `upload/dpr_auto,w_${width}/`);
  }

  return url;
};

const getLast7Days = () => {
  const today = new Date();
  const last7Days = [];

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayName = dayNames[date.getDay()];
    last7Days.push(dayName);
  }

  return last7Days;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage };
