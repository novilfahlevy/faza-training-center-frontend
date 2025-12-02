// /home/novilfahlevy/Projects/faza-training-center/src/app/(main)/kontak/page.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
} from "@material-tailwind/react";
import {
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Loading Skeleton Component
function ContactSkeleton() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form Skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Contact Info Skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-28 mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KontakPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    // Simulasi loading untuk data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Semua field harus diisi");
      return;
    }

    try {
      setSubmitting(true);
      
      // Simulasi pengiriman form
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Pesan Anda telah terkirim!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ContactSkeleton />;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Hubungi Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami jika Anda
            memiliki pertanyaan atau membutuhkan informasi lebih lanjut tentang
            pelatihan kami.
          </p>
        </div>
        
        <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Informasi Kontak
        </h2>
        <div className="space-y-4">
            <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
                <PhoneIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
                <h3 className="font-medium text-gray-800">WhatsApp</h3>
                <a
                href="https://wa.me/6285213314700"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                >
                +62 852-1331-4700
                </a>
            </div>
            </div>
            <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
                <EnvelopeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
                <h3 className="font-medium text-gray-800">Email</h3>
                <a
                href="mailto:fazatrainingcenter@gmail.com"
                className="text-blue-600 hover:underline"
                >
                fazatrainingcenter@gmail.com
                </a>
            </div>
            </div>
            <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
                <MapPinIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
                <h3 className="font-medium text-gray-800">Alamat</h3>
                <p className="text-gray-600">
                Jl. Contoh No. 123, Jakarta Selatan, Indonesia
                </p>
            </div>
            </div>
        </div>

        <div className="mt-8">
            <h3 className="font-medium text-gray-800 mb-4">Chat Langsung</h3>
            <a
            href="https://wa.me/6285213314700"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
            >
            <Button
                color="green"
                size="lg"
                className="flex items-center justify-center gap-2 w-full"
            >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Chat on WhatsApp
            </Button>
            </a>
        </div>
        </div>
      </div>
    </div>
  );
}