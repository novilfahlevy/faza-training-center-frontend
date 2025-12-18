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
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import HapusLaporanModal from "@/components/admin/laporan-kegiatan/hapus-laporan-modal";
import {
  fetchLaporanKegiatanList,
  deleteLaporanKegiatan,
} from "@/adminHttpClient";
import { toast } from "react-toastify";
import Pagination from "@/components/admin/pagination";
import LoadingOverlay from "@/components/admin/loading-overlay";
import { useAuthStore } from "@/stores/useAuthStore";

// Utility: debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function LaporanKegiatan() {
  const authUser = useAuthStore.getState().user;

  const [laporanList, setLaporanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  const fetchLaporan = async (page = 1, perPage = 5, query = "") => {
    try {
      setIsLoading(true);

      const params = { page: page, size: perPage };
      if (query) params.search = query;
      const response = await fetchLaporanKegiatanList(params);

      const { records, totalPages } = response.data;
      setLaporanList(records || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Gagal mengambil data laporan kegiatan:", error);
      setLaporanList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search handler
  const debouncedFetch = useCallback(
    debounce((query) => {
      fetchLaporan(1, limit, query);
    }, 500),
    [limit]
  );

  // Trigger setiap kali halaman atau limit berubah
  useEffect(() => {
    fetchLaporan(activePage, limit, search);
  }, [activePage, limit]);

  // Trigger setiap kali search berubah
  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setActivePage(1);
  };

  const handleDelete = (laporan) => {
    setSelectedLaporan(laporan);
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLaporan) return;

    try {
      const response = await deleteLaporanKegiatan(selectedLaporan.laporan_id);

      toast.success(
        response.data.message || "Laporan kegiatan berhasil dihapus!",
        {
          position: "top-right",
          autoClose: 2500,
        }
      );

      // Refresh daftar laporan setelah hapus
      fetchLaporan(activePage, limit, search);
    } catch (error) {
      console.error("Gagal menghapus laporan kegiatan:", error);
      toast.error(
        error.response?.data?.message || "Gagal menghapus laporan kegiatan.",
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setOpenModal(false);
    }
  };

  const next = () => {
    if (activePage < totalPages) setActivePage((prev) => prev + 1);
  };

  const prev = () => {
    if (activePage > 1) setActivePage((prev) => prev - 1);
  };

  const getUploaderName = (laporan) => {
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
      case "admin":
        return "Admin";
      case "mitra":
        return "Mitra";
      case "peserta":
        return "Peserta";
      default:
        return role;
    }
  };

  return (
    <div className="mt-12">
      <Card className="border border-blue-gray-100 shadow-sm">
        {/* Sticky Header */}
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex gap-y-4 flex-col md:flex-row md:items-center md:justify-between p-6 sticky top-0 bg-white z-10 border-b border-blue-gray-50"
        >
          <Typography variant="h6">Daftar Laporan Kegiatan</Typography>
          <div className="flex flex-col gap-y-4 sm:flex-row sm:items-center sm:gap-x-4">
            <Input
              placeholder="Cari laporan kegiatan..."
              value={search}
              onChange={handleSearch}
              className="!w-full sm:!w-64 !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {authUser?.role === "admin" && (
              <Link href="/admin/laporan-kegiatan/tambah">
                <Button className="flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                  <PlusIcon className="h-5 w-5" /> Tambah Laporan
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <LoadingOverlay active={isLoading}>
            <div className="overflow-x-auto">
              <div className="min-h-[400px]">
                <table className="w-full min-w-[800px] table-auto">
                  <thead className="bg-gray-200">
                    <tr>
                      {[
                        "No",
                        "Judul Laporan",
                        "Tanggal",
                        "Pengunggah",
                        "Aksi",
                      ].map((head, index) => (
                        <th
                          key={head}
                          className={`border-b border-blue-gray-50 py-3 px-5 text-left ${
                            index !== 0 ? "min-w-[160px]" : ""
                          }`}
                        >
                          <Typography
                            variant="small"
                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {laporanList.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-6 text-gray-500"
                        >
                          Tidak ada data laporan kegiatan.
                        </td>
                      </tr>
                    ) : (
                      laporanList.map((item, index) => (
                        <tr
                          key={item.laporan_id}
                          className="border-y-2 hover:bg-gray-50 transition"
                        >
                          {/* Nomor urut */}
                          <td className="py-3 px-5">
                            {(activePage - 1) * limit + index + 1}
                          </td>

                          {/* Judul Laporan */}
                          <td className="py-3 px-5">
                            <Typography variant="small" className="font-medium">
                              {item.judul_laporan}
                            </Typography>
                          </td>

                          {/* Tanggal */}
                          <td className="py-3 px-5">
                            {new Date(item.tanggal_laporan).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>

                          {/* Pengunggah */}
                          <td className="py-3 px-5">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-medium"
                              >
                                {getUploaderName(item)}
                              </Typography>
                              <Chip
                                variant="ghost"
                                size="sm"
                                value={getUploaderRole(item.uploader.role)}
                                color={
                                  item.uploader.role === "admin"
                                    ? "red"
                                    : item.uploader.role === "mitra"
                                    ? "blue"
                                    : "green"
                                }
                                className="rounded-full w-fit"
                              />
                            </div>
                          </td>

                          {/* Aksi */}
                          <td className="py-3 px-5 flex gap-2">
                            <Tooltip content="Lihat Detail">
                              <Link
                                href={`/admin/laporan-kegiatan/${item.laporan_id}`}
                              >
                                <IconButton variant="outlined" color="green">
                                  <EyeIcon className="h-4 w-4" />
                                </IconButton>
                              </Link>
                            </Tooltip>
                            {authUser?.role === "admin" && (
                              <>
                                <Tooltip content="Edit">
                                  <Link
                                    href={`/admin/laporan-kegiatan/${item.laporan_id}/edit`}
                                  >
                                    <IconButton variant="outlined" color="blue">
                                      <PencilIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Link>
                                </Tooltip>
                                <Tooltip content="Hapus">
                                  <IconButton
                                    variant="outlined"
                                    color="red"
                                    onClick={() => handleDelete(item)}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
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

      <HapusLaporanModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        judulLaporan={selectedLaporan?.judul_laporan}
      />
    </div>
  );
}
