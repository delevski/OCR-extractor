'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{
            scale: isDragActive ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {isDragActive ? 'Drop your file here' : 'Upload Image or PDF'}
            </h3>
            <p className="text-gray-500">
              Drag and drop or click to browse
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-400">
            <span>JPG</span>
            <span>•</span>
            <span>PNG</span>
            <span>•</span>
            <span>PDF</span>
            <span>•</span>
            <span>GIF</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
