/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react";
import { aiapikey, server } from "../../constants/config";
import { Modal, Box, IconButton, Typography, Tooltip } from "@mui/material";
import { Send, Close, ContentCopy } from "@mui/icons-material";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import useCurrentWidth from "../../utils/CurrentWidth";
import axios from "axios";
import AiDeleteMenu from "./AIMenu";
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
  apiKey: aiapikey,
});
export default function AiModel({
  allMessages = [],
  groupName,
  groupMembers,
  userId,
  chatId,
  onClose,
}) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingI, setLoadingI] = useState(false);
  const chatEndRef = useRef(null);
  const justAskedRef = useRef(false);
  const WindowWidth = useCurrentWidth();
  const hasScrolledInitially = useRef(false);

  useEffect(() => {
    if (chatHistory.length > 0 && !hasScrolledInitially.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "auto" });
      hasScrolledInitially.current = true;
    }
  }, [chatHistory]);

  // console.log("User ID:", userId);
  // console.log("chatid", chatId);
  const saveAI = async (question, answer) => {
    try {
      await axios.post(
        `${server}/api/v1/chat/ai`,
        {
          userId,
          chatId,
          question,
          answer,
        },
        { withCredentials: true } // <-- add this too
      );
    } catch (err) {
      console.error("Failed to save AI response", err);
    }
  };
  useEffect(() => {
    if (open)
      setTimeout(() => document.getElementById("ai-input")?.focus(), 200);
  }, [open]);

  useEffect(() => {
    if (justAskedRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      justAskedRef.current = false;
    }
  }, [chatHistory]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  const handleAskAI = useCallback(async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || loading) return;

    setLoading(true);
    // console.log("group members name", groupMembersName);
    const groupMembersName = groupMembers.map((member) => member.name);
    const context = (() => {
      const msgs = allMessages
        .map((msg) => {
          const sender = msg?.sender?.name || "Unknown";
          const content = msg.content || "";
          const files = msg?.attachments?.map((a) => a.originalname).join(", ");
          const time = new Date(msg.createdAt).toLocaleString();
          return `${time} - ${sender}: ${content}${
            files ? ` [files: ${files}]` : ""
          }`;
        })
        .slice(-50)
        .join("\n");

      return msgs.trim() === "" ? "No messages found" : msgs;
    })();
    const prompt = `
You are an intelligent assistant that specializes in analyzing group chat history.

Group Name: ${groupName}

Group Members:
${groupMembersName}

Chat History:
${context}

User Question:
"${trimmedQuery}"
Please provide a concise and clear answer in **2-3 sentences maximum**. Keep the response focused and avoid unnecessary details.
`;
    try {
      const res = await model.invoke(prompt);
      const aiResponse = res.content || "No response";

      justAskedRef.current = true;
      setChatHistory((prev) => [
        ...prev,
        { query: trimmedQuery, response: "" },
      ]);

      let charIndex = 0;
      const typingInterval = 50;

      const typingTimer = setInterval(() => {
        if (charIndex < aiResponse.length) {
          setChatHistory((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].response = aiResponse.slice(
              0,
              charIndex + 1
            );
            return updated;
          });
          charIndex++;
        } else {
          clearInterval(typingTimer);
          // Save AI Q&A after typing completes
          saveAI(trimmedQuery, aiResponse);
        }
      }, typingInterval);
    } catch (err) {
      console.error("AI generation failed", err);
      setChatHistory((prev) => [
        ...prev,
        {
          query: trimmedQuery,
          response: "⚠️ Failed to get AI response. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  }, [query, allMessages, loading, chatId, userId]);
  // //initialloading
  // useEffect(() => {
  //   if (!chatId || !userId) return;

  //   const fetchSavedAI = async () => {
  //     try {
  //       const { data } = await axios.get(`${server}/api/v1/chat/ai/my`, {
  //         params: { chatId }, // optionally filter by chatId
  //         withCredentials: true, // <-- IMPORTANT
  //       });

  //       const savedData = Array.isArray(data.data) ? data.data : [];
  //       setChatHistory(
  //         savedData.map(({ question, answer }) => ({
  //           query: question || "",
  //           response: answer || "",
  //         }))
  //       );
  //     } catch (err) {
  //       console.error("Failed to fetch saved AI responses", err);
  //     }
  //   };

  //   fetchSavedAI();
  // }, [chatId, userId]);
  useEffect(() => {
    if (!chatId || !userId) return;

    const fetchSavedAI = async () => {
      setLoadingI(true);
      try {
        const { data } = await axios.get(`${server}/api/v1/chat/ai/my`, {
          params: { chatId },
          withCredentials: true,
        });

        const savedData = Array.isArray(data.data) ? data.data : [];
        setChatHistory(
          savedData.map(({ question, answer }) => ({
            query: question || "",
            response: answer || "",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch saved AI responses", err);
      }
      setLoadingI(false);
    };

    fetchSavedAI();
    // Scroll on mount (initial load)
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [chatId, userId]);
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className={`fixed inset-0 flex items-center justify-center  bg-mainLight ${
          loading ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <div
          className={`w-full  py-1 px-2    bg-mainLight flex flex-col h-[100vh]  ${
            loading ? "overflow-hidden" : "overflow-y-auto"
          }`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(20, 184, 166, 0.3) #e1f3f4",
            // scrollbarColor: "#0f98a0 #e1f3f4",
          }}
        >
          {/* Header */}
          <div className="flex px-2 pt-2 justify-between items-center border-b border-main  pb-3">
            <Typography
              variant={`${WindowWidth < 350 ? "h9" : "h6"}`}
              sx={{ color: "#0f172a", fontWeight: 600 }}
            >
              AI Chat Analysis
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontSize: `${WindowWidth < 350 ? "10px" : "14px"}`,
                }}
              >
                Smart insights based on your chat
              </Typography>
            </Typography>
            <Typography>
              <AiDeleteMenu
                chatId={chatId}
                userId={userId}
                setChatHistory={setChatHistory}
              />
              <IconButton onClick={handleClose} sx={{ color: "#64748b" }}>
                <Close />
              </IconButton>
            </Typography>
          </div>

          {/* Chat Content */}
          {loadingI ? (
            <div className="flex flex-1 items-center justify-center py-8 w-full">
              <div className="w-10 h-10 border-4 border-[#0f98a0]/50 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div
              className="flex-1 p-2 space-y-4 overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(20, 184, 166, 0.3) #e1f3f4",
              }}
            >
              {chatHistory.map((chat, index) => (
                <div key={index} className="flex flex-col">
                  {/* User Message */}
                  <div className="self-end bg-[#14b8a6] text-white p-2 rounded-lg max-w-full">
                    {chat.query}
                  </div>

                  {/* AI Response */}
                  <div className="self-start bg-white text-[#0f172a] p-4 rounded-lg border border-[#e0fafa] max-w-full mt-2 relative">
                    {chat.response}
                    <Tooltip
                      title={copiedIndex === index ? "Copied!" : "Copy"}
                      placement="top"
                      PopperProps={{
                        modifiers: [
                          {
                            name: "arrow",
                            options: { element: ".MuiTooltip-arrow" },
                          },
                        ],
                      }}
                      sx={{
                        "& .MuiTooltip-tooltip": {
                          bgcolor: "#0f98a0",
                          color: "white",
                          fontSize: "0.875rem",
                          borderRadius: "8px",
                          padding: "6px 10px",
                        },
                        "& .MuiTooltip-arrow": {
                          color: "#0f98a0",
                        },
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: -13,
                          right: 8,
                          bgcolor: "#0f98a0",
                          color: "white",
                          "&:hover": { bgcolor: "#0b7f85" },
                        }}
                        onClick={() => copyToClipboard(chat.response, index)}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="self-start text-sm text-[#64748b] px-2">
                  AI is typing...
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input Box */}
          <div className="flex items-end border-t border-[#0f98a0] pt-3 p-3 w-full">
            {/* ChatGPT-style Textarea */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#ffffff",
                border: "1px solid #0f98a0",
                borderRadius: "8px",
                padding: "0.5rem 0.75rem",
                fontSize: "0.95rem",
                color: "#0f172a",
                maxHeight: "120px",
                overflowY: "auto",
                display: "flex",
                alignItems: "center",
                "&:focus-within": {
                  borderColor: "#0b7f85",
                  boxShadow: "0 0 0 2px rgba(15, 152, 160, 0.2)",
                },
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#0f98a0",
                  borderRadius: "10px",
                },
              }}
            >
              <textarea
                placeholder="Ask AI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAskAI();
                  }
                }}
                rows={1}
                style={{
                  width: "100%",
                  resize: "none",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  color: "#0f172a",
                  lineHeight: "1.5",
                  overflowY: "auto",
                }}
              />
            </Box>

            {/* Send Button */}
            <IconButton
              onClick={handleAskAI}
              disabled={loading}
              sx={{
                ml: 1,
                backgroundColor: "#14b8a6",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0d9488",
                },
              }}
            >
              <Send />
            </IconButton>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
