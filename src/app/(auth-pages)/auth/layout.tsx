import { ToastProvider } from "@/components/ui/Toast";
import SessionProvider from "@/components/SessionProvider";
import ThemeEnforcer from "@/components/ThemeEnforcer";
import { Inter } from "next/font/google";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="color-scheme" content="light" />
        <title>Admin Login - STG Mizoram</title>
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900`}
      >
        <ThemeEnforcer />
        <SessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
