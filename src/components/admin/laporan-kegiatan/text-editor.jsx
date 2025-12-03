import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ value, onChange }) => {
  const [editorHtml, setEditorHtml] = useState(value || "");

  useEffect(() => {
    setEditorHtml(value || "");
  }, [value]);

  const handleChange = (html) => {
    setEditorHtml(html);
    onChange(html);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"]
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="text-editor w-full">
      <style jsx>{`
        :global(.text-editor .ql-container) {
          font-size: 16px;
          min-height: 300px;
        }
        :global(.text-editor .ql-editor) {
          min-height: 300px;
          max-height: 500px;
          padding: 12px;
        }
        :global(.text-editor) {
          border: 1px solid #e0e0e0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Tulis isi laporan kegiatan di sini..."
      />
    </div>
  );
};

export default TextEditor;