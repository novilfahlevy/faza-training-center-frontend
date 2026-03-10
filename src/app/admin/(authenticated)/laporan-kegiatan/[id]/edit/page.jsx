// /home/novilfahlevy/Projects/faza-training-center/src/app/admin/(authenticated)/laporan-kegiatan/[id]/edit/page.jsx
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
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { XMarkIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  fetchLaporanKegiatanById,
  updateLaporanKegiatan,
  fetchPelatihanOptions
} from "@/adminHttpClient";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import("@/components/admin/laporan-kegiatan/text-editor"), {
  ssr: false,
});

// Loading Skeleton Component untuk Form Edit Laporan
function FormSkeleton() {
  return (
    <div className="mt-12 flex justify-center">
      <Card className="w-full max-w-3xl border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="p-3">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </CardHeader>

        <CardBody className="px-6 pb-6">
          <div className="flex flex-col gap-6">
            {/* Judul Laporan */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>

            {/* Tanggal Laporan */}
            <div className="relative">
              <div className="h-4 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>

            {/* Isi Laporan */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>

            {/* Tombol */}
            <div className="flex justify-end gap-3 pt-4 border-blue-gray-100">
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function EditLaporanKegiatan() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pelatihanOptions, setPelatihanOptions] = useState([]);

  const dateRef = useRef(null);
  const calendarRef = useRef(null);

  // Fetch pelatihan options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetchPelatihanOptions();
        setPelatihanOptions(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data pelatihan:", error);
        toast.error("Gagal mengambil data pelatihan", { position: "top-right" });
      }
    };
    fetchOptions();
  }, []);

  // Fetch laporan data
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setInitialLoading(true);
        const response = await fetchLaporanKegiatanById(id);
        const laporan = response.data;
        
        // Set form values
        formik.setValues({
          judul_laporan: laporan.judul_laporan,
          isi_laporan: laporan.isi_laporan,
          tanggal_laporan: format(new Date(laporan.tanggal_laporan), "EEEE, dd MMMM yyyy", { locale: localeId }),
          pelatihan_id: laporan.pelatihan_id || "",
        });
        
        // Set selected date
        setSelectedDate(new Date(laporan.tanggal_laporan));
      } catch (error) {
        toast.error("Gagal mengambil data laporan kegiatan.", { position: "top-right" });
        console.error("Gagal mengambil data laporan kegiatan:", error);
        router.push("/admin/laporan-kegiatan");
      } finally {
        setTimeout(() => setInitialLoading(false), 500);
      }
    };
    
    if (id) {
      fetchLaporan();
    }
  }, [id, router]);

  // Validasi form
  const validationSchema = Yup.object({
    judul_laporan: Yup.string()
      .min(3, "Judul laporan minimal 3 karakter")
      .required("Judul laporan wajib diisi"),
    isi_laporan: Yup.string()
      .min(10, "Isi laporan minimal 10 karakter")
      .required("Isi laporan wajib diisi"),
    tanggal_laporan: Yup.string().required("Tanggal laporan wajib dipilih"),
    pelatihan_id: Yup.number().required("Pelatihan wajib dipilih"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      judul_laporan: "",
      isi_laporan: "",
      tanggal_laporan: "",
      pelatihan_id: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // This will be triggered by handleSubmit function
      setSubmitting(false);
    },
  });

  // Handle submit with status parameter
  const handleSubmit = async (status) => {
    // Validate form
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        judul_laporan: true,
        isi_laporan: true,
        tanggal_laporan: true,
        pelatihan_id: true,
      });
      toast.error("Mohon lengkapi semua field yang wajib diisi", {
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        ...formik.values,
        tanggal_laporan: format(selectedDate, "yyyy-MM-dd"),
        status: status, // 'draft' or 'final'
      };

      const response = await updateLaporanKegiatan(id, payload);

      toast.success(
        response.data.message || "Laporan kegiatan berhasil diperbarui!",
        {
          position: "top-right",
          autoClose: 2500,
        }
      );

      setTimeout(() => router.push("/admin/laporan-kegiatan"), 500);
    } catch (error) {
      console.error("Gagal memperbarui laporan kegiatan:", error);
      toast.error(
        "Gagal memperbarui laporan kegiatan: " +
          (error.response?.data?.message || error.message),
        { position: "top-right", autoClose: 3500 }
      );
    } finally {
      setLoading(false);
    }
  };

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
        format(date, "EEEE, dd MMMM yyyy", { locale: localeId })
      );
    }
    setShowCalendar(false);
  };

  const clearDate = () => {
    setSelectedDate(null);
    formik.setFieldValue("tanggal_laporan", "");
    dateRef.current?.focus();
  };

  if (initialLoading) {
    return <FormSkeleton />;
  }

  return (
    <div className="mt-8 mb-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Card className="w-full max-w-2xl border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="p-4 sm:p-6">
          <Typography variant="h6" color="blue-gray" className="text-lg sm:text-xl">
            Edit Laporan Kegiatan
          </Typography>
        </CardHeader>

        <CardBody className="px-4 pb-6 sm:px-6">
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

            {/* Pelatihan */}
            <div>
              <Select
                key={`${pelatihanOptions.length}-${formik.values.pelatihan_id}`}
                label="Pilih Pelatihan"
                name="pelatihan_id"
                value={formik.values.pelatihan_id?.toString()}
                onChange={(value) => formik.setFieldValue("pelatihan_id", parseInt(value))}
                error={formik.touched.pelatihan_id && Boolean(formik.errors.pelatihan_id)}
              >
                {pelatihanOptions.map((pelatihan) => (
                  <Option key={pelatihan.pelatihan_id} value={pelatihan.pelatihan_id.toString()}>
                    {pelatihan.nama_pelatihan}
                  </Option>
                ))}
              </Select>
              {formik.touched.pelatihan_id &&
                formik.errors.pelatihan_id && (
                  <Typography variant="small" color="red" className="mt-1">
                    {formik.errors.pelatihan_id}
                  </Typography>
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
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-blue-gray-100">
              <Button
                type="button"
                variant="text"
                color="blue-gray"
                onClick={() => router.push("/admin/laporan-kegiatan")}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button 
                type="button"
                variant="outlined"
                color="amber"
                disabled={loading}
                onClick={() => handleSubmit('draft')}
                className="w-full sm:w-auto"
              >
                {loading ? "Menyimpan..." : "Simpan sebagai Draf"}
              </Button>
              <Button 
                type="button"
                color="green"
                disabled={loading}
                onClick={() => handleSubmit('final')}
                className="w-full sm:w-auto"
              >
                {loading ? "Menyimpan..." : "Buat Laporan"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}