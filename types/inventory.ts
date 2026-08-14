export type PartnerTier = {
  tier_id: number
  tier_name: string
  price_discount_pct: number
  notes: string
}

export type BusinessPartner = {
  partner_id: number
  company_name: string
  contact_email: string
  tier_id: number
  is_active: boolean
}

export type Product = {
  product_id: number
  sku: string
  product_name: string
  description: string
  unit_price: number
}

export interface InventoryItem {
  product_id: number
  sku: string
  name: string
  category: string
  quantity_on_hand: number
  quantity_incoming: number
  quantity_allocated: number
  stock: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

export type PartnerAllocation = {
  allocation_id: number
  partner_id: number
  product_id: number
  allocated_quantity: number
}

export type Shipment = {
  shipment_id: number
  container_ref: string
  eta_date: string
  status: "IN_TRANSIT" | "RECEIVED" | "DELAYED"
}

export type Order = {
  order_id: number
  partner_id: number
  order_date: string
  status: "FULFILLED" | "PENDING_SHIPMENT" | "CANCELLED"
  total_amount: number
}

export type OrderItem = {
  order_item_id: number
  order_id: number
  product_id: number
  quantity: number
  price_at_order: number
}

export type BackOrder = {
  back_order_id: number
  partner_id: number
  product_id: number
  requested_quantity: number
  status: "PENDING_APPROVAL" | "PENDING_STOCK" | "FULFILLED"
  request_date: string
}

export interface InventorySummary {
  totalItems: number
  uniqueItems: number
  inStockItems: number
  lowStockItems: number
  pendingBackOrders: number
  overdueBackOrders: number
  items: InventoryItem[]
}

export interface PendingBackOrder {
  orderId: string
  itemName: string
  quantity: number
  orderDate: string
  dueDate: string
  isOverdue: boolean
}

// New types for the 'partners' data in lib/inventory-data.ts
export type Partner = {
  id: string
  name: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  type: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  paymentTerms: string
  creditLimit: number
  recentOrders: {
    orderId: string
    date: string
    total: number
    status: string
  }[]
}
