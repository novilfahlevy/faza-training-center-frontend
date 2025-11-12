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
import httpClient from "@/adminHttpClient";
import { toast } from "react-toastify";

export default function EditPenggunaModal({ open, onClose, user, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jika user bukan mitra, jangan tampilkan dialog
  useEffect(() => {
    if (user && user.role !== "mitra") {
      toast.info("Hanya data mitra yang dapat diedit di sini.");
      onClose();
    }
  }, [user]);

  // Skema validasi hanya untuk mitra
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    nama_mitra: Yup.string().required("Nama Mitra wajib diisi"),
    deskripsi_mitra: Yup.string().required("Deskripsi wajib diisi"),
    alamat_mitra: Yup.string().required("Alamat wajib diisi"),
    telepon_mitra: Yup.string().required("Telepon wajib diisi"),
    website_mitra: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      email: user?.email ?? "",
      nama_mitra: user?.data_mitra?.nama_mitra ?? "",
      deskripsi_mitra: user?.data_mitra?.deskripsi_mitra ?? "",
      alamat_mitra: user?.data_mitra?.alamat_mitra ?? "",
      telepon_mitra: user?.data_mitra?.telepon_mitra ?? "",
      website_mitra: user?.data_mitra?.website_mitra ?? "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = {
          role: "mitra",
          email: values.email,
          data_mitra: {
            nama_mitra: values.nama_mitra,
            deskripsi_mitra: values.deskripsi_mitra,
            alamat_mitra: values.alamat_mitra,
            telepon_mitra: values.telepon_mitra,
            website_mitra: values.website_mitra,
          },
        };

        const response = await httpClient.put(
          `/v1/pengguna/${user.pengguna_id}`,
          payload
        );

        toast.success(response.data.message || "Data mitra berhasil diperbarui!");
        if (onSuccess) onSuccess();
        onClose();
      } catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        toast.error(
          error.response?.data?.message || "Gagal memperbarui data mitra."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog
      open={open && user?.role === "mitra"}
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
          <div>
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

            <div>
              <Input
                label="Nama Mitra"
                name="nama_mitra"
                value={formik.values.nama_mitra}
                onChange={formik.handleChange}
                error={Boolean(
                  formik.touched.nama_mitra && formik.errors.nama_mitra
                )}
              />
              {formik.touched.nama_mitra && formik.errors.nama_mitra && (
                <Typography variant="small" color="red">
                  {formik.errors.nama_mitra}
                </Typography>
              )}
            </div>

            <div>
              <Textarea
                label="Deskripsi"
                name="deskripsi_mitra"
                value={formik.values.deskripsi_mitra}
                onChange={formik.handleChange}
                error={Boolean(
                  formik.touched.deskripsi_mitra && formik.errors.deskripsi_mitra
                )}
              />
              {formik.touched.deskripsi_mitra &&
                formik.errors.deskripsi_mitra && (
                  <Typography variant="small" color="red">
                    {formik.errors.deskripsi_mitra}
                  </Typography>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Alamat"
                  name="alamat_mitra"
                  value={formik.values.alamat_mitra}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.alamat_mitra && formik.errors.alamat_mitra
                  )}
                />
                {formik.touched.alamat_mitra &&
                  formik.errors.alamat_mitra && (
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
                  error={Boolean(
                    formik.touched.telepon_mitra &&
                      formik.errors.telepon_mitra
                  )}
                />
                {formik.touched.telepon_mitra &&
                  formik.errors.telepon_mitra && (
                    <Typography variant="small" color="red">
                      {formik.errors.telepon_mitra}
                    </Typography>
                  )}
              </div>
            </div>

            <div>
              <Input
                label="Website"
                name="website_mitra"
                value={formik.values.website_mitra}
                onChange={formik.handleChange}
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="flex justify-end gap-2">
          <Button onClick={onClose} variant="text" color="gray">
            Batal
          </Button>
          <Button type="submit" color="blue" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
