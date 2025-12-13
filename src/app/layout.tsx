import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neo-Bank Dashboard",
  description: "Modern banking for startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <h1 className="text-xl font-bold mr-8">NeoBank</h1>
              <MainNav />
              <div className="ml-auto flex items-center space-x-4">
                {/* UserNav or other items could go here */}
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
