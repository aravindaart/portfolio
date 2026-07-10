"use client";

import { ChapterNav } from "@/components/nav/ChapterNav";
import { CommandPalette } from "@/components/nav/CommandPalette";
import { ChapterSection } from "@/components/story/ChapterSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { FdeThesis } from "@/components/story/FdeThesis";
import { Hero } from "@/components/story/Hero";
import { ModeToggle } from "@/components/recruiter/ModeToggle";
import { RecruiterView } from "@/components/recruiter/RecruiterView";
import { Terminal } from "@/components/terminal/Terminal";
import { useMode } from "@/lib/mode";
import { profile } from "@/content/profile";

export function PortfolioShell({ hasHeadshot }: { hasHeadshot: boolean }) {
  const { mode } = useMode();

  return (
    <>
      <ModeToggle />
      {mode === "recruiter" ? (
        <RecruiterView profile={profile} />
      ) : (
        <main>
          <ChapterNav />
          <CommandPalette />
          <Hero profile={profile} hasHeadshot={hasHeadshot} />
          {profile.chapters.map((chapter) => (
            <ChapterSection key={chapter.id} chapter={chapter} />
          ))}
          <FdeThesis profile={profile} />
          <Terminal />
          <ContactSection profile={profile} />
        </main>
      )}
    </>
  );
}
