"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Chip,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  PencilIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ComputerDesktopIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import {
  fetchPelatihanById,
  fetchPelatihanParticipants,
  updatePesertaStatus,
} from "@/adminHttpClient";
import { toast } from "react-toastify";
import Pagination from "@/components/admin/pagination";
import LoadingOverlay from "@/components/admin/loading-overlay";

import "@/css/admin/editor-content.css";

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
      const res = await fetchPelatihanById(id);
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

      const params = { page: page, size: perPage };
      if (query) params.search = query;
      const res = await fetchPelatihanParticipants(id, params);

      const { records, totalPages } = res.data;

      setPesertaList(records);
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

  const handleStatusChange = async (pesertaId, newStatus) => {
    try {
      await updatePesertaStatus(pesertaId, { status: newStatus });

      toast.dismiss();
      toast.success("Status peserta berhasil diperbarui!");

      // Refresh data peserta
      fetchPeserta(activePage, limit, search);
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      toast.error("Gagal memperbarui status peserta.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
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
                  src={
                    pelatihan.thumbnail_url ||
                    "https://via.placeholder.com/400x300.png?text=No+Image"
                  }
                  alt={pelatihan.nama}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Konten Utama */}
              <div className="w-full lg:w-2/3 p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <Typography variant="h3" color="blue-gray" className="mb-4">
                    {pelatihan.nama}
                  </Typography>

                  {/* Metadata dalam bentuk Chip */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Chip
                      variant="ghost"
                      value={new Date(pelatihan.tanggal).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                      icon={<CalendarDaysIcon className="h-4 w-4" />}
                      className="rounded-full"
                    />
                    {pelatihan.lokasi && (
                      <Chip
                        variant="ghost"
                        value={pelatihan.lokasi}
                        icon={<MapPinIcon className="h-4 w-4" />}
                        className="rounded-full"
                      />
                    )}
                    {pelatihan.link_daring && (
                      <a href={pelatihan.link_daring} target="_blank">
                        <Chip
                          variant="ghost"
                          value={pelatihan.link_daring}
                          icon={<ComputerDesktopIcon className="h-4 w-4" />}
                          className="rounded-full"
                        />
                      </a>
                    )}
                    <Chip
                      variant="ghost"
                      value={formatCurrency(pelatihan.biaya || 0)}
                      icon={<CurrencyDollarIcon className="h-4 w-4" />}
                      className="rounded-full"
                    />
                    <Chip
                      variant="ghost"
                      color={pelatihan.daring ? "blue" : "green"}
                      value={pelatihan.daring ? "Daring" : "Luring"}
                      icon={
                        pelatihan.daring ? (
                          <ComputerDesktopIcon className="h-4 w-4" />
                        ) : (
                          <BuildingOfficeIcon className="h-4 w-4" />
                        )
                      }
                      className="rounded-full"
                    />
                    {pelatihan.mitra && (
                      <Chip
                        variant="ghost"
                        color="blue"
                        value={pelatihan.mitra}
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
                    <Button
                      variant="outlined"
                      color="gray"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeftIcon className="h-5 w-5" /> Kembali
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <Typography color="gray">
                Data pelatihan tidak ditemukan.
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* 🔹 KARTU DESKRIPSI */}
      <Card className="border border-blue-gray-100 shadow-sm mb-8">
        <CardHeader floated={false} shadow={false} className="m-0 p-6 border-b">
          <Typography variant="h6" color="blue-gray">
            Deskripsi Pelatihan
          </Typography>
        </CardHeader>
        <CardBody className="p-6">
          {pelatihan?.deskripsi ? (
            <div
              className="prose prose-content max-w-none"
              dangerouslySetInnerHTML={{
                __html: pelatihan.deskripsi,
              }}
            />
          ) : (
            <Typography color="gray">Tidak ada deskripsi tersedia.</Typography>
          )}
        </CardBody>
      </Card>

      {/* 🔹 KARTU INFORMASI TAMBAHAN */}
      <Card className="border border-blue-gray-100 shadow-sm mb-8">
        <CardHeader floated={false} shadow={false} className="m-0 p-6 border-b">
          <Typography variant="h6" color="blue-gray">
            Informasi Pelatihan
          </Typography>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Biaya */}
            <div className="flex items-start gap-3">
              <CurrencyDollarIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
              <div>
                <Typography
                  variant="small"
                  className="font-medium text-blue-gray-700"
                >
                  Biaya Pelatihan
                </Typography>
                <Typography variant="h6" color="blue-gray">
                  {pelatihan ? formatCurrency(pelatihan.biaya || 0) : "-"}
                </Typography>
              </div>
            </div>

            {/* Nomor Rekening - selalu ditampilkan */}
            <div className="flex items-start gap-3">
              <CreditCardIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
              <div>
                <Typography
                  variant="small"
                  className="font-medium text-blue-gray-700"
                >
                  Nomor Rekening
                </Typography>
                <Typography variant="h6" color="blue-gray">
                  {pelatihan?.nomor_rekening || "-"}
                </Typography>
              </div>
            </div>

            {/* Nama Bank - selalu ditampilkan */}
            <div className="flex items-start gap-3">
              <CreditCardIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
              <div>
                <Typography
                  variant="small"
                  className="font-medium text-blue-gray-700"
                >
                  Nama Bank
                </Typography>
                <Typography variant="h6" color="blue-gray">
                  {pelatihan?.nama_bank || "-"}
                </Typography>
              </div>
            </div>

            {/* Jenis Pelatihan */}
            <div className="flex items-start gap-3">
              <ComputerDesktopIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
              <div>
                <Typography
                  variant="small"
                  className="font-medium text-blue-gray-700"
                >
                  Jenis Pelatihan
                </Typography>
                <Typography variant="h6" color="blue-gray">
                  {pelatihan
                    ? pelatihan.daring
                      ? "Daring (Online)"
                      : "Luring (Offline)"
                    : "-"}
                </Typography>
              </div>
            </div>

            {/* Link Daring - hanya muncul jika pelatihan daring */}
            {pelatihan?.daring && (
              <div className="flex items-start gap-3">
                <ComputerDesktopIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
                <div>
                  <Typography
                    variant="small"
                    className="font-medium text-blue-gray-700"
                  >
                    Link Daring
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                    {pelatihan.link_daring ? (
                      <a
                        href={pelatihan.link_daring}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {pelatihan.link_daring}
                      </a>
                    ) : (
                      "-"
                    )}
                  </Typography>
                </div>
              </div>
            )}

            {/* Durasi */}
            <div className="flex items-start gap-3">
              <CalendarDaysIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
              <div>
                <Typography
                  variant="small"
                  className="font-medium text-blue-gray-700"
                >
                  Durasi Pelatihan
                </Typography>
                <Typography variant="h6" color="blue-gray">
                  {pelatihan?.durasi || "-"}
                </Typography>
              </div>
            </div>
          </div>
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
          <Typography variant="h6" color="blue-gray">
            Daftar Peserta
          </Typography>
          <div className="w-full md:w-auto">
            <Input
              placeholder="Cari peserta..."
              value={search}
              onChange={handleSearch}
              className="!w-full md:!w-64 !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
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
                      {[
                        "No",
                        "Nama",
                        "Email",
                        "No. HP",
                        "Bukti Pembayaran",
                        "Status",
                      ].map((head) => (
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
                        <td
                          colSpan="6"
                          className="text-center py-10 text-gray-500"
                        >
                          Tidak ada peserta terdaftar.
                        </td>
                      </tr>
                    ) : (
                      pesertaList.map((peserta, index) => {
                        const bukti = peserta.bukti_pembayaran_filename;
                        const isImage =
                          bukti &&
                          (bukti.endsWith(".jpg") ||
                            bukti.endsWith(".jpeg") ||
                            bukti.endsWith(".png"));
                        const isPdf = bukti && bukti.endsWith(".pdf");

                        return (
                          <tr key={peserta.id} className="border-y">
                            <td className="py-3 px-5">
                              {(activePage - 1) * limit + index + 1}
                            </td>
                            <td className="py-3 px-5 font-medium">
                              {peserta.nama_lengkap || "-"}
                            </td>
                            <td className="py-3 px-5">
                              {peserta.email || "-"}
                            </td>
                            <td className="py-3 px-5">
                              {peserta.no_telp || "-"}
                            </td>

                            {/* 🔹 Kolom Bukti Pembayaran */}
                            <td className="py-3 px-5">
                              {bukti ? (
                                isImage ? (
                                  <a
                                    href={bukti}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-20 h-20 rounded overflow-hidden border border-blue-gray-100 shadow-sm hover:shadow-md transition"
                                  >
                                    <img
                                      src={bukti}
                                      alt="Bukti Pembayaran"
                                      className="w-full h-full object-cover"
                                    />
                                  </a>
                                ) : isPdf ? (
                                  <div className="flex flex-col items-start">
                                    <embed
                                      src={bukti}
                                      type="application/pdf"
                                      className="w-32 h-20 border border-blue-gray-100 rounded"
                                    />
                                    <a
                                      href={bukti}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 text-xs mt-1 hover:underline"
                                    >
                                      Lihat PDF
                                    </a>
                                  </div>
                                ) : (
                                  <Typography color="gray" className="text-xs">
                                    File tidak dikenal
                                  </Typography>
                                )
                              ) : (
                                <Typography
                                  color="gray"
                                  className="text-xs italic"
                                >
                                  Tidak ada bukti pembayaran
                                </Typography>
                              )}
                            </td>

                            <td className="py-3 px-5">
                              <Select
                                value={peserta.status}
                                onChange={(value) =>
                                  handleStatusChange(peserta.id, value)
                                }
                              >
                                <Option value="pending">Pending</Option>
                                <Option value="terdaftar">Terdaftar</Option>
                                <Option value="selesai">Selesai</Option>
                              </Select>
                            </td>
                          </tr>
                        );
                      })
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
