// /home/novilfahlevy/Projects/faza-training-center/src/components/admin/pengguna/edit-pengguna-modal.jsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updatePengguna } from "@/adminHttpClient"; // 🔹 Gunakan fungsi baru
import { toast } from "react-toastify";
import LogoUploader from "./logo-uploader";

export default function EditPenggunaModal({ open, onClose, user, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoData, setLogoData] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // 🔹 Set logo data ketika user berubah
  useEffect(() => {
    if (user?.logo_mitra) {
      setLogoData({ url: user.logo_mitra });
    } else {
      setLogoData(null);
    }
  }, [user]);

  // Skema validasi hanya untuk mitra
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    // Field khusus mitra
    nama_mitra: Yup.string().required("Nama Mitra wajib diisi"),
    deskripsi_mitra: Yup.string().required("Deskripsi wajib diisi"),
    alamat_mitra: Yup.string().required("Alamat wajib diisi"),
    telepon_mitra: Yup.string().required("Telepon wajib diisi"),
    website_mitra: Yup.string().nullable(),
    visi_misi: Yup.string().nullable(),
    logo_mitra: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      // Inisialisasi field mitra dari data user
      nama_mitra: user?.nama_mitra || "",
      deskripsi_mitra: user?.deskripsi_mitra || "",
      alamat_mitra: user?.alamat_mitra || "",
      telepon_mitra: user?.telepon_mitra || "",
      website_mitra: user?.website_mitra || "",
      visi_misi: user?.visi_misi || "",
      logo_mitra: user?.logo_mitra || "",
    },
    enableReinitialize: true, // Penting untuk reset form saat user berubah
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // 🔹 Struktur payload yang sesuai dengan controller
        const payload = {
          email: values.email,
          role: "mitra", // Role selalu 'mitra' untuk modal ini
          data_mitra: {
            nama_mitra: values.nama_mitra,
            deskripsi_mitra: values.deskripsi_mitra,
            alamat_mitra: values.alamat_mitra,
            telepon_mitra: values.telepon_mitra,
            website_mitra: values.website_mitra,
            visi_misi: values.visi_misi,
            logo_mitra: logoData?.path || null,
          },
        };

        // 🔹 Gunakan fungsi updatePengguna dari adminHttpClient
        const response = await updatePengguna(user.id, payload);
        toast.success(response.data.message || "Data mitra berhasil diperbarui!");
        onClose();
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        toast.error(error.response?.data?.message || "Gagal memperbarui data mitra.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog
      open={open && user?.role === "mitra"} // Pastikan modal hanya terbuka untuk mitra
      handler={onClose}
      size="lg"
      className="!max-h-[90vh] overflow-y-auto"
    >
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5">Edit Data Mitra</Typography>
        <Button variant="text" onClick={onClose}>
          <span>X</span>
        </Button>
      </DialogHeader>

      <form onSubmit={formik.handleSubmit}>
        <DialogBody className="flex flex-col gap-6">
          {/* --- Informasi Akun --- */}
          <div className="space-y-4">
            <Typography variant="h6" className="text-blue-gray-700">
              Informasi Akun
            </Typography>
            <Input
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.email && formik.errors.email)}
            />
            {formik.touched.email && formik.errors.email && (
              <Typography variant="small" color="red">
                {formik.errors.email}
              </Typography>
            )}
          </div>

          {/* --- Informasi Mitra --- */}
          <div className="space-y-4 border-t pt-4">
            <Typography variant="h6" className="text-blue-gray-700">
              Informasi Mitra
            </Typography>

            <Input
              label="Nama Mitra"
              name="nama_mitra"
              value={formik.values.nama_mitra}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.nama_mitra && formik.errors.nama_mitra)}
            />
            {formik.touched.nama_mitra && formik.errors.nama_mitra && (
              <Typography variant="small" color="red">
                {formik.errors.nama_mitra}
              </Typography>
            )}

            <Textarea
              label="Deskripsi"
              name="deskripsi_mitra"
              value={formik.values.deskripsi_mitra}
              onChange={formik.handleChange}
              rows={3}
              error={Boolean(formik.touched.deskripsi_mitra && formik.errors.deskripsi_mitra)}
            />
            {formik.touched.deskripsi_mitra && formik.errors.deskripsi_mitra && (
              <Typography variant="small" color="red">
                {formik.errors.deskripsi_mitra}
              </Typography>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Alamat"
                  name="alamat_mitra"
                  value={formik.values.alamat_mitra}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.alamat_mitra && formik.errors.alamat_mitra)}
                />
                {formik.touched.alamat_mitra && formik.errors.alamat_mitra && (
                  <Typography variant="small" color="red">
                    {formik.errors.alamat_mitra}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Telepon"
                  name="telepon_mitra"
                  value={formik.values.telepon_mitra}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.telepon_mitra && formik.errors.telepon_mitra)}
                />
                {formik.touched.telepon_mitra && formik.errors.telepon_mitra && (
                  <Typography variant="small" color="red">
                    {formik.errors.telepon_mitra}
                  </Typography>
                )}
              </div>
            </div>

            <Input
              label="Website"
              name="website_mitra"
              value={formik.values.website_mitra}
              onChange={formik.handleChange}
            />

            <Textarea
              label="Visi & Misi"
              name="visi_misi"
              value={formik.values.visi_misi}
              onChange={formik.handleChange}
              rows={3}
            />

            <div>
              <Typography variant="small" className="font-medium text-gray-700 mb-2 block">
                Logo Mitra
              </Typography>
              <LogoUploader 
                value={logoData}
                onChange={setLogoData}
                onUploadingChange={setUploadingLogo}
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="flex justify-end gap-2">
          <Button onClick={onClose} variant="text" color="gray">
            Batal
          </Button>
          <Button type="submit" color="blue" disabled={isSubmitting || uploadingLogo}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}