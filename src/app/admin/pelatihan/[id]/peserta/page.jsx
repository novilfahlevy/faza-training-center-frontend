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
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon, ArrowLeftIcon as OutlineArrowLeft } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function PesertaPelatihanPage({ params }) {
  const { id } = params;

  // Data pelatihan dummy
  const pelatihan = {
    id,
    nama_pelatihan: "Pelatihan Dasar Pemrograman",
    tanggal_pelatihan: "10 November 2025",
    lokasi_pelatihan: "Lab Komputer UNMUL",
  };

  const [pesertaList, setPesertaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fungsi simulasi fetch peserta dari API
  const fetchPeserta = async (page = 1, perPage = 5) => {
    setIsLoading(true);

    const dummyData = [
      { id: 1, nama: "Ahmad Fauzan", email: "ahmad@example.com", no_hp: "081234567890", status: "Terdaftar" },
      { id: 2, nama: "Budi Santoso", email: "budi@example.com", no_hp: "081298765432", status: "Lulus" },
      { id: 3, nama: "Citra Dewi", email: "citra@example.com", no_hp: "081355512345", status: "Tidak Hadir" },
      { id: 4, nama: "Dewi Anggraini", email: "dewi@example.com", no_hp: "081278945612", status: "Lulus" },
      { id: 5, nama: "Eka Purnama", email: "eka@example.com", no_hp: "081299887766", status: "Terdaftar" },
      { id: 6, nama: "Fajar Ramadhan", email: "fajar@example.com", no_hp: "081277776655", status: "Lulus" },
      { id: 7, nama: "Gita Pramudita", email: "gita@example.com", no_hp: "081233344455", status: "Lulus" },
      { id: 8, nama: "Hadi Saputra", email: "hadi@example.com", no_hp: "081234567891", status: "Tidak Hadir" },
    ];

    const totalData = dummyData.length;
    const totalPages = Math.ceil(totalData / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedData = dummyData.slice(startIndex, startIndex + perPage);

    await new Promise((r) => setTimeout(r, 500)); // simulasi delay

    setPesertaList(paginatedData);
    setTotalPages(totalPages);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPeserta(activePage, limit);
  }, [activePage, limit]);

  const next = () => {
    if (activePage < totalPages) setActivePage((prev) => prev + 1);
  };

  const prev = () => {
    if (activePage > 1) setActivePage((prev) => prev - 1);
  };

  const handleDelete = (id) => {
    setPesertaList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography variant="h5" color="blue-gray">
            Daftar Peserta - {pelatihan.nama_pelatihan}
          </Typography>
          <Typography variant="small" color="gray">
            {pelatihan.tanggal_pelatihan} • {pelatihan.lokasi_pelatihan}
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/pelatihan">
            <Button
              color="gray"
              variant="outlined"
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" /> Kembali
            </Button>
          </Link>
          <Button color="blue" className="flex items-center gap-2">
            <UserPlusIcon className="h-5 w-5" /> Tambah Peserta
          </Button>
        </div>
      </div>

      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex gap-y-4 flex-col md:flex-row md:items-center md:justify-between p-6 border-b border-blue-gray-50"
        >
          <Typography variant="h6">Tabel Peserta</Typography>
          <div>
            <Input
              placeholder="Cari peserta"
              className="!w-full sm:!w-64 !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
            />
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <div className="overflow-x-auto">
            <div className="min-h-[400px]">
              <table className="w-full min-w-[800px] table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    {["No", "Nama", "Email", "No HP", "Status", "Aksi"].map(
                      (head, index) => (
                        <th
                          key={head}
                          className={`border-b border-blue-gray-50 py-3 px-5 text-left ${
                            index != 0 ? "min-w-[180px]" : ""
                          }`}
                        >
                          <Typography
                            variant="small"
                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                          >
                            {head}
                          </Typography>
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-6 text-gray-500 text-center h-[300px]"
                      >
                        <div className="flex justify-center items-center h-full">
                          Memuat data peserta...
                        </div>
                      </td>
                    </tr>
                  ) : pesertaList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        Tidak ada data peserta.
                      </td>
                    </tr>
                  ) : (
                    pesertaList.map((peserta, index) => (
                      <tr key={peserta.id}>
                        <td className="py-3 px-5">
                          {(activePage - 1) * limit + index + 1}
                        </td>
                        <td className="py-3 px-5">{peserta.nama}</td>
                        <td className="py-3 px-5">{peserta.email}</td>
                        <td className="py-3 px-5">{peserta.no_hp}</td>
                        <td className="py-3 px-5">{peserta.status}</td>
                        <td className="py-3 px-5 flex gap-2">
                          <Tooltip content="Hapus">
                            <IconButton
                              variant="text"
                              color="red"
                              onClick={() => handleDelete(peserta.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-y-4 border-t border-blue-gray-50">
            <div className="flex items-center gap-2">
              <Typography variant="small">Tampilkan</Typography>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setActivePage(1);
                  }}
                  className="w-[100px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.2"
                  stroke="currentColor"
                  className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
              <Typography variant="small">data per halaman</Typography>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={prev}
                disabled={activePage === 1}
              >
                <OutlineArrowLeft strokeWidth={2} className="h-4 w-4" /> Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <IconButton
                    key={i}
                    variant={activePage === i + 1 ? "filled" : "text"}
                    color="gray"
                    onClick={() => setActivePage(i + 1)}
                  >
                    {i + 1}
                  </IconButton>
                ))}
              </div>

              <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={next}
                disabled={activePage === totalPages}
              >
                Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
