import Link from 'next/link';
import Image from 'next/image';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

const TrainingCard = ({ training }) => {
  // Buat slug dari nama pelatihan untuk URL yang SEO-friendly
  const slug = training.nama_pelatihan.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={training.thumbnail_url || 'https://via.placeholder.com/400x250.png?text=No+Image'}
        alt={training.nama_pelatihan}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{training.nama_pelatihan}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
          <span className="flex items-center">
            <CalendarDaysIcon className="h-4 w-4 mr-1" />
            {new Date(training.tanggal_pelatihan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPinIcon className="h-4 w-4 mr-1" />
          {training.lokasi_pelatihan}
        </div>
        <Link href={`/pelatihan/${slug}`}>
          <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
            Lihat Detail
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TrainingCard;