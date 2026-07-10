import { existsSync } from "node:fs";
import { join } from "node:path";
import { PortfolioShell } from "@/components/PortfolioShell";
import { ModeProvider } from "@/lib/mode";

export default function Home() {
  // Photo is pending — only request it once the file ships, so the
  // browser console stays clean until then.
  const hasHeadshot = existsSync(
    join(process.cwd(), "public", "headshot-v2.jpg"),
  );

  return (
    <ModeProvider>
      <PortfolioShell hasHeadshot={hasHeadshot} />
    </ModeProvider>
  );
}
