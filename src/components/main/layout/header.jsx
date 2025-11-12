"use client";

import { clearAuthData, getUserData } from "@/authCredentials";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
    window.location.href = "/"; // redirect ke beranda
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="hidden md:flex items-center space-x-2 text-2xl font-bold text-blue-600"
        >
          <img src="/img/LOGO1.png" className="w-40" alt="Logo" />
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/pelatihan"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Pelatihan
          </Link>
          <Link
            href="/kontak"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Kontak
          </Link>

          {/* Jika user sudah login, tampilkan nama dan tombol logout */}
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-semibold">
                Halo, {user.nama_lengkap}
              </span>
              <Link href="/profil">
                <button type="button" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Profil
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
