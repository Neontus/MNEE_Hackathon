import type { Metadata } from "next";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "MNEE Banking",
  description: "Crypto-native banking for startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center px-6">
                <div className="flex items-center gap-2 mr-8">
                  <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h1 className="text-xl font-semibold">MNEE</h1>
                </div>
                <MainNav />
                <div className="ml-auto flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span>Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                      AA
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
              <div className="container px-6 py-8">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-background">
              <div className="container px-6 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>© 2024 MNEE</span>
                    <span>•</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/20">
                      Sandbox Environment
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
                    <a href="#" className="hover:text-foreground transition-colors">Support</a>
                    <a href="#" className="hover:text-foreground transition-colors">API</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
