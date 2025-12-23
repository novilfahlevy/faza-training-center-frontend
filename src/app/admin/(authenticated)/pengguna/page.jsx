"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import TambahPenggunaModal from "@/components/admin/pengguna/tambah-pengguna-modal";
import EditPenggunaModal from "@/components/admin/pengguna/edit-pengguna-modal";
import HapusPenggunaModal from "@/components/admin/pengguna/hapus-pengguna-modal";
import DetailPenggunaModal from "@/components/admin/pengguna/detail-pengguna-modal";
import {
  fetchPenggunaList,
  fetchPenggunaById,
  deletePengguna,
} from "@/adminHttpClient";
import { toast } from "react-toastify";
import Pagination from "@/components/admin/pagination";
import LoadingOverlay from "@/components/admin/loading-overlay";
import { useAuthStore } from "@/stores/useAuthStore";

// 🧠 Utility: debounce function untuk mencegah panggilan API berlebihan saat mengetik
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function PenggunaPage() {
  // --- STATE MANAGEMENT ---
  const [authUser, setAuthUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [search, setSearch] = useState("");

  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // State untuk mengontrol visibilitas modal
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openHapus, setOpenHapus] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  // State untuk menyimpan data pengguna yang sedang dipilih/diedit
  const [selectedUser, setSelectedUser] = useState(null);

  // 🔹 Get auth user dari zustand store (client-side only)
  useEffect(() => {
    setAuthUser(useAuthStore.getState().user);
  }, []);

  // 🚀 Fungsi untuk mengambil daftar pengguna
  const fetchUsers = async (page = 1, perPage = 5, query = "") => {
    try {
      setIsLoading(true);

      const params = { page: page, size: perPage };
      if (query) params.search = query;
      const response = await fetchPenggunaList(params);

      const { records, totalPages } = response.data;
      setUsers(records || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      toast.error("Gagal memuat data pengguna.", {
        position: "top-right",
        autoClose: 2500,
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔍 Fungsi untuk mengambil detail satu pengguna
  const fetchUserDetail = async (userId) => {
    try {
      setLoadingDetail(true);
      const response = await fetchPenggunaById(userId);
      setSelectedUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Gagal mengambil detail pengguna:", error);
      toast.error("Gagal memuat detail pengguna.", {
        position: "top-right",
        autoClose: 2500,
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  // --- EVENT HANDLERS ---
  // ⚡️ Debounced search handler
  const debouncedFetch = useCallback(
    debounce((query) => {
      fetchUsers(1, limit, query);
    }, 500),
    [limit]
  );

  // Trigger fetch data saat halaman atau limit berubah
  useEffect(() => {
    fetchUsers(activePage, limit, search);
  }, [activePage, limit]);

  // Trigger fetch data saat search berubah (dengan debounce)
  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setActivePage(1); // Reset ke halaman pertama saat pencarian berubah
  };

  const next = () => {
    if (activePage < totalPages) setActivePage((prev) => prev + 1);
  };

  const prev = () => {
    if (activePage > 1) setActivePage((prev) => prev - 1);
  };

  const handleDelete = async (user) => {
    try {
      await deletePengguna(user.id);
      toast.success("Pengguna berhasil dihapus!", {
        position: "top-right",
        autoClose: 2500,
      });

      // Refresh daftar pengguna setelah hapus
      fetchUsers(activePage, limit, search);
    } catch (error) {
      console.error("Gagal menghapus pengguna:", error);
      toast.error(
        error.response?.data?.message || "Gagal menghapus pengguna.",
        { position: "top-right", autoClose: 3000 }
      );
    }
  };

  // 🔹 Fungsi untuk membuka modal detail dan mengambil data pengguna
  const handleOpenDetailModal = async (user) => {
    await fetchUserDetail(user.id);
    setOpenDetail(true);
  };

  // 🔹 Fungsi untuk membuka modal edit dan mengambil data pengguna
  const handleOpenEditModal = async (user) => {
    await fetchUserDetail(user.id);
    setOpenEdit(true);
  };

  return (
    <div className="mt-12">
      <Card className="border border-blue-gray-100 shadow-sm">
        {/* Header: Judul, Pencarian, dan Tombol Tambah */}
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex gap-y-4 flex-col md:flex-row md:items-center md:justify-between p-6 sticky top-0 bg-white z-10 border-b border-blue-gray-50"
        >
          <Typography variant="h6">Daftar Pengguna</Typography>
          <div className="flex flex-col gap-y-4 sm:flex-row sm:items-center sm:gap-x-4">
            <Input
              placeholder="Cari pengguna (nama/email/role)"
              value={search}
              onChange={handleSearch}
              className="!w-full sm:!w-64 !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {authUser?.role === "admin" && (
              <div>
                <Button
                  onClick={() => setOpenTambah(true)}
                  className="flex items-center gap-2 px-4 py-2 whitespace-nowrap"
                >
                  <PlusIcon className="h-5 w-5" /> Tambah Pengguna
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Body: Tabel Data Pengguna */}
        <CardBody className="px-0 pt-0 pb-2">
          <LoadingOverlay active={isLoading}>
            <div className="overflow-x-auto">
              <div className="min-h-[400px]">
                <table className="w-full min-w-[800px] table-auto">
                  <thead className="bg-gray-200">
                    <tr>
                      {[
                        "No",
                        "Role",
                        "Email",
                        "Nama Lengkap / Mitra",
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
                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-6 text-gray-500"
                        >
                          Tidak ada data pengguna.
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr key={user.id} className="border-y">
                          <td className="py-3 px-5">
                            {(activePage - 1) * limit + index + 1}
                          </td>
                          <td className="py-3 px-5 capitalize">
                            <Chip
                              variant="gradient"
                              color={
                                user.role === "peserta"
                                  ? "blue"
                                  : user.role === "mitra"
                                  ? "purple"
                                  : "blue-gray"
                              }
                              value={user.role}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit"
                            />
                          </td>
                          <td className="py-3 px-5">{user.email}</td>
                          <td className="py-3 px-5">
                            {user.nama_lengkap || "-"}
                          </td>
                          <td className="py-3 px-5 flex gap-2">
                            <Tooltip content="Detail">
                              <IconButton
                                variant="outlined"
                                color="green"
                                onClick={() => handleOpenDetailModal(user)}
                                className={
                                  user.role === "peserta" ||
                                  user.role === "mitra"
                                    ? ""
                                    : "opacity-0 pointer-events-none"
                                }
                              >
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            {authUser?.role === "admin" && (
                              <>
                                <Tooltip content="Edit">
                                  <IconButton
                                    variant="outlined"
                                    color="amber"
                                    onClick={() => handleOpenEditModal(user)}
                                    className={
                                      user.role === "mitra"
                                        ? ""
                                        : "opacity-0 pointer-events-none"
                                    }
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip content="Hapus">
                                  <IconButton
                                    variant="outlined"
                                    color="red"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setOpenHapus(true);
                                    }}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </LoadingOverlay>

          {/* Pagination Controls */}
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

      {/* Modal Section */}
      <TambahPenggunaModal
        open={openTambah}
        onClose={() => setOpenTambah(false)}
        onSuccess={() => fetchUsers(activePage, limit, search)}
      />
      <EditPenggunaModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
        onSuccess={() => fetchUsers(activePage, limit, search)}
      />
      <HapusPenggunaModal
        open={openHapus}
        onClose={() => setOpenHapus(false)}
        selectedUser={selectedUser}
        onSuccess={() => fetchUsers(activePage, limit, search)}
      />
      <DetailPenggunaModal
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
}
