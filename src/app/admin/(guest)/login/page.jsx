"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Input, Button, Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useState } from "react";
import { login as loginRequest } from "@/adminHttpClient";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const auth = useAuthStore();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Format email tidak valid").required("Email wajib diisi"),
    password: Yup.string().min(6, "Password minimal 6 karakter").required("Password wajib diisi"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const data = await loginRequest(values);
        toast.success(data.message || "Login berhasil!");

        const token = data.data.token;
        const user = data.data.user;

        auth.login(token, user);

        router.push("/admin");
      } catch (err) {
        console.error("Login Error:", err);
        toast.error(err?.response?.data?.message || "Login gagal. Silakan coba lagi.", { position: "top-left" });
      } finally {
        setLoading(false);
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

        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
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

          <Button type="submit" className="mt-6" fullWidth disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
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
