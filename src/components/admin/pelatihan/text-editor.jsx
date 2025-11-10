"use client";

import React from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";
import '@/css/admin/editor-content.css';

// Gunakan dynamic import agar tidak error di Next.js (karena SSR)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

export default function TextEditor({ value, onChange, placeholder }) {
  return (
    <div className="bg-white border border-blue-gray-100 rounded-md">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Tulis deskripsi di sini..."}
      />
    </div>
  );
}
