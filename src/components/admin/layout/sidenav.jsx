"use client";

import PropTypes from "prop-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useState } from "react";

export default function Sidenav({ brandName, routes, onCollapse }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  // Load collapsed state from localStorage on mount
  useState(() => {
    const collapsed = localStorage.getItem("sidenavCollapsed") === "true";
    setIsCollapsed(collapsed);
    if (onCollapse) onCollapse(collapsed);
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidenavCollapsed", newState.toString());
    if (onCollapse) onCollapse(newState);

    // Trigger custom event for same-window updates
    window.dispatchEvent(new Event("sidenavToggle"));
  };

  return (
    <>
      <aside
        className={`${sidenavTypes[sidenavType]} ${
          openSidenav ? "translate-x-0" : "-translate-x-80"
        } ${
          isCollapsed ? "xl:w-20" : "xl:w-72"
        } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-all duration-300 xl:translate-x-0 border border-blue-gray-100`}
      >
        <div className="relative">
          <Link href="/" className="flex items-center justify-center gap-x-3 pt-6 pb-3 text-center">
            {isCollapsed ? (
              <img src="/img/LOGO1.png" className="w-10 h-12" alt="FTC" />
            ) : (
              <img
                src="/img/LOGO1.png"
                className="w-10 h-12 object-contain flex-shrink-0"
                alt="Faza Training Center Logo"
              />
            )}
            <Typography
              variant="h6"
              color={sidenavType === "dark" ? "white" : "blue-gray"}
              className={`transition-opacity duration-300 ${
                isCollapsed ? "xl:opacity-0 xl:hidden" : "opacity-100"
              }`}
            >
              {brandName}
            </Typography>
          </Link>

          {/* Mobile Close Button */}
          <IconButton
            variant="text"
            color="white"
            size="sm"
            ripple={false}
            className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
            onClick={() => setOpenSidenav(dispatch, false)}
          >
            <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
          </IconButton>

          {/* Desktop Toggle Button */}
          <IconButton
            variant="text"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
            size="sm"
            ripple={false}
            className="hidden xl:grid absolute -right-3 top-7 bg-white border border-blue-gray-100 shadow-md hover:shadow-lg rounded-full"
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRightIcon
                strokeWidth={2.5}
                className="h-4 w-4 text-blue-gray-900"
              />
            ) : (
              <ChevronLeftIcon
                strokeWidth={2.5}
                className="h-4 w-4 text-blue-gray-900"
              />
            )}
          </IconButton>
        </div>

        <div className="m-4 overflow-y-auto h-[calc(100vh-120px)]">
          {routes.map(({ title, pages }, key) => (
            <ul key={key} className="mb-4 flex flex-col gap-1">
              {title && !isCollapsed && (
                <li className="mx-3.5 mt-4 mb-2">
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </li>
              )}
              {title && isCollapsed && (
                <li className="mx-3.5 mt-4 mb-2 hidden xl:block">
                  <div className="h-px bg-blue-gray-100 opacity-25"></div>
                </li>
              )}
              {pages.map(({ icon, name, path }) => {
                const href = path;
                const isActive = pathname === href;
                return (
                  <li key={name}>
                    <Link href={href}>
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor
                            : sidenavType === "dark"
                            ? "white"
                            : "blue-gray"
                        }
                        className={`flex items-center gap-4 capitalize transition-all ${
                          isCollapsed ? "xl:justify-center xl:px-2" : "px-4"
                        }`}
                        fullWidth
                        title={isCollapsed ? name : ""}
                      >
                        <span className={isCollapsed ? "xl:mx-auto" : ""}>
                          {icon}
                        </span>
                        <Typography
                          color="inherit"
                          className={`font-medium transition-opacity duration-300 ${
                            isCollapsed
                              ? "xl:opacity-0 xl:hidden xl:w-0"
                              : "opacity-100"
                          }`}
                        >
                          {name}
                        </Typography>
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {openSidenav && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        />
      )}
    </>
  );
}

Sidenav.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCollapse: PropTypes.func,
};
