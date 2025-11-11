"use client";

import "@/css/tailwind.css";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchTrainings, fetchTrainingById } from "@/api";
import Link from "next/link";
import {
  CalendarDaysIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function TrainingDetailPage() {
  const params = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);

  // inisialisasi imgSrc dengan fallback agar hook useState selalu dipanggil sama
  const FALLBACK_IMG = "https://via.placeholder.com/1200x400.png?text=No+Image+Available";
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMG);

  useEffect(() => {
    let mounted = true;

    const getTraining = async () => {
      setLoading(true);
      try {
        // ambil semua pelatihan, cari yang slug-nya cocok lalu fetch by id
        const allTrainings = await fetchTrainings();
        const found = (allTrainings?.records || []).find((t) => {
          const slug = String(t.nama_pelatihan || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          return slug === params.slug;
        });

        if (!found) {
          if (mounted) {
            toast.error("Pelatihan tidak ditemukan.");
            setTraining(null);
          }
          return;
        }

        // gunakan fetch by id (sesuai permintaan)
        const detail = await fetchTrainingById(found.pelatihan_id);

        if (mounted) {
          setTraining(detail);
          // update gambar jika ada, kalau tidak pakai fallback
          setImgSrc(detail?.thumbnail_url || FALLBACK_IMG);
        }
      } catch (error) {
        console.error("Gagal memuat detail pelatihan:", error);
        if (mounted) toast.error("Gagal memuat detail pelatihan.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getTraining();

    return () => {
      mounted = false;
    };
  }, [params.slug]);

  if (loading)
    return <p className="container mx-auto px-6 py-10">Memuat...</p>;
  if (!training)
    return <p className="container mx-auto px-6 py-10">Pelatihan tidak ditemukan.</p>;

  return (
    <div className="container mx-auto px-6 py-10">
      <Link
        href="/pelatihan"
        className="flex items-center text-blue-600 hover:underline mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Kembali ke Daftar Pelatihan
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Banner Image dengan onError fallback */}
        <img
          src={imgSrc}
          alt={training.nama_pelatihan}
          className="w-full h-64 md:h-96 object-cover"
          onError={() => {
            if (imgSrc !== FALLBACK_IMG) setImgSrc(FALLBACK_IMG);
          }}
        />

        <div className="p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {training.nama_pelatihan}
          </h1>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              {new Date(training.tanggal_pelatihan).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>

            <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {training.lokasi_pelatihan}
            </span>

            {training.mitra && (
              <span className="flex items-center text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                Bersama {training.mitra.nama_mitra}
              </span>
            )}
          </div>

          <div
            className="prose prose-content max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: training.deskripsi_pelatihan }}
          />
        </div>
      </div>
    </div>
  );
}
