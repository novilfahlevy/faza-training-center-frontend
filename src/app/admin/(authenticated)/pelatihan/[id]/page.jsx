// /home/novilfahlevy/Projects/faza-training-center/src/app/admin/(authenticated)/pelatihan/[id]/page.jsx
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
  ClockIcon,
  GlobeAltIcon,
  BanknotesIcon,
  DocumentTextIcon,
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

// Utility: debounce function
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

  // Fetch detail pelatihan
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

  // Fetch peserta pelatihan
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

  // Debounced search handler
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
    if (!amount || amount === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isFree =
    pelatihan && (pelatihan.biaya === 0 || pelatihan.biaya === "0");

  return (
    <div className="mt-10 mb-10">
      <div className="flex flex-col gap-y-4 sm:flex-row sm:items-center gap-x-4 mb-6">
        {/* Tombol Kembali */}
        <Link href="/admin/pelatihan">
          <Button
            variant="outlined"
            color="gray"
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Kembali
          </Button>
        </Link>

        {/* Tombol Edit */}
        <Link href={`/admin/pelatihan/${id}/edit`}>
          <Button color="blue" className="flex items-center gap-2">
            <PencilIcon className="h-5 w-5" /> Edit Pelatihan
          </Button>
        </Link>
      </div>

      {isPelatihanLoading ? (
        <div className="flex items-center justify-center h-64">
          <Typography color="gray">Memuat detail pelatihan...</Typography>
        </div>
      ) : pelatihan ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* KOLOM KIRI - Informasi Pelatihan */}
          <div className="lg:col-span-2 space-y-6">
            {/* CARD HEADER INFO */}
            <Card className="border border-blue-gray-100 shadow-sm">
              <CardBody className="p-6">
                <Typography variant="h3" color="blue-gray" className="mb-4">
                  {pelatihan.nama}
                </Typography>

                {/* Metadata dalam bentuk Chip */}
                <div className="flex flex-wrap gap-2">
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
                  {!pelatihan.daring && pelatihan.lokasi && (
                    <Chip
                      variant="ghost"
                      value={pelatihan.lokasi}
                      icon={<MapPinIcon className="h-4 w-4" />}
                      className="rounded-full"
                    />
                  )}
                  {/* Menampilkan mitra sebagai chip */}
                  {pelatihan.mitra && pelatihan.mitra.length > 0 && (
                    pelatihan.mitra.slice(0, 2).map((mitra, index) => (
                      <Chip
                        key={index}
                        variant="ghost"
                        color="blue"
                        value={mitra.nama}
                        icon={<BuildingOfficeIcon className="h-4 w-4" />}
                        className="rounded-full"
                      />
                    ))
                  )}
                  {pelatihan.mitra && pelatihan.mitra.length > 2 && (
                    <Chip
                      variant="ghost"
                      color="gray"
                      value={`+${pelatihan.mitra.length - 2} mitra lagi`}
                      className="rounded-full"
                    />
                  )}
                </div>
              </CardBody>
            </Card>

            {/* KARTU INFORMASI PELATIHAN */}
            <Card className="border border-blue-gray-100 shadow-sm">
              <CardHeader
                floated={false}
                shadow={false}
                className="m-0 p-6 border-b"
              >
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <Typography variant="h6" color="blue-gray">
                    Informasi Pelatihan
                  </Typography>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tanggal Pelatihan */}
                  <div className="flex items-start gap-3">
                    <CalendarDaysIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
                    <div>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-700"
                      >
                        Tanggal Pelatihan
                      </Typography>
                      <Typography variant="h6" color="blue-gray">
                        {new Date(pelatihan.tanggal).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </Typography>
                    </div>
                  </div>

                  {/* Durasi */}
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
                    <div>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-700"
                      >
                        Durasi
                      </Typography>
                      <Typography variant="h6" color="blue-gray">
                        {pelatihan.durasi || "-"}
                      </Typography>
                    </div>
                  </div>

                  {/* Pelaksanaan */}
                  <div className="flex items-start gap-3">
                    <GlobeAltIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
                    <div>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-700"
                      >
                        Pelaksanaan
                      </Typography>
                      <Typography variant="h6" color="blue-gray">
                        {pelatihan.daring
                          ? "Daring (Online)"
                          : "Luring (Offline)"}
                      </Typography>
                    </div>
                  </div>

                  {/* Lokasi - hanya untuk luring */}
                  {!pelatihan.daring && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
                      <div>
                        <Typography
                          variant="small"
                          className="font-medium text-blue-gray-700"
                        >
                          Lokasi
                        </Typography>
                        <Typography variant="h6" color="blue-gray">
                          {pelatihan.lokasi || "-"}
                        </Typography>
                      </div>
                    </div>
                  )}

                  {/* Link Daring - hanya untuk pelatihan daring */}
                  {pelatihan.daring && pelatihan.link_daring && (
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
                          <a
                            href={pelatihan.link_daring}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all"
                          >
                            {pelatihan.link_daring}
                          </a>
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* KARTU MITRA */}
            {pelatihan.mitra && pelatihan.mitra.length > 0 && (
              <Card className="border border-blue-gray-100 shadow-sm">
                <CardHeader
                  floated={false}
                  shadow={false}
                  className="m-0 p-6 border-b"
                >
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <Typography variant="h6" color="blue-gray">
                      Mitra Pelatihan
                    </Typography>
                  </div>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pelatihan.mitra.map((mitra, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border border-blue-gray-100 rounded-lg">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <Typography
                            variant="small"
                            className="font-medium text-blue-gray-700"
                          >
                            {mitra.nama}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* KARTU DESKRIPSI */}
            <Card className="border border-blue-gray-100 shadow-sm">
              <CardHeader
                floated={false}
                shadow={false}
                className="m-0 p-6 border-b"
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <Typography variant="h6" color="blue-gray">
                    Deskripsi Pelatihan
                  </Typography>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                {pelatihan.deskripsi ? (
                  <div
                    className="prose prose-content max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: pelatihan.deskripsi,
                    }}
                  />
                ) : (
                  <Typography color="gray">
                    Tidak ada deskripsi tersedia.
                  </Typography>
                )}
              </CardBody>
            </Card>

            {/* KARTU INFORMASI BIAYA */}
            <Card className="border border-blue-gray-100 shadow-sm">
              <CardHeader
                floated={false}
                shadow={false}
                className="m-0 p-6 border-b"
              >
                <div className="flex items-center">
                  <BanknotesIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <Typography variant="h6" color="blue-gray">
                    Informasi Biaya
                  </Typography>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Biaya */}
                  <div className="flex items-start gap-3">
                    <BanknotesIcon className="h-5 w-5 text-blue-gray-500 mt-0.5" />
                    <div>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-700"
                      >
                        Biaya Pelatihan
                      </Typography>
                      <Typography
                        variant="h6"
                        color={isFree ? "green" : "blue-gray"}
                        className="font-bold"
                      >
                        {formatCurrency(pelatihan.biaya || 0)}
                      </Typography>
                    </div>
                  </div>

                  {/* Informasi Pembayaran - hanya untuk berbayar */}
                  {!isFree && (
                    <>
                      {/* Nomor Rekening */}
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
                            {pelatihan.nomor_rekening || "-"}
                          </Typography>
                        </div>
                      </div>

                      {/* Nama Bank */}
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
                            {pelatihan.nama_bank || "-"}
                          </Typography>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Catatan untuk gratis */}
                {isFree && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Typography
                      variant="small"
                      color="green"
                      className="font-medium"
                    >
                      Pelatihan ini gratis dan tidak memerlukan pembayaran.
                    </Typography>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* KOLOM KANAN - Thumbnail */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="border border-blue-gray-100 shadow-sm overflow-hidden">
                <img
                  src={
                    pelatihan.thumbnail_url ||
                    "https://via.placeholder.com/400x300.png?text=No+Image"
                  }
                  alt={pelatihan.nama}
                  className="w-full h-64 lg:h-96 object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <Typography color="gray">Data pelatihan tidak ditemukan.</Typography>
        </div>
      )}

      {/* KARTU DAFTAR PESERTA - Full Width */}
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

                            {/* Kolom Bukti Pembayaran */}
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
                                  {isFree
                                    ? "Tidak perlu"
                                    : "Tidak ada bukti pembayaran"}
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