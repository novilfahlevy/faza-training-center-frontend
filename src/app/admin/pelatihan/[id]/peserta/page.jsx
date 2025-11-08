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
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowRightIcon,
  ArrowLeftIcon as OutlineArrowLeft,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import httpClient from "@/httpClient";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination";
import LoadingOverlay from "@/components/loading-overlay";

// 🔹 Utility: debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function PesertaPelatihanPage({ params }) {
  const { id } = params;

  const [pelatihan, setPelatihan] = useState(null);
  const [pesertaList, setPesertaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPelatihanLoading, setIsPelatihanLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch detail pelatihan
  const fetchPelatihanDetail = async () => {
    try {
      setIsPelatihanLoading(true);
      const res = await httpClient.get(`/v1/pelatihan/${id}`);
      setPelatihan(res.data);
    } catch (error) {
      console.error("Gagal mengambil detail pelatihan:", error);
      toast.error("Gagal memuat detail pelatihan.");
    } finally {
      setIsPelatihanLoading(false);
    }
  };

  // 🔹 Fetch peserta pelatihan
  const fetchPeserta = async (page = 1, perPage = 5, query = "") => {
    try {
      setIsLoading(true);
      const res = await httpClient.get(`/v1/pelatihan/${id}/peserta`, {
        params: { page: page - 1, size: perPage, search: query || undefined },
      });

      const { records, totalPages } = res.data;

      // Ambil data peserta dari backend
      const peserta = records.map((item) => ({
        peserta_id: item.peserta_id,
        nama_lengkap: item.peserta?.nama_lengkap,
        no_hp: item.peserta?.no_telp,
        email: item.peserta?.pengguna?.email,
        status_pendaftaran: item.status_pendaftaran || "Terdaftar",
      }));

      setPesertaList(peserta);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Gagal mengambil data peserta:", error);
      toast.error("Gagal memuat data peserta pelatihan.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔸 Debounced search handler
  const debouncedFetch = useCallback(
    debounce((query) => {
      fetchPeserta(1, limit, query);
    }, 500),
    [limit]
  );

  useEffect(() => {
    fetchPelatihanDetail();
    fetchPeserta(activePage, limit, search);
  }, [activePage, limit]);

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setActivePage(1);
  };

  const next = () => {
    if (activePage < totalPages) setActivePage((prev) => prev + 1);
  };

  const prev = () => {
    if (activePage > 1) setActivePage((prev) => prev - 1);
  };

  const handleDelete = (pesertaId) => {
    toast.info(`Fitur hapus peserta #${pesertaId} akan segera tersedia.`);
  };

  return (
    <div className="mt-10">
      {/* Header Detail Pelatihan */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {isPelatihanLoading ? (
            <Typography variant="small" color="gray">
              Memuat detail pelatihan...
            </Typography>
          ) : pelatihan ? (
            <div className="flex flex-col gap-y-1">
              <Typography variant="h5" color="blue-gray">
                {pelatihan.nama_pelatihan}
              </Typography>
              <Typography variant="small" color="gray" className="flex gap-x-2">
                <span>
                  {new Date(pelatihan.tanggal_pelatihan).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}{" "}
                </span>
                <span>•</span>
                <span>{pelatihan.lokasi_pelatihan}</span>
                {pelatihan.mitra && (
                  <React.Fragment>
                    <span>•</span>
                    <span>{pelatihan.mitra.nama_mitra}</span>
                  </React.Fragment>
                )}
              </Typography>
            </div>
          ) : (
            <Typography variant="small" color="gray">
              Data pelatihan tidak ditemukan.
            </Typography>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/admin/pelatihan/${id}/edit`}>
            <Button color="blue" className="flex items-center gap-2">
              <PencilIcon className="h-5 w-5" /> Edit
            </Button>
          </Link>
          <Link href="/admin/pelatihan">
            <Button
              color="gray"
              variant="outlined"
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" /> Kembali
            </Button>
          </Link>
        </div>
      </div>

      {/* Deskripsi Pelatihan */}
      <Card className="border border-blue-gray-100 shadow-sm mb-6">
        <CardHeader
          shadow={false}
          color="transparent"
          className="m-0 flex gap-y-4 flex-col md:flex-row md:items-center md:justify-between p-6 sticky top-0 bg-white z-10 border-b border-blue-gray-50"
        >
          <Typography variant="h6">Deskripsi</Typography>
        </CardHeader>
        <CardBody className="prose prose-custom max-w-none text-gray-800">
          <div dangerouslySetInnerHTML={{ __html: pelatihan?.deskripsi_pelatihan }} />
        </CardBody>
      </Card>

      {/* Tabel Peserta */}
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex gap-y-4 flex-col md:flex-row md:items-center md:justify-between p-6 sticky top-0 bg-white z-10 border-b border-blue-gray-50"
        >
          <Typography variant="h6">Daftar Peserta</Typography>
          <div>
            <Input
              placeholder="Cari peserta..."
              value={search}
              onChange={handleSearch}
              className="!w-full sm:!w-64 !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <LoadingOverlay active={isLoading}>
            <div className="overflow-x-auto">
              <div className="min-h-[400px]">
                <table className="w-full min-w-[800px] table-auto">
                  <thead className="bg-gray-200">
                    <tr>
                      {["No", "Nama", "Email", "No HP", "Status"].map(
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
                    {pesertaList.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-6 text-gray-500"
                        >
                          Tidak ada peserta terdaftar.
                        </td>
                      </tr>
                    ) : (
                      pesertaList.map((peserta, index) => (
                        <tr key={index} className="border-y-2">
                          <td className="py-3 px-5">
                            {(activePage - 1) * limit + index + 1}
                          </td>
                          <td className="py-3 px-5">
                            {peserta.nama_lengkap || "-"}
                          </td>
                          <td className="py-3 px-5">{peserta.email || "-"}</td>
                          <td className="py-3 px-5">{peserta.no_hp || "-"}</td>
                          <td className="py-3 px-5">
                            {peserta.status_pendaftaran}
                          </td>
                          {/* <td className="py-3 px-5 flex gap-2">
                            <Tooltip content="Hapus">
                              <IconButton
                                variant="outlined"
                                color="red"
                                onClick={() => handleDelete(peserta.peserta_id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </td> */}
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
    </div>
  );
}
