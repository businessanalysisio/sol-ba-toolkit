import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { partners } from "@/lib/inventory-data"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function PartnersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Business Partners</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Partners</CardTitle>
          <CardDescription>A list of all your business partners.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.type}</TableCell>
                    <TableCell>{partner.contactPerson}</TableCell>
                    <TableCell>{partner.contactEmail}</TableCell>
                    <TableCell>{partner.contactPhone}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/partners/${partner.id}`} passHref>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
