import { MaterialTailwindControllerProvider } from "@/context";

import DashboardLayout from '@/app/admin/(authenticated)/dashboard-layout';

import "@/css/tailwind.css";
import "@/css/admin/theme.css";

export const metadata = {
  title: "Faza Training Center Admin",
  description: "Pelatihan medis dan kesehatan terpercaya untuk dokter dan tenaga medis profesional.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <MaterialTailwindControllerProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </MaterialTailwindControllerProvider>
      </body>
    </html>
  );
}
