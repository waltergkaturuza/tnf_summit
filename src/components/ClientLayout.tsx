"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AdminProvider } from "@/context/AdminContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <AdminProvider>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "" : ""}>{children}</main>
      {!isAdmin && <Footer />}
    </AdminProvider>
  );
}
