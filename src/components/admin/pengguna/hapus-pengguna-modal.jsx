"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import httpClient from "@/httpClient";
import { toast } from "react-toastify";

export default function HapusPenggunaModal({ open, onClose, selectedUser, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      await httpClient.delete(`/v1/pengguna/${selectedUser.pengguna_id}`);
      toast.success("Pengguna berhasil dihapus!");
      onClose();
      if (onSuccess) onSuccess(); // 🔁 Refresh data di halaman utama
    } catch (error) {
      console.error("❌ Gagal menghapus pengguna:", error);
      toast.error("Gagal menghapus pengguna!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="xs">
      <DialogHeader>Hapus Pengguna</DialogHeader>
      <DialogBody divider>
        <Typography>
          Apakah Anda yakin ingin menghapus pengguna{" "}
          <span className="font-semibold text-red-600">{selectedUser?.email}</span>?
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose} disabled={isDeleting}>
          Batal
        </Button>
        <Button color="red" onClick={handleDelete} disabled={isDeleting} className="ml-2">
          {isDeleting ? "Menghapus..." : "Hapus"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
