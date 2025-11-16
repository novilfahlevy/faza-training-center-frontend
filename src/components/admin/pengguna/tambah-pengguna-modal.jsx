// /home/novilfahlevy/Projects/faza-training-center/src/components/admin/pengguna/tambah-pengguna-modal.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createPengguna } from "@/adminHttpClient"; // 🔹 Gunakan fungsi baru
import { toast } from "react-toastify";

export default function TambahPenggunaModal({ open, onClose, onSuccess }) {
  const [isAdding, setIsAdding] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Format email tidak valid").required("Email wajib diisi"),
    password: Yup.string().min(6, "Password minimal 6 karakter").required("Password wajib diisi"),
    role: Yup.string().oneOf(["admin", "mitra"]).required("Role wajib dipilih"),

    // Validasi khusus untuk mitra
    nama_mitra: Yup.string().when("role", {
      is: "mitra",
      then: (schema) => schema.required("Nama Mitra wajib diisi"),
      otherwise: (schema) => schema.nullable(),
    }),
    deskripsi_mitra: Yup.string().when("role", {
      is: "mitra",
      then: (schema) => schema.required("Deskripsi wajib diisi"),
      otherwise: (schema) => schema.nullable(),
    }),
    alamat_mitra: Yup.string().when("role", {
      is: "mitra",
      then: (schema) => schema.required("Alamat wajib diisi"),
      otherwise: (schema) => schema.nullable(),
    }),
    telepon_mitra: Yup.string().when("role", {
      is: "mitra",
      then: (schema) => schema.required("Telepon wajib diisi"),
      otherwise: (schema) => schema.nullable(),
    }),
    website_mitra: Yup.string().nullable()
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "admin",
      // Field untuk mitra
      nama_mitra: "",
      deskripsi_mitra: "",
      alamat_mitra: "",
      telepon_mitra: "",
      website_mitra: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsAdding(true);
      try {
        // 🔹 Gunakan fungsi createPengguna dari adminHttpClient
        const response = await createPengguna(values);
        toast.success(response.data.message || "Pengguna berhasil dibuat!");
        resetForm();
        onClose();
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Gagal membuat pengguna:", error);
        toast.error(error.response?.data?.message || "Gagal membuat pengguna.");
      } finally {
        setIsAdding(false);
      }
    },
  });

  // Reset field mitra jika role berubah
  useEffect(() => {
    if (formik.values.role !== "mitra") {
      formik.setValues({
        ...formik.values,
        nama_mitra: "",
        deskripsi_mitra: "",
        alamat_mitra: "",
        telepon_mitra: "",
        website_mitra: "",
      });
    }
  }, [formik.values.role]);

  return (
    <Dialog open={open} handler={onClose} size="lg" className="!max-h-[90vh] overflow-y-auto">
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5">Tambah Pengguna Baru</Typography>
        <Button variant="text" onClick={onClose}>
          <span>X</span>
        </Button>
      </DialogHeader>

      <form onSubmit={formik.handleSubmit}>
        <DialogBody className="flex flex-col gap-6">
          {/* --- Field Umum --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
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

            <div>
              <Input
                type="password"
                label="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.password && formik.errors.password)}
              />
              {formik.touched.password && formik.errors.password && (
                <Typography variant="small" color="red">
                  {formik.errors.password}
                </Typography>
              )}
            </div>
          </div>

          <div>
            <Select
              label="Role"
              value={formik.values.role}
              onChange={(value) => formik.setFieldValue("role", value)}
            >
              <Option value="admin">Admin</Option>
              <Option value="mitra">Mitra</Option>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <Typography variant="small" color="red">
                {formik.errors.role}
              </Typography>
            )}
          </div>

          {/* --- Field Khusus Mitra --- */}
          {formik.values.role === "mitra" && (
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
                  error={Boolean(formik.touched.nama_mitra && formik.errors.nama_mitra)}
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
                  rows={3}
                  error={Boolean(formik.touched.deskripsi_mitra && formik.errors.deskripsi_mitra)}
                />
                {formik.touched.deskripsi_mitra && formik.errors.deskripsi_mitra && (
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

              <div>
                <Input
                  label="Website"
                  name="website_mitra"
                  value={formik.values.website_mitra}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="flex justify-end gap-2">
          <Button onClick={onClose} variant="text" color="gray">
            Batal
          </Button>
          <Button type="submit" color="blue" disabled={isAdding}>
            {isAdding ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}