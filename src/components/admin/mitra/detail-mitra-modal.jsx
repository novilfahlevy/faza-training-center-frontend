"use client";

import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

export default function DetailMitraModal({ open, onClose, mitra }) {
  if (!mitra) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader>Detail Mitra</DialogHeader>
      <DialogBody divider className="space-y-2">
        <div>
          <Typography variant="small" color="gray">Nama Mitra:</Typography>
          <Typography>{mitra.nama_mitra}</Typography>
        </div>
        <div>
          <Typography variant="small" color="gray">Deskripsi:</Typography>
          <Typography>{mitra.deskripsi_mitra}</Typography>
        </div>
        <div>
          <Typography variant="small" color="gray">Alamat:</Typography>
          <Typography>{mitra.alamat_mitra}</Typography>
        </div>
        <div>
          <Typography variant="small" color="gray">Telepon:</Typography>
          <Typography>{mitra.telepon_mitra}</Typography>
        </div>
        <div>
          <Typography variant="small" color="gray">Email:</Typography>
          <Typography>{mitra.email_mitra}</Typography>
        </div>
        <div>
          <Typography variant="small" color="gray">Website:</Typography>
          <a href={mitra.website_mitra} target="_blank" className="text-blue-600 hover:underline">
            {mitra.website_mitra}
          </a>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button color="blue" onClick={onClose}>Tutup</Button>
      </DialogFooter>
    </Dialog>
  );
}
