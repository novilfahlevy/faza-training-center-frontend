"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { clearAuthData } from "@/authCredentials";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const layout = pathSegments[0] || "dashboard";
  const page = pathSegments[1] || "home";

  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  }

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Menu Toggle + Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {/* Breadcrumbs */}
          <div className="capitalize">
            <Breadcrumbs
              className={`bg-transparent p-0 transition-all ${
                fixedNavbar ? "mt-1" : ""
              }`}
            >
              <Link href={`/${layout}`}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
                >
                  <span className="hidden sm:inline">{layout}</span>
                  <span className="sm:hidden">...</span>
                </Typography>
              </Link>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal truncate max-w-[150px] sm:max-w-none"
              >
                {page}
              </Typography>
            </Breadcrumbs>
          </div>
        </div>

        {/* Right Section: Logout Button */}
        <div className="flex items-center">
          {/* Desktop Button */}
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-x-1 normal-case"
            onClick={handleLogout}
          >
            <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            Keluar
          </Button>
        </div>
      </div>
    </Navbar>
  );
}