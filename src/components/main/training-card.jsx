import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  ComputerDesktopIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const TrainingCard = ({ training }) => {
  // Format currency
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isFree = !training.biaya_pelatihan || training.biaya_pelatihan === 0;

  return (
    <div className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
      {/* Thumbnail dengan Overlay */}
      <div className="relative h-52 overflow-hidden">
        {training.thumbnail_url ? (
          <>
            <img
              src={training.thumbnail_url}
              alt={training.nama_pelatihan}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
          </>
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <ComputerDesktopIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}
        
        {/* Badge Daring/Luring - Positioned on Image */}
        <div className="absolute top-4 right-4">
          {training.daring ? (
            <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center shadow-lg backdrop-blur-sm bg-opacity-90">
              <ComputerDesktopIcon className="h-3.5 w-3.5 mr-1.5" />
              Daring
            </span>
          ) : (
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center shadow-lg backdrop-blur-sm bg-opacity-90">
              <MapPinIcon className="h-3.5 w-3.5 mr-1.5" />
              Luring
            </span>
          )}
        </div>

        {/* Badge Gratis jika ada */}
        {isFree && (
          <div className="absolute top-4 left-4">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">
              GRATIS
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {training.nama_pelatihan}
        </h3>

        {/* Info Grid */}
        <div className="space-y-2.5 mb-4 flex-1">
          {/* Tanggal */}
          <div className="flex items-start">
            <CalendarDaysIcon className="h-4 w-4 mr-2.5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">
              {new Date(training.tanggal_pelatihan).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>

          {/* Durasi */}
          {training.durasi_pelatihan && (
            <div className="flex items-start">
              <ClockIcon className="h-4 w-4 mr-2.5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{training.durasi_pelatihan}</span>
            </div>
          )}
          
          {/* Lokasi - hanya untuk luring */}
          {!training.daring && training.lokasi_pelatihan && (
            <div className="flex items-start">
              <MapPinIcon className="h-4 w-4 mr-2.5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 line-clamp-1">{training.lokasi_pelatihan}</span>
            </div>
          )}

          {/* Mitra */}
          {training.mitra?.data_mitra?.nama_mitra && (
            <div className="flex items-start">
              <BuildingOfficeIcon className="h-4 w-4 mr-2.5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 line-clamp-1">
                {training.mitra.data_mitra.nama_mitra}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4"></div>

        {/* Footer: Price & Button */}
        <div className="flex items-center justify-between gap-3">
          {/* Price */}
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-1.5 text-green-600" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Biaya</span>
              <span className={`font-bold text-base ${
                isFree ? "text-green-600" : "text-gray-800"
              }`}>
                {formatCurrency(training.biaya_pelatihan || 0)}
              </span>
            </div>
          </div>
          
          {/* Button */}
          <Link href={`/pelatihan/${training.slug_pelatihan}`}>
            <button className="bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 group/btn shadow-sm hover:shadow-md">
              Detail
              <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;