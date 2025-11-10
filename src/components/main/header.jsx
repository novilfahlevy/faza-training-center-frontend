import Link from 'next/link';
import Image from 'next/image';
import { BeakerIcon } from '@heroicons/react/24/solid';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
          <BeakerIcon className="h-8 w-8" />
          <span>FTC</span>
        </Link>
        <div className="space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <Link href="/pelatihan" className="text-gray-700 hover:text-blue-600 transition-colors">
            Pelatihan
          </Link>
          <Link href="/kontak" className="text-gray-700 hover:text-blue-600 transition-colors">
            Kontak
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;