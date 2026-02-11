import "./globals.css";
import { Space_Grotesk, Playfair_Display } from "next/font/google";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif"
});

export const metadata = {
  title: "Revenue Calculator",
  description: "Backsolve the pipeline you need to hit revenue goals."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        {children}
      </body>
    </html>
  );
}
