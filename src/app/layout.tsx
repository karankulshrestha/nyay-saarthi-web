import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/utils/provider";
import { AuthProvider } from "./Providers";
import toast, { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Nyay Saarthi",
  description: "Developed By Team Delhibots",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
