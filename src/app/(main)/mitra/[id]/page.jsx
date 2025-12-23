"use client";

import "@/css/tailwind.css";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchMitraById } from "@/mainHttpClient";
import { toast } from "react-toastify";
import { Button, Typography, Breadcrumbs } from "@material-tailwind/react";
import {
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-100">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
      </div>
      <p className="mt-6 text-gray-600 text-lg font-medium">
        Memuat detail mitra...
      </p>
    </div>
  );
}

export default function DetailMitraPage() {
  const params = useParams();
  const router = useRouter();
  const [mitra, setMitra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tentang");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const mitraid = params.id;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await fetchMitraById(mitraid);
        setMitra(response);
      } catch (error) {
        console.error("Gagal mengambil detail mitra:", error);
        toast.error("Gagal memuat detail mitra");
        router.push("/mitra");
      } finally {
        setLoading(false);
      }
    };

    if (mitraid) {
      fetchDetail();
    }
  }, [mitraid, router]);

  if (loading) return <LoadingSpinner />;
  if (!mitra) return null;

  const handleRating = (value) => {
    setRating(value);
    toast.success(`Terima kasih telah memberi rating ${value} bintang!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs className="bg-transparent">
            <a
              href="/mitra"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mitra
            </a>
            <span className="text-gray-600">{mitra.nama_mitra}</span>
          </Breadcrumbs>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="text"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 p-0 font-medium"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-700 shadow-2xl mb-10">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-8 py-12 md:px-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-2xl shadow-xl flex items-center justify-center p-4 transform hover:scale-105 transition-transform duration-300">
                  {mitra.logo_mitra ? (
                    <img
                      src={mitra.logo_mitra}
                      alt={mitra.nama_mitra}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <GlobeAltIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <Typography variant="small" className="text-gray-500">
                        Tidak ada logo
                      </Typography>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left text-white">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <Typography variant="h2" className="font-bold">
                    {mitra.nama_mitra}
                  </Typography>
                </div>

                <Typography
                  variant="h5"
                  className="font-semibold mb-2 text-white/90"
                >
                  Visi & Misi
                </Typography>

                <p className="text-white/90 max-w-2xl">
                  {mitra.visi_misi ||
                    "Mitra terpercaya yang menyediakan layanan berkualitas tinggi untuk membantu Anda mencapai tujuan."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Tentang {mitra.nama_mitra}
              </h3>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p className="leading-relaxed">
                  {mitra.deskripsi_mitra ||
                    "Tidak ada deskripsi yang tersedia untuk mitra ini. Silakan hubungi mitra untuk informasi lebih lanjut."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Informasi Kontak
              </h3>
              <div className="space-y-6">
                {mitra.alamat_mitra && (
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <MapPinIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Alamat
                      </h4>
                      <p className="text-gray-600">{mitra.alamat_mitra}</p>
                    </div>
                  </div>
                )}

                {mitra.telepon_mitra && (
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <PhoneIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Telepon
                      </h4>
                      <a
                        href={`tel:${mitra.telepon_mitra}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {mitra.telepon_mitra}
                      </a>
                    </div>
                  </div>
                )}

                {mitra.website_mitra && (
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="break-words">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Website
                      </h4>
                      <a
                        href={mitra.website_mitra}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {mitra.website_mitra}
                      </a>
                    </div>
                  </div>
                )}

                {mitra.pengguna?.email && (
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Email
                      </h4>
                      <a
                        href={`mailto:${mitra.pengguna.email}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {mitra.pengguna.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* CTA Card */}
            <div className="bg-indigo-700 rounded-2xl shadow-xl p-8 text-white mb-8">
              <h3 className="text-xl font-bold mb-4">
                Tertarik Berkolaborasi?
              </h3>
              <p className="mb-6 text-white/90">
                Hubungi mitra ini untuk informasi lebih lanjut tentang layanan
                dan ketersediaan mereka.
              </p>
              <div className="space-y-3">
                {mitra.telepon_mitra && (
                  <a
                    href={`tel:${mitra.telepon_mitra}`}
                    className="block w-full py-3 px-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-center"
                  >
                    Hubungi via Telepon
                  </a>
                )}
                {mitra.pengguna?.email && (
                  <a
                    href={`mailto:${mitra.pengguna.email}`}
                    className="block w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors text-center"
                  >
                    Kirim Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
