import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// display "optional" + no preload: slow first loads paint immediately with
// the metric-compatible fallback and the font stays off the LCP critical
// path; repeat visits get the cached webfont.
const inter = Inter({
  variable: "--font-inter",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
