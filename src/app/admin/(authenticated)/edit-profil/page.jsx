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
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states - Pengguna (Email & Password)
  const [formPengguna, setFormPengguna] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
    
    if (!formPengguna.email) {
      toast.error("Email tidak boleh kosong", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await adminHttpClient.put("/admin/profile/email", {
        email: formPengguna.email,
      });

      console.log("Email update response:", response);
      
      toast.success("Email berhasil diperbarui", {
        position: "top-right",
        autoClose: 2500,
      });
      
      // Update local user
      const updatedUser = { ...user, email: formPengguna.email };
      login(useAuthStore.getState().token, updatedUser);
    } catch (error) {
      console.error("Email update error:", error);
      
      toast.error(error.response?.data?.message || "Gagal memperbarui email", {
        position: "top-right",
        autoClose: 3500,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!formPengguna.currentPassword || !formPengguna.newPassword || !formPengguna.confirmPassword) {
      toast.error("Semua field password harus diisi", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }

    if (formPengguna.newPassword !== formPengguna.confirmPassword) {
      toast.error("Password baru tidak cocok", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }

    if (formPengguna.newPassword.length < 6) {
      toast.error("Password minimal 6 karakter", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }

    setLoading(true);
    try {
      await adminHttpClient.put("/admin/profile/password", {
        current_password: formPengguna.currentPassword,
        new_password: formPengguna.newPassword,
      });

      console.log("Password update success");
      
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
    } catch (error) {
      console.error("Password update error:", error);
      
      toast.error(error.response?.data?.message || "Gagal memperbarui password", {
        position: "top-right",
        autoClose: 3500,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update mitra data
  const handleUpdateMitra = async (e) => {
    e.preventDefault();

    setLoading(true);
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
      setLoading(false);
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
                <Typography variant="small" className="mb-2 block font-semibold">
                  Nama Mitra
                </Typography>
                <Input
                  type="text"
                  name="nama_mitra"
                  value={formMitra.nama_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <div>
                <Typography variant="small" className="mb-2 block font-semibold">
                  Deskripsi Mitra
                </Typography>
                <Textarea
                  name="deskripsi_mitra"
                  value={formMitra.deskripsi_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <div>
                <Typography variant="small" className="mb-2 block font-semibold">
                  Alamat Mitra
                </Typography>
                <Input
                  type="text"
                  name="alamat_mitra"
                  value={formMitra.alamat_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <div>
                <Typography variant="small" className="mb-2 block font-semibold">
                  Telepon Mitra
                </Typography>
                <Input
                  type="text"
                  name="telepon_mitra"
                  value={formMitra.telepon_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <div>
                <Typography variant="small" className="mb-2 block font-semibold">
                  Website Mitra
                </Typography>
                <Input
                  type="url"
                  name="website_mitra"
                  value={formMitra.website_mitra}
                  onChange={handleMitraChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Perbarui Data Mitra
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
              <Typography variant="small" className="mb-2 block font-semibold">
                Email
              </Typography>
              <Input
                type="email"
                name="email"
                value={formPengguna.email}
                onChange={handlePenggunaChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Perbarui Email
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
              <Typography variant="small" className="mb-2 block font-semibold">
                Password Saat Ini
              </Typography>
              <Input
                type="password"
                name="currentPassword"
                value={formPengguna.currentPassword}
                onChange={handlePenggunaChange}
              />
            </div>
            <div>
              <Typography variant="small" className="mb-2 block font-semibold">
                Password Baru
              </Typography>
              <Input
                type="password"
                name="newPassword"
                value={formPengguna.newPassword}
                onChange={handlePenggunaChange}
              />
            </div>
            <div>
              <Typography variant="small" className="mb-2 block font-semibold">
                Konfirmasi Password Baru
              </Typography>
              <Input
                type="password"
                name="confirmPassword"
                value={formPengguna.confirmPassword}
                onChange={handlePenggunaChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Perbarui Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
