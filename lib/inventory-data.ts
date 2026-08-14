import type {
  PartnerTier,
  BusinessPartner,
  Product,
  InventoryItem,
  PartnerAllocation,
  Shipment,
  Order,
  OrderItem,
  BackOrder,
  InventorySummary,
  PendingBackOrder,
} from "@/types/inventory"

export const partnerTiers: PartnerTier[] = [
  { tier_id: 1, tier_name: "Gold", price_discount_pct: 15.0, notes: "Priority allocation, best pricing" },
  { tier_id: 2, tier_name: "Silver", price_discount_pct: 7.5, notes: "Standard allocation" },
  { tier_id: 3, tier_name: "Bronze", price_discount_pct: 2.0, notes: "Limited product access" },
]

export const businessPartners: BusinessPartner[] = [
  {
    partner_id: 101,
    company_name: "MegaMart Inc.",
    contact_email: "purchasing@megamart.com",
    tier_id: 1,
    is_active: true,
  },
  {
    partner_id: 102,
    company_name: "Corner Shop LLC",
    contact_email: "manager@cornershop.net",
    tier_id: 2,
    is_active: true,
  },
  {
    partner_id: 103,
    company_name: "City Grocers",
    contact_email: "stock@citygrocers.co",
    tier_id: 2,
    is_active: false,
  },
]

export const products: Product[] = [
  {
    product_id: 5001,
    sku: "APW-500ML",
    product_name: "AquaPure Water 500ml",
    description: "24-pack of bottled water",
    unit_price: 12.0,
  },
  {
    product_id: 5002,
    sku: "ZS-330ML-CAN",
    product_name: "Zesty Soda 330ml Can",
    description: "12-pack of assorted soda",
    unit_price: 18.5,
  },
  {
    product_id: 5003,
    sku: "CC-LAYS-50G",
    product_name: "Crunchy Chips - Classic 50g",
    description: "Box of 50 chip bags",
    unit_price: 30.0,
  },
]

export const inventoryMaster: InventoryItem[] = [
  {
    product_id: 5001,
    quantity_on_hand: 5000,
    quantity_incoming: 0,
    quantity_allocated: 3500,
    sku: "APW-500ML",
    name: "AquaPure Water 500ml",
    category: "Beverages",
    stock: 5000,
    status: "In Stock",
  },
  {
    product_id: 5002,
    quantity_on_hand: 2000,
    quantity_incoming: 1000,
    quantity_allocated: 1500,
    sku: "ZS-330ML-CAN",
    name: "Zesty Soda 330ml Can",
    category: "Beverages",
    stock: 2000,
    status: "In Stock",
  },
  {
    product_id: 5003,
    quantity_on_hand: 0,
    quantity_incoming: 500,
    quantity_allocated: 0,
    sku: "CC-LAYS-50G",
    name: "Crunchy Chips - Classic 50g",
    category: "Snacks",
    stock: 0,
    status: "Out of Stock",
  },
]

export const partnerAllocations: PartnerAllocation[] = [
  { allocation_id: 1, partner_id: 101, product_id: 5001, allocated_quantity: 3000 },
  { allocation_id: 2, partner_id: 101, product_id: 5002, allocated_quantity: 1000 },
  { allocation_id: 3, partner_id: 102, product_id: 5001, allocated_quantity: 500 },
  { allocation_id: 4, partner_id: 102, product_id: 5002, allocated_quantity: 500 },
]

export const shipments: Shipment[] = [
  { shipment_id: 901, container_ref: "MSC-GZA-9872", eta_date: "2023-11-15", status: "IN_TRANSIT" },
  { shipment_id: 902, container_ref: "CMA-US-4451", eta_date: "2023-10-28", status: "RECEIVED" },
]

export const orders: Order[] = [
  { order_id: 7701, partner_id: 101, order_date: "2023-11-01", status: "FULFILLED", total_amount: 2040.0 },
  { order_id: 7702, partner_id: 102, order_date: "2023-11-02", status: "PENDING_SHIPMENT", total_amount: 1110.0 },
]

export const orderItems: OrderItem[] = [
  { order_item_id: 1, order_id: 7701, product_id: 5001, quantity: 200, price_at_order: 10.2 },
  { order_item_id: 2, order_id: 7702, product_id: 5001, quantity: 50, price_at_order: 11.1 },
  { order_item_id: 3, order_id: 7702, product_id: 5002, quantity: 30, price_at_order: 17.11 },
]

export const backOrdersData: BackOrder[] = [
  {
    back_order_id: 1,
    partner_id: 102,
    product_id: 5002,
    requested_quantity: 100,
    status: "PENDING_APPROVAL",
    request_date: "2023-11-03",
  },
  {
    back_order_id: 2,
    partner_id: 101,
    product_id: 5003,
    requested_quantity: 400,
    status: "PENDING_STOCK",
    request_date: "2023-11-04",
  },
]

// Helper functions
export const getProductById = (id: number) => products.find((p) => p.product_id === id)
export const getPartnerById = (id: number) => businessPartners.find((p) => p.partner_id === id)
export const getTierById = (id: number) => partnerTiers.find((t) => t.tier_id === id)
export const getPartnerAllocations = (partnerId: number) =>
  partnerAllocations.filter((pa) => pa.partner_id === partnerId)

