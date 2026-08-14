import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { partners } from "@/lib/inventory-data"

export default async function PartnerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partner = partners.find((p) => p.id === id)

  if (!partner) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{partner.name}</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Primary contact details for {partner.name}.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center">
              <span className="font-medium w-24">Person:</span> {partner.contactPerson}
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Email:</span> {partner.contactEmail}
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Phone:</span> {partner.contactPhone}
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Type:</span> {partner.type}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Physical address of {partner.name}.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>{partner.address.street}</div>
            <div>
              {partner.address.city}, {partner.address.state} {partner.address.zip}
            </div>
            <div>{partner.address.country}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
            <CardDescription>Payment terms and credit limit.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center">
              <span className="font-medium w-24">Payment Terms:</span> {partner.paymentTerms}
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Credit Limit:</span> ${partner.creditLimit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Last few orders placed by {partner.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partner.recentOrders && partner.recentOrders.length > 0 ? (
                  partner.recentOrders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>${order.total.toLocaleString()}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No recent orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
