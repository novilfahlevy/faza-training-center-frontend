"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
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
  createLaporanKegiatan 
} from "@/adminHttpClient";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import LoadingOverlay from "@/components/admin/loading-overlay";

const TextEditor = dynamic(() => import("@/components/admin/laporan-kegiatan/text-editor"), {
  ssr: false,
});

export default function TambahLaporanKegiatan() {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const dateRef = useRef(null);
  const calendarRef = useRef(null);

  // Validasi form
  const validationSchema = Yup.object({
    judul_laporan: Yup.string()
      .min(3, "Judul laporan minimal 3 karakter")
      .required("Judul laporan wajib diisi"),
    isi_laporan: Yup.string()
      .min(10, "Isi laporan minimal 10 karakter")
      .required("Isi laporan wajib diisi"),
    tanggal_laporan: Yup.string().required("Tanggal laporan wajib dipilih"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      judul_laporan: "",
      isi_laporan: "",
      tanggal_laporan: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        const payload = {
          ...values,
          tanggal_laporan: format(selectedDate, "yyyy-MM-dd"),
        };

        const response = await createLaporanKegiatan(payload);

        toast.success(
          response.data.message || "Laporan kegiatan berhasil ditambahkan!",
          {
            position: "top-right",
            autoClose: 2500,
          }
        );

        setTimeout(() => router.push("/admin/laporan-kegiatan"), 500);
      } catch (error) {
        console.error("Gagal menambahkan laporan kegiatan:", error);
        toast.error(
          "Gagal menambahkan laporan kegiatan: " +
            (error.response?.data?.message || error.message),
          { position: "top-right", autoClose: 3500 }
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // Tutup kalender saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup kalender dengan ESC
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
        "tanggal_laporan",
        format(date, "EEEE, dd MMMM yyyy", { locale: id })
      );
    }
    setShowCalendar(false);
  };

  const clearDate = () => {
    setSelectedDate(null);
    formik.setFieldValue("tanggal_laporan", "");
    dateRef.current?.focus();
  };

  return (
    <div className="mt-8 mb-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Card className="w-full max-w-2xl border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="p-4 sm:p-6">
          <Typography variant="h6" color="blue-gray" className="text-lg sm:text-xl">
            Tambah Laporan Kegiatan
          </Typography>
        </CardHeader>

        <CardBody className="px-4 pb-6 sm:px-6">
          <LoadingOverlay active={loading}>
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
              {/* Judul Laporan */}
              <div>
                <Input
                  label="Judul Laporan"
                  name="judul_laporan"
                  value={formik.values.judul_laporan}
                  onChange={formik.handleChange}
                  error={formik.touched.judul_laporan && Boolean(formik.errors.judul_laporan)}
                />
                {formik.touched.judul_laporan &&
                  formik.errors.judul_laporan && (
                    <Typography variant="small" color="red" className="mt-1">
                      {formik.errors.judul_laporan}
                    </Typography>
                  )}
              </div>

              {/* Tanggal Laporan */}
              <div className="relative" ref={calendarRef}>
                <div className="relative">
                  <Input
                    ref={dateRef}
                    label="Tanggal Laporan"
                    name="tanggal_laporan"
                    value={formik.values.tanggal_laporan}
                    readOnly
                    onFocus={() => setShowCalendar(true)}
                    className="cursor-pointer"
                    error={formik.touched.tanggal_laporan && Boolean(formik.errors.tanggal_laporan)}
                  />
                  {formik.values.tanggal_laporan ? (
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
                {formik.touched.tanggal_laporan &&
                  formik.errors.tanggal_laporan && (
                    <Typography variant="small" color="red" className="mt-1">
                      {formik.errors.tanggal_laporan}
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

              {/* Isi Laporan */}
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-3 font-medium text-sm sm:text-base"
                >
                  Isi Laporan
                </Typography>
                <TextEditor
                  value={formik.values.isi_laporan}
                  onChange={(value) =>
                    formik.setFieldValue("isi_laporan", value)
                  }
                />
                {formik.touched.isi_laporan &&
                  formik.errors.isi_laporan && (
                    <Typography variant="small" color="red" className="mt-1">
                      {formik.errors.isi_laporan}
                    </Typography>
                  )}
              </div>

              {/* Tombol */}
              <div className="flex justify-end gap-3 pt-4 border-blue-gray-100">
                <Button
                  type="button"
                  variant="text"
                  color="blue-gray"
                  onClick={() => router.push("/admin/laporan-kegiatan")}
                  className="w-full sm:w-auto"
                >
                  Batal
                </Button>
                <Button type="submit" color="blue" disabled={loading} className="w-full sm:w-auto">
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </LoadingOverlay>
        </CardBody>
      </Card>
    </div>
  );
}