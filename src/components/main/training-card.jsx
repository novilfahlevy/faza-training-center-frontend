import Link from 'next/link';
import Image from 'next/image';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

const TrainingCard = ({ training }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {training.thumbnail_url ? (
        <img
          src={training.thumbnail_url}
          alt={training.nama_pelatihan}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs border">
          No Img
        </div>
      )}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{training.nama_pelatihan}</h3>
        <div>
          <div className="flex items-center text-sm text-gray-600 mb-2 space-x-4">
            <span className="flex items-center">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              {new Date(training.tanggal_pelatihan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {training.lokasi_pelatihan}
          </div>
          <Link href={`/pelatihan/${training.slug_pelatihan}`}>
            <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
              Lihat Detail
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;