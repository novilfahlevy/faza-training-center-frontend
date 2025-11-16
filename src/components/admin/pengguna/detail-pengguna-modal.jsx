"use client";

import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Card,
  CardBody,
  Chip,
  Badge,
} from "@material-tailwind/react";
import {
  UserIcon,
  PhoneIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  CalendarIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

export default function DetailPenggunaModal({ open, onClose, user }) {
  if (!user) return null;

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Komponen untuk menampilkan informasi dasar
  const BasicInfo = ({ children, title, icon }) => (
    <Card className="mb-4 shadow-sm border border-blue-gray-100">
      <CardBody className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-blue-gray-50">
            {icon}
          </div>
          <Typography variant="h6" color="blue-gray">
            {title}
          </Typography>
        </div>
        <div className="space-y-2">
          {children}
        </div>
      </CardBody>
    </Card>
  );

  // Komponen untuk menampilkan item informasi
  const InfoItem = ({ label, value, icon }) => (
    <div className="flex items-start gap-3 py-2 border-b border-blue-gray-50 last:border-0">
      <div className="p-1.5 rounded-md bg-blue-gray-50 mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <Typography variant="small" className="font-medium text-blue-gray-600">
          {label}
        </Typography>
        <Typography variant="small" className="text-blue-gray-900 mt-0.5">
          {value}
        </Typography>
      </div>
    </div>
  );

  // Fungsi untuk mendapatkan warna berdasarkan role
  const getRoleColor = (role) => {
    switch (role) {
      case "peserta":
        return "blue";
      case "mitra":
        return "purple";
      case "admin":
        return "gray";
      default:
        return "gray";
    }
  };

  // Render detail untuk role peserta
  const renderPesertaDetails = () => (
    <>
      <BasicInfo title="Informasi Dasar" icon={<UserIcon className="h-5 w-5 text-blue-600" />}>
        <InfoItem 
          label="Nama Lengkap" 
          value={user.nama_lengkap} 
          icon={<UserIcon className="h-4 w-4 text-blue-500" />}
        />
        <InfoItem 
          label="Email" 
          value={user.email} 
          icon={<EnvelopeIcon className="h-4 w-4 text-blue-500" />}
        />
        <InfoItem 
          label="Jenis Kelamin" 
          value={user.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"} 
          icon={<IdentificationIcon className="h-4 w-4 text-blue-500" />}
        />
        <InfoItem 
          label="Tempat Lahir" 
          value={user.tempat_lahir} 
          icon={<IdentificationIcon className="h-4 w-4 text-blue-500" />}
        />
        <InfoItem 
          label="Tanggal Lahir" 
          value={formatDate(user.tanggal_lahir)} 
          icon={<CalendarIcon className="h-4 w-4 text-blue-500" />}
        />
      </BasicInfo>

      <BasicInfo title="Informasi Kontak" icon={<PhoneIcon className="h-5 w-5 text-green-600" />}>
        <InfoItem 
          label="No. Telepon" 
          value={user.no_telp} 
          icon={<PhoneIcon className="h-4 w-4 text-green-500" />}
        />
        <InfoItem 
          label="Alamat" 
          value={user.alamat} 
          icon={<BuildingOfficeIcon className="h-4 w-4 text-green-500" />}
        />
      </BasicInfo>

      <BasicInfo title="Informasi Profesional" icon={<BriefcaseIcon className="h-5 w-5 text-purple-600" />}>
        <InfoItem 
          label="Profesi" 
          value={user.profesi} 
          icon={<BriefcaseIcon className="h-4 w-4 text-purple-500" />}
        />
        <InfoItem 
          label="Instansi" 
          value={user.instansi} 
          icon={<BuildingOfficeIcon className="h-4 w-4 text-purple-500" />}
        />
        <InfoItem 
          label="No. Registrasi Kesehatan" 
          value={user.no_reg_kes} 
          icon={<IdentificationIcon className="h-4 w-4 text-purple-500" />}
        />
      </BasicInfo>
    </>
  );

  // Render detail untuk role mitra
  const renderMitraDetails = () => (
    <>
      <BasicInfo title="Informasi Dasar" icon={<UserIcon className="h-5 w-5 text-blue-600" />}>
        <InfoItem 
          label="Nama Mitra" 
          value={user.nama_mitra} 
          icon={<UserIcon className="h-4 w-4 text-blue-500" />}
        />
        <InfoItem 
          label="Email" 
          value={user.email} 
          icon={<EnvelopeIcon className="h-4 w-4 text-blue-500" />}
        />
      </BasicInfo>

      <BasicInfo title="Informasi Kontak" icon={<PhoneIcon className="h-5 w-5 text-green-600" />}>
        <InfoItem 
          label="Telepon" 
          value={user.telepon_mitra} 
          icon={<PhoneIcon className="h-4 w-4 text-green-500" />}
        />
        <InfoItem 
          label="Alamat" 
          value={user.alamat_mitra} 
          icon={<BuildingOfficeIcon className="h-4 w-4 text-green-500" />}
        />
        <InfoItem 
          label="Website" 
          value={user.website_mitra} 
          icon={<BuildingOfficeIcon className="h-4 w-4 text-green-500" />}
        />
      </BasicInfo>

      <BasicInfo title="Deskripsi" icon={<BuildingOfficeIcon className="h-5 w-5 text-purple-600" />}>
        <Typography variant="small" className="text-blue-gray-700">
          {user.deskripsi_mitra || "-"}
        </Typography>
      </BasicInfo>
    </>
  );

  // Render detail untuk role admin
  const renderAdminDetails = () => (
    <>
      <BasicInfo title="Informasi Dasar" icon={<UserIcon className="h-5 w-5 text-blue-600" />}>
        <InfoItem 
          label="ID" 
          value={user.id} 
          icon={<IdentificationIcon className="h-4 w-4 text-blue-500" />}
        />
        <InfoItem 
          label="Email" 
          value={user.email} 
          icon={<EnvelopeIcon className="h-4 w-4 text-blue-500" />}
        />
        <InfoItem 
          label="Role" 
          value={user.role} 
          icon={<UserIcon className="h-4 w-4 text-blue-500" />}
        />
      </BasicInfo>
    </>
  );

  // Pilih fungsi render berdasarkan role
  const renderDetails = () => {
    switch (user.role) {
      case "peserta":
        return renderPesertaDetails();
      case "mitra":
        return renderMitraDetails();
      case "admin":
        return renderAdminDetails();
      default:
        return renderAdminDetails();
    }
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="!max-h-[90vh] flex flex-col overflow-hidden"
    >
      <DialogHeader className="sticky top-0 z-10 bg-white border-b border-blue-gray-50 shadow-sm">
        <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-center md:gap-x-4 w-full">
          <div className="flex items-center gap-2">
            <Typography variant="h4" color="blue-gray">
              {user.role === "peserta" && user.nama_lengkap
                ? user.nama_lengkap
                : user.role === "mitra" && user.nama_mitra
                ? user.nama_mitra
                : "Admin"}
            </Typography>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <Chip
              variant="gradient"
              color={getRoleColor(user.role)}
              value={user.role}
              className="py-0.5 px-2 text-[11px] font-medium"
            />
            <Typography variant="small" color="blue-gray" className="font-medium">
              {user.email}
            </Typography>
          </div>
        </div>
      </DialogHeader>

      <DialogBody divider className="overflow-y-auto px-4 flex-1">
        <div className="space-y-4">
          {renderDetails()}
        </div>
      </DialogBody>

      <DialogFooter className="sticky bottom-0 z-10 bg-white border-t border-blue-gray-50 shadow-sm">
        <Button color="red" variant="text" onClick={onClose}>
          Tutup
        </Button>
      </DialogFooter>
    </Dialog>
  );
}