"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { processUpload } from "@/lib/upload-processor"

const uploadTypes = ["Trade File", "Scrip List", "DR-CR", "Payin/Payout", "Latest Rate"]

export default function UploadPage() {
  const [uploadType, setUploadType] = useState("")
  const [settlementDate, setSettlementDate] = useState("")
  const [remarks, setRemarks] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !uploadType || !settlementDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    toast({
      title: "Upload Queued",
      description: "Your file has been queued for processing",
    })

    await processUpload({
      type: uploadType,
      fileName: file.name,
      settlementDate,
      remarks,
      onStatusChange: (status) => {
        if (status === "Processing") {
          toast({
            title: "Processing Started",
            description: `Processing ${file.name}...`,
          })
        } else if (status === "Done") {
          toast({
            title: "Upload Complete",
            description: `${file.name} processed successfully`,
          })
          setIsProcessing(false)
          setFile(null)
          setUploadType("")
          setSettlementDate("")
          setRemarks("")
        } else if (status === "Failed") {
          toast({
            title: "Upload Failed",
            description: `Failed to process ${file.name}`,
            variant: "destructive",
          })
          setIsProcessing(false)
        }
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">File Upload Center</h1>
        <p className="text-muted-foreground">Upload and process trade files</p>
      </div>

      {isProcessing && (
        <Card className="border-blue-500 bg-blue-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              <p className="text-sm font-medium">Processing your upload...</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>Select upload type and file to process</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-primary hover:underline">Choose a file</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                  />
                </label>
                <span className="text-sm text-muted-foreground"> or drag and drop</span>
              </div>
              {file && <p className="mt-2 text-sm text-muted-foreground">Selected: {file.name}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="upload-type">Upload Type *</Label>
                <Select value={uploadType} onValueChange={setUploadType} disabled={isProcessing}>
                  <SelectTrigger id="upload-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {uploadTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settlement-date">Settlement Date *</Label>
                <Input
                  id="settlement-date"
                  type="date"
                  value={settlementDate}
                  onChange={(e) => setSettlementDate(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Add any additional notes..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <Button type="submit" disabled={isProcessing} className="w-full">
              {isProcessing ? "Processing..." : "Submit Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
