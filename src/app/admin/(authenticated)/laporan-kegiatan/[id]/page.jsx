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
    <div className="mt-12">
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 border-b border-blue-gray-50"
        >
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </CardHeader>

        <CardBody className="p-6">
          <div className="space-y-6">
            {/* Judul Laporan */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* Tanggal Laporan */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>

            {/* Pengunggah */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
              <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              </div>
            </div>

            {/* Isi Laporan */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
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
    <div className="mt-12">
      <Breadcrumbs className="mb-4">
        <Link href="/admin/dashboard" className="opacity-60">
          Dashboard
        </Link>
        <Link href="/admin/laporan-kegiatan" className="opacity-60">
          Laporan Kegiatan
        </Link>
        <Typography color="blue-gray">Detail Laporan</Typography>
      </Breadcrumbs>

      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 border-b border-blue-gray-50"
        >
          <Typography variant="h6">Detail Laporan Kegiatan</Typography>
          <div className="flex gap-2">
            <Link href={`/admin/laporan-kegiatan/${id}/edit`}>
              <Button
                color="blue"
                size="sm"
                className="flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Link href="/admin/laporan-kegiatan">
              <Button
                variant="outlined"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Kembali
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardBody className="p-6">
          {laporan && (
            <div className="space-y-6">
              {/* Judul Laporan */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Judul Laporan
                </Typography>
                <Typography variant="paragraph">
                  {laporan.judul_laporan}
                </Typography>
              </div>

              {/* Tanggal Laporan */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Tanggal Laporan
                </Typography>
                <Typography variant="paragraph">
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
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Pengunggah
                </Typography>
                <div className="flex items-center gap-2">
                  <Typography variant="paragraph">
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

              {/* Isi Laporan */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Isi Laporan
                </Typography>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: laporan.isi_laporan }}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}