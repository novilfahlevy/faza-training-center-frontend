// app/dashboard/layout.jsx
"use client";

import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";

import Sidenav from "@/components/layout/sidenav";
import DashboardNavbar from "@/components/layout/dashboard-navbar";
import Configurator from "@/components/layout/configurator";
import Footer from "@/components/layout/footer";

import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import routes from "@/routes";
import { usePathname } from "next/navigation";

import "@/app/globals.css";

export default function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
        brandName="Faza Training Center"
      />

      <div className="p-4 xl:ml-80">
        <DashboardNavbar currentPath={pathname} />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        {/* Render halaman anak (child routes) */}
        <main>{children}</main>

        <div className="text-blue-gray-600">
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
