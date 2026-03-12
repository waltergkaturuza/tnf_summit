"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AdminProvider } from "@/context/AdminContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      themes={["light", "dark", "system"]}
    >
      <LanguageProvider>
        <AdminProvider>
          {!isAdmin && <Navbar />}
          <main>{children}</main>
          {!isAdmin && <Footer />}
        </AdminProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
