import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { MyFirebaseProvider } from "@/components/firebase-providers";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider"
import { NavBar } from "@/components/navbar/navbar";
import NoSSRWrapper from "./NoSSRWrapper";


const font = Work_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cardio App",
  description:
    "Determine heart murmur type, severity, and location using machine learning.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(font.className)}>
        <NavBar />
        <MyFirebaseProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NoSSRWrapper>
              {children}
              <Toaster />
            </NoSSRWrapper>
          </ThemeProvider>
        </MyFirebaseProvider>
      </body>
    </html>
  );
}
