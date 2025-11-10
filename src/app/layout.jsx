export const metadata = {
  title: "Faza Training Center",
  description: "Pelatihan medis dan kesehatan terpercaya untuk dokter dan tenaga medis profesional.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
