"use client";

import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Textarea } from "@material-tailwind/react";
import { useState } from "react";

export default function TambahMitraModal({ open, onClose }) {
  const [form, setForm] = useState({
    nama_mitra: "",
    deskripsi_mitra: "",
    alamat_mitra: "",
    telepon_mitra: "",
    email_mitra: "",
    website_mitra: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("Tambah mitra:", form);
    onClose();
  };

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Tambah Mitra</DialogHeader>
      <DialogBody divider className="space-y-3">
        <Input label="Nama Mitra" name="nama_mitra" value={form.nama_mitra} onChange={handleChange} />
        <Textarea label="Deskripsi Mitra" name="deskripsi_mitra" value={form.deskripsi_mitra} onChange={handleChange} />
        <Textarea label="Alamat Mitra" name="alamat_mitra" value={form.alamat_mitra} onChange={handleChange} />
        <Input label="Telepon Mitra" name="telepon_mitra" value={form.telepon_mitra} onChange={handleChange} />
        <Input label="Email Mitra" name="email_mitra" value={form.email_mitra} onChange={handleChange} />
        <Input label="Website Mitra" name="website_mitra" value={form.website_mitra} onChange={handleChange} />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>Batal</Button>
        <Button color="blue" onClick={handleSubmit}>Simpan</Button>
      </DialogFooter>
    </Dialog>
  );
}
