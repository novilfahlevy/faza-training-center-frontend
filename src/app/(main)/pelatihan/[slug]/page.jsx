// /home/novilfahlevy/Projects/faza-training-center/src/app/(main)/pelatihan/[slug]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  fetchTrainingStatus,
  fetchTrainingBySlug,
  getUserProfile,
  registerForTrainingWithFile,
} from "@/mainHttpClient";
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { useAuthStore } from "@/stores/useAuthStore";

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-blue-400"></div>
      </div>
    </div>
  );
}

export default function PelatihanDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { token, isHydrated } = useAuthStore();

  const [training, setTraining] = useState(null);
  const [registerStatus, setRegisterStatus] = useState(null);
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reset scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  // Ambil detail pelatihan
  useEffect(() => {
    const getTraining = async () => {
      try {
        setError(null);
        setLoading(true);
        const detail = await fetchTrainingBySlug(params.slug);
        setTraining(detail);
      } catch (error) {
        console.error("Gagal memuat detail pelatihan:", error);
        setError("Gagal memuat detail pelatihan. Silakan coba lagi nanti.");
        toast.error("Gagal memuat detail pelatihan.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    getTraining();
  }, [params.slug]);

  const isLoggedIn = Boolean(token && profile);

  // Ambil detail kepesertaan
  useEffect(() => {
    const getRegistrationStatus = async () => {
      try {
        const data = await fetchTrainingStatus(params.slug);
        setRegisterStatus(data);
      } catch (error) {
        console.error("Gagal memuat detail kepesertaan:", error);
      }
    };

    if (token) {
      getRegistrationStatus();
    }
  }, [params.slug, token]);

  // Ambil profil user jika login
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        toast.error("Gagal memuat profil pengguna.");
      }
    };

    if (token) {
      loadUserProfile();
    }
  }, [token]);

  // Validasi & Kirim File ke API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Jika pelatihan gratis, tidak perlu upload bukti pembayaran
    if (training.biaya === 0 || training.biaya === "0") {
      setSubmitting(true);
      try {
        const data = await registerForTrainingWithFile(params.slug, null);
        toast.success("Pendaftaran berhasil dikirim!");
        setRegisterStatus({
          status: data.data.status_pendaftaran,
          bukti_pembayaran_url: data.data.bukti_url,
        });
      } catch (error) {
        toast.error(error.message || "Gagal mengirim pendaftaran.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!file) {
      toast.error("Silakan upload bukti pembayaran terlebih dahulu!");
      return;
    }

    // Validasi tipe file
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("File harus berupa PDF atau gambar (JPG, PNG)!");
      return;
    }

    // Validasi ukuran file (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5 MB!");
      return;
    }

    setSubmitting(true);
    try {
      const data = await registerForTrainingWithFile(params.slug, file);
      toast.success("Pendaftaran berhasil dikirim!");
      setRegisterStatus({
        status: data.data.status_pendaftaran,
        bukti_pembayaran_url: data.data.bukti_url,
      });
    } catch (error) {
      toast.error(error.message || "Gagal mengirim pendaftaran.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
          <p className="font-medium">Terjadi kesalahan</p>
          <p>{error}</p>
          <Button
            variant="text"
            color="red"
            className="mt-2"
            onClick={() => router.push("/pelatihan")}
          >
            Kembali ke daftar pelatihan
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Memuat detail pelatihan...</p>
        </div>
      </div>
    );
  }

  // Check if user is registered
  const isRegistered =
    registerStatus &&
    registerStatus.status &&
    (registerStatus.status.toLowerCase() === "terdaftar" ||
      registerStatus.status.toLowerCase() === "selesai" ||
      registerStatus.status.toLowerCase() === "pending");

  return (
    <div className="container mx-auto px-6 py-10">
      {isLoggedIn ? (
        // Layout 60:40 jika login
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-8 gap-x-4">
          <div className="lg:col-span-3">
            <Link
              href="/pelatihan"
              className="flex items-center text-blue-600 hover:underline"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Kembali ke daftar
              pelatihan
            </Link>
          </div>
          <div className="lg:col-span-3">
            <TrainingDetailCard
              training={training}
              isRegistered={isRegistered}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28">
              {registerStatus && registerStatus.status ? (
                <RegisterStatusCard
                  status={registerStatus}
                  isFree={training.biaya === 0 || training.biaya === "0"}
                  training={training}
                  isRegistered={isRegistered}
                />
              ) : (
                <RegisterCard
                  user={profile}
                  file={file}
                  submitting={submitting}
                  onFileChange={setFile}
                  onSubmit={handleSubmit}
                  training={training}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        // Hanya tampilkan detail pelatihan untuk user yang belum login
        <div className="w-full lg:w-3/5 mx-auto">
          <Link
            href="/pelatihan"
            className="flex items-center text-blue-600 hover:underline mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Kembali ke daftar
            pelatihan
          </Link>
          <TrainingDetailCard
            training={training}
            showLoginPrompt={!isLoggedIn}
            isRegistered={false}
          />
        </div>
      )}
    </div>
  );
}

// Helper function untuk format currency
const formatCurrency = (amount) => {
  if (!amount || amount === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// === KOMPONEN: Card Detail Pelatihan ===
function TrainingDetailCard({
  training,
  showLoginPrompt = false,
  isRegistered = false,
}) {
  const router = useRouter();
  const isFree =
    !training.biaya || training.biaya === 0 || training.biaya === "0";

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Thumbnail */}
      {training.thumbnail_url && (
        <img
          src={training.thumbnail_url}
          alt={training.nama_pelatihan}
          className="w-full object-contain"
        />
      )}

      <div className="p-6 lg:p-8">
        {/* Judul */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {training.nama_pelatihan}
        </h1>

        {/* INFORMASI PELATIHAN */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Informasi Pelatihan
          </h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
            {/* Tanggal */}
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Tanggal Pelatihan
                </p>
                <p className="text-gray-800 font-medium">
                  {training.tanggal_pelatihan
                    ? new Date(training.tanggal_pelatihan).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </p>
              </div>
            </div>

            {/* Durasi */}
            <div className="flex items-start">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Durasi</p>
                <p className="text-gray-800 font-medium">
                  {training.durasi_pelatihan || "-"}
                </p>
              </div>
            </div>

            {/* Pelaksanaan */}
            <div className="flex items-start">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pelaksanaan
                </p>
                <p className="text-gray-800 font-medium">
                  {training.daring ? "Daring (Online)" : "Luring (Offline)"}
                </p>
              </div>
            </div>

            {/* Lokasi - hanya untuk luring */}
            {!training.daring && (
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Lokasi
                  </p>
                  <p className="text-gray-800 font-medium">
                    {training.lokasi_pelatihan || "-"}
                  </p>
                </div>
              </div>
            )}

            {/* Mitra - Menampilkan semua mitra */}
            {training.mitra && training.mitra.length > 0 && (
              <div className="flex items-start">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Mitra{training.mitra.length > 1 ? ' Pelatihan' : ''}
                  </p>
                  <div className="space-y-2">
                    {training.mitra.map((mitra, index) => (
                      <div key={index} className="flex items-center">
                        <p className="text-gray-800 font-medium">
                          {mitra.nama}
                        </p>
                        {mitra.role && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {mitra.role}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DESKRIPSI PELATIHAN */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
            Deskripsi Pelatihan
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  training.deskripsi_pelatihan || "<p>Tidak ada deskripsi.</p>",
              }}
            ></div>
          </div>
        </div>

        {/* INFORMASI BIAYA & PEMBAYARAN */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BanknotesIcon className="h-5 w-5 mr-2 text-blue-600" />
            Informasi Biaya
          </h2>

          <div
            className={`border rounded-lg p-5 ${
              isFree
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            {/* Biaya */}
            <div className="flex items-start mb-4">
              <BanknotesIcon
                className={`h-5 w-5 mr-2 flex-shrink-0 ${
                  isFree ? "text-green-600" : "text-blue-600"
                }`}
              />
              <div>
                <p
                  className={`text-sm font-medium mb-1 ${
                    isFree ? "text-green-700" : "text-blue-700"
                  }`}
                >
                  Biaya Pelatihan
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isFree ? "text-green-800" : "text-blue-800"
                  }`}
                >
                  {formatCurrency(training.biaya || 0)}
                </p>
              </div>
            </div>

            {/* Info Pembayaran - hanya untuk berbayar */}
            {!isFree && (
              <>
                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex items-start">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-700 mb-2">
                      Informasi Rekening
                    </p>
                    <div className="space-y-1">
                      <p className="text-gray-800">
                        <span className="font-semibold">Nomor Rekening:</span>{" "}
                        {training.nomor_rekening || "-"}
                      </p>
                      {training.nama_bank && (
                        <p className="text-gray-800">
                          <span className="font-semibold">Bank:</span>{" "}
                          {training.nama_bank}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Catatan untuk gratis */}
            {isFree && (
              <p className="text-sm text-green-700 mt-2">
                Pelatihan ini gratis dan tidak memerlukan pembayaran.
              </p>
            )}
          </div>
        </div>

        {/* Login Prompt */}
        {showLoginPrompt && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg text-center shadow-sm">
            <p className="mb-3 font-medium">
              Anda harus login untuk mendaftar pelatihan ini.
            </p>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={() => router.push("/login")}
            >
              Login Sekarang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// === KOMPONEN: Card Status Pendaftaran ===
function RegisterStatusCard({ status, isFree, training, isRegistered }) {
  const statusInfo = {
    pending: {
      label: isFree ? "Pendaftaran Diproses" : "Menunggu Validasi",
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      desc: isFree
        ? "Pendaftaran Anda sedang diproses oleh admin."
        : "Bukti pembayaran Anda telah diterima dan sedang divalidasi oleh admin.",
    },
    terdaftar: {
      label: "Terdaftar",
      color: "bg-blue-100 text-blue-700 border-blue-300",
      desc: "Anda telah berhasil terdaftar dalam pelatihan ini.",
    },
    selesai: {
      label: "Selesai",
      color: "bg-green-100 text-green-700 border-green-300",
      desc: "Pelatihan Anda sudah selesai. Terima kasih telah berpartisipasi!",
    },
  };

  const info = statusInfo[status.status.toLowerCase()] || statusInfo["pending"];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Status Pendaftaran
      </h2>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Badge Status */}
        <div
          className={`px-4 py-2 rounded-lg border text-sm font-medium inline-block ${info.color}`}
        >
          {info.label}
        </div>

        {/* File Bukti Pembayaran */}
        {!isFree && status.bukti_pembayaran_url && (
          <div className={`px-4 py-2 rounded-lg border text-sm font-medium inline-block border-blue-600`}>
            <a
              href={status.bukti_pembayaran_url}
              target="_blank"
              className="text-blue-600 hover:underline break-all text-sm"
            >
              Lihat Bukti Pembayaran
            </a>
          </div>
        )}
      </div>

      <p className="mt-4 text-gray-700 leading-relaxed">{info.desc}</p>

      {/* Link Daring - hanya untuk yang sudah terdaftar */}
      {training.daring && training.link_daring && isRegistered && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-center mb-2">
            <GlobeAltIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-900">
              Link Pelatihan Daring
            </span>
          </div>
          <a
            href={training.link_daring}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all text-sm"
          >
            {training.link_daring}
          </a>
        </div>
      )}
    </div>
  );
}

// === KOMPONEN: Card Form Pendaftaran ===
function RegisterCard({
  user,
  file,
  submitting,
  onFileChange,
  onSubmit,
  training,
}) {
  const isFree =
    !training.biaya || training.biaya === 0 || training.biaya === "0";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Formulir Pendaftaran
      </h2>

      {/* Data Peserta */}
      <div className="mb-6">
        <div className="space-y-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p>
            <span className="font-medium">Nama:</span> {user.nama_lengkap}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Telepon:</span> {user.no_telp}
          </p>
          <p>
            <span className="font-medium">Profesi:</span> {user.profesi}
          </p>
          <p>
            <span className="font-medium">Instansi:</span> {user.instansi}
          </p>
          <p>
            <span className="font-medium">Jenis Kelamin:</span>{" "}
            {user.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
          </p>
          <p>
            <span className="font-medium">Alamat:</span> {user.alamat}
          </p>
          <p>
            <span className="font-medium">STR:</span> {user.no_reg_kes || "-"}
          </p>
        </div>
      </div>

      {/* Form Upload */}
      <form onSubmit={onSubmit}>
        {!isFree && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Bukti Pembayaran <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => onFileChange(e.target.files[0])}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 cursor-pointer bg-white focus:ring focus:ring-blue-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: PDF, JPG, PNG (Maks. 5MB)
            </p>
            {file && (
              <p className="text-gray-600 mt-2 text-sm truncate">
                File terpilih: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          className={isFree ? "bg-green-600 hover:bg-green-700" : "bg-blue-600"}
          fullWidth
          disabled={submitting}
        >
          {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
        </Button>
      </form>
    </div>
  );
}