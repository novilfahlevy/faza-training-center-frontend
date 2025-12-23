"use client";

import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function DetailMitraModal({ open, onClose, mitra }) {
  if (!mitra) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="!max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader className="sticky top-0 z-10 bg-white border-b border-blue-gray-50">
        <Typography variant="h4">{mitra.nama_mitra}</Typography>
      </DialogHeader>

      <DialogBody divider className="overflow-y-auto flex-1 space-y-6">
        {/* Logo */}
        {mitra.logo_mitra && (
          <div className="flex justify-center bg-blue-gray-50 p-6 rounded-lg">
            <img
              src={mitra.logo_mitra}
              alt={mitra.nama_mitra}
              className="max-h-48 max-w-48 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Deskripsi */}
        <div>
          <Typography variant="h6" className="mb-2 text-blue-gray-800">
            Tentang Mitra
          </Typography>
          <Typography variant="paragraph" className="text-blue-gray-700 leading-relaxed">
            {mitra.deskripsi_mitra || "Tidak ada deskripsi"}
          </Typography>
        </div>

        {/* Visi & Misi */}
        {mitra.visi_misi && (
          <div>
            <Typography variant="h6" className="mb-2 text-blue-gray-800">
              Visi & Misi
            </Typography>
            <Typography variant="paragraph" className="text-blue-gray-700 leading-relaxed">
              {mitra.visi_misi}
            </Typography>
          </div>
        )}

        {/* Informasi Kontak */}
        <div>
          <Typography variant="h6" className="mb-3 text-blue-gray-800">
            Informasi Kontak
          </Typography>
          <div className="space-y-3">
            {mitra.alamat_mitra && (
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <Typography variant="small" className="font-medium text-blue-gray-600">
                    Alamat
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-800">
                    {mitra.alamat_mitra}
                  </Typography>
                </div>
              </div>
            )}

            {mitra.telepon_mitra && (
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <Typography variant="small" className="font-medium text-blue-gray-600">
                    Telepon
                  </Typography>
                  <a
                    href={`tel:${mitra.telepon_mitra}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {mitra.telepon_mitra}
                  </a>
                </div>
              </div>
            )}

            {mitra.website_mitra && (
              <div className="flex items-center gap-3">
                <GlobeAltIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <Typography variant="small" className="font-medium text-blue-gray-600">
                    Website
                  </Typography>
                  <a
                    href={mitra.website_mitra}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all"
                  >
                    {mitra.website_mitra}
                  </a>
                </div>
              </div>
            )}

            {mitra.pengguna?.email && (
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <Typography variant="small" className="font-medium text-blue-gray-600">
                    Email
                  </Typography>
                  <a
                    href={`mailto:${mitra.pengguna.email}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {mitra.pengguna.email}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="sticky bottom-0 z-10 bg-white border-t border-blue-gray-50">
        <Button color="blue" variant="text" onClick={onClose}>
          Tutup
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
