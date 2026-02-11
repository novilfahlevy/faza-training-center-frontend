"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import {
  fetchPlatformSettings,
  updatePlatformSettings,
} from "@/adminHttpClient";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp_number: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetchPlatformSettings();
      if (response.data) {
        setFormData({
          whatsapp_number: response.data.whatsapp_number || "",
          email: response.data.email || "",
          address: response.data.address || "",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Gagal memuat data kontak");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.whatsapp_number || !formData.email || !formData.address) {
        toast.error("Semua field harus diisi");
        return;
      }

      // Validasi nomor WhatsApp
      if (!formData.whatsapp_number.startsWith('62')) {
        toast.error("Nomor WhatsApp harus dimulai dengan 62");
        return;
      }

      setSaving(true);
      const response = await updatePlatformSettings({
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        address: formData.address,
      });

      if (response.data) {
        toast.success("Data kontak berhasil diperbarui");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan data kontak");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12 flex justify-center">
        <Card className="w-full max-w-3xl border border-blue-gray-100 shadow-sm">
          <CardBody className="px-6 pb-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12 flex justify-center">
      <Card className="w-full max-w-3xl border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="p-3">
          <Typography variant="h6" color="blue-gray">
            Pengaturan Kontak
          </Typography>
        </CardHeader>

        <CardBody className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Informasi Kontak */}
            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray" className="font-medium">
                Informasi Kontak
              </Typography>
              
              {/* Nomor WhatsApp */}
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Nomor WhatsApp
                </Typography>
                <Input
                  name="whatsapp_number"
                  placeholder="Contoh: 6281234567890"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  error={!formData.whatsapp_number}
                  disabled={saving}
                />
                <Typography variant="small" color="gray" className="mt-1">
                  Format: 62 diikuti nomor telepon (untuk WhatsApp)
                </Typography>
              </div>

              {/* Email */}
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
                  type="email"
                  placeholder="Contoh: info@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={!formData.email}
                  disabled={saving}
                />
              </div>

              {/* Alamat */}
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Alamat
                </Typography>
                <Textarea
                  name="address"
                  placeholder="Masukkan alamat lengkap kantor"
                  value={formData.address}
                  onChange={handleChange}
                  error={!formData.address}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Tombol */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="text"
                color="blue-gray"
                onClick={loadSettings}
                disabled={saving}
              >
                Reset
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}