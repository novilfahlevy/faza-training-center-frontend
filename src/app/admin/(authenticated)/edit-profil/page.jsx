"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import adminHttpClient from "@/adminHttpClient";
import { toast } from "react-toastify";
import { Card, Typography, Input, Button, Textarea } from "@material-tailwind/react";

export default function EditProfilPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);

  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Loading states for each form
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingMitra, setLoadingMitra] = useState(false);

  // Form states - Pengguna (Email & Password)
  const [formPengguna, setFormPengguna] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Error states for validation
  const [emailErrors, setEmailErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Form states - Mitra
  const [formMitra, setFormMitra] = useState({
    nama_mitra: "",
    deskripsi_mitra: "",
    alamat_mitra: "",
    telepon_mitra: "",
    website_mitra: "",
  });

  // Fetch profile data on mount
  useEffect(() => {
    if (!user) {
      router.replace("/admin/login");
      return;
    }

    setRole(user.role);
    setFormPengguna({ ...formPengguna, email: user.email || "" });

    if (user.role === "mitra") {
      fetchMitraData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchMitraData = async () => {
    try {
      const response = await adminHttpClient.get("/admin/profile");
      if (response.data?.data?.data_mitra) {
        const mitra = response.data.data.data_mitra;
        setFormMitra({
          nama_mitra: mitra.nama_mitra || "",
          deskripsi_mitra: mitra.deskripsi_mitra || "",
          alamat_mitra: mitra.alamat_mitra || "",
          telepon_mitra: mitra.telepon_mitra || "",
          website_mitra: mitra.website_mitra || "",
        });
      }
    } catch (error) {
      console.error("Error fetching mitra data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Pengguna form change
  const handlePenggunaChange = (e) => {
    const { name, value } = e.target;
    setFormPengguna((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Mitra form change
  const handleMitraChange = (e) => {
    const { name, value } = e.target;
    setFormMitra((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update email
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formPengguna.email) {
      newErrors.email = "Email tidak boleh kosong";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setEmailErrors(newErrors);
      return;
    }

    setLoadingEmail(true);
    try {
      await adminHttpClient.put("/admin/profile/email", {
        email: formPengguna.email,
      });
      
      toast.success("Email berhasil diperbarui", {
        position: "top-right",
        autoClose: 2500,
      });
      
      // Update local user
      const updatedUser = { ...user, email: formPengguna.email };
      login(useAuthStore.getState().token, updatedUser);
      setEmailErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui email", {
        position: "top-right",
        autoClose: 3500,
      });
    } finally {
      setLoadingEmail(false);
    }
  };

  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formPengguna.currentPassword) {
      newErrors.currentPassword = "Password saat ini harus diisi";
    }
    if (!formPengguna.newPassword) {
      newErrors.newPassword = "Password baru harus diisi";
    }
    if (!formPengguna.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    }
    if (formPengguna.newPassword && formPengguna.confirmPassword && formPengguna.newPassword !== formPengguna.confirmPassword) {
      newErrors.confirmPassword = "Password baru tidak cocok";
    }
    if (formPengguna.newPassword && formPengguna.newPassword.length < 6) {
      newErrors.newPassword = "Password minimal 6 karakter";
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    setLoadingPassword(true);
    try {
      await adminHttpClient.put("/admin/profile/password", {
        current_password: formPengguna.currentPassword,
        new_password: formPengguna.newPassword,
      });
      
      toast.success("Password berhasil diperbarui", {
        position: "top-right",
        autoClose: 2500,
      });
      setFormPengguna((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setPasswordErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui password", {
        position: "top-right",
        autoClose: 3500,
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  // Update mitra data
  const handleUpdateMitra = async (e) => {
    e.preventDefault();

    setLoadingMitra(true);
    try {
      await adminHttpClient.put("/admin/profile/mitra", formMitra);

      toast.success("Data mitra berhasil diperbarui", {
        position: "top-right",
        autoClose: 2500,
      });
    } catch (error) {
      console.error("Mitra update error:", error);
      toast.error(error.response?.data?.message || "Gagal memperbarui data mitra", {
        position: "top-right",
        autoClose: 3500,
      });
    } finally {
      setLoadingMitra(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography variant="h6">Memuat...</Typography>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="m-2 flex flex-col gap-4">
      <Typography variant="h4" color="blue-gray">
        Edit Profil
      </Typography>

      <div className="grid grid-cols-1 gap-4">
        {/* Mitra Data Section - Only for Mitra Role */}
        {role === "mitra" && (
          <Card className="p-6">
            <Typography variant="h6" className="mb-4">
              Data Mitra
            </Typography>
            <form onSubmit={handleUpdateMitra} className="flex flex-col gap-4">
              <div>
                <Input
                  label="Nama Mitra"
                  type="text"
                  name="nama_mitra"
                  value={formMitra.nama_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Deskripsi Mitra
                </Typography>
                <Textarea
                  name="deskripsi_mitra"
                  value={formMitra.deskripsi_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <div>
                <Input
                  label="Alamat Mitra"
                  type="text"
                  name="alamat_mitra"
                  value={formMitra.alamat_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <div>
                <Input
                  label="Telepon Mitra"
                  type="text"
                  name="telepon_mitra"
                  value={formMitra.telepon_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <div>
                <Input
                  label="Website Mitra"
                  type="url"
                  name="website_mitra"
                  value={formMitra.website_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <Button
                type="submit"
                color="blue"
                disabled={loadingMitra}
              >
                {loadingMitra ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </div>
                ) : (
                  "Perbarui Data Mitra"
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Email Section */}
        <Card className="p-6">
          <Typography variant="h6" className="mb-4">
            Ubah Email
          </Typography>
          <form onSubmit={handleUpdateEmail} className="flex flex-col gap-4">
            <div>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formPengguna.email}
                onChange={(e) => {
                  handlePenggunaChange(e);
                  setEmailErrors({});
                }}
                error={Boolean(emailErrors.email)}
              />
              {emailErrors.email && (
                <Typography variant="small" color="red" className="mt-1">
                  {emailErrors.email}
                </Typography>
              )}
            </div>
            <Button
              type="submit"
              color="blue"
              disabled={loadingEmail}
            >
              {loadingEmail ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </div>
              ) : (
                "Perbarui Email"
              )}
            </Button>
          </form>
        </Card>

        {/* Password Section */}
        <Card className="p-6">
          <Typography variant="h6" className="mb-4">
            Ubah Password
          </Typography>
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <div>
              <Input
                type="password"
                label="Password Saat Ini"
                name="currentPassword"
                value={formPengguna.currentPassword}
                onChange={(e) => {
                  handlePenggunaChange(e);
                  setPasswordErrors((prev) => ({ ...prev, currentPassword: "" }));
                }}
                error={Boolean(passwordErrors.currentPassword)}
              />
              {passwordErrors.currentPassword && (
                <Typography variant="small" color="red" className="mt-1">
                  {passwordErrors.currentPassword}
                </Typography>
              )}
            </div>
            <div>
              <Input
                type="password"
                label="Password Baru"
                name="newPassword"
                value={formPengguna.newPassword}
                onChange={(e) => {
                  handlePenggunaChange(e);
                  setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
                error={Boolean(passwordErrors.newPassword)}
              />
              {passwordErrors.newPassword && (
                <Typography variant="small" color="red" className="mt-1">
                  {passwordErrors.newPassword}
                </Typography>
              )}
            </div>
            <div>
              <Input
                type="password"
                label="Konfirmasi Password Baru"
                name="confirmPassword"
                value={formPengguna.confirmPassword}
                onChange={(e) => {
                  handlePenggunaChange(e);
                  setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                error={Boolean(passwordErrors.confirmPassword)}
              />
              {passwordErrors.confirmPassword && (
                <Typography variant="small" color="red" className="mt-1">
                  {passwordErrors.confirmPassword}
                </Typography>
              )}
            </div>
            <Button
              type="submit"
              color="blue"
              disabled={loadingPassword}
            >
              {loadingPassword ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </div>
              ) : (
                "Perbarui Password"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
