"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Input,
  Chip,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowRightIcon,
  ArrowLeftIcon as OutlineArrowLeft,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import httpClient from "@/httpClient";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination";
import LoadingOverlay from "@/components/loading-overlay";

// 🔹 Utility: debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function PesertaPelatihanPage({ params }) {
  const { id } = params;

  const [pelatihan, setPelatihan] = useState(null);
  const [pesertaList, setPesertaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPelatihanLoading, setIsPelatihanLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch detail pelatihan
  const fetchPelatihanDetail = async () => {
    try {
      setIsPelatihanLoading(true);
      const res = await httpClient.get(`/v1/pelatihan/${id}`);
      setPelatihan(res.data);
    } catch (error) {
      console.error("Gagal mengambil detail pelatihan:", error);
      toast.error("Gagal memuat detail pelatihan.");
    } finally {
      setIsPelatihanLoading(false);
    }
  };

  // 🔹 Fetch peserta pelatihan
  const fetchPeserta = async (page = 1, perPage = 5, query = "") => {
    try {
      setIsLoading(true);
      const res = await httpClient.get(`/v1/pelatihan/${id}/peserta`, {
        params: { page: page - 1, size: perPage, search: query || undefined },
      });

      const { records, totalPages } = res.data;

      const peserta = records.map((item) => ({
        peserta_id: item.peserta_id,
        nama_lengkap: item.peserta?.nama_lengkap,
        no_hp: item.peserta?.no_telp,
        email: item.peserta?.pengguna?.email,
        status_pendaftaran: item.status_pendaftaran || "Terdaftar",
      }));

      setPesertaList(peserta);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Gagal mengambil data peserta:", error);
      toast.error("Gagal memuat data peserta pelatihan.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔸 Debounced search handler
  const debouncedFetch = useCallback(
    debounce((query) => {
      fetchPeserta(1, limit, query);
    }, 500),
    [limit]
  );

  useEffect(() => {
    fetchPelatihanDetail();
    fetchPeserta(activePage, limit, search);
  }, [activePage, limit]);

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setActivePage(1);
  };

  const next = () => {
    if (activePage < totalPages) setActivePage((prev) => prev + 1);
  };

  const prev = () => {
    if (activePage > 1) setActivePage((prev) => prev - 1);
  };

  const handleDelete = (pesertaId) => {
    toast.info(`Fitur hapus peserta #${pesertaId} akan segera tersedia.`);
  };

  return (
    <div className="mt-10 mb-10">
      {/* 🔹 HERO SECTION: Info Utama Pelatihan */}
      <Card className="border border-blue-gray-100 shadow-lg mb-8 overflow-hidden">
        <CardBody className="p-0">
          {isPelatihanLoading ? (
            <div className="flex items-center justify-center h-64">
              <Typography color="gray">Memuat detail pelatihan...</Typography>
            </div>
          ) : pelatihan ? (
            <div className="flex flex-col lg:flex-row">
              {/* Gambar Thumbnail */}
              <div className="w-full lg:w-1/3 h-64 lg:h-auto">
                <img
                  src={pelatihan.thumbnail_url || 'https://via.placeholder.com/400x300.png?text=No+Image'}
                  alt={pelatihan.nama_pelatihan}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Konten Utama */}
              <div className="w-full lg:w-2/3 p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <Typography variant="h3" color="blue-gray" className="mb-4">
                    {pelatihan.nama_pelatihan}
                  </Typography>
                  
                  {/* Metadata dalam bentuk Chip */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Chip
                      variant="ghost"
                      value={new Date(pelatihan.tanggal_pelatihan).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      icon={<CalendarDaysIcon className="h-4 w-4" />}
                      className="rounded-full"
                    />
                    <Chip
                      variant="ghost"
                      value={pelatihan.lokasi_pelatihan}
                      icon={<MapPinIcon className="h-4 w-4" />}
                      className="rounded-full"
                    />
                    {pelatihan.mitra && (
                      <Chip
                        variant="ghost"
                        color="blue"
                        value={pelatihan.mitra.nama_mitra}
                        icon={<BuildingOfficeIcon className="h-4 w-4" />}
                        className="rounded-full"
                      />
                    )}
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-3 mt-4">
                  <Link href={`/admin/pelatihan/${id}/edit`}>
                    <Button color="blue" className="flex items-center gap-2">
                      <PencilIcon className="h-5 w-5" /> Edit Pelatihan
                    </Button>
                  </Link>
                  <Link href="/admin/pelatihan">
                    <Button variant="outlined" color="gray" className="flex items-center gap-2">
                      <ArrowLeftIcon className="h-5 w-5" /> Kembali
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <Typography color="gray">Data pelatihan tidak ditemukan.</Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* 🔹 KARTU DESKRIPSI */}
      <Card className="border border-blue-gray-100 shadow-sm mb-8">
        <CardHeader floated={false} shadow={false} className="m-0 p-6 border-b">
          <Typography variant="h6" color="blue-gray">Deskripsi Pelatihan</Typography>
        </CardHeader>
        <CardBody className="p-6">
          {pelatihan?.deskripsi_pelatihan ? (
            <div 
              className="prose prose-content max-w-none"
              dangerouslySetInnerHTML={{ __html: pelatihan.deskripsi_pelatihan }} 
            />
          ) : (
            <Typography color="gray">Tidak ada deskripsi tersedia.</Typography>
          )}
        </CardBody>
      </Card>

      {/* 🔹 KARTU DAFTAR PESERTA */}
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex gap-y-4 flex-col md:flex-row md:items-center md:justify-between p-6 sticky top-0 bg-white z-10 border-b border-blue-gray-50"
        >
          <Typography variant="h6" color="blue-gray">Daftar Peserta</Typography>
          <div className="w-full md:w-auto">
            <Input
              placeholder="Cari peserta..."
              value={search}
              onChange={handleSearch}
              className="!w-full md:!w-64 !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
            />
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <LoadingOverlay active={isLoading}>
            <div className="overflow-x-auto">
              <div className="min-h-[400px]">
                <table className="w-full min-w-[800px] table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      {["No", "Nama", "Email", "No. HP", "Status"].map((head) => (
                        <th key={head} className="border-b border-blue-gray-100 py-3 px-5 text-left">
                          <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pesertaList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-gray-500">
                          Tidak ada peserta terdaftar.
                        </td>
                      </tr>
                    ) : (
                      pesertaList.map((peserta, index) => (
                        <tr key={peserta.peserta_id} className="border-y">
                          <td className="py-3 px-5">
                            {(activePage - 1) * limit + index + 1}
                          </td>
                          <td className="py-3 px-5 font-medium">
                            {peserta.nama_lengkap || "-"}
                          </td>
                          <td className="py-3 px-5">{peserta.email || "-"}</td>
                          <td className="py-3 px-5">{peserta.no_hp || "-"}</td>
                          <td className="py-3 px-5">
                            <Chip
                              variant="gradient"
                              value={peserta.status_pendaftaran}
                              color={peserta.status_pendaftaran === 'terdaftar'
                                ? 'blue'
                                : (peserta.status_pendaftaran === 'selesai' ? 'green' : 'gray')}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </LoadingOverlay>

          {/* Pagination */}
          <Pagination
            limit={limit}
            setLimit={setLimit}
            activePage={activePage}
            setActivePage={setActivePage}
            totalPages={totalPages}
            prev={prev}
            next={next}
          />
        </CardBody>
      </Card>
    </div>
  );
}