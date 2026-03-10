"use client";

import React, { useEffect, useState } from "react";
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
  Select,
  Option,
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import HapusLaporanModal from "@/components/admin/laporan-kegiatan/hapus-laporan-modal";
import {
  fetchLaporanKegiatanList,
  fetchLaporanKegiatanStatistics,
  deleteLaporanKegiatan,
} from "@/adminHttpClient";
import { toast } from "react-toastify";
import Pagination from "@/components/admin/pagination";
import LoadingOverlay from "@/components/admin/loading-overlay";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LaporanKegiatan() {
  const authUser = useAuthStore.getState().user;
  const [isMounted, setIsMounted] = useState(false);

  const [laporanList, setLaporanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  const [stats, setStats] = useState({ totalLaporan: 0, pelatihanSelesaiMonth: 0, totalSertifikat: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await fetchLaporanKegiatanStatistics();
        setStats(response.data);
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    if (isMounted) {
      fetchStats();
    }
  }, [isMounted]);

  const fetchLaporan = async (page = 1, perPage = 5, query = "", filterStatus = "") => {
    try {
      setIsLoading(true);

      const params = { page: page, size: perPage };
      if (query) params.search = query;
      if (filterStatus) params.status = filterStatus;
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

  // Handle search change dengan debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLaporan(1, limit, search, statusFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, limit, statusFilter]);

  // Trigger setiap kali halaman berubah (tanpa debounce)
  useEffect(() => {
    fetchLaporan(activePage, limit, search, statusFilter);
  }, [activePage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setActivePage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
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
      fetchLaporan(activePage, limit, search, statusFilter);
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

  const getMitraNames = (laporan) => {
    if (!laporan.pelatihan || !laporan.pelatihan.mitra_pelatihan || laporan.pelatihan.mitra_pelatihan.length === 0) {
      return "-";
    }
    return laporan.pelatihan.mitra_pelatihan
      .map((mitra) => mitra.data_mitra?.nama_mitra || "Unknown")
      .join(", ");
  };

  const getStatusChip = (status) => {
    if (status === "final") {
      return (
        <Chip
          variant="ghost"
          size="sm"
          value="Final"
          color="green"
          className="rounded-full w-fit"
        />
      );
    }
    return (
      <Chip
        variant="ghost"
        size="sm"
        value="Draft"
        color="amber"
        className="rounded-full w-fit"
      />
    );
  };

  return (
    <div className="mt-12">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Laporan Card */}
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="flex flex-row items-center justify-between p-6">
            <div>
              <Typography variant="small" color="blue-gray" className="text-gray-600">
                Total Laporan
              </Typography>
              <Typography variant="h4" color="blue-gray" className="mt-2">
                {statsLoading ? "-" : stats.totalLaporan}
              </Typography>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg">
              <DocumentCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardBody>
        </Card>

        {/* Pelatihan Selesai (Bulan Ini) Card */}
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="flex flex-row items-center justify-between p-6">
            <div>
              <Typography variant="small" color="blue-gray" className="text-gray-600">
                Pelatihan Selesai (Bulan Ini)
              </Typography>
              <Typography variant="h4" color="blue-gray" className="mt-2">
                {statsLoading ? "-" : stats.pelatihanSelesaiMonth}
              </Typography>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardBody>
        </Card>

        {/* Sertifikat Diterbitkan Card */}
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="flex flex-row items-center justify-between p-6">
            <div>
              <Typography variant="small" color="blue-gray" className="text-gray-600">
                Sertifikat Diterbitkan
              </Typography>
              <Typography variant="h4" color="blue-gray" className="mt-2">
                {statsLoading ? "-" : stats.totalSertifikat}
              </Typography>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-teal-100 rounded-lg">
              <DocumentCheckIcon className="h-8 w-8 text-teal-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Data Table Card */}
      <div className="border border-blue-gray-100 shadow-sm rounded-lg overflow-visible">
        {/* Header dengan Controls */}
        <div className="p-6 bg-white border-b border-blue-gray-50">
          <Typography variant="h6" className="mb-4">Daftar Laporan Kegiatan</Typography>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-4">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Cari laporan kegiatan..."
                value={search}
                onChange={handleSearch}
                className="!w-full !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="w-full lg:w-48 min-w-0">
              <Select
                label="Filter Status"
                value={statusFilter}
                onChange={handleStatusFilter}
              >
                <Option value="">Semua Status</Option>
                <Option value="draft">Draft</Option>
                <Option value="final">Final</Option>
              </Select>
            </div>
            {isMounted && authUser?.role === "admin" && (
              <Link href="/admin/laporan-kegiatan/tambah" className="w-full lg:w-auto">
                <Button className="flex items-center justify-center w-full gap-2 px-4 py-2 whitespace-nowrap lg:w-auto">
                  <PlusIcon className="h-5 w-5" /> Tambah Laporan
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Table Body */}
        <div className="px-0 pt-0 pb-2">
          <LoadingOverlay active={isLoading}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "No",
                      "Judul Laporan",
                      "Pelatihan",
                      "Tanggal",
                      "Pengunggah",
                      "Mitra Penyelenggara",
                      "Status",
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
                        colSpan="8"
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

                        {/* Pelatihan */}
                        <td className="py-3 px-5">
                          <Typography variant="small" className="font-normal">
                            {item.pelatihan?.nama_pelatihan || "-"}
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

                        {/* Mitra Penyelenggara */}
                        <td className="py-3 px-5">
                          <Typography variant="small" className="font-normal">
                            {getMitraNames(item)}
                          </Typography>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-5">
                          {getStatusChip(item.status)}
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
                          {isMounted && authUser?.role === "admin" && (
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
        </div>
      </div>

      <HapusLaporanModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        judulLaporan={selectedLaporan?.judul_laporan}
      />
    </div>
  );
}
