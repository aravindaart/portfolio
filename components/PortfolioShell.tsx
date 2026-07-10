"use client";

import { ChapterSection } from "@/components/story/ChapterSection";
import { FdeThesis } from "@/components/story/FdeThesis";
import { Hero } from "@/components/story/Hero";
import { ModeToggle } from "@/components/recruiter/ModeToggle";
import { RecruiterView } from "@/components/recruiter/RecruiterView";
import { Terminal } from "@/components/terminal/Terminal";
import { useMode } from "@/lib/mode";
import { profile } from "@/content/profile";

export function PortfolioShell() {
  const { mode } = useMode();

  return (
    <>
      <ModeToggle />
      {mode === "recruiter" ? (
        <RecruiterView profile={profile} />
      ) : (
        <main>
          <Hero profile={profile} />
          {profile.chapters.map((chapter) => (
            <ChapterSection key={chapter.id} chapter={chapter} />
          ))}
          <FdeThesis profile={profile} />
          <Terminal />
        </main>
      )}
    </>
  );
}
