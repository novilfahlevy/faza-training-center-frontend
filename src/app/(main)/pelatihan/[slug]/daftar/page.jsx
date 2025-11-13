"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchTrainings, fetchTrainingById, registerUser, loginUser, registerForTraining } from '@/mainHttpClient';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function RegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const getTraining = async () => {
      try {
        const allTrainings = await fetchTrainings();
        const found = allTrainings.records.find(t => {
          const slug = t.nama_pelatihan.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return slug === params.slug;
        });
        if (found) {
          const detail = await fetchTrainingById(found.pelatihan_id);
          setTraining(detail);
        }
      } catch (error) {
        toast.error("Gagal memuat data pelatihan.");
      }
    };
    getTraining();
  }, [params.slug]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // 1. Registrasi Pengguna
      const registerPayload = {
        email: data.email,
        password: data.password,
        role: 'calon_peserta',
      };
      await registerUser(registerPayload);

      // 2. Login untuk mendapatkan token
      const loginPayload = { email: data.email, password: data.password };
      const { token } = await loginUser(loginPayload);

      // 3. Buat data calon peserta
      const calonPesertaPayload = {
        nama_lengkap: data.nama_lengkap,
        tempat_lahir: data.tempat_lahir,
        tanggal_lahir: data.tanggal_lahir,
        jenis_kelamin: data.jenis_kelamin,
        alamat: data.alamat,
        profesi: data.profesi,
        instansi: data.instansi,
        no_reg_kes: data.no_reg_kes,
        no_telp: data.no_telp,
      };
      // TODO: Anda perlu endpoint untuk membuat/update profil calon peserta
      // await createCalonPeserta(calonPesertaPayload, token);

      // 4. Daftar ke pelatihan
      await registerForTraining(training.pelatihan_id, token);

      toast.success('Pendaftaran berhasil! Silakan cek email Anda.');
      reset();
      router.push('/'); // Arahkan ke halaman utama

    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mendaftar.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!training) return <p className="container mx-auto px-6 py-10">Memuat...</p>;

  return (
    <div className="container mx-auto px-6 py-10">
      <Link href={`/pelatihan/${params.slug}`} className="flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Kembali ke Detail
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Formulir Pendaftaran</h1>
        <p className="text-gray-600 mb-8">Pelatihan: <span className="font-semibold">{training.nama_pelatihan}</span></p>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
          {/* Data Diri */}
          <h2 className="text-xl font-semibold mb-4">Data Diri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700">Nama Lengkap</label>
              <input {...register('nama_lengkap', { required: 'Wajib diisi' })} className="w-full mt-1 p-2 border rounded" />
              {errors.nama_lengkap && <p className="text-red-500 text-sm">{errors.nama_lengkap.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input type="email" {...register('email', { required: 'Wajib diisi' })} className="w-full mt-1 p-2 border rounded" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Tempat Lahir</label>
              <input {...register('tempat_lahir', { required: 'Wajib diisi' })} className="w-full mt-1 p-2 border rounded" />
              {errors.tempat_lahir && <p className="text-red-500 text-sm">{errors.tempat_lahir.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Tanggal Lahir</label>
              <input type="date" {...register('tanggal_lahir', { required: 'Wajib diisi' })} className="w-full mt-1 p-2 border rounded" />
              {errors.tanggal_lahir && <p className="text-red-500 text-sm">{errors.tanggal_lahir.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Jenis Kelamin</label>
              <select {...register('jenis_kelamin', { required: 'Wajib diisi' })} className="w-full mt-1 p-2 border rounded">
                <option value="">Pilih</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              {errors.jenis_kelamin && <p className="text-red-500 text-sm">{errors.jenis_kelamin.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">No. Telepon</label>
              <input {...register('no_telp', { required: 'Wajib diisi' })} className="w-full mt-1 p-2 border rounded" />
              {errors.no_telp && <p className="text-red-500 text-sm">{errors.no_telp.message}</p>}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Alamat Lengkap</label>
            <textarea {...register('alamat', { required: 'Wajib diisi' })} rows="3" className="w-full mt-1 p-2 border rounded"></textarea>
            {errors.alamat && <p className="text-red-500 text-sm">{errors.alamat.message}</p>}
          </div>

          {/* Data Profesional */}
          <h2 className="text-xl font-semibold mb-4">Data Profesional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700">Profesi</label>
              <input {...register('profesi', { required: 'Wajib diisi' })} className="w-full mt-1 p-2 border rounded" />
              {errors.profesi && <p className="text-red-500 text-sm">{errors.profesi.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Instansi</label>
              <input {...register('instansi')} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
              <label className="block text-gray-700">No. Registrasi (STR/SIP, dll)</label>
              <input {...register('no_reg_kes')} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>

          {/* Data Akun */}
          <h2 className="text-xl font-semibold mb-4">Buat Akun</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-700">Password</label>
              <input type="password" {...register('password', { required: 'Wajib diisi', minLength: 6 })} className="w-full mt-1 p-2 border rounded" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Konfirmasi Password</label>
              <input type="password" {...register('password_confirmation', { required: 'Wajib diisi' })} className="w-full mt-1 p-2 border rounded" />
              {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
          >
            {submitting ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}