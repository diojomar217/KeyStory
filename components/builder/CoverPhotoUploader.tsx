'use client';

import { useState, useCallback, useRef } from 'react';

interface CoverPhotoUploaderProps {
  photos: File[];
  photoPreviews: string[];
  coverPhotoIndex: number | undefined;
  onPhotosChange: (photos: File[]) => void;
  onCoverPhotoSelect: (index: number | undefined) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PHOTOS = 15;

export default function CoverPhotoUploader({
  photos,
  photoPreviews,
  coverPhotoIndex,
  onPhotosChange,
  onCoverPhotoSelect,
}: CoverPhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Please use JPG, PNG, or WebP.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is 10MB.`;
    }
    return null;
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);
    
    if (fileArray.length + photos.length > MAX_PHOTOS) {
      setError(`You can only upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    fileArray.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      onPhotosChange([...photos, ...validFiles]);
    }
  }, [photos, onPhotosChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    
    onPhotosChange(newPhotos);
    
    // Adjust cover photo index
    if (coverPhotoIndex === index) {
      onCoverPhotoSelect(undefined);
    } else if (coverPhotoIndex !== undefined && coverPhotoIndex > index) {
      onCoverPhotoSelect(coverPhotoIndex - 1);
    }
  };

  const handleReplacePhoto = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ALLOWED_TYPES.join(',');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
        
        const newPhotos = [...photos];
        newPhotos[index] = file;
        onPhotosChange(newPhotos);
        
        // Update preview
        const newPreviews = [...photoPreviews];
        newPreviews[index] = URL.createObjectURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-rose-500 bg-rose-50 scale-[1.02]' 
            : 'border-slate-300 hover:border-rose-400 hover:bg-rose-50/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-3">
          <div className={`
            w-16 h-16 mx-auto rounded-full flex items-center justify-center
            ${isDragging ? 'bg-rose-100' : 'bg-slate-100'}
            transition-colors
          `}>
            <svg 
              className={`w-8 h-8 ${isDragging ? 'text-rose-500' : 'text-slate-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-semibold text-slate-700">
              {isDragging ? 'Drop photos here' : 'Drag & drop photos'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse • JPG, PNG, WebP up to 10MB
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {photos.length}/{MAX_PHOTOS} photos uploaded
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Photo Grid */}
      {photoPreviews.length > 0 && (
        <div className="space-y-4">
          {/* Cover Photo Selection */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-5 border border-rose-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🖼️</span>
              <label className="block font-semibold text-slate-700">
                Select Cover Photo
              </label>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              This photo will be the first thing visitors see on your website.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {photoPreviews.map((preview, index) => (
                <div
                  key={index}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    coverPhotoIndex === index
                      ? 'border-rose-500 ring-2 ring-rose-200 shadow-md'
                      : 'border-slate-200 hover:border-rose-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCoverPhotoSelect(index);
                  }}
                >
                  <div className="aspect-square relative">
                    <img
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Cover indicator */}
                    {coverPhotoIndex === index && (
                      <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 shadow-md">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1">
                      {coverPhotoIndex === index ? (
                        <span className="px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                          Cover
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCoverPhotoSelect(index);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-white/90 text-slate-700 text-xs font-medium rounded-full hover:bg-white"
                          >
                            Set Cover
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReplacePhoto(index);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/90 rounded-full hover:bg-white"
                            title="Replace"
                          >
                            <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePhoto(index);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/90 rounded-full hover:bg-white"
                            title="Remove"
                          >
                            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {coverPhotoIndex === undefined && (
              <p className="text-xs text-slate-400 mt-3">
                💡 First photo will be used as cover by default
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

