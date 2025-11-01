"use client";

import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";

export default function HapusPelatihanModal({ open, onClose, onConfirm, namaPelatihan }) {
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
        >
          Batal
        </Button>
        <Button
          color="red"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Hapus
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
