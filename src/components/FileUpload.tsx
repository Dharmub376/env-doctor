import { useCallback } from 'react';

interface FileUploadProps {
  onContentChange: (content: string) => void;
}

export function FileUpload({ onContentChange }: FileUploadProps) {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onContentChange(content);
    };
    reader.readAsText(file);
  }, [onContentChange]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onContentChange(content);
    };
    reader.readAsText(file);
  }, [onContentChange]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative group overflow-hidden border-3 border-dashed border-purple-500/20 hover:border-purple-400/40 rounded-2xl p-12 text-center transition-all duration-500 cursor-pointer glass-effect"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Particle effect overlay on drag */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/30 rounded-full animate-ping"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative space-y-6">
        {/* Animated icon */}
        <div className="relative mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-500">
            <svg
              className="mx-auto h-20 w-20"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              strokeWidth="1.5"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-3">
          <div className="relative inline-block">
            <label htmlFor="file-upload" className="cursor-pointer">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient group-hover:scale-105 transition-transform duration-300">
                Upload your .env file
              </h3>
              <p className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors duration-300">
                Drag & drop anywhere or click to browse
              </p>
            </label>
            <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <input
            id="file-upload"
            type="file"
            accept=".env,.env.local,.env.example,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* File type badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {['.env', '.env.local', '.env.example', '.txt'].map((ext, index) => (
            <div
              key={ext}
              className="relative group/badge overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300"></div>
              <span className="relative px-4 py-2 bg-black/40 border border-purple-500/20 rounded-xl text-purple-300 text-sm font-medium backdrop-blur-sm transition-all duration-300 group-hover/badge:border-purple-400/40 group-hover/badge:text-purple-200 group-hover/badge:scale-105">
                {ext}
              </span>
            </div>
          ))}
        </div>

        {/* Info text */}
        <div className="pt-6">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>All files are processed locally in your browser</span>
          </div>
        </div>

        {/* Drag state indicator */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center space-x-2 text-purple-300">
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="font-medium">Drop your file here</span>
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500/30 rounded-tl-2xl"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500/30 rounded-tr-2xl"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500/30 rounded-bl-2xl"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500/30 rounded-br-2xl"></div>
    </div>
  );
}
