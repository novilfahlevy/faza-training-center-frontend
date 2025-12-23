"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  // Efek saat scroll agar background berubah
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-lg bg-white/90 shadow-md"
          : "bg-transparent backdrop-blur-md"
      }`}
    >
      <nav className="px-6 py-4 flex justify-between items-center gap-x-6">
        {/* === Logo === */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/img/LOGO1.png"
            className="w-8 md:w-12 object-contain"
            alt="Logo"
          />
        </Link>

        {/* === Tombol Hamburger (Mobile) === */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>

        {/* === Menu Utama (Desktop) === */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { href: "/", label: "Beranda" },
            { href: "/pelatihan", label: "Pelatihan" },
            { href: "/mitra", label: "Mitra" },
            { href: "/kontak", label: "Kontak" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-gray-700 font-medium transition-all after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all hover:text-blue-600 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center space-x-4 border-l pl-4 border-gray-300">
              <span className="text-gray-700 font-semibold">Halo, {user?.nama_lengkap?.split(" ")[0]}</span>
              <Link href="/profil">
                <button className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium">
                  Profil
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm font-medium"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* === Dropdown Menu (Mobile) === */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="px-6 py-4 flex flex-col space-y-3">
            {[{ href: "/", label: "Beranda" }, { href: "/pelatihan", label: "Pelatihan" }, { href: "/kontak", label: "Kontak" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <hr className="border-gray-200" />
                <span className="text-gray-700 font-medium">Halo, {user?.nama_lengkap?.split(" ")[0]}</span>
                <Link href="/profil" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition-colors">
                  Profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Keluar
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
