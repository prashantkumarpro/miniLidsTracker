import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mini Leads Tracker - SaaS Lead Management CRM",
  description: "Manage customer leads, track follow-ups, and review pipeline conversion metrics.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafbfc] text-gray-900 dark:bg-[#070b14] dark:text-gray-100 transition-colors duration-300 relative overflow-x-hidden">
        {/* Premium SaaS Ambient Glow Blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-radial from-orange-500/10 dark:from-orange-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-[40%] right-1/4 w-[500px] h-[500px] rounded-full bg-radial from-blue-500/5 dark:from-blue-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
        <AuthProvider>
          <Navbar />
          <main className="flex-1 relative">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
