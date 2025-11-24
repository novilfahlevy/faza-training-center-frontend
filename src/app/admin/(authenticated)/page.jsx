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
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import StatisticsCard from "@/components/admin/cards/statistics-card";
import { toast } from "react-toastify";
import Link from "next/link";

const StatisticsChart = dynamic(
  () => import("@/components/admin/charts/statistics-chart"),
  { ssr: false }
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPelatihan: 0,
    totalPeserta: 0,
    totalMitra: 0,
    pendapatanBulanIni: 0,
  });

  // const [chartData, setChartData] = useState({
  //   pendaftaranPerBulan: {
  //     categories: [],
  //     series: [{ name: "Pendaftaran", data: [] }],
  //   },
  //   statusPendaftaran: {
  //     labels: ["Pending", "Terdaftar", "Selesai"],
  //     series: [0, 0, 0],
  //   },
  //   pelatihanDaringLuring: {
  //     categories: ["Daring", "Luring"],
  //     series: [{ name: "Jumlah", data: [0, 0] }],
  //   },
  // });

  const [pelatihanTerbaru, setPelatihanTerbaru] = useState([]);
  const [pesertaPending, setPesertaPending] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Import fungsi dari adminHttpClient
      const {
        fetchDashboardStatistics,
        fetchDashboardCharts,
        fetchRecentTrainings,
        fetchPendingParticipants,
      } = await import("@/adminHttpClient");

      // Fetch statistics
      const statsRes = await fetchDashboardStatistics();
      setStats(statsRes.data);

      // Fetch chart data
      // const chartsRes = await fetchDashboardCharts();
      // setChartData(chartsRes.data);

      // Fetch recent trainings
      const pelatihanRes = await fetchRecentTrainings();
      setPelatihanTerbaru(pelatihanRes.data);

      // Fetch pending participants
      const pendingRes = await fetchPendingParticipants();
      setPesertaPending(pendingRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
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

  // const statisticsChartsData = [
  //   {
  //     color: "blue",
  //     title: "Pendaftaran Peserta",
  //     description: "Tren pendaftaran per bulan",
  //     footer: "data 6 bulan terakhir",
  //     chart: {
  //       type: "line",
  //       height: 220,
  //       series: chartData.pendaftaranPerBulan.series,
  //       options: {
  //         colors: ["#0288d1"],
  //         chart: {
  //           toolbar: { show: false },
  //         },
  //         dataLabels: { enabled: false },
  //         stroke: { lineCap: "round", curve: "smooth" },
  //         markers: { size: 5 },
  //         xaxis: {
  //           categories: chartData.pendaftaranPerBulan.categories,
  //         },
  //         grid: {
  //           show: true,
  //           borderColor: "#dddddd",
  //           strokeDashArray: 5,
  //           xaxis: { lines: { show: true } },
  //           padding: { top: 5, right: 20 },
  //         },
  //         tooltip: { theme: "dark" },
  //       },
  //     },
  //   },
  //   {
  //     color: "green",
  //     title: "Status Pendaftaran",
  //     description: "Distribusi status peserta",
  //     footer: "total semua pelatihan",
  //     chart: {
  //       type: "pie",
  //       height: 220,
  //       series: chartData.statusPendaftaran.series,
  //       options: {
  //         labels: chartData.statusPendaftaran.labels,
  //         colors: ["#ff9800", "#4caf50", "#2196f3"],
  //         chart: {
  //           toolbar: { show: false },
  //         },
  //         legend: {
  //           show: true,
  //           position: "bottom",
  //         },
  //         dataLabels: { enabled: true },
  //         tooltip: { theme: "dark" },
  //       },
  //     },
  //   },
  //   {
  //     color: "orange",
  //     title: "Pelatihan Daring vs Luring",
  //     description: "Perbandingan metode pelaksanaan",
  //     footer: "total pelatihan aktif",
  //     chart: {
  //       type: "bar",
  //       height: 220,
  //       series: chartData.pelatihanDaringLuring.series,
  //       options: {
  //         colors: ["#ff9800"],
  //         chart: {
  //           toolbar: { show: false },
  //         },
  //         plotOptions: {
  //           bar: {
  //             columnWidth: "40%",
  //             borderRadius: 4,
  //           },
  //         },
  //         xaxis: {
  //           categories: chartData.pelatihanDaringLuring.categories,
  //         },
  //         grid: {
  //           show: true,
  //           borderColor: "#dddddd",
  //           strokeDashArray: 5,
  //           padding: { top: 5, right: 20 },
  //         },
  //         tooltip: { theme: "dark" },
  //       },
  //     },
  //   },
  // ];

  if (loading) {
    return (
      <div className="mt-12 flex items-center justify-center h-64">
        <Typography color="gray">Memuat data dashboard...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Statistics Cards */}
      <div className="mb-6 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
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
        ))}
      </div>

      {/* Charts */}
      {/* <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div> */}

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
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Pelatihan", "Tanggal", "Peserta", "Status"].map((el) => (
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
                      <td colSpan="4" className="text-center py-6 text-gray-500">
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
                                <Typography
                                  variant="small"
                                  className="text-xs font-normal text-blue-gray-500"
                                >
                                  {pelatihan.mitra || "Tanpa Mitra"}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="text-xs font-medium text-blue-gray-600"
                            >
                              {new Date(pelatihan.tanggal).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="text-xs font-medium text-blue-gray-600"
                            >
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
              {pesertaPending.length === 0 ? (
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