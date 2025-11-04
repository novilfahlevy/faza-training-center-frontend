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
  Chip,
  Input,
} from "@material-tailwind/react";
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import TambahPenggunaModal from "@/components/pengguna/tambah-pengguna-modal";
import EditPenggunaModal from "@/components/pengguna/edit-pengguna-modal";
import HapusPenggunaModal from "@/components/pengguna/hapus-pengguna-modal";
import DetailPenggunaModal from "@/components/pengguna/detail-pengguna-modal";

export default function PenggunaPage() {
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openHapus, setOpenHapus] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { user_id: 1, email: "admin@ftc.com", role: "admin" },
    {
      user_id: 2,
      email: "peserta1@ftc.com",
      role: "calon_peserta",
      calon_peserta: {
        nama_lengkap: "Rizky Pratama",
        tempat_lahir: "Samarinda",
        tanggal_lahir: "1999-05-12",
        jenis_kelamin: "L",
        alamat: "Jl. Cendana No. 5 Samarinda",
        profesi: "Mahasiswa",
        instansi: "Universitas Mulawarman",
        no_reg_kes: "REG-2025-001",
        no_telp: "081234567890",
      },
    },
    {
      user_id: 3,
      email: "mitra@ftc.com",
      role: "mitra",
      mitra: {
        nama_mitra: "PT Sukses Bersama",
        deskripsi_mitra: "Perusahaan mitra pelatihan kerja profesional",
        alamat_mitra: "Jl. Gatot Subroto No. 45",
        telepon_mitra: "081298765432",
        email_mitra: "mitra@ftc.com",
        website_mitra: "www.suksesbersama.co.id",
      },
    },
  ];

  // pagination
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const totalPages = Math.ceil(users.length / limit);

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
  const displayedData = users.slice(startIndex, startIndex + limit);

  return (
    <div className="mt-12">
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex gap-y-4 flex-col md:flex-row md:items-center md:justify-between p-6"
        >
          <Typography variant="h6">
            Daftar Pengguna
          </Typography>
          <div className="flex flex-col gap-y-4 sm:flex-row sm:items-center sm:gap-x-4">
            <Input
              placeholder="Cari pengguna"
              className="!w-full sm:!w-64 !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <div>
              <Button
                onClick={() => setOpenTambah(true)}
                className="flex items-center gap-2 px-4 py-2 whitespace-nowrap"
              >
                <PlusIcon className="h-5 w-5" /> Tambah Pengguna
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-auto">
              <thead>
                <tr>
                  {["No", "Role", "Email", "Nama Lengkap", "Aksi"].map(
                    (head) => (
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
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.user_id}>
                    <td className="py-3 px-5">{user.user_id}</td>
                    <td className="py-3 px-5 capitalize">
                      <Chip
                        variant="gradient"
                        color={
                          user.role == "calon_peserta"
                            ? "green"
                            : user.role == "mitra"
                            ? "purple"
                            : "blue-gray"
                        }
                        value={
                          user.role == "calon_peserta"
                            ? "Calon Peserta"
                            : user.role
                        }
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className="py-3 px-5">{user.email}</td>
                    <td className="py-3 px-5">
                      {user.role == "calon_peserta"
                        ? user.calon_peserta.nama_lengkap
                        : user.role == "mitra"
                        ? user.mitra?.nama_mitra || "-"
                        : "-"}
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-start gap-2">
                        {/* Detail */}
                        <Tooltip content="Detail">
                          <IconButton
                            variant="outlined"
                            color="green"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenDetail(true);
                            }}
                            className={
                              user.role === "calon_peserta" ||
                              user.role === "mitra"
                                ? ""
                                : "opacity-0 pointer-events-none"
                            }
                          >
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>

                        {/* Edit */}
                        <Tooltip content="Edit Mitra">
                          <IconButton
                            variant="outlined"
                            color="amber"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenEdit(true);
                            }}
                            className={
                              user.role === "mitra"
                                ? ""
                                : "opacity-0 pointer-events-none"
                            }
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>

                        {/* Hapus */}
                        <Tooltip content="Hapus">
                          <IconButton
                            variant="outlined"
                            color="red"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenHapus(true);
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
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

      {/* Modal */}
      <TambahPenggunaModal
        open={openTambah}
        onClose={() => setOpenTambah(false)}
      />
      <EditPenggunaModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
      />
      <HapusPenggunaModal
        open={openHapus}
        onClose={() => setOpenHapus(false)}
        selectedUser={selectedUser}
      />
      <DetailPenggunaModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        user={selectedUser}
      />
    </div>
  );
}
