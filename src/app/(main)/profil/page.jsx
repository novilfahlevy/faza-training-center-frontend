"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { getUserProfile, updateUserProfile } from "@/mainHttpClient";

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    nama_lengkap: Yup.string().required("Nama lengkap wajib diisi"),
    no_telp: Yup.string().required("Nomor telepon wajib diisi"),
    jenis_kelamin: Yup.string().required("Jenis kelamin wajib dipilih"),
    tempat_lahir: Yup.string().required("Tempat lahir wajib diisi"),
    tanggal_lahir: Yup.string().required("Tanggal lahir wajib diisi"),
    alamat: Yup.string().required("Alamat wajib diisi"),
    profesi: Yup.string().required("Profesi wajib diisi"),
    instansi: Yup.string().required("Instansi wajib diisi"),
    no_reg_kes: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      nama_lengkap: "",
      no_telp: "",
      jenis_kelamin: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      alamat: "",
      profesi: "",
      instansi: "",
      no_reg_kes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await updateUserProfile(values);
        toast.success("Profil berhasil diperbarui!", { position: "top-right" });
      } catch (error) {
        toast.error(error.message || "Gagal memperbarui profil.", {
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        if (data) {
          formik.setValues({
            nama_lengkap: data.nama_lengkap || "",
            no_telp: data.no_telp || "",
            jenis_kelamin: data.jenis_kelamin || "",
            tempat_lahir: data.tempat_lahir || "",
            tanggal_lahir: data.tanggal_lahir || "",
            alamat: data.alamat || "",
            profesi: data.profesi || "",
            instansi: data.instansi || "",
            no_reg_kes: data.no_reg_kes || "",
          });
        }
      } catch (error) {
        toast.error("Gagal memuat data profil.");
      } finally {
        setInitialLoading(false);
      }
    };
    loadProfile();
  }, []);

  const Label = ({ children }) => (
    <Typography
      variant="small"
      color="blue-gray"
      className="my-2 font-medium flex items-center gap-1"
    >
      {children} <span className="text-red-500">*</span>
    </Typography>
  );

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Memuat data profil...
      </div>
    );
  }

  return (
    <section className="m-8 min-h-screen">
      <Toaster />
      <div className="w-full mt-8">
        <div className="text-center">
          <Typography variant="h3" className="font-bold mb-4 text-blue-600">
            Profil Saya
          </Typography>
          <Typography variant="small" color="gray">
            Perbarui informasi data diri Anda di sini.
          </Typography>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 mb-2 mx-auto w-96 max-w-screen-lg lg:w-1/2"
        >
          <Label>Nama Lengkap</Label>
          <Input
            name="nama_lengkap"
            size="lg"
            value={formik.values.nama_lengkap}
            onChange={formik.handleChange}
          />

          <Label>No. Telepon</Label>
          <Input
            name="no_telp"
            size="lg"
            value={formik.values.no_telp}
            onChange={formik.handleChange}
          />

          <Label>Jenis Kelamin</Label>
          <Select
            name="jenis_kelamin"
            label="Pilih Jenis Kelamin"
            value={formik.values.jenis_kelamin}
            onChange={(val) => formik.setFieldValue("jenis_kelamin", val)}
          >
            <Option value="L">Laki-laki</Option>
            <Option value="P">Perempuan</Option>
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div>
              <Label>Tempat Lahir</Label>
              <Input
                name="tempat_lahir"
                value={formik.values.tempat_lahir}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <Label>Tanggal Lahir</Label>
              <Input
                type="date"
                name="tanggal_lahir"
                value={formik.values.tanggal_lahir}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <Label className="mt-4">Alamat</Label>
          <Input
            name="alamat"
            size="lg"
            value={formik.values.alamat}
            onChange={formik.handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div>
              <Label>Profesi</Label>
              <Input
                name="profesi"
                value={formik.values.profesi}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <Label>Instansi</Label>
              <Input
                name="instansi"
                value={formik.values.instansi}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="my-2 font-medium"
              >
                Surat Tanda Registrasi (STR)
              </Typography>
              <Input
                name="no_reg_kes"
                value={formik.values.no_reg_kes}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-6 bg-blue-600"
            fullWidth
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </div>
    </section>
  );
}
