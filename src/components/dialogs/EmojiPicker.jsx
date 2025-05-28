import { useRef, useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Smiley } from "phosphor-react";
import useCurrentWidth from "../../utils/CurrentWidth";

function EmojiSelector({ message, setMessage }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const buttonRef = useRef(null);
  const pickerRef = useRef(null);
  const currentWidth = useCurrentWidth();

  // Dynamically set picker width
  let setwidth = "0px";
  if (currentWidth >= 770) setwidth = "350px";
  else if (currentWidth >= 640) setwidth = "240px";
  else if (currentWidth >= 400) setwidth = "300px";
  else if (currentWidth >= 330) setwidth = "250px";
  else if (currentWidth >= 250) setwidth = "200px";
  else if (currentWidth >= 220) setwidth = "170px";
  else if (currentWidth >= 200) setwidth = "150px";
  else if (currentWidth >= 175) setwidth = "130px";
  else if (currentWidth >= 1) setwidth = "100px";

  // Close picker only when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Append emoji without closing picker
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    // Do NOT close picker here
  };

  return (
    <div className="relative flex">
      {/* <button
        // onClick={(e) => e.preventDefault()}
        type="button"
        ref={buttonRef}
        className="text-main hover:text-mainHover"
        onClick={(e) => {
          e.preventDefault();
          setPickerOpen((prev) => !prev);
        }}
      >
        <Smiley size={18} />
      </button> */}
      <div
        ref={buttonRef}
        className="text-main hover:text-mainHover cursor-pointer"
        // role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          setPickerOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPickerOpen((prev) => !prev);
          }
        }}
      >
        <Smiley size={18} />
      </div>

      {pickerOpen && (
        <div ref={pickerRef} className="absolute z-50 -top-78 mt-2">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="auto"
            width={setwidth}
            height={300}
            previewConfig={{ showPreview: false }}
            searchDisabled={false}
          />
        </div>
      )}
    </div>
  );
}

export default EmojiSelector;
