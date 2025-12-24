// /home/novilfahlevy/Projects/faza-training-center/src/app/(main)/register/page.jsx
"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Typography,
  Select,
  Option,
  IconButton,
  Alert,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import { registerUser } from "@/mainHttpClient";
import Link from "next/link";
import VerificationAlert from "@/components/main/auth/verification-alert";

export default function RegisterPage({ searchParams }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🧩 Skema validasi input (semua wajib kecuali no_reg_kes)
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    password: Yup.string()
      .min(6, "Password minimal 6 karakter")
      .required("Password wajib diisi"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Konfirmasi password tidak cocok")
      .required("Konfirmasi password wajib diisi"),
    nama_lengkap: Yup.string().required("Nama lengkap wajib diisi"),
    no_telp: Yup.string().required("Nomor telepon wajib diisi"),
    jenis_kelamin: Yup.string().required("Jenis kelamin wajib dipilih"),
    tempat_lahir: Yup.string().required("Tempat lahir wajib diisi"),
    tanggal_lahir: Yup.string().required("Tanggal lahir wajib diisi"),
    alamat: Yup.string().required("Alamat wajib diisi"),
    profesi: Yup.string().required("Profesi wajib diisi"),
    instansi: Yup.string().required("Instansi wajib diisi"),
    no_reg_kes: Yup.string().nullable(), // opsional
  });

  // 🧩 Inisialisasi Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirm_password: "",
      nama_lengkap: "",
      no_telp: "",
      jenis_kelamin: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      alamat: "",
      profesi: "",
      instansi: "",
      no_reg_kes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setRegisterError(null);
      try {
        const { confirm_password, ...payload } = values;
        payload.role = "peserta";
        const data = await registerUser(payload);

        // Show success message and redirect shortly
        const successMessage =
          data?.message ||
          "Registrasi berhasil! Silakan periksa email Anda untuk verifikasi.";
        setRegisterSuccess(successMessage);
      } catch (err) {
        console.error("Register Error:", err);
        setRegisterError(
          err?.response?.message ||
            err.message ||
            "Gagal registrasi. Silakan coba lagi."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // 🔴 Komponen label dengan tanda wajib
  const Label = ({ children }) => (
    <Typography
      variant="small"
      color="blue-gray"
      className="my-2 font-medium flex items-center gap-1"
    >
      {children}
      <span className="text-red-500">*</span>
    </Typography>
  );

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <VerificationAlert searchParams={searchParams} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-6">
            <Typography
              variant="h3"
              className="font-bold text-2xl md:text-3xl mb-4 text-blue-600"
            >
              Daftar Akun Peserta
            </Typography>
            <Typography variant="small" color="gray" className="text-base">
              Lengkapi data diri Anda untuk membuat akun.
            </Typography>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4 md:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Nama lengkap */}
              <div className="md:col-span-2">
                <Label>Nama Lengkap</Label>
                <Input
                  name="nama_lengkap"
                  size="lg"
                  placeholder="Nama lengkap"
                  value={formik.values.nama_lengkap}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nama_lengkap && formik.errors.nama_lengkap && (
                  <Typography variant="small" color="red" className="mt-2">
                    {formik.errors.nama_lengkap}
                  </Typography>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <Label>Email</Label>
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

              {/* Password */}
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    size="lg"
                    placeholder="********"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                  />
                  <IconButton
                    variant="text"
                    className="!absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </IconButton>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <Typography variant="small" color="red" className="mt-2">
                    {formik.errors.password}
                  </Typography>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <Label>Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    name="confirm_password"
                    type={showConfirm ? "text" : "password"}
                    size="lg"
                    placeholder="********"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.confirm_password &&
                      Boolean(formik.errors.confirm_password)
                    }
                  />
                  <IconButton
                    variant="text"
                    className="!absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </IconButton>
                </div>
                {formik.touched.confirm_password &&
                  formik.errors.confirm_password && (
                    <Typography variant="small" color="red" className="mt-2">
                      {formik.errors.confirm_password}
                    </Typography>
                  )}
              </div>

              {/* No Telepon */}
              <div>
                <Label>No. Telepon</Label>
                <Input
                  name="no_telp"
                  size="lg"
                  placeholder="08xxxxxxxxxx"
                  inputMode="numeric"
                  value={formik.values.no_telp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    formik.setFieldValue("no_telp", value);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.no_telp && formik.errors.no_telp && (
                  <Typography variant="small" color="red" className="mt-2">
                    {formik.errors.no_telp}
                  </Typography>
                )}
              </div>

              {/* Jenis Kelamin */}
              <div>
                <Label>Jenis Kelamin</Label>
                <Select
                  name="jenis_kelamin"
                  label="Pilih Jenis Kelamin"
                  value={formik.values.jenis_kelamin}
                  onChange={(value) =>
                    formik.setFieldValue("jenis_kelamin", value)
                  }
                  onBlur={formik.handleBlur}
                >
                  <Option value="L">Laki-laki</Option>
                  <Option value="P">Perempuan</Option>
                </Select>
                {formik.touched.jenis_kelamin &&
                  formik.errors.jenis_kelamin && (
                    <Typography variant="small" color="red" className="mt-2">
                      {formik.errors.jenis_kelamin}
                    </Typography>
                  )}
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div>
                <Label>Tempat Lahir</Label>
                <Input
                  name="tempat_lahir"
                  placeholder="Samarinda"
                  value={formik.values.tempat_lahir}
                  onChange={formik.handleChange}
                />
                {formik.touched.tempat_lahir && formik.errors.tempat_lahir && (
                  <Typography variant="small" color="red" className="mt-2">
                    {formik.errors.tempat_lahir}
                  </Typography>
                )}
              </div>
              <div>
                <Label>Tanggal Lahir</Label>
                <Input
                  name="tanggal_lahir"
                  type="date"
                  value={formik.values.tanggal_lahir}
                  onChange={formik.handleChange}
                />
                {formik.touched.tanggal_lahir &&
                  formik.errors.tanggal_lahir && (
                    <Typography variant="small" color="red" className="mt-2">
                      {formik.errors.tanggal_lahir}
                    </Typography>
                  )}
              </div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <Label>Alamat</Label>
                <Input
                  name="alamat"
                  size="lg"
                  placeholder="Alamat lengkap"
                  value={formik.values.alamat}
                  onChange={formik.handleChange}
                />
                {formik.touched.alamat && formik.errors.alamat && (
                  <Typography variant="small" color="red" className="mt-2">
                    {formik.errors.alamat}
                  </Typography>
                )}
              </div>

              {/* Profesi, Instansi, STR */}
              <div>
                <Label>Profesi</Label>
                <Input
                  name="profesi"
                  placeholder="Mahasiswa / Guru / Dll"
                  value={formik.values.profesi}
                  onChange={formik.handleChange}
                />
                {formik.touched.profesi && formik.errors.profesi && (
                  <Typography variant="small" color="red" className="mt-2">
                    {formik.errors.profesi}
                  </Typography>
                )}
              </div>
              <div>
                <Label>Instansi</Label>
                <Input
                  name="instansi"
                  placeholder="Nama kampus / perusahaan"
                  value={formik.values.instansi}
                  onChange={formik.handleChange}
                />
                {formik.touched.instansi && formik.errors.instansi && (
                  <Typography variant="small" color="red" className="mt-2">
                    {formik.errors.instansi}
                  </Typography>
                )}
              </div>
              <div className="md:col-span-2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="my-2 font-medium"
                >
                  Surat Tanda Registrasi (STR)
                </Typography>
                <Input
                  name="no_reg_kes"
                  placeholder="(Opsional)"
                  value={formik.values.no_reg_kes}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            {/* Alert error */}
            {registerError && (
              <Alert open={Boolean(registerError)} color="red" className="mb-4">
                {registerError}
              </Alert>
            )}

            {/* Alert success */}
            {registerSuccess && (
              <Alert open={Boolean(registerSuccess)} color="green" className="mb-4">
                {registerSuccess}
              </Alert>
            )}

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-colors mt-6"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Mendaftarkan...
                </div>
              ) : (
                "Daftar"
              )}
            </Button>

            <Typography variant="small" color="gray" className="text-center">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Masuk sekarang
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </section>
  );
}
