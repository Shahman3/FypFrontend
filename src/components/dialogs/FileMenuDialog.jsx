/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { X } from "react-feather";
import { toggleDocumentModal } from "../../redux/reducers/misc";
import { PaperPlaneTilt } from "phosphor-react";
import FileDropZone from "../FileDropZone";

const FileMenuDialog = ({ isModalOpen, setIsModalOpen, sendFilesHandler }) => {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const [caption, setCaption] = useState("");

  const closeDialog = () => {
    setIsModalOpen(false);
    dispatch(toggleDocumentModal());
  };

  const handleSendFiles = () => {
    sendFilesHandler(caption);
    closeDialog();
  };

  return (
    <div
      className={`fixed left-0 top-0 z-[9999] h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
        isModalOpen ? "flex" : "hidden"
      }`}
    >
      <div
        ref={modalRef}
        className="md:px-17.5 w-full max-w-[560px] rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12"
      >
        <div className="flex flex-row items-center justify-between mb-8 space-x-2">
          <div className="text-md font-medium text-black dark:text-white">
            Choose Documents to Send
          </div>
          <button onClick={closeDialog} className="text-black dark:text-white">
            <X size={24} />
          </button>
        </div>

        {/* File Selection - Drag & Drop Zone */}
        <FileDropZone
          maxFileSize={100 * 1024 * 1024}
          acceptedFiles=".pdf,.ppt,.doc,.docx,.xls,.xlsx,.txt,.csv,.fig"
        />

        {/* Optional Caption Input */}
        <div className="flex flex-row items-center space-x-2 justify-between mt-4">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="border rounded-lg hover:border-primary outline-none w-full p-2 border-stroke dark:border-strokedark bg-transparent dark:bg-form-input"
          />
          <button
            onClick={handleSendFiles}
            className="p-2.5 border border-primary flex items-center justify-center rounded-lg bg-primary hover:bg-opacity-90 text-white"
          >
            <PaperPlaneTilt size={20} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileMenuDialog;
