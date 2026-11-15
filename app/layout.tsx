import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

// display "optional" + no preload: slow first loads paint immediately with
// the metric-compatible fallback and the font stays off the LCP critical
// path; repeat visits get the cached webfont.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

const TITLE = "Aravindhan Mohan — Forward Deployed Engineer";
const DESCRIPTION =
  "Senior Frontend Lead with 11+ years taking systems from prototype to production across banking, retail, and enterprise. Forward-deployed before it had a name.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aravindaart.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "aravindaart",
    type: "website",
    locale: "en_SG",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// resizes-content: the layout viewport shrinks when the on-screen keyboard
// opens (instead of only the visual viewport), so svh-based sections and
// the terminal's scroll-into-view don't leave a dead gap above the keyboard.
export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
