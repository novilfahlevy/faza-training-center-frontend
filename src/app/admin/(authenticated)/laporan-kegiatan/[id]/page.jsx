// /home/novilfahlevy/Projects/faza-training-center/src/app/admin/(authenticated)/laporan-kegiatan/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchLaporanKegiatanById } from "@/adminHttpClient";

// Loading Skeleton Component untuk Detail Laporan
function DetailSkeleton() {
  return (
    <div className="mt-8 mb-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      {/* Header Card */}
      <Card className="border border-blue-gray-100 shadow-sm mb-6">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-blue-gray-50 gap-3 sm:gap-0"
        >
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
            <div className="h-8 bg-gray-200 rounded w-full sm:w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-full sm:w-24 animate-pulse"></div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Card */}
      <Card className="border border-blue-gray-100 shadow-sm mb-6">
        <CardBody className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Judul Laporan */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>

            {/* Tanggal Laporan */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>

            {/* Pengunggah */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
              <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Isi Laporan Card */}
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardBody className="p-4 sm:p-6">
          <div>
            <div className="h-6 bg-gray-200 rounded w-28 mb-4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function DetailLaporanKegiatan() {
  const params = useParams();
  const id = params.id;
  const [laporan, setLaporan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setIsLoading(true);
        const response = await fetchLaporanKegiatanById(id);
        setLaporan(response.data);
      } catch (error) {
        console.error("Gagal mengambil data laporan kegiatan:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    if (id) {
      fetchLaporan();
    }
  }, [id]);

  const getUploaderName = () => {
    if (!laporan) return "";
    
    if (laporan.uploader.data_peserta?.nama_lengkap) {
      return laporan.uploader.data_peserta.nama_lengkap;
    } else if (laporan.uploader.data_mitra?.nama_mitra) {
      return laporan.uploader.data_mitra.nama_mitra;
    } else {
      return laporan.uploader.email;
    }
  };

  const getUploaderRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'mitra':
        return 'Mitra';
      case 'peserta':
        return 'Peserta';
      default:
        return role;
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  return (
    <div className="mt-8 mb-8 px-4 sm:px-6 lg:px-8">
      <Breadcrumbs className="mb-4">
        <Link href="/admin/dashboard" className="opacity-60">
          Dashboard
        </Link>
        <Link href="/admin/laporan-kegiatan" className="opacity-60">
          Laporan Kegiatan
        </Link>
        <Typography color="blue-gray">Detail Laporan</Typography>
      </Breadcrumbs>

      {/* Header Card */}
      <Card className="border border-blue-gray-100 shadow-sm mb-6">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-blue-gray-50 gap-3 sm:gap-0"
        >
          <Typography variant="h6" className="text-lg sm:text-xl">Detail Laporan Kegiatan</Typography>
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
            <Link href={`/admin/laporan-kegiatan/${id}/edit`} className="w-full sm:w-auto">
              <Button
                color="blue"
                size="sm"
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Link href="/admin/laporan-kegiatan" className="w-full sm:w-auto">
              <Button
                variant="outlined"
                size="sm"
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Kembali
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      {/* Content Card */}
      <Card className="border border-blue-gray-100 shadow-sm mb-6">
        <CardBody className="p-4 sm:p-6">
          {laporan && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Judul Laporan */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base sm:text-lg">
                  Judul Laporan
                </Typography>
                <Typography variant="paragraph" className="text-sm sm:text-base">
                  {laporan.judul_laporan}
                </Typography>
              </div>

              {/* Tanggal Laporan */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base sm:text-lg">
                  Tanggal Laporan
                </Typography>
                <Typography variant="paragraph" className="text-sm sm:text-base">
                  {new Date(laporan.tanggal_laporan).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </Typography>
              </div>

              {/* Pengunggah */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base sm:text-lg">
                  Pengunggah
                </Typography>
                <div className="flex flex-wrap items-center gap-2">
                  <Typography variant="paragraph" className="text-sm sm:text-base">
                    {getUploaderName()}
                  </Typography>
                  <Chip
                    variant="ghost"
                    size="sm"
                    value={getUploaderRole(laporan.uploader.role)}
                    color={
                      laporan.uploader.role === 'admin' ? 'red' :
                      laporan.uploader.role === 'mitra' ? 'blue' : 'green'
                    }
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Isi Laporan Card */}
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardBody className="p-4 sm:p-6">
          {laporan && (
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-4 text-base sm:text-lg">
                Isi Laporan
              </Typography>
              <div
                className="prose prose-sm max-w-none text-sm sm:text-base overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: laporan.isi_laporan }}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}