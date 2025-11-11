"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // 🔹 Definisikan skema validasi dengan Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    password: Yup.string()
      .min(6, "Password minimal 6 karakter")
      .required("Password wajib diisi"),
  });

  // 🔹 Inisialisasi dan konfigurasi Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setGeneralError("");
      setLoading(true);
      setSubmitting(true);

      try {
        const response = await fetch("http://172.31.64.87:3001/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login gagal. Silakan coba lagi.");
        }

        toast.success(data.message || "Login berhasil!");

        // Simpan token dan data user ke localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect ke halaman admin
        router.push("/admin");

      } catch (err) {
        console.error("Login Error:", err);
        setGeneralError(err.message || "Terjadi kesalahan yang tidak diketahui.");
        toast.error(err.message || "Login gagal. Silakan coba lagi.");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Faza Training Center
          </Typography>
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 font-medium"
            >
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
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {/* Tampilkan error email jika ada */}
            {formik.touched.email && formik.errors.email && (
              <Typography variant="small" color="red" className="mt-2">
                {formik.errors.email}
              </Typography>
            )}

            <Typography
              variant="small"
              color="blue-gray"
              className="my-2 font-medium"
            >
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
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {/* Tampilkan error password jika ada */}
            {formik.touched.password && formik.errors.password && (
              <Typography variant="small" color="red" className="mt-2">
                {formik.errors.password}
              </Typography>
            )}
          </div>

          {/* Tampilkan error umum (misal: dari jaringan) */}
          {generalError && (
            <Typography color="red" className="text-center text-sm mb-3">
              {generalError}
            </Typography>
          )}

          <Button
            type="submit"
            className="mt-6"
            fullWidth
            disabled={loading || formik.isSubmitting}
          >
            {loading || formik.isSubmitting ? "Memproses..." : "Masuk"}
          </Button>

          <div className="text-center mt-6">
            <Typography
              as="a"
              href="#"
              variant="small"
              className="font-medium text-gray-900 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Fitur lupa password akan segera hadir.");
              }}
            >
              Forgot Password
            </Typography>
          </div>
        </form>
      </div>

      <div className="w-2/5 h-screen hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-screen w-full object-cover rounded-3xl"
          alt="Sign in background"
        />
      </div>
    </section>
  );
}