import Sidebar from "@/components/dashboard/Sidebar";
import { UserProvider } from "@/context/UserContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex h-screen bg-surface-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
