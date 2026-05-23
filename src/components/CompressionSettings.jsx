import { Target, Sliders } from "lucide-react";
import { formatBytes } from "../utils/format";

export default function CompressionSettings({
  mode,
  quality,
  format,
  targetSizeKB,
  fileSize,
  onModeChange,
  onQualityChange,
  onFormatChange,
  onTargetSizeChange,
}) {
  const formats = [
    { value: "jpeg", label: "JPEG", desc: "Best for photos" },
    { value: "webp", label: "WebP", desc: "Smallest files" },
    { value: "png", label: "PNG", desc: "Graphics only" },
  ];

  const fileSizeKB = fileSize ? Math.floor(fileSize / 1024) : null;
  const maxTargetKB = fileSizeKB ? Math.max(1, fileSizeKB - 1) : 153600;
  const sliderStep = maxTargetKB > 10000 ? 100 : maxTargetKB > 1000 ? 10 : 1;

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-300">
          Compression mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onModeChange("targetSize")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left transition-all ${
              mode === "targetSize"
                ? "border-accent bg-accent/15 text-white"
                : "border-surface-border bg-surface-raised/50 text-gray-400 hover:border-gray-500"
            }`}
          >
            <Target className="h-4 w-4 shrink-0" />
            <div>
              <span className="block text-sm font-semibold">Target size</span>
              <span className="mt-0.5 block text-xs opacity-70">
                e.g. 102400 KB → 51200 KB
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("quality")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left transition-all ${
              mode === "quality"
                ? "border-accent bg-accent/15 text-white"
                : "border-surface-border bg-surface-raised/50 text-gray-400 hover:border-gray-500"
            }`}
          >
            <Sliders className="h-4 w-4 shrink-0" />
            <div>
              <span className="block text-sm font-semibold">By quality</span>
              <span className="mt-0.5 block text-xs opacity-70">Manual slider</span>
            </div>
          </button>
        </div>
      </div>

      {mode === "targetSize" ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Max output size
            </label>
            <span className="rounded-lg bg-surface-raised px-2.5 py-1 text-sm font-semibold text-accent">
              {targetSizeKB.toLocaleString()} KB
            </span>
          </div>
          <input
            type="range"
            min="1"
            max={maxTargetKB}
            step={sliderStep}
            value={Math.min(targetSizeKB, maxTargetKB)}
            onChange={(e) => onTargetSizeChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-border accent-accent"
          />
          <input
            type="number"
            min="1"
            max={maxTargetKB}
            value={targetSizeKB}
            onChange={(e) => onTargetSizeChange(Number(e.target.value))}
            className="mt-3 w-full rounded-xl border border-surface-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:border-accent"
          />
          {fileSize && (
            <p className="mt-2 text-xs text-gray-500">
              Original: {formatBytes(fileSize)} ({fileSizeKB.toLocaleString()} KB)
              {targetSizeKB >= fileSizeKB && (
                <span className="ml-1 text-amber-400">
                  — target must be less than original
                </span>
              )}
            </p>
          )}
          <p className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300">
            Automatically lowers quality and resolution until your file fits
            under the target. Use JPEG or WebP for best results on large photos.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Quality</label>
            <span className="rounded-lg bg-surface-raised px-2.5 py-1 text-sm font-semibold text-accent">
              {quality}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => onQualityChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-border accent-accent"
          />
          <div className="mt-1.5 flex justify-between text-xs text-gray-500">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
      )}

      <div>
        <label className="mb-3 block text-sm font-medium text-gray-300">
          Output format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {formats.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onFormatChange(f.value)}
              className={`rounded-xl border px-3 py-3 text-left transition-all ${
                format === f.value
                  ? "border-accent bg-accent/15 text-white"
                  : "border-surface-border bg-surface-raised/50 text-gray-400 hover:border-gray-500"
              }`}
            >
              <span className="block text-sm font-semibold">{f.label}</span>
              <span className="mt-0.5 block text-xs opacity-70">{f.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
