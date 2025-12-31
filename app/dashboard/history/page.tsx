"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, RotateCw, Download } from "lucide-react"
import { uploads } from "@/lib/dummy-data"
import { useToast } from "@/hooks/use-toast"
import { retryUpload } from "@/lib/upload-processor"

export default function HistoryPage() {
  const [selectedUpload, setSelectedUpload] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      Done: "default",
      Failed: "destructive",
      Processing: "secondary",
      Queued: "outline",
    }
    return (
      <Badge variant={variants[status] || "default"} className="capitalize">
        {status}
      </Badge>
    )
  }

  const handleViewDetails = (upload: any) => {
    setSelectedUpload(upload)
    setDialogOpen(true)
  }

  const handleRetry = async (upload: any) => {
    toast({
      title: "Retry Started",
      description: `Retrying ${upload.fileName}...`,
    })

    await retryUpload(upload.uploadId, (status) => {
      if (status === "Done") {
        toast({
          title: "Retry Successful",
          description: `${upload.fileName} processed successfully`,
        })
      } else if (status === "Failed") {
        toast({
          title: "Retry Failed",
          description: `Failed to process ${upload.fileName}`,
          variant: "destructive",
        })
      }
    })
  }

  const handleDownloadErrorLog = (upload: any) => {
    const errorLog = `Error Log for ${upload.fileName}\n\nUpload ID: ${upload.uploadId}\nTimestamp: ${upload.uploadedAt}\n\nError: Failed to parse file format\nDetails: Invalid column structure at row 45`
    const blob = new Blob([errorLog], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `error-log-${upload.uploadId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload History</h1>
        <p className="text-muted-foreground">View and manage all upload records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Uploads ({uploads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Upload ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Settlement Date</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploads.map((upload) => (
                  <TableRow key={upload.uploadId}>
                    <TableCell className="font-mono text-xs">{upload.uploadId}</TableCell>
                    <TableCell>{upload.type}</TableCell>
                    <TableCell>{upload.fileName}</TableCell>
                    <TableCell>{upload.settlementDate}</TableCell>
                    <TableCell>{upload.uploadedBy}</TableCell>
                    <TableCell>{new Date(upload.uploadedAt).toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(upload.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(upload)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {upload.status === "Failed" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleRetry(upload)}>
                              <RotateCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadErrorLog(upload)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Details</DialogTitle>
            <DialogDescription>Detailed information about this upload</DialogDescription>
          </DialogHeader>
          {selectedUpload && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Upload ID</p>
                  <p className="text-sm text-muted-foreground font-mono">{selectedUpload.uploadId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedUpload.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground">{selectedUpload.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">File Name</p>
                  <p className="text-sm text-muted-foreground">{selectedUpload.fileName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Settlement Date</p>
                  <p className="text-sm text-muted-foreground">{selectedUpload.settlementDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Uploaded By</p>
                  <p className="text-sm text-muted-foreground">{selectedUpload.uploadedBy}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Uploaded At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedUpload.uploadedAt).toLocaleString()}
                  </p>
                </div>
                {selectedUpload.remarks && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Remarks</p>
                    <p className="text-sm text-muted-foreground">{selectedUpload.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
