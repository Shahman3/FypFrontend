// import { Grid, Skeleton, Stack } from "@mui/material";
import { Stack } from "@mui/material";
// import { Skeleton } from "@mui/material";

import { BouncingSkeleton } from "../styles/StyledComponents";
// Used in Chat.jsx [pages]
const LayoutLoaderChat = () => {
  return (
    <div className="flex flex-col h-screen bg-[var(--color-mainLight)] overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-[var(--color-main)]/10 h-18 p-4 bg-[var(--color-mainLight)] shadow-sm">
        {/* Left section (Avatar + Name) */}
        <div className="flex items-center space-x-4">
          <div className="block sm:hidden">
            {/* Placeholder for back button */}
            <div className="w-6 h-6 bg-[var(--color-muted)] rounded-full animate-pulse" />
          </div>

          {/* Avatar */}
          <div className="w-12 h-12 bg-[var(--color-muted)] rounded-full animate-pulse" />

          {/* Chat name and typing indicator */}
          <div>
            <div className="w-24 h-6 bg-[var(--color-muted)] rounded-lg animate-pulse" />
            <div className="w-32 h-4 mt-2 bg-[var(--color-muted)] rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Right section (Buttons) */}
        <div className="flex items-center space-x-2">
          {/* AI Button Placeholder */}
          <div className="w-8 h-8 bg-[var(--color-muted)] rounded-full animate-pulse" />
          <div className="w-8 h-8 bg-[var(--color-muted)] rounded-full animate-pulse" />
        </div>
      </div>

      {/* MESSAGES */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        <div className="p-4 space-y-4 bg-[var(--color-mainLight)]">
          {/* Placeholder for message bubbles */}
          {[...Array(12)].map((_, idx) => (
            <div
              key={idx}
              className={`w-${
                idx % 2 === 0 ? "3/4" : "1/2"
              } h-12 bg-[var(--color-muted)] rounded-xl animate-pulse`}
            />
          ))}
        </div>
      </div>

      {/* INPUT */}
      <form className="border-t border-[var(--color-border)] p-4 bg-white">
        <div className="relative flex items-center space-x-4">
          {/* Attach file button */}
          <div className="w-6 h-6 bg-[var(--color-muted)] rounded-full animate-pulse absolute left-4" />

          {/* Message input field */}
          <div className="w-full h-12 bg-[var(--color-muted)] rounded-md animate-pulse" />

          {/* Send button */}
          <div className="w-12 h-12 bg-[var(--color-muted)] rounded-full animate-pulse" />
        </div>
      </form>
    </div>
  );
};
// Used in

const LayoutLoader = () => {
  return (
    <div className="flex h-screen bg-[var(--color-mainLight)] overflow-hidden">
      {/* Sidebar */}
      <div className="hidden sm:flex flex-col w-20 sm:w-64 bg-[var(--color-muted)] p-4 space-y-6">
        {/* Top section */}
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-12 h-12 bg-[var(--color-mainLight)] rounded-full" />
          <div className="w-16 h-4 bg-[var(--color-mainLight)] rounded-lg" />
          <div className="w-12 h-4 bg-[var(--color-mainLight)] rounded-lg" />
        </div>

        {/* Sidebar items */}
        <div className="flex-1 flex flex-col space-y-4 mt-8 animate-pulse">
          {[...Array(10)].map((_, idx) => (
            <div
              key={idx}
              className="w-full h-10 bg-[var(--color-mainLight)] rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="hidden md:flex flex-col w-80 bg-[var(--color-muted)] border-l border-[var(--color-main)]/10">
        {/* Header */}
        <div className="h-18 p-4 flex items-center justify-between border-b border-[var(--color-main)]/10 shadow-sm bg-[var(--color-muted)]">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-10 h-10 bg-[var(--color-mainLight)] rounded-full" />
            <div className="w-24 h-6 bg-[var(--color-mainLight)] rounded-lg" />
          </div>
        </div>

        {/* Chat Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-pulse">
          {[...Array(12)].map((_, idx) => (
            <div
              key={idx}
              className="w-full h-16 bg-[var(--color-mainLight)] rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 flex flex-col bg-[var(--color-muted)]">
        {/* Header */}
        <div className="flex items-center justify-between h-18 p-4 border-b border-[var(--color-main)]/10 shadow-sm bg-[var(--color-muted)]">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="block sm:hidden">
              <div className="w-6 h-6 bg-[var(--color-mainLight)] rounded-full" />
            </div>

            <div className="w-12 h-12 bg-[var(--color-mainLight)] rounded-full" />

            <div>
              <div className="w-24 h-6 bg-[var(--color-mainLight)] rounded-lg" />
              <div className="w-32 h-4 mt-2 bg-[var(--color-mainLight)] rounded-lg" />
            </div>
          </div>

          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-[var(--color-mainLight)] rounded-full" />
            <div className="w-8 h-8 bg-[var(--color-mainLight)] rounded-full" />
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 150px)" }}
        >
          <div className="p-4 space-y-4 bg-[var(--color-muted)] animate-pulse">
            {[...Array(12)].map((_, idx) => (
              <div
                key={idx}
                className={`h-12 ${
                  idx % 2 === 0 ? "w-3/4 self-start" : "w-1/2 self-end"
                } bg-[var(--color-mainLight)] rounded-xl`}
              />
            ))}
          </div>
        </div>

        {/* Input */}
        <form className="border-t border-[var(--color-border)] p-4 bg-white">
          <div className="relative flex items-center space-x-4 animate-pulse">
            <div className="w-6 h-6 bg-[var(--color-mainLight)] rounded-full absolute left-4" />
            <div className="w-full h-12 bg-[var(--color-mainLight)] rounded-md" />
            <div className="w-12 h-12 bg-[var(--color-mainLight)] rounded-full" />
          </div>
        </form>
      </div>
    </div>
  );
};
// //
const MessagesLoader = () => {
  const bubbles = [...Array(10)].map((_, i) => ({
    id: i,
    side: i % 2 === 0 ? "left" : "right", // alternate sides
    width: `${40 + Math.random() * 15}%`, // random width for realism
    // width: `53%`, // random width for realism
  }));

  return (
    <div className="space-y-3  overflow-hidden ">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`flex ${
            bubble.side === "right" ? "justify-end " : "justify-start"
          } `}
        >
          <div
            className={`${
              bubble.side === "right" ? "bg-main/70" : "bg-white/70"
            }   rounded-lg h-10`}
            style={{ width: bubble.width }}
          ></div>
        </div>
      ))}
    </div>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.5rem"}
      direction={"row"}
      padding={"0.5rem"}
      justifyContent={"center"}
    >
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.2s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.4s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.6s",
        }}
      />
    </Stack>
  );
};

export { TypingLoader, LayoutLoaderChat, LayoutLoader, MessagesLoader };
