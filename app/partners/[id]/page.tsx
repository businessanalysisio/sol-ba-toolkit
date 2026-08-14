import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getPartnerById, getTierById, getPartnerAllocations, getProductById } from "@/lib/inventory-data"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function PartnerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partner = getPartnerById(Number(id))
  if (!partner) {
    notFound()
  }

  const tier = getTierById(partner.tier_id)
  const allocations = getPartnerAllocations(partner.partner_id)

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href="/dashboard/partners">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Partners List
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{partner.company_name}</CardTitle>
          <CardDescription>{partner.contact_email}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-medium text-muted-foreground">Tier</p>
            <Badge
              variant={tier?.tier_name === "Gold" ? "default" : tier?.tier_name === "Silver" ? "secondary" : "outline"}
              className={tier?.tier_name === "Gold" ? "bg-yellow-400 text-black hover:bg-yellow-500" : ""}
            >
              {tier?.tier_name}
            </Badge>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Status</p>
            <Badge variant={partner.is_active ? "default" : "destructive"}>
              {partner.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Discount</p>
            <p className="font-semibold">{tier?.price_discount_pct}%</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Allocations</CardTitle>
          <CardDescription>Virtual stock reserved for this partner.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden sm:table-cell">SKU</TableHead>
                <TableHead className="text-right">Allocated Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations.length > 0 ? (
                allocations.map((alloc) => {
                  const product = getProductById(alloc.product_id)
                  return (
                    <TableRow key={alloc.allocation_id}>
                      <TableCell className="font-medium">{product?.product_name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{product?.sku}</TableCell>
                      <TableCell className="text-right">{alloc.allocated_quantity.toLocaleString()}</TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No allocations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
