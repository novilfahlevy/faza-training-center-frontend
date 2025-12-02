"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Chip,
  Avatar,
} from "@material-tailwind/react";
import {
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import StatisticsCard from "@/components/admin/cards/statistics-card";
import { toast } from "react-toastify";
import Link from "next/link";

// Loading Skeleton Component untuk Statistics Cards
function StatisticsCardSkeleton() {
  return (
    <div className="relative bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden">
      <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-100 to-gray-200 shadow-lg shadow-gray-500/40 absolute mt-2 grid h-16 w-16 place-items-center">
        <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
      </div>
      <div className="p-6 text-right">
        <div className="h-6 bg-gray-200 rounded w-24 mb-2 animate-pulse ml-auto"></div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse ml-auto"></div>
        <div className="h-4 bg-gray-100 rounded w-28 animate-pulse ml-auto"></div>
      </div>
    </div>
  );
}

// Loading Skeleton Component untuk Tabel Pelatihan
function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {Array(columns).fill(0).map((_, i) => (
                <th key={i} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(rows).fill(0).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array(columns).fill(0).map((_, colIndex) => (
                  <td key={colIndex} className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Loading Skeleton Component untuk Peserta Pending
function PendingParticipantsSkeleton({ items = 5 }) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-48 animate-pulse"></div>
      </div>
      <div className="space-y-3">
        {Array(items).fill(0).map((_, i) => (
          <div key={i} className="flex items-start gap-4 py-3 border-b border-blue-gray-50">
            <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-48 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-32 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [statsLoading, setStatsLoading] = useState(true);
  const [pelatihanLoading, setPelatihanLoading] = useState(true);
  const [pesertaLoading, setPesertaLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalPelatihan: 0,
    totalPeserta: 0,
    totalMitra: 0,
    pendapatanBulanIni: 0,
  });

  const [pelatihanTerbaru, setPelatihanTerbaru] = useState([]);
  const [pesertaPending, setPesertaPending] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Import fungsi dari adminHttpClient
      const {
        fetchDashboardStatistics,
        fetchDashboardCharts,
        fetchRecentTrainings,
        fetchPendingParticipants,
      } = await import("@/adminHttpClient");

      // Fetch statistics
      setStatsLoading(true);
      const statsRes = await fetchDashboardStatistics();
      setStats(statsRes.data);

      // Fetch recent trainings
      setPelatihanLoading(true);
      const pelatihanRes = await fetchRecentTrainings();
      setPelatihanTerbaru(pelatihanRes.data);

      // Fetch pending participants
      setPesertaLoading(true);
      const pendingRes = await fetchPendingParticipants();
      setPesertaPending(pendingRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setTimeout(() => {
        setStatsLoading(false);
        setPelatihanLoading(false);
        setPesertaLoading(false);
      }, 500);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statisticsCardsData = [
    {
      color: "blue",
      icon: AcademicCapIcon,
      title: "Total Pelatihan",
      value: stats.totalPelatihan.toString(),
      footer: {
        color: "text-blue-500",
        label: "Pelatihan Tersedia",
      },
    },
    {
      color: "green",
      icon: UserGroupIcon,
      title: "Total Peserta",
      value: stats.totalPeserta.toString(),
      footer: {
        color: "text-green-500",
        label: "Peserta Terdaftar",
      },
    },
    {
      color: "orange",
      icon: BuildingOfficeIcon,
      title: "Total Mitra",
      value: stats.totalMitra.toString(),
      footer: {
        color: "text-orange-500",
        label: "Mitra Aktif",
      },
    },
    {
      color: "pink",
      icon: CurrencyDollarIcon,
      title: "Pendapatan Bulan Ini",
      value: formatCurrency(stats.pendapatanBulanIni),
      footer: {
        color: "text-pink-500",
        label: "Dari Pelatihan Berbayar",
      },
    },
  ];

  return (
    <div className="mt-12">
      {/* Statistics Cards */}
      <div className="mb-6 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => <StatisticsCardSkeleton key={i} />)
        ) : (
          statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
            <StatisticsCard
              key={title}
              {...rest}
              title={title}
              icon={React.createElement(icon, {
                className: "w-6 h-6 text-white",
              })}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={footer.color}>{footer.label}</strong>
                </Typography>
              }
            />
          ))
        )}
      </div>

      {/* Tables */}
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Pelatihan Terbaru */}
        <div>
          <Card className="overflow-hidden border border-blue-gray-100 shadow-sm">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between p-6"
            >
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Pelatihan Terbaru
                </Typography>
                <Typography
                  variant="small"
                  className="flex items-center gap-1 font-normal text-blue-gray-600"
                >
                  <AcademicCapIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                  5 pelatihan terbaru
                </Typography>
              </div>
              <Link href="/admin/pelatihan">
                <Typography
                  variant="small"
                  color="blue"
                  className="font-medium cursor-pointer hover:underline"
                >
                  Lihat Semua
                </Typography>
              </Link>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              {pelatihanLoading ? (
                <TableSkeleton rows={5} columns={5} />
              ) : (
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                    <tr>
                      {["Pelatihan", "Tanggal", "Mitra", "Peserta", "Status"].map((el) => (
                        <th
                          key={el}
                          className="border-b border-blue-gray-50 py-3 px-6 text-left"
                        >
                          <Typography
                            variant="small"
                            className="text-[11px] font-medium uppercase text-blue-gray-400"
                          >
                            {el}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pelatihanTerbaru.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-500">
                          Belum ada pelatihan
                        </td>
                      </tr>
                    ) : (
                      pelatihanTerbaru.map((pelatihan, key) => {
                        const className = `py-3 px-5 ${
                          key === pelatihanTerbaru.length - 1
                            ? ""
                            : "border-b border-blue-gray-50"
                        }`;

                        return (
                          <tr key={pelatihan.pelatihan_id}>
                            <td className={className}>
                              <div className="flex items-center gap-4">
                                {/* <Avatar
                                  src={pelatihan.thumbnail_url || "/img/placeholder.png"}
                                  alt={pelatihan.nama}
                                  size="sm"
                                  variant="rounded"
                                /> */}
                                <div>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-bold"
                                  >
                                    {pelatihan.nama}
                                  </Typography>
                                  <Typography className="text-xs font-normal text-blue-gray-500">
                                    {pelatihan.daring ? "Daring" : "Luring"}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                            <td className={className}>
                              <Typography className="text-xs font-semibold text-blue-gray-600">
                                {new Date(pelatihan.tanggal).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </Typography>
                            </td>
                            <td className={className}>
                              {pelatihan.mitra && pelatihan.mitra.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {pelatihan.mitra.slice(0, 2).map((m, index) => (
                                    <Chip
                                      key={index}
                                      variant="ghost"
                                      size="sm"
                                      value={m.nama}
                                      icon={<BuildingOfficeIcon className="h-3 w-3" />}
                                      color="blue"
                                      className="rounded-full"
                                    />
                                  ))}
                                  {pelatihan.mitra.length > 2 && (
                                    <Chip
                                      variant="ghost"
                                      size="sm"
                                      value={`+${pelatihan.mitra.length - 2} lagi`}
                                      color="gray"
                                      className="rounded-full"
                                    />
                                  )}
                                </div>
                              ) : (
                                <Typography className="text-xs font-normal text-blue-gray-500">
                                  Tidak ada mitra
                                </Typography>
                              )}
                            </td>
                            <td className={className}>
                              <Typography className="text-xs font-semibold text-blue-gray-600">
                                {pelatihan.jumlah_peserta} peserta
                              </Typography>
                            </td>
                            <td className={className}>
                              <Chip
                                variant="gradient"
                                color={pelatihan.daring ? "blue" : "green"}
                                value={pelatihan.daring ? "Daring" : "Luring"}
                                className="py-0.5 px-2 text-[11px] font-medium text-center"
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Peserta Pending */}
        <div>
          <Card className="border border-blue-gray-100 shadow-sm">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Peserta Pending
                  </Typography>
                  <Typography
                    variant="small"
                    className="flex items-center gap-1 font-normal text-blue-gray-600"
                  >
                    <ExclamationCircleIcon
                      strokeWidth={3}
                      className="h-4 w-4 text-orange-500"
                    />
                    <strong>{pesertaPending.length}</strong> peserta menunggu verifikasi
                  </Typography>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              {pesertaLoading ? (
                <PendingParticipantsSkeleton items={5} />
              ) : pesertaPending.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <Typography color="gray" variant="small">
                    Tidak ada peserta pending
                  </Typography>
                </div>
              ) : (
                pesertaPending.map((peserta, key) => (
                  <div
                    key={peserta.id}
                    className={`flex items-start gap-4 py-3 ${
                      key === pesertaPending.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`}
                  >
                    <div className="relative p-1">
                      <ExclamationCircleIcon className="!w-5 !h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-medium"
                      >
                        {peserta.nama_lengkap}
                      </Typography>
                      <Typography
                        as="span"
                        variant="small"
                        className="text-xs font-medium text-blue-gray-500"
                      >
                        {peserta.pelatihan_nama}
                      </Typography>
                      <Typography
                        as="div"
                        variant="small"
                        className="text-xs text-blue-gray-400 mt-1"
                      >
                        {new Date(peserta.tanggal_pendaftaran).toLocaleDateString("id-ID")}
                      </Typography>
                    </div>
                    <Link href={`/admin/pelatihan/${peserta.pelatihan_id}`}>
                      <Typography
                        variant="small"
                        color="blue"
                        className="font-medium cursor-pointer hover:underline"
                      >
                        Verifikasi
                      </Typography>
                    </Link>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}