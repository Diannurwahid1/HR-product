import toast from "react-hot-toast";
import React, { useState } from "react";

// Standardized alert types
export type AlertType = "success" | "error" | "warning" | "info";

// Alert configuration
const alertConfig = {
  duration: 4000,
  position: "top-right" as const,
  style: {
    borderRadius: "8px",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid var(--border-primary)",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
    maxWidth: "400px",
  },
};

// Success alerts
export const showSuccess = (message: string, options?: any) => {
  return toast.success(message, {
    ...alertConfig,
    ...options,
    style: {
      ...alertConfig.style,
      borderLeft: "4px solid #10b981",
      ...options?.style,
    },
    iconTheme: {
      primary: "#10b981",
      secondary: "#fff",
    },
  });
};

// Error alerts
export const showError = (message: string, options?: any) => {
  return toast.error(message, {
    ...alertConfig,
    duration: 6000, // Longer duration for errors
    ...options,
    style: {
      ...alertConfig.style,
      borderLeft: "4px solid #ef4444",
      ...options?.style,
    },
    iconTheme: {
      primary: "#ef4444",
      secondary: "#fff",
    },
  });
};

// Warning alerts
export const showWarning = (message: string, options?: any) => {
  return toast(message, {
    ...alertConfig,
    duration: 5000,
    ...options,
    style: {
      ...alertConfig.style,
      borderLeft: "4px solid #f59e0b",
      ...options?.style,
    },
    icon: "⚠️",
  });
};

// Info alerts
export const showInfo = (message: string, options?: any) => {
  return toast(message, {
    ...alertConfig,
    ...options,
    style: {
      ...alertConfig.style,
      borderLeft: "4px solid #3b82f6",
      ...options?.style,
    },
    icon: "ℹ️",
  });
};

// Loading alert with promise
export const showLoading = (
  promise: Promise<any>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: any
) => {
  return toast.promise(promise, messages, {
    ...alertConfig,
    ...options,
    style: {
      ...alertConfig.style,
      ...options?.style,
    },
    success: {
      style: {
        ...alertConfig.style,
        borderLeft: "4px solid #10b981",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#fff",
      },
    },
    error: {
      style: {
        ...alertConfig.style,
        borderLeft: "4px solid #ef4444",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
    loading: {
      style: {
        ...alertConfig.style,
        borderLeft: "4px solid #6b7280",
      },
    },
  });
};

// Dismiss all alerts
export const dismissAll = () => {
  toast.dismiss();
};

// Dismiss specific alert
export const dismiss = (toastId: string) => {
  toast.dismiss(toastId);
};

export const showConfirm = (
  message: string,
  options?: any
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (
      typeof window !== "undefined" &&
      (window as any).__confirmModalHandler
    ) {
      (window as any).__confirmModalHandler({ message, options, resolve });
    } else {
      // fallback: resolve false if modal not mounted
      resolve(false);
    }
  });
};
