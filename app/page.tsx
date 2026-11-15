import { PortfolioShell } from "@/components/PortfolioShell";
import { ModeProvider } from "@/lib/mode";

export default function Home() {
  return (
    <ModeProvider>
      <PortfolioShell />
    </ModeProvider>
  );
}
