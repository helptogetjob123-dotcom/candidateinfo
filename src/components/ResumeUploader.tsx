import React, { useRef, useState } from 'react';
import { CrosshairMarker } from './CrosshairMarker';

interface ResumeUploaderProps {
  file: File | null;
  cloudLink: string;
  onFileSelect: (file: File | null, base64: string) => void;
  onCloudLinkChange: (link: string) => void;
  error?: string;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  file,
  cloudLink,
  onFileSelect,
  onCloudLinkChange,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string>('');

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const handleFileProcess = (selectedFile: File) => {
    setFileError('');

    // Check file type
    const isAllowedExt = /\.(pdf|doc|docx)$/i.test(selectedFile.name);
    if (!ALLOWED_TYPES.includes(selectedFile.type) && !isAllowedExt) {
      setFileError('FILE_TYPE_INVALID: ONLY PDF, DOC, OR DOCX ACCEPTED.');
      return;
    }

    // Check size limit
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError(`FILE_SIZE_LIMIT: ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB EXCEEDS MAXIMUM 10MB.`);
      return;
    }

    // Read as Base64 for submission readiness
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string) || '';
      onFileSelect(selectedFile, base64);
    };
    reader.onerror = () => {
      setFileError('READ_ERROR: FAILED TO PROCESS RESUME BYTES.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null, '');
    setFileError('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Hidden Native Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Primary Drag & Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative p-6 cursor-pointer border transition-colors ${
          isDragging
            ? 'border-stark bg-carbon-hover'
            : file
            ? 'border-hairline-light bg-carbon-surface'
            : 'border-hairline bg-carbon-input hover:border-stark-steel'
        }`}
      >
        <CrosshairMarker position="top-left" />
        <CrosshairMarker position="top-right" />
        <CrosshairMarker position="bottom-left" />
        <CrosshairMarker position="bottom-right" />

        {!file ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
            <div className="w-10 h-10 border border-hairline flex items-center justify-center font-mono text-stark text-xs bg-carbon">
              [FILE]
            </div>
            <div>
              <p className="font-mono text-xs tracking-technical text-stark uppercase">
                DRAG & DROP RESUME DOSSIER HERE
              </p>
              <p className="font-mono text-[11px] text-stark-steel mt-1">
                OR CLICK TO BROWSE LOCAL FILESYSTEM
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-stark-dim uppercase tracking-wider">
              <span>PDF</span>
              <span>//</span>
              <span>DOCX</span>
              <span>//</span>
              <span>MAX: 10MB</span>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-signal-orange" />
                <span className="font-mono text-xs font-semibold text-stark tracking-tight break-all">
                  {file.name}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-stark-steel tracking-technical">
                <span>SIZE: {formatFileSize(file.size)}</span>
                <span>//</span>
                <span>STATUS: READY_FOR_ENCRYPTION</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="font-mono text-[11px] text-stark-steel hover:text-signal-orange px-2 py-1 border border-hairline hover:border-signal-orange transition-colors uppercase tracking-technical"
            >
              [X REMOVE]
            </button>
          </div>
        )}
      </div>

      {/* File Level Error */}
      {(fileError || error) && (
        <div className="font-mono text-[11px] text-signal-orange border-l-2 border-signal-orange pl-2 uppercase tracking-technical">
          [!] {fileError || error}
        </div>
      )}

      {/* Fallback & Secondary Alternative: Cloud Resume Link */}
      <div className="pt-2 border-t border-hairline space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="cloud_resume_link"
            className="font-mono text-[11px] uppercase tracking-technical text-stark-steel"
          >
            SECONDARY PROTOCOL // CLOUD RESUME REPOSITORY (OPTIONAL)
          </label>
          <span className="font-mono text-[10px] text-stark-dim uppercase tracking-wider">
            DRIVE / DROPBOX / NOTION / LINKEDIN
          </span>
        </div>

        <input
          id="cloud_resume_link"
          type="url"
          value={cloudLink}
          onChange={(e) => onCloudLinkChange(e.target.value)}
          placeholder="https://drive.google.com/... or https://linkedin.com/in/..."
          className="mechanical-input w-full px-3.5 py-2.5 font-mono text-xs text-stark placeholder:text-stark-dim focus:ring-0"
        />
        <p className="font-mono text-[10px] text-stark-dim leading-relaxed">
          * If your resume is hosted on Google Drive, ensure link sharing permissions are set to &quot;Anyone with the link can view&quot;.
        </p>
      </div>
    </div>
  );
};
