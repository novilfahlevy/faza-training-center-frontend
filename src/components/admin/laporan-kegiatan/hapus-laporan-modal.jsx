import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const HapusLaporanModal = ({ open, onClose, onConfirm, judulLaporan }) => {
  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader className="flex items-center gap-3">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
        <Typography variant="h5" color="blue-gray">
          Konfirmasi Hapus
        </Typography>
      </DialogHeader>
      <DialogBody>
        <Typography color="gray" className="font-normal">
          Apakah Anda yakin ingin menghapus laporan kegiatan{" "}
          <span className="font-semibold">"{judulLaporan}"</span>? Tindakan ini
          tidak dapat dibatalkan.
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="blue-gray" onClick={onClose}>
          Batal
        </Button>
        <Button variant="gradient" color="red" onClick={onConfirm}>
          Hapus
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default HapusLaporanModal;