"use client";

import '@/app/globals.css';
import { useState, useEffect, useCallback } from 'react';
import { fetchTrainings } from '@/api';
import { toast } from 'react-hot-toast';
import TrainingCard from '@/components/main/training-card';
// import Pagination from '@/components/main/ui/Pagination';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Utility: debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// export const metadata = {
//   title: 'Daftar Pelatihan - Faza Training Center',
//   description: 'Temukan berbagai pelatihan medis dan kesehatan untuk meningkatkan kompetensi profesional Anda.',
// };

export default function PelatihanPage() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // State untuk paginasi
  const [activePage, setActivePage] = useState(1);
  const [limit] = useState(9); // 9 kartu per halaman (3x3 grid)
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  // Fungsi untuk mengambil data pelatihan
  const fetchData = useCallback(async (page = 1, query = '') => {
    try {
      setLoading(true);
      const params = { page: page - 1, size: limit, search: query || undefined };
      const response = await fetchTrainings(params);
      
      setTrainings(response.records || []);
      setTotalPages(response.totalPages || 1);
      setTotalData(response.totalData || 0);
    } catch (error) {
      console.error("Gagal memuat data pelatihan:", error);
      toast.error("Gagal memuat data pelatihan.");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Debounced search handler
  const debouncedFetch = useCallback(
    debounce((query) => {
      setActivePage(1); // Reset ke halaman 1 saat searching
      fetchData(1, query);
    }, 500),
    [fetchData]
  );

  // Effect untuk fetch data pertama kali dan saat halaman berubah
  useEffect(() => {
    fetchData(activePage, search);
  }, [activePage, fetchData]);

  // Effect untuk handle perubahan input search
  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Daftar Pelatihan</h1>
        <p className="text-lg text-gray-600">
          Temukan pelatihan yang sesuai dengan kebutuhan profesional Anda.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama pelatihan..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-center text-gray-600 mb-6">
          Menampilkan {trainings.length} dari {totalData} pelatihan
        </p>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Training Grid */}
      {!loading && (
        <>
          {trainings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainings.map((training) => (
                <TrainingCard key={training.pelatihan_id} training={training} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Tidak ada pelatihan yang ditemukan untuk pencarian "<strong>{search}</strong>".</p>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {/* {!loading && totalPages > 1 && (
        <Pagination
          activePage={activePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )} */}
    </div>
  );
}