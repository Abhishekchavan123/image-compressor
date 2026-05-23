import { Download, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatBytes } from "../utils/format";

export default function ResultPanel({
  originalPreview,
  compressedPreview,
  originalSize,
  compressedSize,
  savingsPercent,
  targetMet,
  targetSizeKB,
  qualityUsed,
  scaleUsed,
  onDownload,
}) {
  return (
    <div className="animate-slide-up space-y-6">
      {targetSizeKB != null && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            targetMet
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-400"
          }`}
        >
          {targetMet ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0" />
          )}
          {targetMet ? (
            <span>
              Target reached — file is under {targetSizeKB.toLocaleString()} KB (quality{" "}
              {qualityUsed}%, scale {Math.round(scaleUsed * 100)}%)
            </span>
          ) : (
            <span>
              Could not reach {targetSizeKB.toLocaleString()} KB — this is the smallest we could
              get ({formatBytes(compressedSize)}). Try a higher target or JPEG/WebP
              format.
            </span>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="border-b border-surface-border px-4 py-2.5">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Original
            </span>
          </div>
          <div className="flex aspect-video items-center justify-center bg-black/30 p-4">
            <img
              src={originalPreview}
              alt="Original"
              className="max-h-48 max-w-full rounded-lg object-contain"
            />
          </div>
          <div className="px-4 py-3 text-sm text-gray-400">
            {formatBytes(originalSize)}
          </div>
        </div>

        <div className="glass overflow-hidden rounded-2xl ring-1 ring-emerald-500/30">
          <div className="border-b border-surface-border px-4 py-2.5">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
              Compressed
            </span>
          </div>
          <div className="flex aspect-video items-center justify-center bg-black/30 p-4">
            <img
              src={compressedPreview}
              alt="Compressed"
              className="max-h-48 max-w-full rounded-lg object-contain"
            />
          </div>
          <div className="px-4 py-3 text-sm text-emerald-400">
            {formatBytes(compressedSize)}
          </div>
        </div>
      </div>

      <div className="glass flex flex-col items-center gap-4 rounded-2xl p-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-400">You saved</p>
            <p className="text-3xl font-bold text-emerald-400">
              {Math.max(0, savingsPercent)}%
            </p>
          </div>
          <ArrowRight className="hidden h-5 w-5 text-gray-600 sm:block" />
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-400">Size reduction</p>
            <p className="text-lg font-semibold text-white">
              {formatBytes(originalSize)} → {formatBytes(compressedSize)}
            </p>
          </div>
        </div>

        <button
          onClick={onDownload}
          className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <Download className="h-5 w-5" />
          Download
        </button>
      </div>
    </div>
  );
}
