import { ChapterSection } from "@/components/story/ChapterSection";
import { FdeThesis } from "@/components/story/FdeThesis";
import { Hero } from "@/components/story/Hero";
import { ModeProvider } from "@/lib/mode";
import { profile } from "@/content/profile";

export default function Home() {
  return (
    <ModeProvider>
      <main>
        <Hero profile={profile} />
        {profile.chapters.map((chapter) => (
          <ChapterSection key={chapter.id} chapter={chapter} />
        ))}
        <FdeThesis profile={profile} />
      </main>
    </ModeProvider>
  );
}
