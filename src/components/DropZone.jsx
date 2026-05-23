import { useCallback, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { formatBytes } from "../utils/format";

export default function DropZone({ onFileSelect, selectedFile }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-accent bg-accent/10 scale-[1.01]"
          : selectedFile
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-surface-border hover:border-accent/50 hover:bg-surface-raised/50"
      }`}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        className="absolute inset-0 cursor-pointer opacity-0"
      />

      {selectedFile ? (
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20">
            <ImagePlus className="h-7 w-7 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-white">{selectedFile.name}</p>
            <p className="mt-1 text-sm text-emerald-400/90">
              {formatBytes(selectedFile.size)}
            </p>
            <p className="mt-0.5 text-sm text-gray-400">
              Click or drop to replace
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
              isDragging ? "bg-accent/20" : "bg-surface-raised"
            }`}
          >
            <Upload
              className={`h-8 w-8 transition-colors ${
                isDragging ? "text-accent" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <p className="text-lg font-medium text-white">
              Drop your image here
            </p>
            <p className="mt-1 text-sm text-gray-400">
              or click to browse — JPEG, PNG, WebP, GIF up to 150MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
