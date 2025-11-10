import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="hidden md:flex items-center space-x-2 text-2xl font-bold text-blue-600">
          <img src="/img/LOGO1.png" className="w-40" />
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