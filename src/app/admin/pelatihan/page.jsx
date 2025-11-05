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
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import HapusPelatihanModal from "@/components/pelatihan/hapus-pelatihan-modal";
import httpClient from "@/httpClient";

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
          <div className="overflow-x-auto">
            <div className="min-h-[400px]">
              <table className="w-full min-w-[800px] table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "No",
                      "Nama Pelatihan",
                      "Tanggal",
                      "Durasi",
                      "Lokasi",
                      "Aksi",
                    ].map((head, index) => (
                      <th
                        key={head}
                        className={`border-b border-blue-gray-50 py-3 px-5 text-left ${
                          index != 0 ? "min-w-[200px]" : ""
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
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-6 text-gray-500 text-center h-[300px]"
                      >
                        <div className="flex justify-center items-center h-full">
                          Memuat data pelatihan...
                        </div>
                      </td>
                    </tr>
                  ) : pelatihanList.length === 0 ? (
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
                      <tr key={item.pelatihan_id} className="border-y-2">
                        <td className="py-3 px-5">
                          {(activePage - 1) * limit + index + 1}
                        </td>
                        <td className="py-3 px-5">{item.nama_pelatihan}</td>
                        <td className="py-3 px-5">
                          {new Date(item.tanggal_pelatihan).toLocaleDateString(
                            "id-ID",
                            { day: "2-digit", month: "long", year: "numeric" }
                          )}
                        </td>
                        <td className="py-3 px-5">{item.durasi_pelatihan}</td>
                        <td className="py-3 px-5">{item.lokasi_pelatihan}</td>
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

          {/* Sticky Footer: Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-y-4 border-t border-blue-gray-50 sticky bottom-0 bg-white z-10">
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
                variant="filled"
                className="flex items-center gap-2"
                onClick={prev}
                disabled={activePage === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
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
                variant="filled"
                className="flex items-center gap-2"
                onClick={next}
                disabled={activePage === totalPages}
              >
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
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
