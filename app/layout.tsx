import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfirmModalProvider } from "./components/ConfirmModalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aplikasi HR Dashboard Indonesia",
  description:
    "Sistem manajemen HR yang komprehensif untuk perusahaan Indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConfirmModalProvider>{children}</ConfirmModalProvider>
      </body>
    </html>
  );
}
