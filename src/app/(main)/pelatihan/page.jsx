"use client";

import '@/css/tailwind.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTrainings } from '@/mainHttpClient';
import { toast } from 'react-hot-toast';
import TrainingCard from '@/components/main/training-card';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function PelatihanPage() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);
  const limit = 6;
  const [hasMore, setHasMore] = useState(true);

  // gunakan ref agar fetch berulang tidak double dipanggil
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(
    async (currentPage, query = '') => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        setLoading(true);

        const params = { page: currentPage, size: limit };
        if (query !== '') params.search = query;

        const res = await fetchTrainings(params);

        const newRecords = res.records || [];

        if (currentPage === 1) {
          // reset data jika search baru
          setTrainings(newRecords);
        } else {
          // append data lama + baru
          setTrainings(prev => [...prev, ...newRecords]);
        }

        // cek apakah masih ada data berikutnya
        if (!newRecords.length || newRecords.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err) {
        console.error("Gagal fetch:", err);
        toast.error("Gagal memuat data");
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [limit]
  );

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      setPage(1);
      setHasMore(true);
      fetchData(1, query);
    }, 500),
    [fetchData]
  );

  // load data pertama
  useEffect(() => {
    fetchData(page, search);
  }, [page]);

  // search handler
  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  // =====================================
  // INFINITE SCROLL LISTENER
  // =====================================
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading) return;

      const scrolled = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 300;

      if (scrolled >= threshold) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Daftar Pelatihan</h1>
        <p className="text-lg text-gray-600">Temukan pelatihan yang sesuai dengan kebutuhan Anda.</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari pelatihan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Training Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainings.map((training, idx) => (
          <TrainingCard key={training.pelatihan_id + '-' + idx} training={training} />
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
        </div>
      )}

      {/* No More Data */}
      {!hasMore && !loading && (
        <p className="text-center text-gray-500 py-10">
          Tidak ada pelatihan lainnya.
        </p>
      )}
    </div>
  );
}
