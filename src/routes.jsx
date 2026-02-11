import { ChartBarSquareIcon, UsersIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import {
  AcademicCapIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

// import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <ChartBarSquareIcon {...icon} />,
        name: "Dasbor",
        path: "/admin"
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Laporan Kegiatan",
        path: "/admin/laporan-kegiatan"
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Pelatihan",
        path: "/admin/pelatihan"
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Pengguna",
        path: "/admin/pengguna"
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Kontak",
        path: "/admin/contact"
      },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/admin/profile"
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "tables",
      //   path: "/admin/tables"
      // },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/admin/notifications"
      // },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
