"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function PesertaPelatihanPage({ params }) {
  const { id } = params;

  // 🔹 Data dummy pelatihan
  const pelatihan = {
    id,
    nama_pelatihan: "Pelatihan Dasar Pemrograman",
    tanggal_pelatihan: "10 November 2025",
    lokasi_pelatihan: "Lab Komputer UNMUL",
  };

  // 🔹 Data dummy peserta
  const [pesertaList, setPesertaList] = useState([
    {
      id: 1,
      nama: "Ahmad Fauzan",
      email: "ahmad@example.com",
      no_hp: "081234567890",
      status: "Terdaftar",
    },
    {
      id: 2,
      nama: "Budi Santoso",
      email: "budi@example.com",
      no_hp: "081298765432",
      status: "Lulus",
    },
    {
      id: 3,
      nama: "Citra Dewi",
      email: "citra@example.com",
      no_hp: "081355512345",
      status: "Tidak Hadir",
    },
    {
      id: 4,
      nama: "Dewi Anggraini",
      email: "dewi@example.com",
      no_hp: "081278945612",
      status: "Lulus",
    },
    {
      id: 5,
      nama: "Eka Purnama",
      email: "eka@example.com",
      no_hp: "081299887766",
      status: "Terdaftar",
    },
    {
      id: 6,
      nama: "Fajar Ramadhan",
      email: "fajar@example.com",
      no_hp: "081277776655",
      status: "Lulus",
    },
  ]);

  // 🔹 Pagination state
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const totalPages = Math.ceil(pesertaList.length / limit);

  const getItemProps = (index) => ({
    variant: activePage === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActivePage(index),
  });

  const next = () => {
    if (activePage === totalPages) return;
    setActivePage(activePage + 1);
  };

  const prev = () => {
    if (activePage === 1) return;
    setActivePage(activePage - 1);
  };

  const startIndex = (activePage - 1) * limit;
  const displayedData = pesertaList.slice(startIndex, startIndex + limit);

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
          className="m-0 p-4 border-b border-blue-gray-50"
        >
          <Typography variant="h6" color="blue-gray">
            Tabel Peserta
          </Typography>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-auto">
              <thead>
                <tr>
                  {["No", "Nama", "Email", "No HP", "Status", "Aksi"].map(
                    (head, index) => (
                      <th
                        key={head}
                        className={`border-b border-blue-gray-50 py-3 px-5 text-left ${
                          index !== 0 ? "min-w-[180px]" : ""
                        }`}
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {head}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {displayedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium text-blue-gray-500"
                      >
                        Belum ada peserta
                      </Typography>
                    </td>
                  </tr>
                ) : (
                  displayedData.map((peserta, index) => {
                    const isLast = index === displayedData.length - 1;
                    const classes = isLast
                      ? "py-3 px-5"
                      : "py-3 px-5 border-b border-blue-gray-50";

                    return (
                      <tr key={peserta.id}>
                        <td className={classes}>{startIndex + index + 1}</td>
                        <td className={classes}>{peserta.nama}</td>
                        <td className={classes}>{peserta.email}</td>
                        <td className={classes}>{peserta.no_hp}</td>
                        <td className={classes}>{peserta.status}</td>
                        <td className={`${classes} flex items-center gap-3`}>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-y-4 border-t border-blue-gray-50">
            {/* Limit data per halaman */}
            <div className="flex items-center gap-2 sm:mb-0 order-2 md:order-1">
              <Typography variant="small">Tampilkan</Typography>
              <div className="w-[100px] max-w-sm min-w-[100px]">
                <div className="relative">
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setActivePage(1);
                    }}
                    className="w-[100px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
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
              </div>
              <Typography variant="small">data per halaman</Typography>
            </div>

            {/* Navigasi pagination */}
            <div className="flex items-center gap-4 order-1 md:order-2">
              <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={prev}
                disabled={activePage === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <IconButton key={i} {...getItemProps(i + 1)}>
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
