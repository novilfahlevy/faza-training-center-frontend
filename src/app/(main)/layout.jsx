import "@/css/tailwind.css";

import Footer from "@/components/main/layout/footer";
import Header from "@/components/main/layout/header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NextTopLoader from "nextjs-toploader";
import AuthDataLayout from "@/app/(main)/auth-data-layout";

export const metadata = {
  title: "Faza Training Center",
  description: "Pelatihan medis dan kesehatan terpercaya untuk dokter dan tenaga medis profesional.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthDataLayout>
          <NextTopLoader
            color="#1e88e5"       // biru elegan
            height={3}            // tinggi bar
            showSpinner={false}   // hilangkan spinner kecil
            crawlSpeed={200}      // efek animasi halus
          />
          <Header />
          {children}
          <Footer />
          <ToastContainer position="top-right" />
        </AuthDataLayout>
      </body>
    </html>
  );
}
