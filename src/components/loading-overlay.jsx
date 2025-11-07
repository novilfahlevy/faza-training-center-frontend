"use client";
import React from "react";
import LoadingOverlayTs from "react-loading-overlay-ts";

export default function LoadingOverlay({ active, text, children }) {
  return (
    <LoadingOverlayTs
      active={active}
      spinner
      text={text}
      styles={{
        overlay: (base) => ({
          ...base,
          background: "rgba(255, 255, 255, 0.85)",
          zIndex: 50,
        }),
        content: (base) => ({
          ...base,
          color: "#333",
          fontSize: "1.1rem",
          fontWeight: "500",
        }),
        spinner: (base) => ({
          ...base,
          width: "60px",
          "& svg circle": {
            stroke: "#3B82F6", // warna biru Tailwind
          },
        }),
      }}
    >
      {children}
    </LoadingOverlayTs>
  );
}
