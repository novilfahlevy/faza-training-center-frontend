"use client";

import { useMaterialTailwindController } from "@/context";

import routes from "@/routes";
import { usePathname } from "next/navigation";

import NextTopLoader from "nextjs-toploader";

import Sidenav from "@/components/admin/layout/sidenav";
import DashboardNavbar from "@/components/admin/layout/dashboard-navbar";
import Footer from "@/components/admin/layout/footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import localFont from "next/font/local";
import { useState, useEffect } from "react";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function DashboardLayout({ children }) {
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Listen to sidenav collapse state from localStorage or context
  useEffect(() => {
    const collapsed = localStorage.getItem("sidenavCollapsed") === "true";
    setIsCollapsed(collapsed);

    // Listen for storage events
    const handleStorage = () => {
      const collapsed = localStorage.getItem("sidenavCollapsed") === "true";
      setIsCollapsed(collapsed);
    };

    window.addEventListener("storage", handleStorage);
    
    // Custom event for same-window updates
    window.addEventListener("sidenavToggle", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("sidenavToggle", handleStorage);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-blue-gray-50/50 ${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ToastContainer />

      {/* Loading bar di atas halaman */}
      <NextTopLoader
        color="#171717"
        height={3}
        showSpinner={false}
        crawlSpeed={200}
      />

      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
        brandName="Faza Training Center"
        onCollapse={setIsCollapsed}
      />

      <div 
        className={`p-4 flex flex-col justify-between min-h-screen transition-all duration-300 ${
          isCollapsed ? "xl:ml-24" : "xl:ml-80"
        }`}
      >
        <div>
          <DashboardNavbar currentPath={pathname} />
          <main>{children}</main>
        </div>

        <div className="text-blue-gray-600 mt-32">
          <Footer
            brandName="Creative Tim"
            brandLink="https://www.creative-tim.com"
            routes={[
              { name: "Creative Tim", path: "https://www.creative-tim.com" },
              { name: "About Us", path: "https://www.creative-tim.com/presentation" },
              { name: "Blog", path: "https://www.creative-tim.com/blog" },
              { name: "License", path: "https://www.creative-tim.com/license" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}