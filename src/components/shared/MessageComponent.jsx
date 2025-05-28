/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import ImagePreview from "./ImagePerview";
import { useRelativeTime } from "./UseRelativeTime";
import LinkifiedMessage from "./LinkifiedMessage";

const MessageComponent = ({ message, user, onMediaLoad, isGroupChat }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = useRelativeTime(createdAt);
  const [processedAttachments, setProcessedAttachments] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const mediaLoadCounter = useRef(0); // to track loaded attachments

  useEffect(() => {
    if (attachments.length > 0) {
      Promise.all(
        attachments.map(async (attachment) => {
          const file = await fileFormat(attachment.url);
          return { file, ...attachment };
        })
      ).then(setProcessedAttachments);
    }
  }, [attachments]);

  // Trigger scroll when all media attachments have loaded
  const handleMediaLoad = () => {
    mediaLoadCounter.current += 1;
    if (mediaLoadCounter.current === processedAttachments.length) {
      onMediaLoad?.(); // Only when all attachments have loaded
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: sameSender ? "100%" : "-100%" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`
     flex flex-col p-3 rounded-xl shadow-md min-w-[80px]
     ${
       sameSender
         ? "bg-main text-white self-end"
         : "bg-white text-textP self-start border border-border"
     }
   `}
      >
        {!sameSender && isGroupChat && (
          <Typography className="text-main font-semibold text-sm">
            {sender.name}
          </Typography>
        )}
        {content && (
          <LinkifiedMessage content={content} sameSender={sameSender} />
        )}

        {processedAttachments.map((attachment, index) => (
          <Box
            key={index}
            className="mt-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          >
            {RenderAttachment(
              attachment.file,
              attachment.url,
              attachment.originalname,
              setIsImagePreviewOpen,
              handleMediaLoad // pass load callback into RenderAttachment
            )}
            {isImagePreviewOpen && (
              <ImagePreview
                imageUrl={attachment.url}
                isOpen={isImagePreviewOpen}
                onClose={() => setIsImagePreviewOpen(false)}
              />
            )}
          </Box>
        ))}

        <Typography className="text-xs text-right opacity-70 mt-1">
          {timeAgo}
        </Typography>
      </motion.div>
    </>
  );
};

export default memo(MessageComponent);
