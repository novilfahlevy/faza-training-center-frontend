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

export default function HapusPelatihanModal({ open, onClose, onConfirm, namaPelatihan }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <Dialog open={open} handler={onClose} size="sm" className="p-2">
      <DialogHeader>
        <Typography variant="h6" color="red">
          Konfirmasi Hapus
        </Typography>
      </DialogHeader>

      <DialogBody divider>
        <Typography color="blue-gray" className="text-base">
          Apakah kamu yakin ingin menghapus pelatihan{" "}
          <span className="font-semibold text-red-500">
            {namaPelatihan || "ini"}
          </span>
          ? <br />
          Tindakan ini tidak dapat dibatalkan.
        </Typography>
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2">
        <Button
          variant="text"
          color="blue-gray"
          onClick={onClose}
          disabled={loading}
        >
          Batal
        </Button>
        <Button
          color="red"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Menghapus..." : "Hapus"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
