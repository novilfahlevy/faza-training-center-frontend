// /home/novilfahlevy/Projects/faza-training-center/src/app/(main)/pelatihan/page.jsx
"use client";

import '@/css/tailwind.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTrainings } from '@/mainHttpClient';
import { toast } from 'react-toastify';
import TrainingCard from '@/components/main/training-card';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// Skeleton Card Component
function TrainingCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

// Loading Spinner Component
function LoadingSpinner({ text = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute top-0 left-0 w-10 h-10 border-4 border-transparent rounded-full animate-pulse border-t-blue-400"></div>
      </div>
      <p className="mt-2 text-gray-500 text-sm">{text}</p>
    </div>
  );
}

export default function PelatihanPage() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [loadingMore, setLoadingMore] = useState(false); // Loading more state
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Search loading state

  const [page, setPage] = useState(1);
  const limit = 6;
  const [hasMore, setHasMore] = useState(true);

  // gunakan ref agar fetch berulang tidak double dipanggil
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(
    async (currentPage, query = '', isLoadMore = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        // Set appropriate loading state
        if (isLoadMore) {
          setLoadingMore(true);
        } else if (currentPage === 1) {
          setLoading(true);
          if (query) setIsSearching(true);
        }

        const params = { page: currentPage, size: limit };
        if (query !== '') params.search = query;

        const res = await fetchTrainings(params);

        const newRecords = res.records || [];

        if (currentPage === 1) {
          // reset data jika search baru atau first load
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
        setTimeout(() => {
          setLoading(false);
          setLoadingMore(false);
          setIsSearching(false);
        }, 500);
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
      if (!hasMore || loading || loadingMore) return;

      const scrolled = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 300;

      if (scrolled >= threshold) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

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
        {/* Initial loading state */}
        {loading && trainings.length === 0 ? (
          Array(limit)
            .fill(0)
            .map((_, index) => <TrainingCardSkeleton key={`skeleton-${index}`} />)
        ) : (
          trainings.map((training, idx) => (
            <TrainingCard key={training.pelatihan_id + '-' + idx} training={training} />
          ))
        )}
      </div>

      {/* Loading More Spinner */}
      {loadingMore && <LoadingSpinner text="Memuat lebih banyak..." />}

      {/* Search Loading State */}
      {isSearching && trainings.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(limit)
            .fill(0)
            .map((_, index) => <TrainingCardSkeleton key={`search-skeleton-${index}`} />)}
        </div>
      )}

      {/* No Data State */}
      {!loading && !isSearching && trainings.length === 0 && (
        <div className="text-center py-10">
          <div className="mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pelatihan ditemukan</h3>
          <p className="text-gray-500">Coba ubah kata kunci pencarian atau periksa kembali nanti.</p>
        </div>
      )}

      {/* No More Data */}
      {!hasMore && !loading && trainings.length > 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Tidak ada pelatihan lainnya.</p>
        </div>
      )}
    </div>
  );
}