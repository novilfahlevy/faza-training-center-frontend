"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { XMarkIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as Yup from "yup";
import httpClient from "@/httpClient";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import ThumbnailUploader from "@/components/admin/pelatihan/thumbnail-uploader";

const TextEditor = dynamic(() => import("@/components/admin/text-editor"), {
  ssr: false,
});

export default function EditPelatihan() {
  const router = useRouter();
  const params = useParams();
  const { id: pelatihanId } = params;

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [mitraList, setMitraList] = useState([]);
  const [isMitraListLoaded, setMitraListLoaded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const dateRef = useRef(null);
  const calendarRef = useRef(null);

  // 📦 Validasi Form
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
  });

  // 🧠 Formik setup
  const formik = useFormik({
    initialValues: {
      nama_pelatihan: "",
      deskripsi_pelatihan: "",
      tanggal_pelatihan: "",
      durasi_pelatihan: "",
      lokasi_pelatihan: "",
      mitra_id: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);

        const payload = {
          ...values,
          thumbnail_id: thumbnail?.id || null,
          mitra_id: values.mitra_id || null,
          tanggal_pelatihan: selectedDate
            ? format(selectedDate, "yyyy-MM-dd")
            : values.tanggal_pelatihan,
        };

        const response = await httpClient.put(`/v1/pelatihan/${pelatihanId}`, payload);

        toast.success(response.data.message || "Pelatihan berhasil diperbarui!", {
          position: "top-right",
          autoClose: 2500,
        });

        setTimeout(() => router.push("/admin/pelatihan"), 500);
      } catch (error) {
        console.error(error);
        toast.error(
          "Gagal memperbarui pelatihan: " +
            (error.response?.data?.message || error.message),
          { position: "top-right", autoClose: 3500 }
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const [thumbnail, setThumbnail] = useState(null);

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

  // ⌨️ Tutup kalender + blur input saat tekan ESC / Ctrl+ESC
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

  // 📅 Pilih tanggal
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

  // 🔹 Fetch Mitra
  useEffect(() => {
    const fetchMitra = async () => {
      try {
        const res = await httpClient.get("/v1/mitra");
        setMitraList(res.data.records || []);
      } catch (err) {
        console.error("Gagal mengambil mitra:", err);
      } finally {
        setMitraListLoaded(true);
      }
    };
    fetchMitra();
  }, []);

  // 🔹 Fetch Data Pelatihan by ID
  useEffect(() => {
    const fetchPelatihan = async () => {
      try {
        const res = await httpClient.get(`/v1/pelatihan/${pelatihanId}`);
        const data = res.data;

        if (res.data.thumbnail_url) {
          setThumbnail({ id: null, url: res.data.thumbnail_url });
        }

        let parsedDate = null;
        if (data.tanggal_pelatihan) {
          parsedDate = new Date(data.tanggal_pelatihan);
        }

        formik.setValues({
          nama_pelatihan: data.nama_pelatihan || "",
          deskripsi_pelatihan: data.deskripsi_pelatihan || "",
          tanggal_pelatihan: parsedDate
            ? format(parsedDate, "EEEE, dd MMMM yyyy", { locale: id })
            : "",
          durasi_pelatihan: data.durasi_pelatihan || "",
          lokasi_pelatihan: data.lokasi_pelatihan || "",
          mitra_id: data.mitra_id ? String(data.mitra_id) : "",
        });

        if (parsedDate) {
          setSelectedDate(parsedDate);
        }
      } catch (err) {
        console.error("Gagal memuat data pelatihan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPelatihan();
  }, [pelatihanId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography>Memuat data pelatihan...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex justify-center">
      <Card className="w-full max-w-3xl border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="p-3 sticky top-0 bg-white z-10 border-b">
          <Typography variant="h6" color="blue-gray">
            Edit Pelatihan
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
              <ThumbnailUploader value={thumbnail} onChange={setThumbnail} />
            </div>

            {/* Nama */}
            <div>
              <Input
                label="Nama Pelatihan"
                name="nama_pelatihan"
                value={formik.values.nama_pelatihan}
                onChange={formik.handleChange}
              />
              {formik.touched.nama_pelatihan && formik.errors.nama_pelatihan && (
                <Typography variant="small" color="red">
                  {formik.errors.nama_pelatihan}
                </Typography>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Deskripsi Pelatihan
              </Typography>
              <TextEditor
                value={formik.values.deskripsi_pelatihan}
                onChange={(value) => formik.setFieldValue("deskripsi_pelatihan", value)}
              />
              {formik.touched.deskripsi_pelatihan && formik.errors.deskripsi_pelatihan && (
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

            {/* Mitra */}
            <div className="relative">
              {!isMitraListLoaded ? (
                <Input label="Memuat daftar mitra..." disabled />
              ) : (
                <Select
                  label="Pilih Mitra (opsional)"
                  value={formik.values.mitra_id}
                  onChange={(value) => formik.setFieldValue("mitra_id", value)}
                >
                  {mitraList.length > 0 ? (
                    mitraList.map((m) => (
                      <Option key={m.mitra_id} value={m.mitra_id.toString()}>
                        {m.nama_mitra}
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
            <div className="sticky bottom-0 bg-white py-3 flex justify-end gap-3 border-t mt-4">
              <Button
                type="button"
                variant="text"
                color="blue-gray"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button type="submit" color="blue" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
