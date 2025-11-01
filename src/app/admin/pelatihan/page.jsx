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
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import HapusPelatihanModal from "@/components/pelatihan/hapus-pelatihan-modal";

export default function Pelatihan() {
  const [pelatihanList, setPelatihanList] = useState([
    {
      pelatihan_id: 1,
      nama_pelatihan: "Pelatihan Dasar Pemrograman",
      deskripsi_pelatihan: "Belajar logika pemrograman untuk pemula",
      tanggal_pelatihan: "10 November 2025",
      durasi_pelatihan: "3 Hari",
      lokasi_pelatihan: "Lab Komputer UNMUL",
      user_id: 1,
      role: "admin",
    },
    {
      pelatihan_id: 2,
      nama_pelatihan: "Pelatihan Desain UI/UX",
      deskripsi_pelatihan: "Mempelajari dasar desain aplikasi yang user-friendly",
      tanggal_pelatihan: "15 November 2025",
      durasi_pelatihan: "2 Hari",
      lokasi_pelatihan: "Ruang Multimedia A",
      user_id: 1,
      role: "admin",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPelatihan, setSelectedPelatihan] = useState(null);

  const handleDelete = (pelatihan) => {
    setSelectedPelatihan(pelatihan);
    setOpenModal(true);
  };

  const confirmDelete = () => {
    console.log("Pelatihan dihapus:", selectedPelatihan);
    setPelatihanList((prev) =>
      prev.filter((item) => item.pelatihan_id !== selectedPelatihan.pelatihan_id)
    );
    setOpenModal(false);
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
          <div>
            <Typography variant="h6" color="blue-gray">
              Daftar Pelatihan
            </Typography>
          </div>
          <Link href="/admin/pelatihan/tambah">
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" /> Tambah Pelatihan
            </Button>
          </Link>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
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
                ].map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
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
              {pelatihanList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium text-blue-gray-500"
                    >
                      Tidak ada data pelatihan
                    </Typography>
                  </td>
                </tr>
              ) : (
                pelatihanList.map((item, index) => {
                  const isLast = index === pelatihanList.length - 1;
                  const classes = isLast
                    ? "py-3 px-5"
                    : "py-3 px-5 border-b border-blue-gray-50";

                  return (
                    <tr key={item.pelatihan_id}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {index + 1}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {item.nama_pelatihan}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="text-blue-gray-600"
                        >
                          {item.deskripsi_pelatihan}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small">
                          {item.tanggal_pelatihan}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small">
                          {item.durasi_pelatihan}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small">
                          {item.lokasi_pelatihan}
                        </Typography>
                      </td>
                      <td className={`${classes} flex items-center gap-3`}>
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
                  );
                })
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <HapusPelatihanModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmDelete}
        namaPelatihan={selectedPelatihan?.nama_pelatihan}
      />
    </div>
  );
}
