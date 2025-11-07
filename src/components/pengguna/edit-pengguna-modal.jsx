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
  Select,
  Option,
} from "@material-tailwind/react";
import httpClient from "@/httpClient";
import { toast } from "react-toastify";

export default function EditPenggunaModal({ open, onClose, user }) {
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    mitra: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        role: user.role || "",
        mitra: user.mitra || {},
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMitraChange = (e) =>
    setFormData({
      ...formData,
      mitra: { ...formData.mitra, [e.target.name]: e.target.value },
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await httpClient.put(`/v1/pengguna/${user.user_id}`, formData);
      toast.success("✅ Data pengguna berhasil diperbarui!");
      onClose(true); // refresh tabel di parent
    } catch (error) {
      console.error("❌ Gagal memperbarui data pengguna:", error);
      toast.error("Gagal memperbarui data pengguna!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="!max-h-[90vh] flex flex-col overflow-hidden rounded-xl"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 bg-white overflow-hidden"
      >
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
          <h5 className="text-lg font-semibold">Edit Pengguna</h5>
        </DialogHeader>

        {/* Scrollable Body */}
        <DialogBody
          divider={false}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
        >
          <div className="space-y-4">
            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Select
              label="Peran"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
            >
              <Option value="admin">Admin</Option>
              <Option value="mitra">Mitra</Option>
            </Select>
          </div>

          {formData.role === "mitra" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div className="md:col-span-2">
                <h6 className="font-semibold text-gray-700">Data Mitra</h6>
              </div>

              <Input
                label="Nama Mitra"
                name="nama_mitra"
                value={formData.mitra.nama_mitra || ""}
                onChange={handleMitraChange}
              />

              <Input
                label="Email Mitra"
                name="email_mitra"
                value={formData.mitra.email_mitra || ""}
                onChange={handleMitraChange}
              />

              <Textarea
                label="Deskripsi Mitra"
                name="deskripsi_mitra"
                value={formData.mitra.deskripsi_mitra || ""}
                onChange={handleMitraChange}
                className="md:col-span-2"
              />

              <Textarea
                label="Alamat Mitra"
                name="alamat_mitra"
                value={formData.mitra.alamat_mitra || ""}
                onChange={handleMitraChange}
                className="md:col-span-2"
              />

              <Input
                label="Telepon Mitra"
                name="telepon_mitra"
                value={formData.mitra.telepon_mitra || ""}
                onChange={handleMitraChange}
              />

              <Input
                label="Website Mitra"
                name="website_mitra"
                value={formData.mitra.website_mitra || ""}
                onChange={handleMitraChange}
              />
            </div>
          )}
        </DialogBody>

        {/* Sticky Footer */}
        <DialogFooter className="sticky bottom-0 z-20 bg-white border-t border-gray-200 shadow-sm px-6 py-3 flex justify-end">
          <Button
            variant="text"
            color="red"
            onClick={onClose}
            className="mr-2"
          >
            Batal
          </Button>
          <Button type="submit" color="green" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
