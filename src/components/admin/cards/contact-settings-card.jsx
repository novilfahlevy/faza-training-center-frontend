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

export default function ContactSettingsCard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp_number: "",
    email: "",
    address: "",
  });
  const [originalData, setOriginalData] = useState({
    whatsapp_number: "",
    email: "",
    address: "",
  });

  // Fetch settings on mount
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
        setOriginalData({
          whatsapp_number: response.data.whatsapp_number || "",
          email: response.data.email || "",
          address: response.data.address || "",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Gagal memuat pengaturan kontak");
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      if (
        !formData.whatsapp_number ||
        !formData.email ||
        !formData.address
      ) {
        toast.error("Semua field harus diisi");
        return;
      }

      setSaving(true);
      const response = await updatePlatformSettings({
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        address: formData.address,
      });

      if (response.data) {
        setOriginalData(formData);
        setIsEditing(false);
        toast.success("Pengaturan kontak berhasil diperbarui");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan kontak");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card color="transparent" shadow={false}>
        <CardHeader
          color="transparent"
          shadow={false}
          floated={false}
          className="mx-0 mt-0 mb-4"
        >
          <Typography variant="h6" color="blue-gray">
            Pengaturan Kontak
          </Typography>
        </CardHeader>
        <CardBody className="p-0">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card color="transparent" shadow={false}>
      <CardHeader
        color="transparent"
        shadow={false}
        floated={false}
        className="mx-0 mt-0 mb-4 flex items-center justify-between gap-4"
      >
        <Typography variant="h6" color="blue-gray">
          Pengaturan Kontak
        </Typography>
        {!isEditing && (
          <Button
            size="sm"
            variant="text"
            color="blue"
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </CardHeader>

      <CardBody className="p-0">
        {!isEditing ? (
          <div className="space-y-6">
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold mb-2"
              >
                Nomor WhatsApp
              </Typography>
              <Typography
                variant="small"
                className="font-normal text-blue-gray-500"
              >
                {formData.whatsapp_number}
              </Typography>
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold mb-2"
              >
                Email
              </Typography>
              <Typography
                variant="small"
                className="font-normal text-blue-gray-500"
              >
                {formData.email}
              </Typography>
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold mb-2"
              >
                Alamat
              </Typography>
              <Typography
                variant="small"
                className="font-normal text-blue-gray-500"
              >
                {formData.address}
              </Typography>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold mb-2"
              >
                Nomor WhatsApp
              </Typography>
              <Input
                name="whatsapp_number"
                type="text"
                placeholder="Contoh: +62 852-1331-4700"
                value={formData.whatsapp_number}
                onChange={handleChange}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold mb-2"
              >
                Email
              </Typography>
              <Input
                name="email"
                type="email"
                placeholder="Contoh: info@example.com"
                value={formData.email}
                onChange={handleChange}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold mb-2"
              >
                Alamat
              </Typography>
              <Textarea
                name="address"
                placeholder="Masukkan alamat lengkap"
                value={formData.address}
                onChange={handleChange}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>
        )}
      </CardBody>

      {isEditing && (
        <CardFooter className="p-0 pt-4 flex gap-4 justify-end">
          <Button
            size="sm"
            variant="text"
            color="red"
            onClick={handleCancel}
            disabled={saving}
          >
            Batal
          </Button>
          <Button
            size="sm"
            variant="filled"
            color="green"
            onClick={handleSave}
            disabled={saving}
            loading={saving}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
