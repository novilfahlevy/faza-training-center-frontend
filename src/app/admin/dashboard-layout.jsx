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

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function DashboardLayout({ children }) {
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const pathname = usePathname();

  return (
    <div className={`min-h-screen bg-blue-gray-50/50 ${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ToastContainer />

      {/* 🔵 Loading bar di atas halaman */}
      <NextTopLoader
        color="#171717"       // biru elegan
        height={3}            // tinggi bar
        showSpinner={false}   // hilangkan spinner kecil
        crawlSpeed={200}      // efek animasi halus
      />

      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
        brandName="Faza Training Center"
      />

      <div className="p-4 xl:ml-80 flex flex-col justify-between min-h-screen">
        <div>
          <DashboardNavbar currentPath={pathname} />
          {/* Render halaman anak */}
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