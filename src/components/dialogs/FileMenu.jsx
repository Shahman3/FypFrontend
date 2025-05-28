import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import {
  PhotoLibrary,
  Description,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import useCurrentWidth from "../../utils/CurrentWidth";

const FileMenu = ({ anchorE1, chatId, setFileMenuAnchor }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const mediaRef = useRef(null);
  const fileRef = useRef(null);
  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
    setFileMenuAnchor(null);
  };
  const selectFileInput = (ref) => ref.current?.click();
  // const isMobile = window.innerWidth <= 640;
  const currentWidth = useCurrentWidth();
  const isMobile = currentWidth <= 600;
  const isBetween601And640 = currentWidth >= 601 && currentWidth <= 640;
  // console.log("toastt", isMobile);
  const toastStyles = {
    borderRadius: "12px",
    background: "var(--color-mainLight)",
    color: "var(--color-textP)",
    width: "fit-content",
    maxWidth: "90vw",
    wordBreak: "break-word",
    marginLeft: isMobile ? "30px" : "",
    marginRight: isMobile ? "" : "55px",
    marginBottom: isBetween601And640 ? "-16px" : "-10px",
  };

  useEffect(() => {
    closeFileMenu();
  }, [currentWidth]);
  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (files.length > 5) {
      toast.error(`You can only send 5 ${key.toLowerCase()} at a time`, {
        icon: <Error className="text-red-500" />,
        style: toastStyles,
      });
      return;
    }

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key.toLowerCase()}...`, {
      position: "bottom-right",
      style: toastStyles,
    });

    closeFileMenu();

    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      files.forEach((file) => formData.append("files", file));

      const res = await sendAttachments(formData);

      if (res?.data && !res.error) {
        toast.success(`${key} sent successfully`, {
          id: toastId,
          icon: <CheckCircle className="text-green-500" />,
          style: toastStyles,
        });
      } else {
        toast.error(
          res?.error?.data?.message || `Failed to send ${key.toLowerCase()}`,
          {
            id: toastId,
            icon: <Error className="text-red-500" />,
            style: toastStyles,
          }
        );
      }
    } catch (err) {
      toast.error(err.message || "Unexpected error", {
        id: toastId,
        icon: <Error className="text-red-500" />,
        style: toastStyles,
      });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <>
      <Menu
        anchorEl={anchorE1}
        open={isFileMenu}
        onClose={closeFileMenu}
        MenuListProps={{ disablePadding: true }}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            style: {
              background: "#fff",
              color: "var(--color-textP)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.5)", // boxShadow: "0 15px 60px var(--color-main)",
              minWidth: "200px",
              maxWidth: "95vw",
            },
          },
        }}
      >
        <AnimatePresence>
          {isFileMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
            >
              <MenuList className="space-y-1 text-textP">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MenuItem
                    onClick={() => selectFileInput(mediaRef)}
                    className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/10 transition min-w-0"
                  >
                    <Tooltip title="Images & Videos">
                      <PhotoLibrary
                        className="text-blue-400 !text-[20px] sm:!text-[24px]"
                        style={{
                          background:
                            "linear-gradient(45deg, #3B82F6, #60A5FA)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      />
                    </Tooltip>
                    <ListItemText
                      primary="Images & Videos"
                      primaryTypographyProps={{
                        fontWeight: 600,
                        sx: {
                          color: "var(--color-textP)",
                          fontSize: {
                            xs: "0.85rem",
                            sm: "0.95rem",
                          },
                        },
                      }}
                    />
                  </MenuItem>
                </motion.div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  style={{ display: "none" }}
                  ref={mediaRef}
                  onChange={(e) => fileChangeHandler(e, "Media")}
                />

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MenuItem
                    onClick={() => selectFileInput(fileRef)}
                    className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/10 transition"
                  >
                    <Tooltip title="Documents & Files">
                      <Description
                        className="text-green-400 !text-[20px] sm:!text-[24px]"
                        style={{
                          background:
                            "linear-gradient(45deg, #10B981, #34D399)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      />
                    </Tooltip>
                    <ListItemText
                      primary="Documents & Files"
                      primaryTypographyProps={{
                        fontWeight: 600,
                        sx: {
                          color: "var(--color-textP)",
                          fontSize: {
                            xs: "0.85rem",
                            sm: "0.95rem",
                          },
                        },
                      }}
                    />
                  </MenuItem>
                </motion.div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                  style={{ display: "none" }}
                  ref={fileRef}
                  onChange={(e) => fileChangeHandler(e, "Files")}
                />
              </MenuList>
            </motion.div>
          )}
        </AnimatePresence>
      </Menu>
    </>
  );
};

export default FileMenu;
