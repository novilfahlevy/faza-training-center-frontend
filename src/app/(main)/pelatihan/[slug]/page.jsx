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
} from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { useAuthStore } from "@/stores/useAuthStore";

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

  // Ambil detail pelatihan
  useEffect(() => {
    const getTraining = async () => {
      try {
        setError(null);
        const detail = await fetchTrainingBySlug(params.slug);
        setTraining(detail);
      } catch (error) {
        console.error("Gagal memuat detail pelatihan:", error);
        setError("Gagal memuat detail pelatihan. Silakan coba lagi nanti.");
        toast.error("Gagal memuat detail pelatihan.");
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
        // Jangan tampilkan error untuk status kepesertaan, ini bukan error kritis
      }
    };

    if (token) {
      getRegistrationStatus();
    }
  }, [params.slug, token]);

  // Ambil profil user jika login (tunggu rehydrate)
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

  // ✅ Validasi & Kirim File ke API
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
          bukti_pembayaran_url: data.data.bukti_url
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
        bukti_pembayaran_url: data.data.bukti_url
      });
    } catch (error) {
      toast.error(error.message || "Gagal mengirim pendaftaran.");
    } finally {
      setSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    // Handle case when amount is 0 or undefined
    if (!amount || amount === 0) return "Gratis";
    
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
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
            Kembali ke Daftar Pelatihan
          </Button>
        </div>
      </div>
    );
  }

  if (!training) {
    return (
      <p className="container mx-auto px-6 py-10 text-gray-600">Memuat...</p>
    );
  }

  // Check if user is registered
  const isRegistered = registerStatus && registerStatus.status && 
    (registerStatus.status.toLowerCase() === "terdaftar" || 
     registerStatus.status.toLowerCase() === "selesai" || 
     registerStatus.status.toLowerCase() === "pending");

  return (
    <div className="container mx-auto px-6 py-10">
      {isLoggedIn ? (
        // === Layout 60:40 jika login ===
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-8 gap-x-4">
          <div className="lg:col-span-3">
            <Link
              href="/pelatihan"
              className="flex items-center text-blue-600 hover:underline"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Kembali ke Daftar Pelatihan
            </Link>
          </div>
          <div className="lg:col-span-3">
            <TrainingDetailCard 
              training={training} 
              isRegistered={isRegistered}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24">
              {registerStatus && registerStatus.status ? (
                <RegisterStatusCard status={registerStatus} isFree={training.biaya === 0 || training.biaya === "0"} />
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
        // === Hanya tampilkan detail pelatihan (tanpa prompt, tanpa form)
        <div className="w-full lg:w-3/5 mx-auto">
          <Link
            href="/pelatihan"
            className="flex items-center text-blue-600 hover:underline mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Kembali ke Daftar Pelatihan
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

// === KOMPONEN: Card Detail Pelatihan ===
function TrainingDetailCard({ training, showLoginPrompt = false, isRegistered = false }) {
  const router = useRouter();

  // Format currency
  const formatCurrency = (amount) => {
    // Handle case when amount is 0 or undefined
    if (!amount || amount === 0) return "Gratis";
    
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isFree = !training.biaya || training.biaya === 0 || training.biaya === "0";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 border border-gray-200">
      {training.thumbnail_url && (
        <img
          src={training.thumbnail_url}
          alt={training.nama_pelatihan}
          className="w-full h-64 object-cover rounded-lg mb-6 shadow-sm"
        />
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {training.nama_pelatihan}
      </h1>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 mb-6">
        <p className="flex flex-col">
          <span className="font-semibold mb-1">Tanggal Pelatihan:</span>{" "}
          {training.tanggal_pelatihan
            ? new Date(training.tanggal_pelatihan).toLocaleDateString("id-ID")
            : "-"}
        </p>

        <p className="flex flex-col">
          <span className="font-semibold mb-1">Durasi:</span>{" "}
          {training.durasi_pelatihan || "-"}
        </p>
        
        {/* Link daring hanya ditampilkan untuk pelatihan daring */}
        {training.daring ? (
          <p className="flex flex-col">
            <span className="font-semibold mb-1">Pelaksanaan:</span>
            <span>Daring (Online)</span>
          </p>
        ) : (
          <p className="flex flex-col">
            <span className="font-semibold mb-1">Pelaksanaan:</span>
            <span>Luring (Offline)</span>
          </p>
        )}
        
        <p className="flex flex-col">
          <span className="font-semibold mb-1">Biaya:</span>{" "}
          <span className={isFree ? "text-green-600 font-medium" : ""}>
            {formatCurrency(training.biaya || 0)}
          </span>
        </p>
        
        {/* Mitra hanya ditampilkan jika ada */}
        {training?.mitra?.data_mitra?.nama_mitra && (
          <p className="flex flex-col">
            <span className="font-semibold mb-1">Mitra:</span>{" "}
            {training.mitra.data_mitra.nama_mitra}
          </p>
        )}

        {/* Lokasi hanya ditampilkan untuk pelatihan luring */}
        {!training.daring && (
          <p className="flex flex-col">
            <span className="font-semibold mb-1">Lokasi:</span>{" "}
            {training.lokasi_pelatihan || "-"}
          </p>
        )}
      </div>

      {/* Informasi tambahan untuk pelatihan daring - Hanya ditampilkan untuk pengguna yang sudah terdaftar */}
      {training.daring && training.link_daring && isRegistered && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <GlobeAltIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-900">Link Daring:</span>
          </div>
          <a
            href={training.link_daring}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {training.link_daring}
          </a>
        </div>
      )}

      {/* Informasi pembayaran hanya ditampilkan untuk pelatihan berbayar */}
      {!isFree && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-gray-900">Informasi Pembayaran:</span>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Nomor Rekening:</span>
            <span>{training.nomor_rekening || "-"}</span>
          </p>
          {training.nama_bank && (
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Bank:</span>
              <span>{training.nama_bank}</span>
            </p>
          )}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <span className="font-semibold text-gray-900">Deskripsi Pelatihan:</span>
        </div>
        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              training.deskripsi_pelatihan || "<p>Tidak ada deskripsi.</p>",
          }}
        ></div>
      </div>

      {showLoginPrompt && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg text-center shadow-sm">
          <p className="mb-2 font-medium">
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
  );
}

function RegisterStatusCard({ status, isFree }) {
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

      {/* Badge Status */}
      <div
        className={`px-4 py-2 rounded-lg border text-sm font-medium inline-block ${info.color}`}
      >
        {info.label}
      </div>

      <p className="mt-4 text-gray-700 leading-relaxed">{info.desc}</p>

      {/* File Bukti Pembayaran hanya ditampilkan untuk pelatihan berbayar */}
      {!isFree && status.bukti_pembayaran_url && (
        <div className="mt-6">
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
  );
}

// === KOMPONEN: Card Form Pendaftaran ===
function RegisterCard({ user, file, submitting, onFileChange, onSubmit, training }) {
  // Format currency
  const formatCurrency = (amount) => {
    // Handle case when amount is 0 or undefined
    if (!amount || amount === 0) return "Gratis";
    
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isFree = !training.biaya || training.biaya === 0 || training.biaya === "0";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Daftar</h2>

      <div className={`border rounded-lg p-4 mb-6 ${isFree ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}>
        <div className="flex items-center mb-2">
          <span className={`font-semibold ${isFree ? "text-green-900" : "text-blue-900"}`}>
            Biaya Pelatihan:
          </span>
        </div>
        <p className={`text-lg font-bold mb-1 ${isFree ? "text-green-900" : "text-blue-900"}`}>
          {formatCurrency(training.biaya || 0)}
        </p>
        <p className={`${isFree ? "text-green-900" : "text-blue-900"}`}>
          {training.nomor_rekening} ({training.nama_bank})
        </p>
        {isFree && (
          <p className="text-sm text-green-700 mt-1">
            Pelatihan ini gratis, tidak perlu mengupload bukti pembayaran.
          </p>
        )}
      </div>

      <div className="space-y-2 text-gray-700 text-sm mb-6">
        <p>
          <span className="font-semibold">Nama:</span> {user.nama_lengkap}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Telepon:</span> {user.no_telp}
        </p>
        <p>
          <span className="font-semibold">Profesi:</span> {user.profesi}
        </p>
        <p>
          <span className="font-semibold">Instansi:</span> {user.instansi}
        </p>
        <p>
          <span className="font-semibold">Jenis Kelamin:</span>{" "}
          {user.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
        </p>
        <p>
          <span className="font-semibold">Alamat:</span> {user.alamat}
        </p>
        <p>
          <span className="font-semibold">Surat Tanda Registrasi (STR):</span>{" "}
          {user.no_reg_kes || "-"}
        </p>
      </div>

      <hr className="my-4" />

      <form onSubmit={onSubmit}>
        {/* Upload bukti pembayaran hanya untuk pelatihan berbayar */}
        {!isFree && (
          <>
            <label className="block text-gray-700 font-medium mb-2">
              Upload Bukti Pembayaran
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => onFileChange(e.target.files[0])}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 cursor-pointer bg-white focus:ring focus:ring-blue-200"
            />
            {file && (
              <p className="text-gray-600 mt-2 text-sm truncate">
                File: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </>
        )}

        <Button
          type="submit"
          className={`mt-6 ${isFree ? "bg-green-600 hover:bg-green-700" : "bg-blue-600"}`}
          fullWidth
          disabled={submitting}
        >
          {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
        </Button>
      </form>
    </div>
  );
}