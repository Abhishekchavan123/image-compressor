import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 600000,
});

export async function compressImage(file, options) {
  const { quality, format, mode, targetSizeKB } = options;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("format", format);
  formData.append("mode", mode);

  if (mode === "targetSize") {
    formData.append("targetSizeKB", targetSizeKB);
  } else {
    formData.append("quality", quality);
  }

  const response = await api.post("/compress", formData, {
    responseType: "blob",
    headers: { "Content-Type": "multipart/form-data" },
  });

  return {
    blob: response.data,
    originalSize: parseInt(response.headers["x-original-size"]),
    compressedSize: parseInt(response.headers["x-compressed-size"]),
    savingsPercent: parseInt(response.headers["x-savings-percent"]),
    targetMet: response.headers["x-target-met"] === "true",
    qualityUsed: parseInt(response.headers["x-quality-used"]),
    scaleUsed: parseFloat(response.headers["x-scale-used"]),
  };
}

export async function fetchHistory() {
  const { data } = await api.get("/history");
  return data;
}

export async function deleteHistoryItem(id) {
  await api.delete(`/history/${id}`);
}

export async function clearHistory() {
  await api.delete("/history");
}
