"use client";
import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function DetailPenggunaModal({ open, onClose, user }) {
  if (!user) return null;

  const renderDetails = () => {
    const data =
      user.role === "calon_peserta"
        ? user.calon_peserta
        : user.role === "mitra"
        ? user.mitra
        : null;

    if (!data)
      return <Typography color="gray">Tidak ada data detail tersedia.</Typography>;

    return (
      <table className="w-full text-sm">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className="py-1 pr-4 capitalize font-medium w-1/3">
                {key.replace(/_/g, " ")}
              </td>
              <td className="py-1 text-gray-700 break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="!max-h-[90vh] flex flex-col overflow-hidden"
    >
      <DialogHeader className="sticky top-0 z-10 bg-white border-b border-blue-gray-50 shadow-sm">
        Detail {user.role === "calon_peserta" ? "Calon Peserta" : user.role}
      </DialogHeader>

      <DialogBody divider className="overflow-y-auto px-4 flex-1">
        {renderDetails()}
      </DialogBody>

      <DialogFooter className="sticky bottom-0 z-10 bg-white border-t border-blue-gray-50 shadow-sm">
        <Button color="red" variant="text" onClick={onClose}>
          Tutup
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
