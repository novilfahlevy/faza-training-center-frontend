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

  const [serverErrorProfile, setServerErrorProfile] = useState("");
  const [serverErrorEmail, setServerErrorEmail] = useState("");
  const [serverErrorPassword, setServerErrorPassword] = useState("");

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
      setServerErrorProfile("");
      try {
        await updateProfilePeserta(values);
        toast.success("Profil berhasil diperbarui", {
          position: "top-right",
        });
      } catch (err) {
        const errorMessage = err.message || "Gagal memperbarui profil";
        setServerErrorProfile(errorMessage);
        toast.error(errorMessage);
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
      setServerErrorEmail("");
      try {
        await updateEmail(values);
        toast.success("Email berhasil diperbarui", {
          position: "top-right",
        });
      } catch (err) {
        const errorMessage = err.message || "Gagal memperbarui email";
        setServerErrorEmail(errorMessage);
        toast.error(errorMessage);
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
      setServerErrorPassword("");
      try {
        await updatePassword(values);
        toast.success("Password berhasil diperbarui", {
          position: "top-right",
        });
        passwordForm.resetForm();
      } catch (err) {
        const errorMessage = err.message || "Gagal memperbarui password";
        setServerErrorPassword(errorMessage);
        toast.error(errorMessage);
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

  const Label = ({ children, required }) => (
    <Typography variant="small" className="my-2 font-medium">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Typography>
  );

  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (
      <Typography variant="small" color="red" className="mt-1">
        {error}
      </Typography>
    );
  };

  const ServerError = ({ error }) => {
    if (!error) return null;
    return (
      <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        <Typography variant="small" className="font-medium">
          {error}
        </Typography>
      </div>
    );
  };

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
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <Typography variant="h5" className="font-semibold mb-4">
            Data Diri
          </Typography>

          <ServerError error={serverErrorProfile} />

          <form onSubmit={profileForm.handleSubmit}>
            <Label required>Nama Lengkap</Label>
            <Input
              name="nama_lengkap"
              value={profileForm.values.nama_lengkap}
              onChange={(e) => {
                profileForm.handleChange(e);
                setServerErrorProfile("");
              }}
              onBlur={profileForm.handleBlur}
              error={profileForm.touched.nama_lengkap && Boolean(profileForm.errors.nama_lengkap)}
            />
            <ErrorMessage error={profileForm.touched.nama_lengkap && profileForm.errors.nama_lengkap} />

            <Label required>No Telepon</Label>
            <Input
              name="no_telp"
              value={profileForm.values.no_telp}
              onChange={(e) => {
                profileForm.handleChange(e);
                setServerErrorProfile("");
              }}
              onBlur={profileForm.handleBlur}
              error={profileForm.touched.no_telp && Boolean(profileForm.errors.no_telp)}
            />
            <ErrorMessage error={profileForm.touched.no_telp && profileForm.errors.no_telp} />

            <Label required>Jenis Kelamin</Label>
            <Select
              value={profileForm.values.jenis_kelamin}
              onChange={(v) => {
                profileForm.setFieldValue("jenis_kelamin", v);
                setServerErrorProfile("");
              }}
              onBlur={() => profileForm.setFieldTouched("jenis_kelamin", true)}
              label="Pilih Jenis Kelamin"
              error={profileForm.touched.jenis_kelamin && Boolean(profileForm.errors.jenis_kelamin)}
            >
              <Option value="L">Laki-laki</Option>
              <Option value="P">Perempuan</Option>
            </Select>
            <ErrorMessage error={profileForm.touched.jenis_kelamin && profileForm.errors.jenis_kelamin} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label required>Tempat Lahir</Label>
                <Input
                  name="tempat_lahir"
                  value={profileForm.values.tempat_lahir}
                  onChange={(e) => {
                    profileForm.handleChange(e);
                    setServerErrorProfile("");
                  }}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.tempat_lahir && Boolean(profileForm.errors.tempat_lahir)}
                />
                <ErrorMessage error={profileForm.touched.tempat_lahir && profileForm.errors.tempat_lahir} />
              </div>

              <div>
                <Label required>Tanggal Lahir</Label>
                <Input
                  type="date"
                  name="tanggal_lahir"
                  value={profileForm.values.tanggal_lahir}
                  onChange={(e) => {
                    profileForm.handleChange(e);
                    setServerErrorProfile("");
                  }}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.tanggal_lahir && Boolean(profileForm.errors.tanggal_lahir)}
                />
                <ErrorMessage error={profileForm.touched.tanggal_lahir && profileForm.errors.tanggal_lahir} />
              </div>
            </div>

            <Label className="mt-4" required>Alamat</Label>
            <Input
              name="alamat"
              value={profileForm.values.alamat}
              onChange={(e) => {
                profileForm.handleChange(e);
                setServerErrorProfile("");
              }}
              onBlur={profileForm.handleBlur}
              error={profileForm.touched.alamat && Boolean(profileForm.errors.alamat)}
            />
            <ErrorMessage error={profileForm.touched.alamat && profileForm.errors.alamat} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label required>Profesi</Label>
                <Input
                  name="profesi"
                  value={profileForm.values.profesi}
                  onChange={(e) => {
                    profileForm.handleChange(e);
                    setServerErrorProfile("");
                  }}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.profesi && Boolean(profileForm.errors.profesi)}
                />
                <ErrorMessage error={profileForm.touched.profesi && profileForm.errors.profesi} />
              </div>

              <div>
                <Label required>Instansi</Label>
                <Input
                  name="instansi"
                  value={profileForm.values.instansi}
                  onChange={(e) => {
                    profileForm.handleChange(e);
                    setServerErrorProfile("");
                  }}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.instansi && Boolean(profileForm.errors.instansi)}
                />
                <ErrorMessage error={profileForm.touched.instansi && profileForm.errors.instansi} />
              </div>

              <div>
                <Label>No Reg Kesehatan (STR)</Label>
                <Input
                  name="no_reg_kes"
                  value={profileForm.values.no_reg_kes}
                  onChange={(e) => {
                    profileForm.handleChange(e);
                    setServerErrorProfile("");
                  }}
                  onBlur={profileForm.handleBlur}
                />
                <ErrorMessage error={profileForm.touched.no_reg_kes && profileForm.errors.no_reg_kes} />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 bg-blue-600 hover:bg-blue-700"
              fullWidth
              disabled={savingProfile}
            >
              {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </div>

        {/* ====================== FORM EMAIL ====================== */}
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <Typography variant="h5" className="font-semibold mb-4">
            Ganti Email
          </Typography>

          <ServerError error={serverErrorEmail} />

          <form onSubmit={emailForm.handleSubmit}>
            <Label required>Email Baru</Label>
            <Input
              name="email"
              type="email"
              value={emailForm.values.email}
              onChange={(e) => {
                emailForm.handleChange(e);
                setServerErrorEmail("");
              }}
              onBlur={emailForm.handleBlur}
              error={emailForm.touched.email && Boolean(emailForm.errors.email)}
            />
            <ErrorMessage error={emailForm.touched.email && emailForm.errors.email} />

            <Button
              type="submit"
              className="mt-6 bg-green-600 hover:bg-green-700"
              fullWidth
              disabled={savingEmail}
            >
              {savingEmail ? "Menyimpan..." : "Ganti Email"}
            </Button>
          </form>
        </div>

        {/* ====================== FORM PASSWORD ====================== */}
        <div className="border rounded-xl p-6 shadow-sm bg-white">
          <Typography variant="h5" className="font-semibold mb-4">
            Ganti Password
          </Typography>

          <ServerError error={serverErrorPassword} />

          <form onSubmit={passwordForm.handleSubmit}>
            <Label required>Password Saat Ini</Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                name="current_password"
                value={passwordForm.values.current_password}
                onChange={(e) => {
                  passwordForm.handleChange(e);
                  setServerErrorPassword("");
                }}
                onBlur={passwordForm.handleBlur}
                className="pr-10"
                error={passwordForm.touched.current_password && Boolean(passwordForm.errors.current_password)}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showCurrentPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <ErrorMessage error={passwordForm.touched.current_password && passwordForm.errors.current_password} />

            <Label required>Password Baru</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                name="new_password"
                value={passwordForm.values.new_password}
                onChange={(e) => {
                  passwordForm.handleChange(e);
                  setServerErrorPassword("");
                }}
                onBlur={passwordForm.handleBlur}
                className="pr-10"
                error={passwordForm.touched.new_password && Boolean(passwordForm.errors.new_password)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <ErrorMessage error={passwordForm.touched.new_password && passwordForm.errors.new_password} />

            <Button
              type="submit"
              className="mt-6 bg-orange-600 hover:bg-orange-700"
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