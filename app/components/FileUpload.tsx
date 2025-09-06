import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept: string;
  maxSize: string;
  formats: string;
  onFileSelect: (file: File | null) => void;
  value?: File | null;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept, 
  maxSize, 
  formats, 
  onFileSelect,
  value,
  error
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setUploadStatus('uploading');
    
    // Simulate upload delay
    setTimeout(() => {
      onFileSelect(file);
      setUploadStatus('success');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setUploadStatus('idle');
      }, 2000);
    }, 500);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    onFileSelect(null);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 transition-colors duration-300">
        {label}
      </label>
      
      {value ? (
        <div className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-300 ${
          error 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' 
            : uploadStatus === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
            : 'bg-gray-50 dark:bg-dark-700 border-gray-300 dark:border-dark-600'
        }`}>
          <div className="flex items-center space-x-2">
            {uploadStatus === 'uploading' ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : uploadStatus === 'success' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : error ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <FileText className="w-4 h-4 text-gray-500 dark:text-dark-400" />
            )}
            <div>
              <span className="text-sm text-gray-700 dark:text-dark-300 font-medium">{value.name}</span>
              <p className="text-xs text-gray-500 dark:text-dark-400">{formatFileSize(value.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
              : error
              ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500 bg-white dark:bg-dark-700'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {uploadStatus === 'uploading' ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Mengupload...</p>
            </div>
          ) : (
            <>
              <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors duration-300 ${
                error ? 'text-red-400' : 'text-gray-400 dark:text-dark-500'
              }`} />
              <p className={`text-sm mb-1 transition-colors duration-300 ${
                error ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-dark-400'
              }`}>
                Klik untuk upload atau drag & drop
              </p>
              <p className={`text-xs transition-colors duration-300 ${
                error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-dark-500'
              }`}>
                Format: {formats}, Maks: {maxSize}
              </p>
            </>
          )}
        </div>
      )}
      
      {error && (
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;