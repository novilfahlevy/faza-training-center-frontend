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
  Select,
  Option,
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import HapusPelatihanModal from "@/components/pelatihan/hapus-pelatihan-modal";

export default function Pelatihan() {
  const [pelatihanList] = useState([
    {
      pelatihan_id: 1,
      nama_pelatihan: "Pelatihan Dasar Pemrograman",
      deskripsi_pelatihan: "Belajar logika pemrograman untuk pemula",
      tanggal_pelatihan: "10 November 2025",
      durasi_pelatihan: "3 Hari",
      lokasi_pelatihan: "Lab Komputer UNMUL",
    },
    {
      pelatihan_id: 2,
      nama_pelatihan: "Pelatihan Desain UI/UX",
      deskripsi_pelatihan:
        "Mempelajari dasar desain aplikasi yang user-friendly",
      tanggal_pelatihan: "15 November 2025",
      durasi_pelatihan: "2 Hari",
      lokasi_pelatihan: "Ruang Multimedia A",
    },
    {
      pelatihan_id: 3,
      nama_pelatihan: "Pelatihan Database Dasar",
      deskripsi_pelatihan: "Mengenal konsep dasar database relasional",
      tanggal_pelatihan: "20 November 2025",
      durasi_pelatihan: "1 Hari",
      lokasi_pelatihan: "Lab Basis Data",
    },
    {
      pelatihan_id: 4,
      nama_pelatihan: "Pelatihan Cloud Computing",
      deskripsi_pelatihan: "Dasar pemanfaatan cloud untuk aplikasi modern",
      tanggal_pelatihan: "25 November 2025",
      durasi_pelatihan: "2 Hari",
      lokasi_pelatihan: "Ruang Cloud Center",
    },
    {
      pelatihan_id: 5,
      nama_pelatihan: "Pelatihan AI dan Machine Learning",
      deskripsi_pelatihan: "Pengantar kecerdasan buatan dan pembelajaran mesin",
      tanggal_pelatihan: "28 November 2025",
      durasi_pelatihan: "3 Hari",
      lokasi_pelatihan: "Lab AI UNMUL",
    },
    {
      pelatihan_id: 6,
      nama_pelatihan: "Pelatihan Flutter Development",
      deskripsi_pelatihan: "Membangun aplikasi mobile dengan Flutter",
      tanggal_pelatihan: "30 November 2025",
      durasi_pelatihan: "3 Hari",
      lokasi_pelatihan: "Ruang Mobile Dev",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPelatihan, setSelectedPelatihan] = useState(null);

  // Pagination states
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const totalPages = Math.ceil(pelatihanList.length / limit);

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
  const displayedData = pelatihanList.slice(startIndex, startIndex + limit);

  const handleDelete = (pelatihan) => {
    setSelectedPelatihan(pelatihan);
    setOpenModal(true);
  };

  return (
    <div className="mt-12">
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex gap-y-4 flex-col sm:flex-row sm:items-center sm:justify-between p-6"
        >
          <Typography variant="h6" color="blue-gray">
            Daftar Pelatihan
          </Typography>
          <Link href="/admin/pelatihan/tambah">
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" /> Tambah Pelatihan
            </Button>
          </Link>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-auto">
              <thead>
                <tr>
                  {[
                    "No",
                    "Nama Pelatihan",
                    "Deskripsi",
                    "Tanggal",
                    "Durasi",
                    "Lokasi",
                    "Aksi",
                  ].map((head, index) => (
                    <th
                      key={head}
                      className={`border-b border-blue-gray-50 py-3 px-5 text-left ${index != 0 ? 'min-w-[200px]' : ''}`}
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedData.map((item, index) => (
                  <tr key={item.pelatihan_id}>
                    <td className="py-3 px-5">{startIndex + index + 1}</td>
                    <td className="py-3 px-5">{item.nama_pelatihan}</td>
                    <td className="py-3 px-5">{item.deskripsi_pelatihan}</td>
                    <td className="py-3 px-5">{item.tanggal_pelatihan}</td>
                    <td className="py-3 px-5">{item.durasi_pelatihan}</td>
                    <td className="py-3 px-5">{item.lokasi_pelatihan}</td>
                    <td className="py-3 px-5 flex gap-2">
                      <Tooltip content="Lihat Peserta">
                        <Link
                          href={`/admin/pelatihan/${item.pelatihan_id}/peserta`}
                        >
                          <IconButton variant="text" color="green">
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip content="Edit">
                        <Link href="/admin/pelatihan/edit">
                          <IconButton variant="text" color="blue">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip content="Hapus">
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => handleDelete(item)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-y-4 border-t border-blue-gray-50">
            <div className="flex items-center gap-2 sm:mb-0 order-2 md:order-1">
              <Typography variant="small">Tampilkan</Typography>
              <div className="w-[100px] max-w-sm min-w-[100px]">
                <div className="relative">
                  <select className="w-[100px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
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

      <HapusPelatihanModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        namaPelatihan={selectedPelatihan?.nama_pelatihan}
      />
    </div>
  );
}
