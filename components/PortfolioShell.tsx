"use client";

import { AgentShell } from "@/components/agent/AgentShell";
import { ModeToggle } from "@/components/recruiter/ModeToggle";
import { RecruiterView } from "@/components/recruiter/RecruiterView";
import { useMode } from "@/lib/mode";
import { profile } from "@/content/profile";

export function PortfolioShell() {
  const { mode } = useMode();

  return (
    <>
      <ModeToggle />
      {mode === "recruiter" ? <RecruiterView profile={profile} /> : <AgentShell />}
    </>
  );
}
