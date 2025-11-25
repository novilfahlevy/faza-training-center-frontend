'use client'; // Komponen ini memerlukan interaksi klien (useEffect, useRouter)

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function VerificationAlert({ searchParams }) {
  // Tampilkan pesan berdasarkan status
  if (searchParams.verification_status === 'success') {
    return (
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
        <p className="font-bold">Verifikasi Berhasil!</p>
        <p>Email Anda telah berhasil diverifikasi. Silakan masuk.</p>
      </div>
    );
  }

  // Anda juga bisa menambahkan penanganan untuk status gagal jika perlu
  if (searchParams.verification_status === 'failure') {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p className="font-bold">Verifikasi Gagal</p>
        <p>Link verifikasi tidak valid atau telah kedaluwarsa.</p>
      </div>
    );
  }

  return null; // Jangan tampilkan apa-apa jika tidak ada parameter
}