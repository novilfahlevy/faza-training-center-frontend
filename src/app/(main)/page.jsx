import { Inter } from 'next/font/google';
import '@/css/tailwind.css';
import Link from 'next/link';
import { fetchTrainings } from '@/mainHttpClient';
import TrainingCard from '@/components/main/training-card';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { AcademicCapIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const inter = Inter({ subsets: ['latin'] });

export default async function HomePage() {
  let trainings = [];

  try {
    const data = await fetchTrainings({ limit: 6 });
    trainings = data.records || [];
  } catch (error) {
    console.error("Gagal memuat pelatihan di server:", error);
  }

  return (
    <div className={inter.className}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-x-12">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Tingkatkan Kompetensi Medis Anda Bersama FTC
            </h1>
            <p className="text-lg mb-6">
              Bergabunglah dengan pelatihan medis dan kesehatan terpercaya untuk dokter dan tenaga medis profesional, diselenggarakan oleh FTC bersama mitra berpengalaman.
            </p>
            <Link href="/pelatihan">
              <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition duration-300 flex items-center">
                Lihat Pelatihan Kami
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            </Link>
          </div>
          <div className="hidden lg:block lg:w-1/2">
            <img src="/img/LOGO1.png" alt="Medical Training" className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Mengapa Memilih FTC?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <AcademicCapIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pengajar Berpengalaman</h3>
              <p className="text-gray-600">Didukung oleh para ahli dan praktisi medis terkemuka di bidangnya.</p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sertifikat Resmi</h3>
              <p className="text-gray-600">Dapatkan sertifikat yang diakui dan meningkatkan nilai profesional Anda.</p>
            </div>
            <div className="text-center">
              <UserGroupIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Kolaborasi Mitra</h3>
              <p className="text-gray-600">Bekerja sama dengan rumah sakit dan institusi kesehatan terpercaya.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Trainings Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Pelatihan Terbaru</h2>
            <Link href="/pelatihan" className="text-blue-600 hover:underline flex items-center">
              Lihat Semua
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {/* 🔹 Tidak perlu loading state, data sudah ada saat render */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {trainings.length > 0 ? (
              trainings.map((training) => (
                <TrainingCard key={training.pelatihan_id} training={training} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">Belum ada pelatihan tersedia.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}