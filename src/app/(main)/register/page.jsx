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
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useState } from "react";
import { registerUser } from "@/mainHttpClient";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      try {
        const { confirm_password, ...payload } = values;
        payload.role = "peserta";
        const data = await registerUser(payload);

        toast.success(data.message || "Registrasi berhasil!", { position: "top-right" });

        // Redirect ke halaman login
        router.push("/login");
      } catch (err) {
        console.error("Register Error:", err);
        toast.dismissAll();
        toast.error(err.message || "Gagal registrasi. Silakan coba lagi.", { position: "top-right" });
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
    <section className="m-8 min-h-screen">
      <div className="w-full mt-8">
        <div className="text-center">
          <Typography variant="h3" className="font-bold mb-4 text-blue-600">
            Daftar Akun Peserta
          </Typography>
          <Typography variant="small" color="gray">
            Lengkapi data diri Anda untuk membuat akun.
          </Typography>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 mb-2 mx-auto w-96 max-w-screen-lg lg:w-1/2"
        >
          {/* Email */}
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

          {/* Password */}
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
              error={formik.touched.password && Boolean(formik.errors.password)}
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

          {/* Konfirmasi Password */}
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
          {formik.touched.confirm_password && formik.errors.confirm_password && (
            <Typography variant="small" color="red" className="mt-2">
              {formik.errors.confirm_password}
            </Typography>
          )}

          {/* Nama lengkap */}
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

          {/* No Telepon */}
          <Label>No. Telepon</Label>
          <Input
            name="no_telp"
            size="lg"
            placeholder="08xxxxxxxxxx"
            value={formik.values.no_telp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.no_telp && formik.errors.no_telp && (
            <Typography variant="small" color="red" className="mt-2">
              {formik.errors.no_telp}
            </Typography>
          )}

          {/* Jenis Kelamin */}
          <Label>Jenis Kelamin</Label>
          <Select
            name="jenis_kelamin"
            label="Pilih Jenis Kelamin"
            value={formik.values.jenis_kelamin}
            onChange={(value) => formik.setFieldValue("jenis_kelamin", value)}
            onBlur={formik.handleBlur}
          >
            <Option value="L">Laki-laki</Option>
            <Option value="P">Perempuan</Option>
          </Select>
          {formik.touched.jenis_kelamin && formik.errors.jenis_kelamin && (
            <Typography variant="small" color="red" className="mt-2">
              {formik.errors.jenis_kelamin}
            </Typography>
          )}

          {/* Tempat & Tanggal Lahir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
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
              {formik.touched.tanggal_lahir && formik.errors.tanggal_lahir && (
                <Typography variant="small" color="red" className="mt-2">
                  {formik.errors.tanggal_lahir}
                </Typography>
              )}
            </div>
          </div>

          <Label className="mt-4">Alamat</Label>
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

          {/* Profesi, Instansi, STR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
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
            <div>
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

          {/* Tombol */}
          <Button
            type="submit"
            className="mt-6 bg-blue-600"
            fullWidth
            disabled={loading}
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </Button>

          <Typography
            variant="small"
            color="gray"
            className="mt-4 text-center"
          >
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Masuk sekarang
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}
