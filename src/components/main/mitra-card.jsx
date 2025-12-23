"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

export default function MitraCard({ mitra }) {
  return (
    <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow border border-blue-gray-100">
      {/* Logo Section */}
      <div className="bg-gradient-to-b from-blue-gray-50 to-blue-gray-100 p-6 flex items-center justify-center min-h-[200px]">
        {mitra.logo_mitra ? (
          <img
            src={mitra.logo_mitra}
            alt={mitra.nama_mitra}
            className="max-h-40 max-w-40 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-32 h-32 bg-blue-gray-200 rounded-lg flex items-center justify-center">
            <Typography variant="small" className="text-blue-gray-500">
              No Logo
            </Typography>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardBody className="flex-grow">
        <Typography variant="h5" className="mb-2 line-clamp-2">
          {mitra.nama_mitra}
        </Typography>

        <Typography
          variant="small"
          color="blue-gray"
          className="mb-4 line-clamp-3 text-gray-600"
        >
          {mitra.deskripsi_mitra || "Tidak ada deskripsi"}
        </Typography>

        {/* Contact Info */}
        <div className="space-y-2">
          {mitra.alamat_mitra && (
            <div className="flex items-start gap-2">
              <MapPinIcon className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <Typography variant="small" className="text-blue-gray-700 line-clamp-2">
                {mitra.alamat_mitra}
              </Typography>
            </div>
          )}

          {mitra.telepon_mitra && (
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <Typography variant="small" className="text-blue-gray-700">
                {mitra.telepon_mitra}
              </Typography>
            </div>
          )}

          {mitra.website_mitra && (
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <a
                href={mitra.website_mitra}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm truncate"
              >
                {mitra.website_mitra}
              </a>
            </div>
          )}
        </div>
      </CardBody>

      {/* Footer Section */}
      <CardFooter className="pt-0 border-t border-blue-gray-50">
        <Link href={`/mitra/${mitra.mitra_id}`} className="w-full">
          <Button
            variant="text"
            color="blue"
            className="w-full"
          >
            Lihat Selengkapnya
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
