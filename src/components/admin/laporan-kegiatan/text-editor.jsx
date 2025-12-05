import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { uploadEditorImage } from "@/adminHttpClient";

import "react-quill/dist/quill.snow.css";
import '@/css/admin/editor-content.css';

// Import Quill's ImageResize module
const QuillImageResize = dynamic(
  () => import('quill-image-resize-module-react'),
  { ssr: false }
);

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    
    // Register ImageResize module
    if (typeof window !== 'undefined') {
      const ReactQuillModule = await import('react-quill');
      const { default: ImageResize } = await import('quill-image-resize-module-react');
      const Quill = ReactQuillModule.default.Quill;
      if (Quill) {
        Quill.register('modules/imageResize', ImageResize);
      }
    }

    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);

export default function QuillWrapper({ value, onChange, ...props }) {
  const quillRef = React.useRef(false);

  // Custom image upload handler
  function imgHandler() {
    // from https://github.com/quilljs/quill/issues/1089#issuecomment-318066471
    const quill = quillRef.current.getEditor();
    let fileInput = quill.root.querySelector("input.ql-image[type=file]");

    // to prevent duplicate initialization I guess
    if (fileInput === null) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute(
        "accept",
        "image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
      );
      fileInput.classList.add("ql-image");

      fileInput.addEventListener("change", () => {
        const files = fileInput.files;
        const range = quill.getSelection(true);

        if (!files || !files.length) {
          console.log("No files selected");
          return;
        }

        const formData = new FormData();
        formData.append("image", files[0]);
        quill.enable(false);
        uploadEditorImage(formData)
          .then((response) => {
            // after uploading succeed add img tag in the editor.
            // for detail visit https://quilljs.com/docs/api/#editor
            quill.enable(true);
            quill.insertEmbed(range.index, "image", response.data.data.url);
            quill.setSelection(range.index + 1);
            fileInput.value = "";
          })
          .catch((error) => {
            console.log("quill image upload failed");
            console.log(error);
            quill.enable(true);
          });
      });
      quill.root.appendChild(fileInput);
    }
    fileInput.click();
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          ["bold", "italic", "underline", "strike"], // toggled buttons
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],

          [{ align: [] }],
          ["link", "image"],
          ["clean"], // remove formatting button
        ],
        handlers: { image: imgHandler }, // Custom image handler
      },
      imageResize: {
        parchment: typeof window !== 'undefined' ? (require('react-quill').Quill || {}).import('parchment') : undefined,
        modules: ['Resize', 'DisplaySize', 'Toolbar']
      }
    }),
    []
  );

  return (
    <ReactQuill
      forwardedRef={quillRef}
      modules={modules}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
