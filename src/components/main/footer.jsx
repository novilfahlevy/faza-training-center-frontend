import { BeakerIcon } from '@heroicons/react/24/solid';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BeakerIcon className="h-6 w-6" />
            <span className="text-xl font-bold">Faza Training Center</span>
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