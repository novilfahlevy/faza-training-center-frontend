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

export default function TambahPelatihan() {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [mitraOptions, setMitraOptions] = useState([]);
  const [isMitraOptionsLoaded, setMitraOptionsLoaded] = useState(false);

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
      .min(3, "Minimal 3 karakter")
      .required("Nama pelatihan wajib diisi"),
    deskripsi_pelatihan: Yup.string()
      .min(10, "Deskripsi minimal 10 karakter")
      .required("Deskripsi wajib diisi"),
    tanggal_pelatihan: Yup.string().required("Tanggal wajib dipilih"),
    durasi_pelatihan: Yup.string().required("Durasi wajib diisi"),
    lokasi_pelatihan: Yup.string().required("Lokasi wajib diisi"),
    biaya: Yup.number()
      .typeError("Biaya harus berupa angka")
      .min(0, "Biaya tidak boleh negatif"),
    link_daring: Yup.string().when("daring", {
      is: true,
      then: (schema) => schema.required("Link daring wajib diisi jika pelatihan daring"),
      otherwise: (schema) => schema.notRequired(),
    }),
    // Nomor rekening tidak lagi bergantung pada status daring/luring
    nomor_rekening: Yup.string().notRequired(),
    nama_bank: Yup.string().notRequired(),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      nama_pelatihan: "",
      deskripsi_pelatihan: "",
      tanggal_pelatihan: "",
      durasi_pelatihan: "",
      lokasi_pelatihan: "",
      mitra_id: "",
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
        const payload = {
          ...values,
          thumbnail_id: thumbnail?.id || null,
          mitra_id: values.mitra_id || null,
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

  const clearMitra = () => {
    formik.setFieldValue("mitra_id", "");
  };

  const [thumbnail, setThumbnail] = useState(null);

  // Function to handle thumbnail upload state change
  const handleThumbnailUploadingChange = (isUploading) => {
    setUploadingThumbnail(isUploading);
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

            {/* Nama */}
            <div>
              <Input
                label="Nama Pelatihan"
                name="nama_pelatihan"
                value={formik.values.nama_pelatihan}
                onChange={formik.handleChange}
              />
              {formik.touched.nama_pelatihan &&
                formik.errors.nama_pelatihan && (
                  <Typography variant="small" color="red">
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
                  <Typography variant="small" color="red">
                    {formik.errors.deskripsi_pelatihan}
                  </Typography>
                )}
            </div>

            {/* Grid tanggal & durasi */}
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
                    <Typography variant="small" color="red">
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
                />
                {formik.touched.durasi_pelatihan &&
                  formik.errors.durasi_pelatihan && (
                    <Typography variant="small" color="red">
                      {formik.errors.durasi_pelatihan}
                    </Typography>
                  )}
              </div>
            </div>

            {/* Lokasi */}
            <div>
              <Input
                label="Lokasi Pelatihan"
                name="lokasi_pelatihan"
                value={formik.values.lokasi_pelatihan}
                onChange={formik.handleChange}
              />
              {formik.touched.lokasi_pelatihan &&
                formik.errors.lokasi_pelatihan && (
                  <Typography variant="small" color="red">
                    {formik.errors.lokasi_pelatihan}
                  </Typography>
                )}
            </div>

            {/* Biaya */}
            <div>
              <Input
                label="Biaya Pelatihan (dalam Rupiah)"
                name="biaya"
                type="number"
                value={formik.values.biaya}
                onChange={formik.handleChange}
              />
              {formik.touched.biaya && formik.errors.biaya && (
                <Typography variant="small" color="red">
                  {formik.errors.biaya}
                </Typography>
              )}
            </div>

            {/* Nomor Rekening - selalu ditampilkan */}
            <div>
              <Input
                label="Nomor Rekening untuk Pembayaran"
                name="nomor_rekening"
                value={formik.values.nomor_rekening}
                onChange={formik.handleChange}
              />
              {formik.touched.nomor_rekening && formik.errors.nomor_rekening && (
                <Typography variant="small" color="red">
                  {formik.errors.nomor_rekening}
                </Typography>
              )}
            </div>

            {/* Nama Bank - selalu ditampilkan */}
            <div>
              <Input
                label="Nama Bank untuk Pembayaran"
                name="nama_bank"
                value={formik.values.nama_bank}
                onChange={formik.handleChange}
              />
              {formik.touched.nama_bank && formik.errors.nama_bank && (
                <Typography variant="small" color="red">
                  {formik.errors.nama_bank}
                </Typography>
              )}
            </div>

            {/* Jenis Pelatihan (Daring/Luring) */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="daring"
                name="daring"
                checked={formik.values.daring}
                onChange={(e) => {
                  formik.setFieldValue("daring", e.target.checked);
                  // Reset link daring when toggling
                  if (!e.target.checked) {
                    formik.setFieldValue("link_daring", "");
                  }
                }}
              />
              <label htmlFor="daring" className="text-sm font-medium text-blue-gray-700">
                Pelatihan Daring (Online)
              </label>
            </div>

            {/* Link Daring - hanya muncul jika checkbox dicentang */}
            {formik.values.daring && (
              <div>
                <Input
                  label="Link Daring (URL Meeting/Platform)"
                  name="link_daring"
                  value={formik.values.link_daring}
                  onChange={formik.handleChange}
                />
                {formik.touched.link_daring && formik.errors.link_daring && (
                  <Typography variant="small" color="red">
                    {formik.errors.link_daring}
                  </Typography>
                )}
              </div>
            )}

            {/* Mitra */}
            <div className="relative">
              {isMitraOptionsLoaded && (
                <Select
                  label="Pilih Mitra (opsional)"
                  value={formik.values.mitra_id}
                  onChange={(value) => formik.setFieldValue("mitra_id", value)}
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
              )}
              {formik.values.mitra_id && (
                <button
                  type="button"
                  onClick={clearMitra}
                  className="absolute right-8 top-1.5 p-1 text-gray-500 hover:text-red-600 transition"
                  title="Hapus pilihan mitra"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
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