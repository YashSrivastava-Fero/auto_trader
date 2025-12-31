import { uploads } from "./dummy-data"

export const processUpload = async (uploadData: {
  type: string
  fileName: string
  settlementDate: string
  remarks: string
  onStatusChange: (status: string) => void
}) => {
  const uploadId = `UPL${String(uploads.length + 1).padStart(3, "0")}`
  const newUpload = {
    uploadId,
    type: uploadData.type,
    fileName: uploadData.fileName,
    settlementDate: uploadData.settlementDate,
    uploadedBy: "admin",
    uploadedAt: new Date().toISOString(),
    status: "Queued",
    remarks: uploadData.remarks,
  }

  uploads.unshift(newUpload)

  // Simulate queued state
  await new Promise((resolve) => setTimeout(resolve, 1000))

  newUpload.status = "Processing"
  uploadData.onStatusChange("Processing")

  // Simulate processing
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // 80% success rate
  const success = Math.random() > 0.2
  newUpload.status = success ? "Done" : "Failed"
  uploadData.onStatusChange(newUpload.status)
}

export const retryUpload = async (uploadId: string, onStatusChange: (status: string) => void) => {
  const upload = uploads.find((u) => u.uploadId === uploadId)
  if (!upload) return

  upload.status = "Processing"
  onStatusChange("Processing")

  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 70% success rate on retry
  const success = Math.random() > 0.3
  upload.status = success ? "Done" : "Failed"
  onStatusChange(upload.status)
}
