"use client";
import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

export default function HapusPenggunaModal({ open, onClose, selectedUser }) {
  const handleDelete = () => {
    console.log("Hapus pengguna:", selectedUser);
    onClose();
  };

  return (
    <Dialog open={open} handler={onClose} size="xs">
      <DialogHeader>Hapus Pengguna</DialogHeader>
      <DialogBody divider>
        <Typography>
          Apakah Anda yakin ingin menghapus pengguna{" "}
          <span className="font-semibold">{selectedUser?.email}</span>?
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>
          Batal
        </Button>
        <Button color="red" onClick={handleDelete} className="ml-2">
          Hapus
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
