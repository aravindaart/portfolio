"use client";

import { ChatOverlay } from "@/components/chat/ChatOverlay";
import { OverviewShell } from "@/components/overview/OverviewShell";
import { RecruiterView } from "@/components/recruiter/RecruiterView";
import { Tty } from "@/components/terminal/Tty";
import { ViewSwitcher } from "@/components/nav/ViewSwitcher";
import { ChatOverlayProvider } from "@/lib/chat-overlay";
import { useMode } from "@/lib/mode";
import { profile } from "@/content/profile";

export function PortfolioShell() {
  const { mode } = useMode();

  return (
    <ChatOverlayProvider>
      <ViewSwitcher />
      {mode === "recruiter" ? (
        <RecruiterView profile={profile} />
      ) : mode === "terminal" ? (
        <Tty />
      ) : (
        <OverviewShell />
      )}
      {/* Mounted once, outside the mode switch: the conversation survives
          both view changes and close/reopen. */}
      <ChatOverlay />
    </ChatOverlayProvider>
  );
}
