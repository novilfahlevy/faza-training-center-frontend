"use client";

import '@/app/globals.css';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchTrainings, fetchTrainingById } from '@/api';
import Link from 'next/link';
import { CalendarDaysIcon, MapPinIcon, BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function TrainingDetailPage() {
  const params = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTraining = async () => {
      try {
        // Cari pelatihan berdasarkan slug dari semua data pelatihan
        const allTrainings = await fetchTrainings();
        const found = allTrainings.records.find(t => {
          const slug = t.nama_pelatihan.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return slug === params.slug;
        });

        if (found) {
          const detail = await fetchTrainingById(found.pelatihan_id);
          setTraining(detail);
        } else {
          toast.error("Pelatihan tidak ditemukan.");
        }
      } catch (error) {
        toast.error("Gagal memuat detail pelatihan.");
      } finally {
        setLoading(false);
      }
    };
    getTraining();
  }, [params.slug]);

  if (loading) return <p className="container mx-auto px-6 py-10">Memuat...</p>;
  if (!training) return <p className="container mx-auto px-6 py-10">Pelatihan tidak ditemukan.</p>;

  return (
    <div className="container mx-auto px-6 py-10">
      <Link href="/pelatihan" className="flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Kembali ke Daftar Pelatihan
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={training.thumbnail_url || 'https://via.placeholder.com/800x400.png?text=No+Image'}
          alt={training.nama_pelatihan}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{training.nama_pelatihan}</h1>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              {new Date(training.tanggal_pelatihan).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {training.lokasi_pelatihan}
            </span>
            {training.mitra && (
              <span className="flex items-center text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                Bersama {training.mitra.nama_mitra}
              </span>
            )}
          </div>

          <div className="prose prose-content max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: training.deskripsi_pelatihan }} />

          <div className="mt-8">
            <Link href={`/pelatihan/${params.slug}/daftar`}>
              <button className="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300">
                Daftar Sekarang
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}