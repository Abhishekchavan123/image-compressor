import { History, Trash2, X } from "lucide-react";
import { formatBytes, formatDate } from "../utils/format";

export default function HistoryPanel({
  history,
  onDelete,
  onClear,
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col glass animate-slide-up">
        <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold">Compression History</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-surface-raised hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              No compressions yet. Your history will appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {history.map((item) => (
                <li
                  key={item._id}
                  className="rounded-xl border border-surface-border bg-surface-raised/50 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">
                        {item.originalName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="shrink-0 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {formatBytes(item.originalSize)} →{" "}
                      {formatBytes(item.compressedSize)}
                    </span>
                    <span className="font-semibold text-emerald-400">
                      -{item.savingsPercent}%
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-md bg-surface px-2 py-0.5 text-xs uppercase text-gray-400">
                      {item.format}
                    </span>
                    {item.mode === "targetSize" && item.targetSizeKB ? (
                      <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
                        Target {item.targetSizeKB.toLocaleString()} KB
                        {item.targetMet === false && " (closest)"}
                      </span>
                    ) : (
                      <span className="rounded-md bg-surface px-2 py-0.5 text-xs text-gray-400">
                        Q{item.quality}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {history.length > 0 && (
          <div className="border-t border-surface-border p-4">
            <button
              onClick={onClear}
              className="w-full rounded-xl border border-red-500/30 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              Clear all history
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
