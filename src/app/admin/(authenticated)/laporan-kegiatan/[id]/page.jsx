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
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  PencilIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  fetchLaporanKegiatanById,
  fetchPelatihanParticipants,
  updatePesertaStatus,
  downloadCertificate,
  downloadAllCertificates,
  markAllAttended,
} from "@/adminHttpClient";
import { toast } from "react-toastify";
import Pagination from "@/components/admin/pagination";
import LoadingOverlay from "@/components/admin/loading-overlay";
import { useAuthStore } from "@/stores/useAuthStore";

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
  const authUser = useAuthStore.getState().user;
  const [isMounted, setIsMounted] = useState(false);
  const [laporan, setLaporan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Peserta states
  const [pesertaList, setPesertaList] = useState([]);
  const [pesertaLoading, setPesertaLoading] = useState(false);
  const [pesertaSearch, setPesertaSearch] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Statistics state
  const [pesertaStats, setPesertaStats] = useState({
    pending: 0,
    terdaftar: 0,
    selesai: 0,
    tidak_hadir: 0,
    total: 0,
  });

  // Track which rows are being updated
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Fetch peserta when laporan is loaded and has pelatihan
  const fetchPeserta = async (page = 1, perPage = 5, query = "") => {
    if (!laporan?.pelatihan?.pelatihan_id) return;

    try {
      setPesertaLoading(true);
      const params = { page, size: perPage };
      if (query) params.search = query;
      const res = await fetchPelatihanParticipants(laporan.pelatihan.pelatihan_id, params);
      const { records, totalPages } = res.data;
      setPesertaList(records || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Gagal mengambil data peserta:", error);
      setPesertaList([]);
    } finally {
      setPesertaLoading(false);
    }
  };

  // Fetch ALL peserta (unpaginated) for statistics
  const fetchPesertaStats = async () => {
    if (!laporan?.pelatihan?.pelatihan_id) return;

    try {
      const res = await fetchPelatihanParticipants(laporan.pelatihan.pelatihan_id, { page: 1, size: 999999 });
      const allRecords = res.data.records || [];
      const stats = { pending: 0, terdaftar: 0, selesai: 0, tidak_hadir: 0, total: allRecords.length };
      allRecords.forEach((p) => {
        if (stats[p.status] !== undefined) stats[p.status]++;
      });
      setPesertaStats(stats);
    } catch (error) {
      console.error("Gagal mengambil statistik peserta:", error);
    }
  };

  // Load peserta when laporan is ready
  useEffect(() => {
    if (laporan?.pelatihan?.pelatihan_id) {
      fetchPeserta(activePage, limit, pesertaSearch);
      fetchPesertaStats();
    }
  }, [laporan]);

  // Debounced search
  useEffect(() => {
    if (!laporan?.pelatihan?.pelatihan_id) return;
    const timer = setTimeout(() => {
      fetchPeserta(1, limit, pesertaSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [pesertaSearch]);

  // Page/limit change
  useEffect(() => {
    if (laporan?.pelatihan?.pelatihan_id) {
      fetchPeserta(activePage, limit, pesertaSearch);
    }
  }, [activePage, limit]);

  const handlePesertaSearch = (e) => {
    setPesertaSearch(e.target.value);
    setActivePage(1);
  };

  const handleStatusChange = async (pesertaId, newStatus) => {
    setUpdatingIds((prev) => new Set(prev).add(pesertaId));
    try {
      await updatePesertaStatus(pesertaId, { status: newStatus });
      toast.success("Status peserta berhasil diperbarui!");
      fetchPeserta(activePage, limit, pesertaSearch);
      fetchPesertaStats();
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      toast.error("Gagal memperbarui status peserta.");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(pesertaId);
        return next;
      });
    }
  };

  const handleDownloadCertificate = async (sertifikatId, namaLengkap) => {
    setDownloadingIds((prev) => new Set(prev).add(sertifikatId));
    try {
      const res = await downloadCertificate(sertifikatId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Sertifikat_${namaLengkap}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengunduh sertifikat:", error);
      toast.error("Gagal mengunduh sertifikat.");
    } finally {
      setDownloadingIds((prev) => { const next = new Set(prev); next.delete(sertifikatId); return next; });
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      const res = await downloadAllCertificates(laporan.pelatihan.pelatihan_id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Sertifikat_${laporan.pelatihan.nama_pelatihan || "Pelatihan"}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengunduh semua sertifikat:", error);
      toast.error("Gagal mengunduh semua sertifikat.");
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleMarkAllAttended = async () => {
    setIsMarkingAll(true);
    try {
      const res = await markAllAttended(laporan.pelatihan.pelatihan_id);
      toast.success(res.data.message || "Semua peserta berhasil ditandai hadir!");
      fetchPeserta(activePage, limit, pesertaSearch);
      fetchPesertaStats();
    } catch (error) {
      console.error("Gagal menandai semua hadir:", error);
      toast.error("Gagal menandai semua peserta hadir.");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const next = () => {
    if (activePage < totalPages) setActivePage((prev) => prev + 1);
  };

  const prev = () => {
    if (activePage > 1) setActivePage((prev) => prev - 1);
  };

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
      case "admin": return "Admin";
      case "mitra": return "Mitra";
      case "peserta": return "Peserta";
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "amber";
      case "terdaftar": return "blue";
      case "selesai": return "green";
      case "tidak_hadir": return "red";
      default: return "gray";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return "Menunggu Validasi";
      case "terdaftar": return "Terkonfirmasi";
      case "selesai": return "Hadir";
      case "tidak_hadir": return "Tidak Hadir";
      default: return status;
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
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base sm:text-lg">
                  Judul Laporan
                </Typography>
                <Typography variant="paragraph" className="text-sm sm:text-base">
                  {laporan.judul_laporan}
                </Typography>
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base sm:text-lg">
                  Tanggal Laporan
                </Typography>
                <Typography variant="paragraph" className="text-sm sm:text-base">
                  {new Date(laporan.tanggal_laporan).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </div>

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
                      laporan.uploader.role === "admin" ? "red" :
                      laporan.uploader.role === "mitra" ? "blue" : "green"
                    }
                    className="rounded-full"
                  />
                </div>
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base sm:text-lg">
                  Status
                </Typography>
                <Chip
                  variant="ghost"
                  size="sm"
                  value={laporan.status === "final" ? "Final" : "Draft"}
                  color={laporan.status === "final" ? "green" : "amber"}
                  className="rounded-full w-fit"
                />
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base sm:text-lg">
                  Pelatihan Terkait
                </Typography>
                <Typography variant="paragraph" className="text-sm sm:text-base">
                  {laporan.pelatihan?.nama_pelatihan || "-"}
                </Typography>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Mitra Penyelenggara Card */}
      {laporan && laporan.pelatihan && laporan.pelatihan.mitra_pelatihan && laporan.pelatihan.mitra_pelatihan.length > 0 && (
        <Card className="border border-blue-gray-100 shadow-sm mb-6">
          <CardBody className="p-4 sm:p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4 text-base sm:text-lg">
              Mitra Penyelenggara
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {laporan.pelatihan.mitra_pelatihan.map((mitra, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <Typography variant="small" className="font-medium">
                    {mitra.data_mitra?.nama_mitra || "Unknown"}
                  </Typography>
                  <Chip
                    variant="ghost"
                    size="sm"
                    value={mitra.PelatihanMitra?.role_mitra || "pemateri"}
                    color="blue"
                    className="rounded-full w-fit capitalize"
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Isi Laporan Card */}
      <Card className="border border-blue-gray-100 shadow-sm mb-6">
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

      {/* Peserta Section - only if laporan has related pelatihan */}
      {laporan && laporan.pelatihan && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="border border-amber-200 shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-600 text-xs">Menunggu Validasi</Typography>
                    <Typography variant="h5" color="amber">{pesertaStats.pending}</Typography>
                  </div>
                </div>
                <Typography variant="small" className="text-gray-500 text-[11px] leading-relaxed">
                  Peserta yang telah mendaftar dan menunggu validasi dari admin.
                </Typography>
              </CardBody>
            </Card>

            <Card className="border border-blue-200 shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <CheckBadgeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-600 text-xs">Terdaftar</Typography>
                    <Typography variant="h5" color="blue">{pesertaStats.terdaftar}</Typography>
                  </div>
                </div>
                <Typography variant="small" className="text-gray-500 text-[11px] leading-relaxed">
                  Peserta yang telah divalidasi dan terdaftar resmi sebagai peserta pelatihan.
                </Typography>
              </CardBody>
            </Card>

            <Card className="border border-green-200 shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-600 text-xs">Selesai</Typography>
                    <Typography variant="h5" color="green">{pesertaStats.selesai}</Typography>
                  </div>
                </div>
                <Typography variant="small" className="text-gray-500 text-[11px] leading-relaxed">
                  Peserta yang telah mengikuti dan menyelesaikan pelatihan.
                </Typography>
              </CardBody>
            </Card>

            <Card className="border border-red-200 shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                    <XCircleIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-600 text-xs">Tidak Hadir</Typography>
                    <Typography variant="h5" color="red">{pesertaStats.tidak_hadir}</Typography>
                  </div>
                </div>
                <Typography variant="small" className="text-gray-500 text-[11px] leading-relaxed">
                  Peserta yang tidak menghadiri pelatihan.
                </Typography>
              </CardBody>
            </Card>

            <Card className="border border-teal-200 shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-lg">
                    <DocumentCheckIcon className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-600 text-xs">Sertifikat Siap</Typography>
                    <Typography variant="h5" className="text-teal-600">{pesertaStats.selesai}</Typography>
                  </div>
                </div>
                <Typography variant="small" className="text-gray-500 text-[11px] leading-relaxed">
                  Jumlah sertifikat yang telah diterbitkan untuk peserta hadir.
                </Typography>
              </CardBody>
            </Card>
          </div>

          {/* Peserta Table */}
          <Card className="border border-blue-gray-100 shadow-sm overflow-visible" style={{ overflow: 'visible' }}>
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex gap-y-4 flex-col md:flex-row md:items-center md:justify-between p-6 sticky top-0 bg-white z-10 border-b border-blue-gray-50 rounded-t-xl overflow-visible"
            >
              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5 text-blue-gray-700" />
                <Typography variant="h6" color="blue-gray">
                  Daftar Peserta ({pesertaStats.total})
                </Typography>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                {isMounted && authUser?.role === "admin" && (
                  <>
                    <Button
                      size="sm"
                      color="teal"
                      variant="outlined"
                      disabled={isMarkingAll}
                      className="flex items-center justify-center gap-1 text-xs whitespace-nowrap !overflow-visible"
                      onClick={handleMarkAllAttended}
                    >
                      {isMarkingAll ? (
                        <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Memproses...</>
                      ) : (
                        <><CheckCircleIcon className="h-4 w-4" /> Tandai Semua Hadir</>
                      )}
                    </Button>
                    {pesertaStats.selesai > 0 && (
                      <Button
                        size="sm"
                        color="green"
                        variant="outlined"
                        disabled={isDownloadingAll}
                        className="flex items-center justify-center gap-1 text-xs whitespace-nowrap !overflow-visible"
                        onClick={handleDownloadAll}
                      >
                        {isDownloadingAll ? (
                          <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Mengunduh...</>
                        ) : (
                          <><ArrowDownTrayIcon className="h-4 w-4" /> Unduh Semua Sertifikat</>
                        )}
                      </Button>
                    )}
                  </>
                )}
                <Input
                  placeholder="Cari peserta..."
                  value={pesertaSearch}
                  onChange={handlePesertaSearch}
                  className="!w-full md:!w-64 !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
            </CardHeader>

            <CardBody className="px-0 pt-0 pb-2 overflow-visible">
              <LoadingOverlay active={pesertaLoading}>
                {/* Mobile: card list */}
                <div className="block md:hidden divide-y divide-blue-gray-50">
                  {pesertaList.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 px-4">Tidak ada peserta terdaftar.</div>
                  ) : (
                    pesertaList.map((peserta, index) => (
                      <div key={peserta.id} className="p-4 space-y-3 bg-white">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Typography variant="small" className="font-semibold text-blue-gray-800">
                              {(activePage - 1) * limit + index + 1}. {peserta.nama_lengkap || "-"}
                            </Typography>
                            <Typography variant="small" className="text-gray-500 text-xs truncate">{peserta.email || "-"}</Typography>
                            <Typography variant="small" className="text-gray-500 text-xs">{peserta.no_telp || "-"}</Typography>
                          </div>
                          {peserta.status === "selesai" && peserta.sertifikat_id && (
                            <Button
                              size="sm"
                              color="green"
                              variant="outlined"
                              disabled={downloadingIds.has(peserta.sertifikat_id)}
                              className="flex items-center gap-1 text-xs shrink-0"
                              onClick={() => handleDownloadCertificate(peserta.sertifikat_id, peserta.nama_lengkap)}
                            >
                              {downloadingIds.has(peserta.sertifikat_id) ? (
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                        <div className="relative">
                          {updatingIds.has(peserta.id) && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded">
                              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          {isMounted && authUser?.role === "admin" ? (
                            <Select
                              value={peserta.status}
                              disabled={updatingIds.has(peserta.id)}
                              onChange={(value) => handleStatusChange(peserta.id, value)}
                            >
                              <Option value="pending" disabled>Menunggu Validasi</Option>
                              <Option value="terdaftar">Terdaftar</Option>
                              <Option value="selesai">Selesai</Option>
                              <Option value="tidak_hadir">Tidak Hadir</Option>
                            </Select>
                          ) : (
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={getStatusLabel(peserta.status)}
                              color={getStatusColor(peserta.status)}
                              className="rounded-full w-fit"
                            />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Desktop: table */}
                <div className="hidden md:block overflow-x-auto">
                  <div className="min-h-[400px]">
                    <table className="w-full min-w-[800px] table-auto">
                      <thead className="bg-gray-50">
                        <tr>
                          {["No", "Nama", "Email", "No. HP", "Status", "Sertifikat"].map((head) => (
                            <th
                              key={head}
                              className="border-b border-blue-gray-100 py-3 px-5 text-left"
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
                      {pesertaList.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-10 text-gray-500">
                            Tidak ada peserta terdaftar.
                          </td>
                        </tr>
                      ) : (
                        pesertaList.map((peserta, index) => (
                          <tr key={peserta.id} className="border-y hover:bg-gray-50 transition">
                            <td className="py-3 px-5">
                              {(activePage - 1) * limit + index + 1}
                            </td>
                            <td className="py-3 px-5 font-medium">
                              {peserta.nama_lengkap || "-"}
                            </td>
                            <td className="py-3 px-5">{peserta.email || "-"}</td>
                            <td className="py-3 px-5">{peserta.no_telp || "-"}</td>
                            <td className="py-3 px-5">
                              {isMounted && authUser?.role === "admin" ? (
                                <div className="relative">
                                  {updatingIds.has(peserta.id) && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded">
                                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                  )}
                                  <Select
                                    value={peserta.status}
                                    disabled={updatingIds.has(peserta.id)}
                                    onChange={(value) => handleStatusChange(peserta.id, value)}
                                  >
                                    <Option value="pending" disabled>Menunggu Validasi</Option>
                                    <Option value="terdaftar">Terdaftar</Option>
                                    <Option value="selesai">Selesai</Option>
                                    <Option value="tidak_hadir">Tidak Hadir</Option>
                                  </Select>
                                </div>
                              ) : (
                                <Chip
                                  variant="ghost"
                                  size="sm"
                                  value={getStatusLabel(peserta.status)}
                                  color={getStatusColor(peserta.status)}
                                  className="rounded-full w-fit"
                                />
                              )}
                            </td>
                            <td className="py-3 px-5">
                              {peserta.status === "selesai" && peserta.sertifikat_id ? (
                                <Button
                                  size="sm"
                                  color="green"
                                  variant="outlined"
                                  disabled={downloadingIds.has(peserta.sertifikat_id)}
                                  className="flex items-center gap-1 text-xs"
                                  onClick={() => handleDownloadCertificate(peserta.sertifikat_id, peserta.nama_lengkap)}
                                >
                                  {downloadingIds.has(peserta.sertifikat_id) ? (
                                    <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Mengunduh...</>
                                  ) : (
                                    <><ArrowDownTrayIcon className="h-4 w-4" /> Unduh</>
                                  )}
                                </Button>
                              ) : (
                                <Typography variant="small" className="text-gray-400 text-xs italic">
                                  Tidak tersedia
                                </Typography>
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
        </>
      )}
    </div>
  );
}