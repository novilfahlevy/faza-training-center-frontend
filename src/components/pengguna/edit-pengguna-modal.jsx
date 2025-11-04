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

export default function EditPenggunaModal({ open, onClose, user }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user && user.role === "mitra") {
      setFormData(user.mitra || {});
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("✅ Data mitra diperbarui:", formData);
    alert("Data mitra siap dikirim untuk pembaruan!");
    onClose();
  };

  if (!user || user.role !== "mitra") return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="!max-h-[90vh] overflow-hidden flex flex-col"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        {/* Header Sticky */}
        <DialogHeader className="sticky top-0 z-10 bg-white border-b border-blue-gray-50 shadow-sm">
          Edit Data Mitra
        </DialogHeader>

        {/* Body Scrollable */}
        <DialogBody divider className="space-y-4 flex-1 overflow-y-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Nama Mitra"
                name="nama_mitra"
                value={formData.nama_mitra || ""}
                onChange={handleChange}
              />
              {!formData.nama_mitra && (
                <Typography color="red" className="text-xs mt-1 ml-1">
                  Nama Mitra wajib diisi
                </Typography>
              )}
            </div>

            <div>
              <Input
                label="Email Mitra"
                name="email_mitra"
                value={formData.email_mitra || ""}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Deskripsi Mitra"
                name="deskripsi_mitra"
                value={formData.deskripsi_mitra || ""}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Alamat Mitra"
                name="alamat_mitra"
                value={formData.alamat_mitra || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Telepon Mitra"
                name="telepon_mitra"
                value={formData.telepon_mitra || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Website Mitra"
                name="website_mitra"
                value={formData.website_mitra || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </DialogBody>

        {/* Footer Sticky */}
        <DialogFooter className="sticky bottom-0 z-10 bg-white border-t border-blue-gray-50 shadow-sm">
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
