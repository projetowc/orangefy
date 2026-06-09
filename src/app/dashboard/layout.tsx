import Sidebar from "@/components/dashboard/Sidebar";
import { UserProvider } from "@/context/UserContext";
import Script from "next/script";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex h-screen bg-surface-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>
      </div>
      <Script id="meta-pixel-dashboard" strategy="afterInteractive">{`
        fbq('track', 'PageView');
      `}</Script>
    </UserProvider>
  );
}
