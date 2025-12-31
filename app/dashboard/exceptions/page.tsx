"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { exceptions } from "@/lib/dummy-data"
import { useToast } from "@/hooks/use-toast"

export default function ExceptionsPage() {
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const getSeverityBadge = (severity: string) => {
    const colors = {
      High: "bg-red-500/10 text-red-500",
      Medium: "bg-yellow-500/10 text-yellow-500",
      Low: "bg-blue-500/10 text-blue-500",
    }
    return <Badge className={colors[severity as keyof typeof colors] || colors.Low}>{severity}</Badge>
  }

  const handleResolve = (id: string) => {
    setResolvedIds((prev) => new Set(prev).add(id))
    toast({
      title: "Exception Resolved",
      description: "Exception has been marked as resolved",
    })
  }

  const activeExceptions = exceptions.filter((e) => !resolvedIds.has(e.id))
  const resolvedExceptions = exceptions.filter((e) => resolvedIds.has(e.id))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exceptions & Reconciliation</h1>
        <p className="text-muted-foreground">Monitor and resolve data exceptions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exceptions.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{activeExceptions.length}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{resolvedIds.size}</div>
            <p className="text-xs text-muted-foreground">This session</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Exceptions ({activeExceptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {activeExceptions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <CheckCircle className="mx-auto h-12 w-12 mb-2" />
              <p>No active exceptions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Upload ID</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeExceptions.map((exception) => (
                    <TableRow key={exception.id}>
                      <TableCell className="font-mono text-xs">{exception.id}</TableCell>
                      <TableCell>{exception.type}</TableCell>
                      <TableCell>{exception.description}</TableCell>
                      <TableCell>{getSeverityBadge(exception.severity)}</TableCell>
                      <TableCell className="font-mono text-xs">{exception.linkedUploadId}</TableCell>
                      <TableCell>{new Date(exception.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleResolve(exception.id)}>
                          Mark Resolved
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {resolvedIds.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resolved Exceptions ({resolvedIds.size})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Upload ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolvedExceptions.map((exception) => (
                    <TableRow key={exception.id}>
                      <TableCell className="font-mono text-xs">{exception.id}</TableCell>
                      <TableCell>{exception.type}</TableCell>
                      <TableCell>{exception.description}</TableCell>
                      <TableCell>{getSeverityBadge(exception.severity)}</TableCell>
                      <TableCell className="font-mono text-xs">{exception.linkedUploadId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
