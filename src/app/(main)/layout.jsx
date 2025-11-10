import Footer from "@/components/main/layout/footer";
import Header from "@/components/main/layout/header";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Faza Training Center",
  description: "Pelatihan medis dan kesehatan terpercaya untuk dokter dan tenaga medis profesional.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Header />
        {children}
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