// New data for partners (used by app/dashboard/partners/page.tsx and [id]/page.tsx)
export const partners = [
  {
    id: "partner-101",
    name: "MegaMart Inc.",
    contactPerson: "John Doe",
    contactEmail: "purchasing@megamart.com",
    contactPhone: "+1-555-1001",
    type: "Retailer",
    address: {
      street: "123 Retail Way",
      city: "Springfield",
      state: "IL",
      zip: "62704",
      country: "USA",
    },
    paymentTerms: "Net 30",
    creditLimit: 100000,
    recentOrders: [
      { orderId: "ORD001", date: "2024-06-20", total: 5000, status: "Completed" },
      { orderId: "ORD005", date: "2024-07-01", total: 7500, status: "Pending" },
    ],
  },
  {
    id: "partner-102",
    name: "Corner Shop LLC",
    contactPerson: "Jane Smith",
    contactEmail: "manager@cornershop.net",
    contactPhone: "+1-555-1002",
    type: "Small Business",
    address: {
      street: "45 Main St",
      city: "Shelbyville",
      state: "KY",
      zip: "40065",
      country: "USA",
    },
    paymentTerms: "Net 15",
    creditLimit: 25000,
    recentOrders: [{ orderId: "ORD002", date: "2024-06-25", total: 1200, status: "Shipped" }],
  },
  {
    id: "partner-103",
    name: "City Grocers",
    contactPerson: "Bob Johnson",
    contactEmail: "stock@citygrocers.co",
    contactPhone: "+1-555-1003",
    type: "Grocery Chain",
    address: {
      street: "789 Market Ave",
      city: "Capital City",
      state: "CA",
      zip: "95814",
      country: "USA",
    },
    paymentTerms: "Net 45",
    creditLimit: 150000,
    recentOrders: [
      { orderId: "ORD003", date: "2024-06-15", total: 3000, status: "Completed" },
      { orderId: "ORD006", date: "2024-07-05", total: 9000, status: "Processing" },
    ],
  },
]

const inventoryItems: InventoryItem[] = [
  {
    product_id: 5001,
    sku: "SKU001",
    name: "Laptop Pro X",
    category: "Electronics",
    stock: 150,
    status: "In Stock",
    quantity_on_hand: 150,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
  {
    product_id: 5002,
    sku: "SKU002",
    name: "Wireless Mouse",
    category: "Accessories",
    stock: 500,
    status: "In Stock",
    quantity_on_hand: 500,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
  {
    product_id: 5003,
    sku: "SKU003",
    name: "Mechanical Keyboard",
    category: "Accessories",
    stock: 30,
    status: "Low Stock",
    quantity_on_hand: 30,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
  {
    product_id: 5004,
    sku: "SKU004",
    name: "Monitor 27-inch",
    category: "Electronics",
    stock: 75,
    status: "In Stock",
    quantity_on_hand: 75,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
  {
    product_id: 5005,
    sku: "SKU005",
    name: "USB-C Hub",
    category: "Accessories",
    stock: 10,
    status: "Low Stock",
    quantity_on_hand: 10,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
  {
    product_id: 5006,
    sku: "SKU006",
    name: "Ergonomic Chair",
    category: "Furniture",
    stock: 5,
    status: "Out of Stock",
    quantity_on_hand: 5,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
  {
    product_id: 5007,
    sku: "SKU007",
    name: "External SSD 1TB",
    category: "Storage",
    stock: 200,
    status: "In Stock",
    quantity_on_hand: 200,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
  {
    product_id: 5008,
    sku: "SKU008",
    name: "Webcam HD",
    category: "Peripherals",
    stock: 40,
    status: "In Stock",
    quantity_on_hand: 40,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
  {
    product_id: 5009,
    sku: "SKU009",
    name: "Noise-Cancelling Headphones",
    category: "Audio",
    stock: 25,
    status: "Low Stock",
    quantity_on_hand: 25,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
  {
    product_id: 5010,
    sku: "SKU010",
    name: "Desk Lamp LED",
    category: "Lighting",
    stock: 80,
    status: "In Stock",
    quantity_on_hand: 80,
    quantity_incoming: 0,
    quantity_allocated: 0,
  },
]

const backOrders: PendingBackOrder[] = [
  {
    orderId: "BO001",
    itemName: "Ergonomic Chair",
    quantity: 10,
    orderDate: "2024-06-20",
    dueDate: "2024-07-10",
    isOverdue: false,
  },
  {
    orderId: "BO002",
    itemName: "Mechanical Keyboard",
    quantity: 5,
    orderDate: "2024-06-25",
    dueDate: "2024-07-01",
    isOverdue: true,
  },
  {
    orderId: "BO003",
    itemName: "USB-C Hub",
    quantity: 20,
    orderDate: "2024-06-18",
    dueDate: "2024-07-05",
    isOverdue: false,
  },
]

export function getInventorySummary(): InventorySummary {
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.stock, 0)
  const uniqueItems = inventoryItems.length
  const inStockItems = inventoryItems.filter((item) => item.stock > 0).length
  const lowStockItems = inventoryItems.filter((item) => item.status === "Low Stock").length
  const pendingBackOrdersCount = backOrders.length
  const overdueBackOrders = backOrders.filter((order) => order.isOverdue).length

  return {
    totalItems,
    uniqueItems,
    inStockItems,
    lowStockItems,
    pendingBackOrders: pendingBackOrdersCount,
    overdueBackOrders,
    items: inventoryItems,
  }
}

export function getPendingBackOrders(): PendingBackOrder[] {
  return backOrders
}
