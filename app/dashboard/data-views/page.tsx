"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { trades, scripList, drCrList, payinPayoutList, latestRates } from "@/lib/dummy-data"

const ITEMS_PER_PAGE = 20

export default function DataViewsPage() {
  const [tradesPage, setTradesPage] = useState(1)
  const [scripPage, setScripPage] = useState(1)
  const [drcrPage, setDrcrPage] = useState(1)
  const [payinPage, setPayinPage] = useState(1)
  const [ratesPage, setRatesPage] = useState(1)

  const [tradesFilter, setTradesFilter] = useState({ clientId: "", scrip: "", dateFrom: "", dateTo: "" })
  const [scripFilter, setScripFilter] = useState({ scrip: "" })

  const filteredTrades = trades.filter((t) => {
    if (tradesFilter.clientId && !t.clientId.includes(tradesFilter.clientId)) return false
    if (tradesFilter.scrip && !t.scrip.includes(tradesFilter.scrip)) return false
    return true
  })

  const paginatedTrades = filteredTrades.slice((tradesPage - 1) * ITEMS_PER_PAGE, tradesPage * ITEMS_PER_PAGE)
  const paginatedScrips = scripList.slice((scripPage - 1) * ITEMS_PER_PAGE, scripPage * ITEMS_PER_PAGE)
  const paginatedDrCr = drCrList.slice((drcrPage - 1) * ITEMS_PER_PAGE, drcrPage * ITEMS_PER_PAGE)
  const paginatedPayin = payinPayoutList.slice((payinPage - 1) * ITEMS_PER_PAGE, payinPage * ITEMS_PER_PAGE)
  const paginatedRates = latestRates.slice((ratesPage - 1) * ITEMS_PER_PAGE, ratesPage * ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Views</h1>
        <p className="text-muted-foreground">Browse and filter all uploaded data</p>
      </div>

      <Tabs defaultValue="trades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="scrip">Scrip List</TabsTrigger>
          <TabsTrigger value="drcr">DR-CR</TabsTrigger>
          <TabsTrigger value="payin">Payin/Payout</TabsTrigger>
          <TabsTrigger value="rates">Latest Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filter Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Client ID</Label>
                  <Input
                    placeholder="Search client..."
                    value={tradesFilter.clientId}
                    onChange={(e) => setTradesFilter({ ...tradesFilter, clientId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scrip</Label>
                  <Input
                    placeholder="Search scrip..."
                    value={tradesFilter.scrip}
                    onChange={(e) => setTradesFilter({ ...tradesFilter, scrip: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date From</Label>
                  <Input
                    type="date"
                    value={tradesFilter.dateFrom}
                    onChange={(e) => setTradesFilter({ ...tradesFilter, dateFrom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date To</Label>
                  <Input
                    type="date"
                    value={tradesFilter.dateTo}
                    onChange={(e) => setTradesFilter({ ...tradesFilter, dateTo: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trades ({filteredTrades.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trade ID</TableHead>
                      <TableHead>Client ID</TableHead>
                      <TableHead>Scrip</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Trade Date</TableHead>
                      <TableHead>Settlement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTrades.map((trade) => (
                      <TableRow key={trade.tradeId}>
                        <TableCell className="font-mono text-xs">{trade.tradeId}</TableCell>
                        <TableCell>{trade.clientId}</TableCell>
                        <TableCell className="font-medium">{trade.scrip}</TableCell>
                        <TableCell>{trade.quantity}</TableCell>
                        <TableCell>₹{trade.price.toFixed(2)}</TableCell>
                        <TableCell>{trade.tradeDate}</TableCell>
                        <TableCell>{trade.settlementDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {tradesPage} of {Math.ceil(filteredTrades.length / ITEMS_PER_PAGE)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={tradesPage === 1}
                    onClick={() => setTradesPage(tradesPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={tradesPage >= Math.ceil(filteredTrades.length / ITEMS_PER_PAGE)}
                    onClick={() => setTradesPage(tradesPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scrip">
          <Card>
            <CardHeader>
              <CardTitle>Scrip List ({scripList.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scrip Code</TableHead>
                      <TableHead>Scrip Name</TableHead>
                      <TableHead>ISIN</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedScrips.map((scrip) => (
                      <TableRow key={scrip.scripCode}>
                        <TableCell className="font-medium">{scrip.scripCode}</TableCell>
                        <TableCell>{scrip.scripName}</TableCell>
                        <TableCell className="font-mono text-xs">{scrip.isin}</TableCell>
                        <TableCell>{scrip.segment}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            {scrip.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {scripPage} of {Math.ceil(scripList.length / ITEMS_PER_PAGE)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={scripPage === 1}
                    onClick={() => setScripPage(scripPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={scripPage >= Math.ceil(scripList.length / ITEMS_PER_PAGE)}
                    onClick={() => setScripPage(scripPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drcr">
          <Card>
            <CardHeader>
              <CardTitle>DR-CR Records ({drCrList.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Record ID</TableHead>
                      <TableHead>Client ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Narration</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDrCr.map((record) => (
                      <TableRow key={record.recordId}>
                        <TableCell className="font-mono text-xs">{record.recordId}</TableCell>
                        <TableCell>{record.clientId}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              record.type === "Debit" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                            }`}
                          >
                            {record.type}
                          </span>
                        </TableCell>
                        <TableCell>₹{record.amount.toFixed(2)}</TableCell>
                        <TableCell>{record.narration}</TableCell>
                        <TableCell>{record.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {drcrPage} of {Math.ceil(drCrList.length / ITEMS_PER_PAGE)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={drcrPage === 1}
                    onClick={() => setDrcrPage(drcrPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={drcrPage >= Math.ceil(drCrList.length / ITEMS_PER_PAGE)}
                    onClick={() => setDrcrPage(drcrPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payin">
          <Card>
            <CardHeader>
              <CardTitle>Payin/Payout Records ({payinPayoutList.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Client ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPayin.map((record) => (
                      <TableRow key={record.transactionId}>
                        <TableCell className="font-mono text-xs">{record.transactionId}</TableCell>
                        <TableCell>{record.clientId}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              record.type === "Payin"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            {record.type}
                          </span>
                        </TableCell>
                        <TableCell>₹{record.amount.toFixed(2)}</TableCell>
                        <TableCell>{record.mode}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            {record.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {payinPage} of {Math.ceil(payinPayoutList.length / ITEMS_PER_PAGE)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={payinPage === 1}
                    onClick={() => setPayinPage(payinPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={payinPage >= Math.ceil(payinPayoutList.length / ITEMS_PER_PAGE)}
                    onClick={() => setPayinPage(payinPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Latest Rates ({latestRates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scrip</TableHead>
                      <TableHead>Open</TableHead>
                      <TableHead>High</TableHead>
                      <TableHead>Low</TableHead>
                      <TableHead>Close</TableHead>
                      <TableHead>LTP</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRates.map((rate) => (
                      <TableRow key={`${rate.scrip}-${rate.date}`}>
                        <TableCell className="font-medium">{rate.scrip}</TableCell>
                        <TableCell>₹{rate.open.toFixed(2)}</TableCell>
                        <TableCell>₹{rate.high.toFixed(2)}</TableCell>
                        <TableCell>₹{rate.low.toFixed(2)}</TableCell>
                        <TableCell>₹{rate.close.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">₹{rate.ltp.toFixed(2)}</TableCell>
                        <TableCell>{rate.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {ratesPage} of {Math.ceil(latestRates.length / ITEMS_PER_PAGE)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={ratesPage === 1}
                    onClick={() => setRatesPage(ratesPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={ratesPage >= Math.ceil(latestRates.length / ITEMS_PER_PAGE)}
                    onClick={() => setRatesPage(ratesPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
