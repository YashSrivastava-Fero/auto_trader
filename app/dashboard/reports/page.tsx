"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText } from "lucide-react"
import { clientMIS, companyMIS } from "@/lib/dummy-data"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const { toast } = useToast()

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(",")).join("\n")
    const csv = `${headers}\n${rows}`

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: `${filename}.csv downloaded successfully`,
    })
  }

  const exportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality coming soon",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & MIS</h1>
        <p className="text-muted-foreground">Client and company-level management reports</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Client-Level MIS</h2>
            <div className="flex gap-2">
              <Button onClick={() => exportToCSV(clientMIS, "client-mis")}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={exportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client ID</TableHead>
                      <TableHead>Turnover</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Brokerage</TableHead>
                      <TableHead>Net Position</TableHead>
                      <TableHead>Last Trade Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientMIS.map((client) => (
                      <TableRow key={client.clientId}>
                        <TableCell className="font-medium">{client.clientId}</TableCell>
                        <TableCell>₹{client.turnover.toLocaleString()}</TableCell>
                        <TableCell className={client.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                          ₹{client.pnl.toLocaleString()}
                        </TableCell>
                        <TableCell>₹{client.brokerage.toLocaleString()}</TableCell>
                        <TableCell className={client.netPosition >= 0 ? "text-green-500" : "text-red-500"}>
                          ₹{client.netPosition.toLocaleString()}
                        </TableCell>
                        <TableCell>{client.lastTradeDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Company-Level MIS</h2>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Turnover</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{companyMIS.totalTurnover.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Brokerage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{companyMIS.totalBrokerage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Revenue generated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyMIS.activeClients}</div>
                <p className="text-xs text-muted-foreground mt-1">Traded this month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 Clients by Turnover</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Client ID</TableHead>
                      <TableHead>Turnover</TableHead>
                      <TableHead>Brokerage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyMIS.topClients.map((client, index) => (
                      <TableRow key={client.clientId}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell>{client.clientId}</TableCell>
                        <TableCell>₹{client.turnover.toLocaleString()}</TableCell>
                        <TableCell>₹{client.brokerage.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Settlement Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Settlement Date</TableHead>
                      <TableHead>Total Trades</TableHead>
                      <TableHead>Buy Amount</TableHead>
                      <TableHead>Sell Amount</TableHead>
                      <TableHead>Net Settlement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyMIS.settlementSummary.map((settlement) => (
                      <TableRow key={settlement.date}>
                        <TableCell className="font-medium">{settlement.date}</TableCell>
                        <TableCell>{settlement.totalTrades}</TableCell>
                        <TableCell>₹{settlement.buyAmount.toLocaleString()}</TableCell>
                        <TableCell>₹{settlement.sellAmount.toLocaleString()}</TableCell>
                        <TableCell className={settlement.netSettlement >= 0 ? "text-green-500" : "text-red-500"}>
                          ₹{settlement.netSettlement.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
