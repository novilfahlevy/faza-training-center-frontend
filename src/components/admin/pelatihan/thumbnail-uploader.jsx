"use client";

import React, { useState, useEffect } from "react";
import ImageUploading from "react-images-uploading";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { uploadPelatihanThumbnail } from "@/adminHttpClient";

import '@/css/admin/thumbnail-uploader.css';

export default function ThumbnailUploader({ value, onChange, onFinished, onUploadingChange }) {
  const [uploading, setUploading] = useState(false);
  const [imageList, setImageList] = useState([]);

  // 🔹 Set preview dari data lama (edit mode)
  useEffect(() => {
    if (value?.url) {
      setImageList([{ data_url: value.url }]);
    } else {
      setImageList([]);
    }
  }, [value]);

  // 🔹 Notify parent when uploading state changes
  useEffect(() => {
    if (onUploadingChange) {
      onUploadingChange(uploading);
    }
  }, [uploading, onUploadingChange]);

  // 🔹 Fungsi upload thumbnail ke server
  const handleUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await uploadPelatihanThumbnail(formData);

      const { thumbnail_id, url } = response.data;
      onChange({ id: thumbnail_id, url });
      toast.success("Thumbnail berhasil diunggah!");
    } catch (error) {
      console.error("❌ Gagal upload thumbnail:", error);
      toast.error("Gagal mengunggah thumbnail.");
    } finally {
      setUploading(false);
      if (onFinished) onFinished();
    }
  };

  // 🔹 Handler utama perubahan gambar
  const handleChange = async (list) => {
    setImageList(list);
    if (list.length > 0 && list[0].file) {
      await handleUpload(list[0].file);
    }
  };

  // 🔹 Hapus thumbnail
  const handleRemove = (event) => {
    event.stopPropagation();
    setImageList([]);
    onChange(null);
  };

  return (
    <div className="image-upload">
      <ImageUploading
        multiple={false}
        value={imageList}
        onChange={handleChange}
        maxNumber={1}
        dataURLKey="data_url"
        acceptType={["jpg", "jpeg", "png", "webp"]}
      >
        {({ imageList, onImageUpload, dragProps }) => (
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition ${
              uploading ? "opacity-60 pointer-events-none" : ""
            }`}
            onClick={() => !uploading && onImageUpload()}
            {...dragProps}
          >
            {imageList.length === 0 ? (
              <div className="text-gray-500">
                {uploading ? (
                  <p>Mengunggah...</p>
                ) : (
                  <p>Klik atau tarik gambar ke sini untuk mengunggah</p>
                )}
              </div>
            ) : (
              imageList.map((image, index) => (
                <div key={index} className="relative w-full">
                  <img
                    src={image.data_url}
                    alt="Thumbnail"
                    className="w-full h-48 md:h-40 object-cover rounded-lg shadow-sm border"
                  />
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-50"
                    title="Hapus thumbnail"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}