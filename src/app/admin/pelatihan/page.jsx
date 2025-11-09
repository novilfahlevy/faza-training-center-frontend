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
  Input,
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import HapusPelatihanModal from "@/components/pelatihan/hapus-pelatihan-modal";
import httpClient from "@/httpClient";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination";
import LoadingOverlay from "@/components/loading-overlay";

// 🧠 Utility: debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function Pelatihan() {
  const [pelatihanList, setPelatihanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPelatihan, setSelectedPelatihan] = useState(null);

  const fetchPelatihan = async (page = 1, perPage = 5, query = "") => {
    try {
      setIsLoading(true);
      const response = await httpClient.get("/v1/pelatihan", {
        params: {
          page: page - 1,
          size: perPage,
          search: query || undefined,
        },
      });

      const { records, totalPages } = response.data;
      setPelatihanList(records || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Gagal mengambil data pelatihan:", error);
      setPelatihanList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ⚡️ Debounced search handler
  const debouncedFetch = useCallback(
    debounce((query) => {
      fetchPelatihan(1, limit, query);
    }, 500),
    [limit]
  );

  // Trigger setiap kali halaman atau limit berubah
  useEffect(() => {
    fetchPelatihan(activePage, limit, search);
  }, [activePage, limit]);

  // Trigger setiap kali search berubah
  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setActivePage(1);
  };

  const handleDelete = (pelatihan) => {
    setSelectedPelatihan(pelatihan);
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPelatihan) return;

    try {
      const response = await httpClient.delete(
        `/v1/pelatihan/${selectedPelatihan.pelatihan_id}`
      );

      toast.success(response.data.message || "Pelatihan berhasil dihapus!", {
        position: "top-right",
        autoClose: 2500,
      });

      // Refresh daftar pelatihan setelah hapus
      fetchPelatihan(activePage, limit, search);
    } catch (error) {
      console.error("Gagal menghapus pelatihan:", error);
      toast.error(
        error.response?.data?.message || "Gagal menghapus pelatihan.",
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setOpenModal(false);
    }
  };

  const next = () => {
    if (activePage < totalPages) setActivePage((prev) => prev + 1);
  };

  const prev = () => {
    if (activePage > 1) setActivePage((prev) => prev - 1);
  };

  return (
    <div className="mt-12">
      <Card className="border border-blue-gray-100 shadow-sm">
        {/* Sticky Header */}
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex gap-y-4 flex-col md:flex-row md:items-center md:justify-between p-6 sticky top-0 bg-white z-10 border-b border-blue-gray-50"
        >
          <Typography variant="h6">Daftar Pelatihan</Typography>
          <div className="flex flex-col gap-y-4 sm:flex-row sm:items-center sm:gap-x-4">
            <Input
              placeholder="Cari pelatihan..."
              value={search}
              onChange={handleSearch}
              className="!w-full sm:!w-64 !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Link href="/admin/pelatihan/tambah">
              <Button className="flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                <PlusIcon className="h-5 w-5" /> Tambah Pelatihan
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <LoadingOverlay active={isLoading}>
            <div className="overflow-x-auto">
              <div className="min-h-[400px]">
                <table className="w-full min-w-[800px] table-auto">
                  <thead className="bg-gray-200">
                    <tr>
                      {[
                        "No",
                        "Thumbnail",
                        "Nama Pelatihan",
                        "Tanggal",
                        "Durasi",
                        "Lokasi",
                        "Aksi",
                      ].map((head, index) => (
                        <th
                          key={head}
                          className={`border-b border-blue-gray-50 py-3 px-5 text-left ${
                            index !== 0 ? "min-w-[160px]" : ""
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
                    {pelatihanList.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-6 text-gray-500"
                        >
                          Tidak ada data pelatihan.
                        </td>
                      </tr>
                    ) : (
                      pelatihanList.map((item, index) => (
                        <tr
                          key={item.pelatihan_id}
                          className="border-y-2 hover:bg-gray-50 transition"
                        >
                          {/* Nomor urut */}
                          <td className="py-3 px-5">
                            {(activePage - 1) * limit + index + 1}
                          </td>

                          {/* Thumbnail */}
                          <td className="py-3 px-5">
                            {item.thumbnail_url ? (
                              <img
                                src={item.thumbnail_url}
                                alt="Thumbnail"
                                className="w-32 h-20 rounded-md object-cover border border-gray-200 shadow-sm"
                              />
                            ) : (
                              <div className="w-32 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs border">
                                No Img
                              </div>
                            )}
                          </td>

                          {/* Nama pelatihan */}
                          <td className="py-3 px-5">{item.nama_pelatihan}</td>

                          {/* Tanggal */}
                          <td className="py-3 px-5">
                            {new Date(
                              item.tanggal_pelatihan
                            ).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>

                          {/* Durasi */}
                          <td className="py-3 px-5">{item.durasi_pelatihan}</td>

                          {/* Lokasi */}
                          <td className="py-3 px-5">{item.lokasi_pelatihan}</td>

                          {/* Aksi */}
                          <td className="py-3 px-5 flex gap-2">
                            <Tooltip content="Lihat Peserta">
                              <Link
                                href={`/admin/pelatihan/${item.pelatihan_id}/peserta`}
                              >
                                <IconButton variant="outlined" color="green">
                                  <EyeIcon className="h-4 w-4" />
                                </IconButton>
                              </Link>
                            </Tooltip>
                            <Tooltip content="Edit">
                              <Link
                                href={`/admin/pelatihan/${item.pelatihan_id}/edit`}
                              >
                                <IconButton variant="outlined" color="blue">
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
                              </Link>
                            </Tooltip>
                            <Tooltip content="Hapus">
                              <IconButton
                                variant="outlined"
                                color="red"
                                onClick={() => handleDelete(item)}
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

      <HapusPelatihanModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        namaPelatihan={selectedPelatihan?.nama_pelatihan}
      />
    </div>
  );
}
