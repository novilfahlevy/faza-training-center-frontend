"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  const pathSegments = pathname.split("/").filter(Boolean);
  const layout = pathSegments[0] || "dashboard";
  const page = pathSegments[1] || "home";

  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleEditProfil = () => {
    setOpenMenu(false);
    router.push('/admin/edit-profil');
  };

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

        {/* Right Section: User Dropdown Menu */}
        <div className="flex items-center">
          {/* Desktop Dropdown */}
          <Menu open={openMenu} handler={setOpenMenu}>
            <MenuHandler>
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-x-1 normal-case"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                <span className="hidden sm:inline truncate max-w-[120px] text-sm">{user?.email || "User"}</span>
              </Button>
            </MenuHandler>
            <MenuList className="min-w-max">
              <MenuItem onClick={handleEditProfil} className="flex items-center gap-2">
                Edit Profil
              </MenuItem>
              <MenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                Keluar
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}