// /home/novilfahlevy/Projects/faza-training-center/src/app/admin/(authenticated)/pelatihan/tambah/page.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Button,
  Typography,
  Select,
  Option,
  Checkbox,
  Chip,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { XMarkIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  fetchMitraOptions, 
  createPelatihan 
} from "@/adminHttpClient";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import ThumbnailUploader from "@/components/admin/pelatihan/thumbnail-uploader";

const TextEditor = dynamic(() => import("@/components/admin/pelatihan/text-editor"), {
  ssr: false,
});

// Fungsi untuk memformat mata uang
const formatCurrency = (value) => {
  if (!value) return "";
  // Hapus semua karakter non-digit
  const numberValue = value.toString().replace(/\D/g, "");
  // Format dengan titik sebagai pemisah ribuan
  const formattedValue = numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${formattedValue}`;
};

// Fungsi untuk mengembalikan nilai format mata uang ke angka
const parseCurrency = (formattedValue) => {
  if (!formattedValue) return 0;
  // Hapus semua karakter non-digit
  return parseInt(formattedValue.toString().replace(/\D/g, ""), 10);
};

export default function TambahPelatihan() {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [mitraOptions, setMitraOptions] = useState([]);
  const [isMitraOptionsLoaded, setMitraOptionsLoaded] = useState(false);
  const [selectedMitraIds, setSelectedMitraIds] = useState([]);

  const dateRef = useRef(null);
  const calendarRef = useRef(null);

  // 🔹 Fetch daftar opsi mitra dari backend
  useEffect(() => {
    const fetchMitra = async () => {
      try {
        const response = await fetchMitraOptions();
        setMitraOptions(response.data || []);
        setMitraOptionsLoaded(true);
      } catch (error) {
        toast.error("Gagal mengambil daftar mitra.", { position: "top-right" });
        console.error("Gagal mengambil daftar mitra:", error);
      }
    };
    fetchMitra();
  }, []);

  // ✅ Validasi form
  const validationSchema = Yup.object({
    nama_pelatihan: Yup.string()
      .min(3, "Nama pelatihan minimal 3 karakter")
      .required("Nama pelatihan wajib diisi"),
    deskripsi_pelatihan: Yup.string()
      .min(10, "Deskripsi pelatihan minimal 10 karakter")
      .required("Deskripsi pelatihan wajib diisi"),
    tanggal_pelatihan: Yup.string().required("Tanggal pelatihan wajib dipilih"),
    durasi_pelatihan: Yup.string()
      .min(2, "Durasi pelatihan minimal 2 karakter")
      .required("Durasi pelatihan wajib diisi"),
    lokasi_pelatihan: Yup.string().when("daring", {
      is: false,
      then: (schema) => 
        schema.min(5, "Lokasi pelatihan minimal 5 karakter")
        .required("Lokasi pelatihan wajib diisi untuk pelatihan luring"),
      otherwise: (schema) => schema.notRequired(),
    }),
    biaya: Yup.string()
      .test(
        "is-valid-currency",
        "Format biaya tidak valid",
        (value) => {
          if (!value) return false;
          // Validasi format Rp xxx.xxx
          return /^Rp\s\d{1,3}(?:\.\d{3})*$/.test(value);
        }
      )
      .required("Biaya pelatihan wajib diisi"),
    nomor_rekening: Yup.string()
      .matches(/^[0-9]+$/, "Nomor rekening hanya boleh berisi angka")
      .min(8, "Nomor rekening minimal 8 digit")
      .required("Nomor rekening wajib diisi"),
    nama_bank: Yup.string()
      .min(3, "Nama bank minimal 3 karakter")
      .required("Nama bank wajib diisi"),
    link_daring: Yup.string().when("daring", {
      is: true,
      then: (schema) =>
        schema.url("Format URL tidak valid")
        .required("Link daring wajib diisi untuk pelatihan daring"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      nama_pelatihan: "",
      deskripsi_pelatihan: "",
      tanggal_pelatihan: "",
      durasi_pelatihan: "",
      lokasi_pelatihan: "",
      biaya: "",
      daring: false,
      link_daring: "",
      nomor_rekening: "",
      nama_bank: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        // Konversi biaya dari format mata uang ke angka
        const biayaNumeric = parseCurrency(values.biaya);
        
        const payload = {
          ...values,
          biaya: biayaNumeric, // Gunakan nilai numerik untuk payload
          thumbnail_id: thumbnail?.id || null,
          mitra_ids: selectedMitraIds, // Kirim array mitra_ids
          tanggal_pelatihan: format(selectedDate, "yyyy-MM-dd"),
        };

        const response = await createPelatihan(payload);

        toast.success(
          response.data.message || "Pelatihan berhasil ditambahkan!",
          {
            position: "top-right",
            autoClose: 2500,
          }
        );

        setTimeout(() => router.push("/admin/pelatihan"), 500);
      } catch (error) {
        console.error("Gagal menambahkan pelatihan:", error);
        toast.error(
          "Gagal menambahkan pelatihan: " +
            (error.response?.data?.message || error.message),
          { position: "top-right", autoClose: 3500 }
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // 📅 Tutup kalender saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Tutup kalender dengan ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" || (e.ctrlKey && e.key === "Escape")) {
        setShowCalendar(false);
        dateRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      formik.setFieldValue(
        "tanggal_pelatihan",
        format(date, "EEEE, dd MMMM yyyy", { locale: id })
      );
    }
    setShowCalendar(false);
  };

  const clearDate = () => {
    setSelectedDate(null);
    formik.setFieldValue("tanggal_pelatihan", "");
    dateRef.current?.focus();
  };

  const [thumbnail, setThumbnail] = useState(null);

  // Function to handle thumbnail upload state change
  const handleThumbnailUploadingChange = (isUploading) => {
    setUploadingThumbnail(isUploading);
  };

  // Handler untuk perubahan input biaya
  const handleBiayaChange = (e) => {
    let value = e.target.value;
    
    // Hapus semua karakter non-digit kecuali untuk prefix "Rp "
    if (value.startsWith("Rp ")) {
      value = "Rp " + value.substring(3).replace(/\D/g, "");
    } else {
      value = value.replace(/\D/g, "");
      if (value) value = "Rp " + value;
    }
    
    // Format dengan titik sebagai pemisah ribuan
    const numberPart = value.replace("Rp ", "").replace(/\D/g, "");
    if (numberPart) {
      value = "Rp " + numberPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    formik.setFieldValue("biaya", value);
  };

  // Handler untuk perubahan checkbox daring
  const handleDaringChange = (e) => {
    const isDaring = e.target.checked;
    formik.setFieldValue("daring", isDaring);
    
    // Reset fields yang tidak relevan
    if (isDaring) {
      formik.setFieldValue("lokasi_pelatihan", "");
    } else {
      formik.setFieldValue("link_daring", "");
    }
  };

  // Handler untuk menambahkan mitra
  const handleAddMitra = (mitraId) => {
    if (mitraId && !selectedMitraIds.includes(mitraId)) {
      setSelectedMitraIds([...selectedMitraIds, mitraId]);
    }
  };

  // Handler untuk menghapus mitra
  const handleRemoveMitra = (mitraId) => {
    setSelectedMitraIds(selectedMitraIds.filter(id => id !== mitraId));
  };

  // Mendapatkan nama mitra berdasarkan ID
  const getMitraName = (mitraId) => {
    const mitra = mitraOptions.find(m => m.id === mitraId);
    return mitra ? mitra.nama : "";
  };

  return (
    <div className="mt-12 flex justify-center">
      <Card className="w-full max-w-3xl border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="p-3">
          <Typography variant="h6" color="blue-gray">
            Tambah Pelatihan
          </Typography>
        </CardHeader>

        <CardBody className="px-6 pb-6">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            {/* Informasi Dasar */}
            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray" className="font-medium">
                Informasi Dasar
              </Typography>
              
              {/* Nama */}
              <div>
                <Input
                  label="Nama Pelatihan"
                  name="nama_pelatihan"
                  value={formik.values.nama_pelatihan}
                  onChange={formik.handleChange}
                  error={formik.touched.nama_pelatihan && Boolean(formik.errors.nama_pelatihan)}
                />
                {formik.touched.nama_pelatihan &&
                  formik.errors.nama_pelatihan && (
                    <Typography variant="small" color="red" className="mt-1">
                      {formik.errors.nama_pelatihan}
                    </Typography>
                  )}
              </div>

              {/* Deskripsi */}
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Deskripsi Pelatihan
                </Typography>
                <TextEditor
                  value={formik.values.deskripsi_pelatihan}
                  onChange={(value) =>
                    formik.setFieldValue("deskripsi_pelatihan", value)
                  }
                />
                {formik.touched.deskripsi_pelatihan &&
                  formik.errors.deskripsi_pelatihan && (
                    <Typography variant="small" color="red" className="mt-1">
                      {formik.errors.deskripsi_pelatihan}
                    </Typography>
                  )}
              </div>
            </div>

            {/* Jenis Pelatihan */}
            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray" className="font-medium">
                Jenis Pelatihan
              </Typography>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="daring"
                  name="daring"
                  checked={formik.values.daring}
                  onChange={handleDaringChange}
                />
                <label htmlFor="daring" className="text-sm font-medium text-blue-gray-700">
                  Pelatihan Daring (Online)
                </label>
              </div>

              {/* Lokasi - hanya untuk pelatihan luring */}
              {!formik.values.daring && (
                <div>
                  <Input
                    label="Lokasi Pelatihan"
                    name="lokasi_pelatihan"
                    value={formik.values.lokasi_pelatihan}
                    onChange={formik.handleChange}
                    error={formik.touched.lokasi_pelatihan && Boolean(formik.errors.lokasi_pelatihan)}
                  />
                  {formik.touched.lokasi_pelatihan &&
                    formik.errors.lokasi_pelatihan && (
                      <Typography variant="small" color="red" className="mt-1">
                        {formik.errors.lokasi_pelatihan}
                      </Typography>
                    )}
                </div>
              )}

              {/* Link Daring - hanya untuk pelatihan daring */}
              {formik.values.daring && (
                <div>
                  <Input
                    label="Link Daring (URL Meeting/Platform)"
                    name="link_daring"
                    value={formik.values.link_daring}
                    onChange={formik.handleChange}
                    error={formik.touched.link_daring && Boolean(formik.errors.link_daring)}
                  />
                  {formik.touched.link_daring && formik.errors.link_daring && (
                    <Typography variant="small" color="red" className="mt-1">
                      {formik.errors.link_daring}
                    </Typography>
                  )}
                </div>
              )}
            </div>

            {/* Informasi Waktu dan Biaya */}
            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray" className="font-medium">
                Waktu dan Biaya
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                {/* Tanggal */}
                <div className="relative" ref={calendarRef}>
                  <div className="relative">
                    <Input
                      ref={dateRef}
                      label="Tanggal Pelatihan"
                      name="tanggal_pelatihan"
                      value={formik.values.tanggal_pelatihan}
                      readOnly
                      onFocus={() => setShowCalendar(true)}
                      className="cursor-pointer"
                      error={formik.touched.tanggal_pelatihan && Boolean(formik.errors.tanggal_pelatihan)}
                    />
                    {formik.values.tanggal_pelatihan ? (
                      <button
                        type="button"
                        onClick={clearDate}
                        className="absolute right-2 top-1.5 p-1 text-gray-500 hover:text-red-600 transition"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCalendar(true)}
                        className="absolute right-2 top-1.5 p-1 text-gray-500 hover:text-blue-600 transition"
                      >
                        <CalendarDaysIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {formik.touched.tanggal_pelatihan &&
                    formik.errors.tanggal_pelatihan && (
                      <Typography variant="small" color="red" className="mt-1">
                        {formik.errors.tanggal_pelatihan}
                      </Typography>
                    )}
                  {showCalendar && (
                    <div className="absolute z-50 bg-white shadow-lg rounded-lg mt-2 p-3 border border-blue-gray-100">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                      />
                    </div>
                  )}
                </div>

                {/* Durasi */}
                <div>
                  <Input
                    label="Durasi Pelatihan (Contoh: 3 Hari, 2 Minggu, 1 Bulan)"
                    name="durasi_pelatihan"
                    value={formik.values.durasi_pelatihan}
                    onChange={formik.handleChange}
                    error={formik.touched.durasi_pelatihan && Boolean(formik.errors.durasi_pelatihan)}
                  />
                  {formik.touched.durasi_pelatihan &&
                    formik.errors.durasi_pelatihan && (
                      <Typography variant="small" color="red" className="mt-1">
                        {formik.errors.durasi_pelatihan}
                      </Typography>
                    )}
                </div>
              </div>

              {/* Biaya */}
              <div>
                <Input
                  label="Biaya Pelatihan"
                  name="biaya"
                  value={formik.values.biaya}
                  onChange={handleBiayaChange}
                  error={formik.touched.biaya && Boolean(formik.errors.biaya)}
                />
                {formik.touched.biaya && formik.errors.biaya && (
                  <Typography variant="small" color="red" className="mt-1">
                    {formik.errors.biaya}
                  </Typography>
                )}
              </div>
            </div>

            {/* Informasi Pembayaran */}
            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray" className="font-medium">
                Informasi Pembayaran
              </Typography>
              
              {/* Nomor Rekening */}
              <div>
                <Input
                  label="Nomor Rekening"
                  name="nomor_rekening"
                  value={formik.values.nomor_rekening}
                  onChange={formik.handleChange}
                  error={formik.touched.nomor_rekening && Boolean(formik.errors.nomor_rekening)}
                />
                {formik.touched.nomor_rekening &&
                  formik.errors.nomor_rekening && (
                    <Typography variant="small" color="red" className="mt-1">
                      {formik.errors.nomor_rekening}
                    </Typography>
                  )}
              </div>

              {/* Nama Bank */}
              <div>
                <Input
                  label="Nama Bank"
                  name="nama_bank"
                  value={formik.values.nama_bank}
                  onChange={formik.handleChange}
                  error={formik.touched.nama_bank && Boolean(formik.errors.nama_bank)}
                />
                {formik.touched.nama_bank && formik.errors.nama_bank && (
                  <Typography variant="small" color="red" className="mt-1">
                    {formik.errors.nama_bank}
                  </Typography>
                )}
              </div>
            </div>

            {/* Informasi Tambahan */}
            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray" className="font-medium">
                Informasi Tambahan
              </Typography>
              
              {/* Mitra */}
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Pilih Mitra (bisa lebih dari satu)
                </Typography>
                
                {isMitraOptionsLoaded ? (
                  <div className="space-y-2">
                    <Select
                      label="Pilih Mitra"
                      onChange={(value) => value && handleAddMitra(value)}
                      value=""
                    >
                      {mitraOptions.length > 0 ? (
                        mitraOptions.map((m) => (
                          <Option key={m.id} value={m.id}>
                            {m.nama}
                          </Option>
                        ))
                      ) : (
                        <Option disabled>Tidak ada mitra</Option>
                      )}
                    </Select>
                    
                    {/* Menampilkan mitra yang sudah dipilih */}
                    {selectedMitraIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedMitraIds.map((mitraId) => (
                          <Chip
                            key={mitraId}
                            value={getMitraName(mitraId)}
                            onClose={() => handleRemoveMitra(mitraId)}
                            closeBtn={
                              <XMarkIcon className="h-3 w-3" />
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Input label="Memuat daftar mitra..." disabled />
                )}
              </div>

              {/* Thumbnail uploader */}
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Poster/Sampul
                </Typography>
                <ThumbnailUploader 
                  value={thumbnail} 
                  onChange={setThumbnail} 
                  onUploadingChange={handleThumbnailUploadingChange}
                />
              </div>
            </div>

            {/* Tombol */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="text"
                color="blue-gray"
                onClick={() => router.push("/admin/pelatihan")}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                color="blue" 
                disabled={loading || uploadingThumbnail}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}