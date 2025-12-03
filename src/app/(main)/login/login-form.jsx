// /home/novilfahlevy/Projects/faza-training-center/src/app/(main)/login/login-form.jsx
"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Typography, Alert } from "@material-tailwind/react";
import React, { useState } from "react";
import { loginPeserta } from "@/mainHttpClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    password: Yup.string()
      .required("Password wajib diisi"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setLoginError(null);
      try {
        const data = await loginPeserta(values);

        // response diasumsikan: { token, user, message }
        login(data.token, data.user);

        // Optionally show server message somewhere; for now redirect on success
        
        // Redirect
        router.push("/");
      } catch (err) {
        console.error("Login Error:", err);
        // Show inline alert with error message
        setLoginError(err?.response?.message || err.message || "Login gagal. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {loginError && (
        <Alert open={Boolean(loginError)} color="red" className="mb-2">
          {loginError}
        </Alert>
      )}
      <div>
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
      </div>

      <div>
        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
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
      </div>

      <Button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 transition-colors" 
        fullWidth 
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Memproses...
          </div>
        ) : (
          "Masuk"
        )}
      </Button>

      <Typography variant="small" color="gray" className="text-center">
        Belum punya akun?{" "}
        <Link href="/register" className="text-blue-600 hover:underline font-medium">
          Daftar sekarang
        </Link>
      </Typography>
    </form>
  );
}