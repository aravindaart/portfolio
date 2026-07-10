import { Hero } from "@/components/story/Hero";
import { ModeProvider } from "@/lib/mode";
import { profile } from "@/content/profile";

export default function Home() {
  return (
    <ModeProvider>
      <main>
        <Hero profile={profile} />
      </main>
    </ModeProvider>
  );
}
