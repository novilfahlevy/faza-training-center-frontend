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
    if (user && user.role === "mitra") setFormData(user.mitra || {});
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("Update data mitra:", formData);
    onClose();
  };

  if (!user || user.role !== "mitra") return null;

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>Edit Data Mitra</DialogHeader>
      <DialogBody divider className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nama Mitra" name="nama_mitra" onChange={handleChange} value={formData.nama_mitra || ""} />
          <Input label="Email Mitra" name="email_mitra" onChange={handleChange} value={formData.email_mitra || ""} />
          <Textarea label="Deskripsi Mitra" name="deskripsi_mitra" onChange={handleChange} value={formData.deskripsi_mitra || ""} />
          <Textarea label="Alamat Mitra" name="alamat_mitra" onChange={handleChange} value={formData.alamat_mitra || ""} />
          <Input label="Telepon Mitra" name="telepon_mitra" onChange={handleChange} value={formData.telepon_mitra || ""} />
          <Input label="Website Mitra" name="website_mitra" onChange={handleChange} value={formData.website_mitra || ""} />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-2">
          Batal
        </Button>
        <Button color="green" onClick={handleSubmit}>
          Simpan
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
