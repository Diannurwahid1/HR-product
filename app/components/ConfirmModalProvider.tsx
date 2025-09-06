"use client";
import React, { useState, useEffect } from "react";

let confirmModalHandler:
  | null
  | ((opts: {
      message: string;
      options?: any;
      resolve: (v: boolean) => void;
    }) => void) = null;

export function ConfirmModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modal, setModal] = useState<null | {
    message: string;
    options?: any;
    resolve: (v: boolean) => void;
  }>(null);

  useEffect(() => {
    // Expose handler globally for alerts.tsx
    (window as any).__confirmModalHandler = (opts: {
      message: string;
      options?: any;
      resolve: (v: boolean) => void;
    }) => setModal(opts);
    return () => {
      (window as any).__confirmModalHandler = null;
    };
  }, []);

  const handleClose = (result: boolean) => {
    if (modal) {
      modal.resolve(result);
      setModal(null);
    }
  };

  return (
    <>
      {children}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl p-6 min-w-[320px] max-w-[90vw]">
            <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-dark-100">
              Konfirmasi
            </div>
            <div className="mb-6 text-gray-700 dark:text-dark-200">
              {modal.message}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleClose(false)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-dark-200 hover:bg-gray-300 dark:hover:bg-dark-500"
              >
                Batal
              </button>
              <button
                onClick={() => handleClose(true)}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
