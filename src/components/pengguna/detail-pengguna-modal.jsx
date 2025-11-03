"use client";
import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Typography, Button } from "@material-tailwind/react";

export default function DetailPenggunaModal({ open, onClose, user }) {
  if (!user) return null;

  const renderDetails = () => {
    if (user.role === "calon_peserta" && user.calon_peserta) {
      const data = user.calon_peserta;
      return (
        <table className="w-full text-sm">
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className="py-1 pr-4 capitalize font-medium w-1/3">
                {key.replace(/_/g, " ")}
              </td>
              <td className="py-1 text-gray-700">{value}</td>
            </tr>
          ))}
        </table>
      );
    }

    if (user.role === "mitra" && user.mitra) {
      const data = user.mitra;
      return (
        <table className="w-full text-sm">
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className="py-1 pr-4 capitalize font-medium w-1/3">
                {key.replace(/_/g, " ")}
              </td>
              <td className="py-1 text-gray-700">{value}</td>
            </tr>
          ))}
        </table>
      );
    }

    return <Typography color="gray">Tidak ada data detail tersedia.</Typography>;
  };

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Detail {user.role == 'calon_peserta' ? 'calon peserta' : user.role}</DialogHeader>
      <DialogBody divider>{renderDetails()}</DialogBody>
      <DialogFooter>
        <Button color="red" variant="text" onClick={onClose}>
          Tutup
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
