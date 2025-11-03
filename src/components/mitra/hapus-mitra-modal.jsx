"use client";

import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

export default function HapusMitraModal({ open, onClose, mitra }) {
  const handleDelete = () => {
    console.log("Hapus mitra:", mitra?.mitra_id);
    onClose();
  };

  return (
    <Dialog open={open} handler={onClose} size="xs">
      <DialogHeader>Hapus Mitra</DialogHeader>
      <DialogBody divider>
        <Typography>
          Apakah Anda yakin ingin menghapus mitra{" "}
          <strong>{mitra?.nama_mitra}</strong>?
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>Batal</Button>
        <Button color="red" onClick={handleDelete}>Hapus</Button>
      </DialogFooter>
    </Dialog>
  );
}
