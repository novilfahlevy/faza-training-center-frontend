"use client";
import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function TambahPenggunaModal({ open, onClose }) {
  // Skema validasi menggunakan Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Format email tidak valid").required("Email wajib diisi"),
    password: Yup.string().min(6, "Minimal 6 karakter").required("Password wajib diisi"),
    role: Yup.string().required("Role wajib dipilih"),
    // Validasi khusus mitra
    nama_mitra: Yup.string().when("role", {
      is: "mitra",
      then: (schema) => schema.required("Nama Mitra wajib diisi"),
    }),
    email_mitra: Yup.string().when("role", {
      is: "mitra",
      then: (schema) => schema.email("Format email tidak valid").required("Email Mitra wajib diisi"),
    }),
    telepon_mitra: Yup.string().when("role", {
      is: "mitra",
      then: (schema) => schema.required("Telepon Mitra wajib diisi"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
      nama_mitra: "",
      email_mitra: "",
      deskripsi_mitra: "",
      alamat_mitra: "",
      telepon_mitra: "",
      website_mitra: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("✅ Data pengguna baru siap dikirim:", values);
      alert("Data pengguna berhasil disiapkan untuk dikirim!");
      onClose();
    },
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } = formik;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="!max-h-[90vh] overflow-y-auto flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <DialogHeader className="sticky top-0 z-10 bg-white border-b border-blue-gray-50">Tambah Pengguna Baru</DialogHeader>
        <DialogBody divider className="space-y-4 flex-1 overflow-y-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              {touched.email && errors.email && (
                <Typography color="red" className="text-xs mt-1 ml-1">
                  {errors.email}
                </Typography>
              )}
            </div>

            <div>
              <Input
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
              />
              {touched.password && errors.password && (
                <Typography color="red" className="text-xs mt-1 ml-1">
                  {errors.password}
                </Typography>
              )}
            </div>
          </div>

          <div>
            <Select
              label="Role"
              value={values.role}
              onChange={(val) => setFieldValue("role", val)}
            >
              <Option value="admin">Admin</Option>
              <Option value="mitra">Mitra</Option>
            </Select>
            {touched.role && errors.role && (
              <Typography color="red" className="text-xs mt-1 ml-1">
                {errors.role}
              </Typography>
            )}
          </div>

          {/* Form Mitra */}
          {values.role === "mitra" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Nama Mitra"
                  name="nama_mitra"
                  value={values.nama_mitra}
                  onChange={handleChange}
                />
                {touched.nama_mitra && errors.nama_mitra && (
                  <Typography color="red" className="text-xs mt-1 ml-1">
                    {errors.nama_mitra}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Email Mitra"
                  name="email_mitra"
                  value={values.email_mitra}
                  onChange={handleChange}
                />
                {touched.email_mitra && errors.email_mitra && (
                  <Typography color="red" className="text-xs mt-1 ml-1">
                    {errors.email_mitra}
                  </Typography>
                )}
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Deskripsi Mitra"
                  name="deskripsi_mitra"
                  value={values.deskripsi_mitra}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Alamat Mitra"
                  name="alamat_mitra"
                  value={values.alamat_mitra}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Input
                  label="Telepon Mitra"
                  name="telepon_mitra"
                  value={values.telepon_mitra}
                  onChange={handleChange}
                />
                {touched.telepon_mitra && errors.telepon_mitra && (
                  <Typography color="red" className="text-xs mt-1 ml-1">
                    {errors.telepon_mitra}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Website Mitra"
                  name="website_mitra"
                  value={values.website_mitra}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="sticky bottom-0 z-10 bg-white border-t border-blue-gray-50">
          <Button variant="text" color="red" onClick={onClose} className="mr-2">
            Batal
          </Button>
          <Button type="submit" color="green">
            Simpan
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
