import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/img/LOGO1.png"
                className="w-32 md:w-40 object-contain"
                alt="Logo"
              />
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FTC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;