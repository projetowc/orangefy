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
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '4554908504786727');
        fbq('track', 'PageView');
      `}</Script>
      <noscript>
        <img height="1" width="1" style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=4554908504786727&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </UserProvider>
  );
}
