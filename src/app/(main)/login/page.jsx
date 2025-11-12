"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useState } from "react";
import { loginPeserta } from "@/mainHttpClient";
import { setBearerToken, setUserData } from "@/authCredentials";
import Link from "next/link";

export default function MainLoginPage() {
  const [loading, setLoading] = useState(false);

  // 🧩 Validasi input
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    password: Yup.string()
      .min(6, "Password minimal 6 karakter")
      .required("Password wajib diisi"),
  });

  // 🧩 Inisialisasi Formik
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data = await loginPeserta(values);
        toast.success(data.message || "Login berhasil!");

        // Simpan data autentikasi
        setBearerToken(data.token);
        setUserData(data.user);

        // Simpan token & user di cookie agar bisa dibaca middleware Next.js
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=86400; SameSite=Lax`;

        // Redirect ke halaman utama
        window.location.href = "/";
      } catch (err) {
        console.error("Login Error:", err);
        toast.error(err.message || "Login gagal. Silakan coba lagi.", {
          position: "top-left",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section className="m-8 min-h-screen">
      {/* Form Section */}
      <div className="w-full mt-16">
        <div className="text-center">
          <Typography variant="h3" className="font-bold mb-4 text-blue-600">
            Masuk ke Akun Anda
          </Typography>
          <Typography variant="small" color="gray">
            Silakan masuk untuk mengikuti pelatihan.
          </Typography>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/3"
        >
          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
            Email
          </Typography>
          <Input
            name="email"
            size="lg"
            placeholder="name@mail.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          {formik.touched.email && formik.errors.email && (
            <Typography variant="small" color="red" className="mt-2">
              {formik.errors.email}
            </Typography>
          )}

          <Typography variant="small" color="blue-gray" className="my-2 font-medium">
            Password
          </Typography>
          <Input
            name="password"
            type="password"
            size="lg"
            placeholder="********"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
          />
          {formik.touched.password && formik.errors.password && (
            <Typography variant="small" color="red" className="mt-2">
              {formik.errors.password}
            </Typography>
          )}

          <Button type="submit" className="mt-6 bg-blue-600" fullWidth disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>

          <Typography
            variant="small"
            color="gray"
            className="mt-4 text-center"
          >
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Daftar sekarang
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}
