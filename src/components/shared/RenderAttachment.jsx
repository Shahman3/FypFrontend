/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { transformImage } from "../../lib/features";
import { DownloadSimple, File, Play, Pause } from "phosphor-react";

const handleDownload = (event, url, orignalname) => {
  event.preventDefault();
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = orignalname || url.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => console.error("Download failed:", error));
};

const RenderAttachment = (
  file,
  url,
  orignalname,
  setIsImagePreviewOpen,
  onLoad
) => {
  const downloadBtnClass =
    "absolute top-3 right-4 bg-[#0f98a0] p-2 rounded-lg text-white hover:bg-[#0b7f85] transition-all duration-300 shadow-md";

  const commonContainer =
    "max-w-90 col-span-2 row-span-2 relative rounded-2xl bg-[#e1f3f4] shadow-lg border border-[#e0fafa]";

  switch (file) {
    case "video":
      return (
        <div className={commonContainer}>
          <video
            src={url}
            preload="none"
            className="max-w-80 min-w-60 rounded-lg border border-gray-300 shadow-md"
            controls
            controlsList="nodownload nopictureinpicture"
            disablePictureInPicture
            // onLoadedData={onLoad}
          />
          <button className={downloadBtnClass}>
            <DownloadSimple
              size={20}
              onClick={(e) => handleDownload(e, url, orignalname)}
            />
          </button>
        </div>
      );

    case "image":
      return (
        <div className={commonContainer}>
          <img
            src={transformImage(url, 200)}
            alt="Attachment"
            className="h-full w-full rounded-lg object-cover object-center transition-all duration-300 hover:opacity-90"
            onClick={() => setIsImagePreviewOpen(true)}
            onLoad={onLoad}
          />
          <button className={downloadBtnClass}>
            <DownloadSimple
              size={20}
              onClick={(e) => handleDownload(e, url, orignalname)}
            />
          </button>
        </div>
      );

    case "audio":
      return (
        <div className="max-w-90 w-full flex items-center bg-[#e1f3f4] rounded-2xl shadow-md p-3 border border-[#e0fafa]">
          <CustomAudioPlayer
            url={url}
            orignalname={orignalname}
            onLoad={onLoad}
          />
          <button className="pl-1 pr-4 text-[#0f98a0] hover:text-[#0b7f85] transition-all duration-300">
            <DownloadSimple
              size={20}
              onClick={(e) => handleDownload(e, url, orignalname)}
            />
          </button>
        </div>
      );

    default:
      return (
        <div className="max-w-90 w-fit">
          <div className="rounded-2xl bg-white shadow-md border border-[#e0fafa] p-3">
            <div className="flex flex-row items-center justify-between p-2 rounded-md bg-[#f0fdfd]">
              <div className="flex flex-row items-center space-x-3">
                <div className="p-2 rounded-md bg-[#14b8a6] text-white cursor-pointer">
                  <File size={20} />
                </div>
                <div className="flex flex-col text-[#0f172a]">
                  <div>{orignalname}</div>
                </div>
              </div>
              <button className="pl-5 text-[#0f98a0] hover:text-[#0b7f85] transition-all duration-300">
                <DownloadSimple
                  size={20}
                  onClick={(e) => handleDownload(e, url, orignalname)}
                />
              </button>
            </div>
          </div>
        </div>
      );
  }
};
//

//
const CustomAudioPlayer = ({ url, orignalname, onLoad }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setProgress(
          audioRef.current.duration && !isNaN(audioRef.current.duration)
            ? (audioRef.current.currentTime / audioRef.current.duration) * 100
            : 0
        );
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
      audioRef.current.addEventListener("ended", handleAudioEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current.removeEventListener("ended", handleAudioEnd);
      }
    };
  }, []);

  const updateDuration = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      updateDuration();
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changePlaybackRate = () => {
    const newRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(newRate);
    audioRef.current.playbackRate = newRate;
  };

  const formatTime = (time) => {
    if (!time || isNaN(time) || time === Infinity) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleAudioEnd = () => {
    updateDuration();
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <>
      <button
        onClick={togglePlay}
        className="mr-3 bg-[#0f98a0] p-2 rounded-full text-white hover:bg-[#0b7f85] transition-all duration-300 shadow-md"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <div className="w-full">
        <div className="flex justify-end text-[#64748b] text-sm mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="w-full h-1 bg-gray-300 rounded-lg overflow-hidden">
          <div
            className="h-1 bg-[#14b8a6] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <button
        onClick={changePlaybackRate}
        className="ml-3 bg-[#0f98a0] p-2 rounded-lg text-white hover:bg-[#0b7f85]"
      >
        {playbackRate}x
      </button>
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        className="hidden"
        onEnded={handleAudioEnd}
        onLoadedData={onLoad}
      />
    </>
  );
};

export default RenderAttachment;
