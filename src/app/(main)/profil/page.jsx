"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";

import {
  getUserProfile,
  updateProfilePeserta,
  updateEmail,
  updatePassword,
} from "@/mainHttpClient";

export default function ProfilPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // ----------------------------- VALIDATION SCHEMAS -----------------------------
  const profileSchema = Yup.object().shape({
    nama_lengkap: Yup.string().required("Nama lengkap wajib diisi"),
    no_telp: Yup.string().required("Nomor telepon wajib diisi"),
    jenis_kelamin: Yup.string().required("Jenis kelamin wajib dipilih"),
    tempat_lahir: Yup.string().required("Tempat lahir wajib diisi"),
    tanggal_lahir: Yup.string().required("Tanggal lahir wajib diisi"),
    alamat: Yup.string().required("Alamat wajib diisi"),
    profesi: Yup.string().required("Profesi wajib diisi"),
    instansi: Yup.string().required("Instansi wajib diisi"),
    no_reg_kes: Yup.string().nullable(),
  });

  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email tidak valid")
      .required("Email wajib diisi"),
  });

  const passwordSchema = Yup.object().shape({
    current_password: Yup.string().required("Password saat ini wajib diisi"),
    new_password: Yup.string()
      .min(6, "Minimal 6 karakter")
      .required("Password baru wajib diisi"),
  });

  // ----------------------------- FORMIK INSTANCES -----------------------------
  const profileForm = useFormik({
    initialValues: {
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
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      setSavingProfile(true);
      try {
        await updateProfilePeserta(values);
        toast.success("Profil berhasil diperbarui", {
          position: "bottom-right",
        });
      } catch (err) {
        toast.error(err.message || "Gagal memperbarui profil");
      } finally {
        setSavingProfile(false);
      }
    },
  });

  const emailForm = useFormik({
    initialValues: { email: "" },
    validationSchema: emailSchema,
    onSubmit: async (values) => {
      setSavingEmail(true);
      try {
        await updateEmail(values);
        toast.success("Email berhasil diperbarui", {
          position: "bottom-right",
        });
      } catch (err) {
        toast.error(err.message || "Gagal memperbarui email");
      } finally {
        setSavingEmail(false);
      }
    },
  });

  const passwordForm = useFormik({
    initialValues: { current_password: "", new_password: "" },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      setSavingPassword(true);
      try {
        await updatePassword(values);
        toast.success("Password berhasil diperbarui", {
          position: "bottom-right",
        });
        passwordForm.resetForm();
      } catch (err) {
        toast.error(err.message || "Gagal memperbarui password");
      } finally {
        setSavingPassword(false);
      }
    },
  });

  // ----------------------------- LOAD PROFILE -----------------------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();

        // Isi form profil peserta
        if (data) {
          profileForm.setValues({
            nama_lengkap: data.nama_lengkap || "",
            no_telp: data.no_telp || "",
            jenis_kelamin: data.jenis_kelamin || "",
            tempat_lahir: data.tempat_lahir || "",
            tanggal_lahir: data.tanggal_lahir || "",
            alamat: data.alamat || "",
            profesi: data.profesi || "",
            instansi: data.instansi || "",
            no_reg_kes: data.no_reg_kes || "",
          });

          // Isi email form
          emailForm.setValues({ email: data.email || "" });
        }
      } catch (err) {
        toast.error("Gagal memuat data profil");
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const Label = ({ children }) => (
    <Typography variant="small" className="my-2 font-medium">
      {children}
    </Typography>
  );

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Memuat data...
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------
  return (
    <section className="m-8 min-h-screen">
      <Typography
        variant="h3"
        className="font-bold text-center mb-6 text-blue-600"
      >
        Profil Saya
      </Typography>

      <div className="mx-auto w-full max-w-3xl space-y-10">
        {/* ====================== FORM PROFIL PESERTA ====================== */}
        <div className="border rounded-xl p-6 shadow-sm">
          <Typography variant="h5" className="font-semibold mb-4">
            Data Diri
          </Typography>

          <form onSubmit={profileForm.handleSubmit}>
            <Label>Nama Lengkap</Label>
            <Input
              name="nama_lengkap"
              value={profileForm.values.nama_lengkap}
              onChange={profileForm.handleChange}
            />

            <Label>No Telepon</Label>
            <Input
              name="no_telp"
              value={profileForm.values.no_telp}
              onChange={profileForm.handleChange}
            />

            <Label>Jenis Kelamin</Label>
            <Select
              value={profileForm.values.jenis_kelamin}
              onChange={(v) => profileForm.setFieldValue("jenis_kelamin", v)}
              label="Pilih Jenis Kelamin"
            >
              <Option value="L">Laki-laki</Option>
              <Option value="P">Perempuan</Option>
            </Select>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Tempat Lahir</Label>
                <Input
                  name="tempat_lahir"
                  value={profileForm.values.tempat_lahir}
                  onChange={profileForm.handleChange}
                />
              </div>

              <div>
                <Label>Tanggal Lahir</Label>
                <Input
                  type="date"
                  name="tanggal_lahir"
                  value={profileForm.values.tanggal_lahir}
                  onChange={profileForm.handleChange}
                />
              </div>
            </div>

            <Label className="mt-4">Alamat</Label>
            <Input
              name="alamat"
              value={profileForm.values.alamat}
              onChange={profileForm.handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label>Profesi</Label>
                <Input
                  name="profesi"
                  value={profileForm.values.profesi}
                  onChange={profileForm.handleChange}
                />
              </div>

              <div>
                <Label>Instansi</Label>
                <Input
                  name="instansi"
                  value={profileForm.values.instansi}
                  onChange={profileForm.handleChange}
                />
              </div>

              <div>
                <Label>No Reg Kesehatan (STR)</Label>
                <Input
                  name="no_reg_kes"
                  value={profileForm.values.no_reg_kes}
                  onChange={profileForm.handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 bg-blue-600"
              fullWidth
              disabled={savingProfile}
            >
              {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </div>

        {/* ====================== FORM EMAIL ====================== */}
        <div className="border rounded-xl p-6 shadow-sm">
          <Typography variant="h5" className="font-semibold mb-4">
            Ganti Email
          </Typography>

          <form onSubmit={emailForm.handleSubmit}>
            <Label>Email Baru</Label>
            <Input
              name="email"
              value={emailForm.values.email}
              onChange={emailForm.handleChange}
            />

            <Button
              type="submit"
              className="mt-6 bg-green-600"
              fullWidth
              disabled={savingEmail}
            >
              {savingEmail ? "Menyimpan..." : "Ganti Email"}
            </Button>
          </form>
        </div>

        {/* ====================== FORM PASSWORD ====================== */}
        <div className="border rounded-xl p-6 shadow-sm">
          <Typography variant="h5" className="font-semibold mb-4">
            Ganti Password
          </Typography>

          <form onSubmit={passwordForm.handleSubmit}>
            <Label>Password Saat Ini</Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                name="current_password"
                value={passwordForm.values.current_password}
                onChange={passwordForm.handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showCurrentPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <Label>Password Baru</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                name="new_password"
                value={passwordForm.values.new_password}
                onChange={passwordForm.handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <Button
              type="submit"
              className="mt-6 bg-orange-600"
              fullWidth
              disabled={savingPassword}
            >
              {savingPassword ? "Menyimpan..." : "Ganti Password"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
