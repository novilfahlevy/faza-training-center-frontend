"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Input, Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useState } from "react";
import { login as loginRequest } from "@/adminHttpClient";
import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";
import VerificationAlert from "@/components/admin/auth/verification-alert";
import { Suspense } from "react";

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
        toast.error(err?.response?.data?.message || "Login gagal. Silakan coba lagi.", { position: "top-right" });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section className="flex gap-4 max-h-screen">
      <div className="w-full lg:w-2/5 mx-auto mt-20">
        <div className="text-center mb-8">
          <Typography variant="h2" className="font-bold mb-4 text-blue-600">
            Faza Training Center
          </Typography>
          <Typography variant="h4" className="font-bold mb-4 text-gray-800">
            Portal Admin
          </Typography>
        </div>

        <Suspense>
          <VerificationAlert />
        </Suspense>

        <Card className="shadow-lg border border-blue-gray-100">
          <CardBody className="p-8">
            <form
              onSubmit={formik.handleSubmit}
              className="mx-auto w-full max-w-screen-lg"
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

              <Typography variant="small" color="blue-gray" className="my-4 font-medium">
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

              <Button type="submit" className="mt-6 bg-blue-600 hover:bg-blue-700" fullWidth disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}