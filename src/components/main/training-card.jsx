import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  ComputerDesktopIcon 
} from '@heroicons/react/24/outline';

const TrainingCard = ({ training }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
      <div className="flex-1 p-6 flex flex-col">
        {/* Bagian Atas: Judul dan Badge */}
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-800 flex-1 pr-2">{training.nama_pelatihan}</h3>
            {training.daring ? (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center whitespace-nowrap">
                <ComputerDesktopIcon className="h-3 w-3 mr-1" />
                Daring
              </span>
            ) : (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center whitespace-nowrap">
                <MapPinIcon className="h-3 w-3 mr-1" />
                Luring
              </span>
            )}
          </div>
        </div>

        {/* Bagian Bawah: Informasi Detail dan Tombol */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
              {new Date(training.tanggal_pelatihan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
              {training.lokasi_pelatihan}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-semibold">{formatCurrency(training.biaya_pelatihan || 0)}</span>
            </div>
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