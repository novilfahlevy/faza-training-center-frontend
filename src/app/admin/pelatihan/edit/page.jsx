"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function EditPelatihan() {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [formData, setFormData] = useState({
    nama_pelatihan: "",
    deskripsi_pelatihan: "",
    tanggal_pelatihan: "",
    durasi_pelatihan: "",
    lokasi_pelatihan: "",
    user_id: 1,
    role: "admin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      tanggal_pelatihan: format(date, "yyyy-MM-dd"),
    });
    setShowCalendar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data pelatihan baru:", formData);
    alert("Pelatihan berhasil ditambahkan!");
    router.push("/admin/pelatihan");
  };

  return (
    <div className="mt-12 flex justify-center">
      <Card className="w-full max-w-3xl border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="p-3">
          <Typography variant="h6" color="blue-gray">
            Edit Pelatihan
          </Typography> 
        </CardHeader>

        <CardBody className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Nama Pelatihan"
              name="nama_pelatihan"
              value={formData.nama_pelatihan}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Deskripsi Pelatihan"
              name="deskripsi_pelatihan"
              value={formData.deskripsi_pelatihan}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              {/* Date Picker Input */}
              <div>
                <Input
                  label="Tanggal Pelatihan"
                  name="tanggal_pelatihan"
                  value={formData.tanggal_pelatihan}
                  onFocus={() => setShowCalendar(true)}
                  readOnly
                  required
                />
                {showCalendar && (
                  <div className="absolute z-50 bg-white shadow-lg rounded-lg mt-2 p-3">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                    />
                  </div>
                )}
              </div>

              <div>
                <Input
                  label="Durasi Pelatihan"
                  name="durasi_pelatihan"
                  value={formData.durasi_pelatihan}
                  onChange={handleChange}
                  required
                />
                <Typography
                  variant="small"
                  color="gray"
                  className="mt-1 ml-1 text-xs"
                >
                  Contoh: 3 Hari, 2 Minggu, 1 Bulan
                </Typography>
              </div>
            </div>

            <Input
              label="Lokasi Pelatihan"
              name="lokasi_pelatihan"
              value={formData.lokasi_pelatihan}
              onChange={handleChange}
              required
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="text"
                color="blue-gray"
                onClick={() => router.push("/admin/pelatihan")}
              >
                Batal
              </Button>
              <Button type="submit" color="blue">
                Simpan
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
