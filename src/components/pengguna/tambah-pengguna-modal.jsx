"use client";
import React, { useState } from "react";
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

export default function TambahPenggunaModal({ open, onClose }) {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("Data pengguna baru:", { role, ...formData });
    onClose();
  };

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>Tambah Pengguna Baru</DialogHeader>
      <DialogBody divider className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="email"
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            required
          />
        </div>

        <Select label="Role" value={role} onChange={(val) => setRole(val)}>
          <Option value="admin">Admin</Option>
          <Option value="mitra">Mitra</Option>
        </Select>

        {/* Calon Peserta Form */}
        {/* {role === "calon_peserta" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nama Lengkap" name="nama_lengkap" onChange={handleChange} />
            <Input label="Tempat Lahir" name="tempat_lahir" onChange={handleChange} />
            <Input type="date" label="Tanggal Lahir" name="tanggal_lahir" onChange={handleChange} />
            <Select label="Jenis Kelamin" name="jenis_kelamin" onChange={(val) => handleChange({ target: { name: 'jenis_kelamin', value: val } })}>
              <Option value="L">Laki-laki</Option>
              <Option value="P">Perempuan</Option>
            </Select>
            <Textarea label="Alamat" name="alamat" onChange={handleChange} />
            <Input label="Profesi" name="profesi" onChange={handleChange} />
            <Input label="Instansi" name="instansi" onChange={handleChange} />
            <Input label="No. Reg KES" name="no_reg_kes" onChange={handleChange} />
            <Input label="No. Telepon" name="no_telp" onChange={handleChange} />
          </div>
        )} */}

        {/* Mitra Form */}
        {role === "mitra" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nama Mitra" name="nama_mitra" onChange={handleChange} />
            <Input label="Email Mitra" name="email_mitra" onChange={handleChange} />
            <Textarea label="Deskripsi Mitra" name="deskripsi_mitra" onChange={handleChange} />
            <Textarea label="Alamat Mitra" name="alamat_mitra" onChange={handleChange} />
            <Input label="Telepon Mitra" name="telepon_mitra" onChange={handleChange} />
            <Input label="Website Mitra" name="website_mitra" onChange={handleChange} />
          </div>
        )}
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
