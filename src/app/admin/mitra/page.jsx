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
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

import TambahMitraModal from "@/components/admin/mitra/tambah-mitra-modal";
import EditMitraModal from "@/components/admin/mitra/edit-mitra-modal";
import HapusMitraModal from "@/components/admin/mitra/hapus-mitra-modal";
import DetailMitraModal from "@/components/admin/mitra/detail-mitra-modal";

export default function MitraPage() {
  // Dummy data
  const [mitraList, setMitraList] = useState([
    {
      mitra_id: 1,
      nama_mitra: "PT Teknologi Nusantara",
      deskripsi_mitra: "Perusahaan software house di Samarinda",
      alamat_mitra: "Jl. M. Yamin No. 12, Samarinda",
      telepon_mitra: "081234567890",
      email_mitra: "kontak@teknologi.co.id",
      website_mitra: "https://teknologi.co.id",
    },
    {
      mitra_id: 2,
      nama_mitra: "CV Kreatif Media",
      deskripsi_mitra: "Penyedia jasa desain dan multimedia",
      alamat_mitra: "Jl. Antasari No. 88, Samarinda",
      telepon_mitra: "085234567891",
      email_mitra: "info@kreatifmedia.com",
      website_mitra: "https://kreatifmedia.com",
    },
    {
      mitra_id: 3,
      nama_mitra: "Universitas Mulawarman",
      deskripsi_mitra: "Perguruan tinggi negeri di Kalimantan Timur",
      alamat_mitra: "Jl. Kuaro, Samarinda Ulu",
      telepon_mitra: "0541-123456",
      email_mitra: "info@unmul.ac.id",
      website_mitra: "https://unmul.ac.id",
    },
  ]);

  // Modal states
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openHapus, setOpenHapus] = useState(false);
  const [selectedMitra, setSelectedMitra] = useState(null);

  // Pagination states
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const totalPages = Math.ceil(mitraList.length / limit);

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
  const displayedData = mitraList.slice(startIndex, startIndex + limit);

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
            Daftar Mitra
          </Typography>
          <Button
            className="flex items-center gap-2"
            onClick={() => setOpenTambah(true)}
          >
            <PlusIcon className="h-5 w-5" /> Tambah Mitra
          </Button>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-auto">
              <thead>
                <tr>
                  {[
                    "No",
                    "Nama Mitra",
                    "Deskripsi",
                    "Alamat",
                    "Telepon",
                    "Email",
                    "Aksi",
                  ].map((head, index) => (
                    <th
                      key={head}
                      className={`border-b border-blue-gray-50 py-3 px-5 text-left ${
                        index !== 0 ? "min-w-[200px]" : ""
                      }`}
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
                  <tr key={item.mitra_id}>
                    <td className="py-3 px-5">{startIndex + index + 1}</td>
                    <td className="py-3 px-5">{item.nama_mitra}</td>
                    <td className="py-3 px-5">{item.deskripsi_mitra}</td>
                    <td className="py-3 px-5">{item.alamat_mitra}</td>
                    <td className="py-3 px-5">{item.telepon_mitra}</td>
                    <td className="py-3 px-5">{item.email_mitra}</td>
                    <td className="py-3 px-5 flex gap-2">
                      <Tooltip content="Detail">
                        <IconButton
                          variant="text"
                          color="green"
                          onClick={() => {
                            setSelectedMitra(item);
                            setOpenDetail(true);
                          }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip content="Edit">
                        <IconButton
                          variant="text"
                          color="blue"
                          onClick={() => {
                            setSelectedMitra(item);
                            setOpenEdit(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip content="Hapus">
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => {
                            setSelectedMitra(item);
                            setOpenHapus(true);
                          }}
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

          {/* Pagination & Limit */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-y-4 border-t border-blue-gray-50">
            <div className="flex items-center gap-2 sm:mb-0 order-2 md:order-1">
              <Typography variant="small">Tampilkan</Typography>
              <div className="w-[100px] max-w-sm min-w-[100px]">
                <div className="relative">
                  <select
                    className="w-[100px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setActivePage(1);
                    }}
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

      {/* Modals */}
      <TambahMitraModal open={openTambah} onClose={() => setOpenTambah(false)} />
      <EditMitraModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        mitra={selectedMitra}
      />
      <DetailMitraModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        mitra={selectedMitra}
      />
      <HapusMitraModal
        open={openHapus}
        onClose={() => setOpenHapus(false)}
        mitra={selectedMitra}
      />
    </div>
  );
}
