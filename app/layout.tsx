import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import QueryClientWrapper from "./queryClient";

export const metadata: Metadata = {
  title: "GeekSpill",
  description:
    "Your one-stop destination for the latest tech insights from industry giants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientWrapper>{children}</QueryClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}
