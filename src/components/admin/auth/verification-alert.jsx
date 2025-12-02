"use client";

import { Alert, Typography } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

export default function VerificationAlert() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const type = searchParams.get("type") || "info";

  if (!message) return null;

  const getAlertColor = () => {
    switch (type) {
      case "success":
        return "green";
      case "error":
        return "red";
      case "warning":
        return "amber";
      default:
        return "blue";
    }
  };

  return (
    <div className="mb-6">
      <Alert
        color={getAlertColor()}
        icon={
          <InformationCircleIcon
            strokeWidth={2}
            className="h-6 w-6"
          />
        }
      >
        <Typography variant="small">
          {message}
        </Typography>
      </Alert>
    </div>
  );
}