import { useCallback, useEffect, useState } from "react";
import {
  Zap,
  History,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import DropZone from "./components/DropZone";
import CompressionSettings from "./components/CompressionSettings";
import ResultPanel from "./components/ResultPanel";
import HistoryPanel from "./components/HistoryPanel";
import {
  compressImage,
  fetchHistory,
  deleteHistoryItem,
  clearHistory,
} from "./api";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mode, setMode] = useState("targetSize");
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState("jpeg");
  const [targetSizeKB, setTargetSizeKB] = useState(500);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const originalPreview = selectedFile
    ? URL.createObjectURL(selectedFile)
    : null;

  useEffect(() => {
    return () => {
      if (originalPreview) URL.revokeObjectURL(originalPreview);
      if (result?.compressedPreview) URL.revokeObjectURL(result.compressedPreview);
    };
  }, [originalPreview, result]);

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch {
      /* history optional when DB unavailable */
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    const sizeKB = Math.floor(file.size / 1024);
    setTargetSizeKB(Math.max(1, Math.floor(sizeKB / 2)));
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    if (mode === "targetSize") {
      const originalKB = Math.floor(selectedFile.size / 1024);
      if (targetSizeKB >= originalKB) {
        setError(
          `Target size must be less than the original file (${originalKB.toLocaleString()} KB)`
        );
        return;
      }
    }

    setIsCompressing(true);
    setError(null);
    setResult(null);

    try {
      const data = await compressImage(selectedFile, {
        quality,
        format,
        mode,
        targetSizeKB: mode === "targetSize" ? targetSizeKB : undefined,
      });

      const compressedPreview = URL.createObjectURL(data.blob);

      setResult({
        blob: data.blob,
        compressedPreview,
        originalSize: data.originalSize,
        compressedSize: data.compressedSize,
        savingsPercent: data.savingsPercent,
        targetMet: data.targetMet,
        qualityUsed: data.qualityUsed,
        scaleUsed: data.scaleUsed,
      });

      await loadHistory();
    } catch (err) {
      let message = err.message || "Compression failed";
      if (err.response?.data instanceof Blob) {
        try {
          const parsed = JSON.parse(await err.response.data.text());
          message = parsed.error || message;
        } catch {
          /* use default */
        }
      } else if (err.response?.data?.error) {
        message = err.response.data.error;
      }
      setError(message);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteHistory = async (id) => {
    await deleteHistoryItem(id);
    setHistory((prev) => prev.filter((h) => h._id !== id));
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
  };

  const compressLabel =
    mode === "targetSize"
      ? `Compress to under ${targetSizeKB.toLocaleString()} KB`
      : "Compress Image";

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <header className="relative border-b border-surface-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Squeeze</span>
              </h1>
              <p className="text-xs text-gray-500">Image Compressor</p>
            </div>
          </div>
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-raised/50 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-accent/50 hover:text-white"
          >
            <History className="h-4 w-4" />
            History
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <Sparkles className="h-4 w-4" />
            Shrink large images to your exact target size in KB
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Shrink large images to your target file size
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Upload photos up to 150 MB, set a target size in KB, and we automatically
            adjust quality and resolution until your file fits.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <DropZone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />

            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            {result && (
              <ResultPanel
                originalPreview={originalPreview}
                compressedPreview={result.compressedPreview}
                originalSize={result.originalSize}
                compressedSize={result.compressedSize}
                savingsPercent={result.savingsPercent}
                targetMet={result.targetMet}
                targetSizeKB={mode === "targetSize" ? targetSizeKB : null}
                qualityUsed={result.qualityUsed}
                scaleUsed={result.scaleUsed}
                onDownload={handleDownload}
              />
            )}
          </div>

          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <h3 className="mb-6 text-lg font-semibold">Settings</h3>
            <CompressionSettings
              mode={mode}
              quality={quality}
              format={format}
              targetSizeKB={targetSizeKB}
              fileSize={selectedFile?.size}
              onModeChange={setMode}
              onQualityChange={setQuality}
              onFormatChange={setFormat}
              onTargetSizeChange={setTargetSizeKB}
            />

            <button
              onClick={handleCompress}
              disabled={!selectedFile || isCompressing}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3.5 font-semibold text-white transition-all hover:from-indigo-400 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {mode === "targetSize"
                    ? "Finding optimal size..."
                    : "Compressing..."}
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  {compressLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <HistoryPanel
        history={history}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
