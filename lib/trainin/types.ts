// ============================================
// Trainin API Response Types
// Gebaseerd op de officiële API documentatie:
// Base: https://api.trainin.app/integrations/tenant/<tenant-domain>
// Auth: Authorization: Bearer <api-token>
// ============================================

export interface TraininError {
  message: string
  status: number
}

// Verificatie
export interface VerifyResponse {
  success: boolean
  accountName?: string
  error?: string
}

// Pagination wrapper (standaard Laravel pagination)
export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Businesses
export interface Business {
  id: number
  name: string
  domain?: string
  [key: string]: unknown
}

export type BusinessesResponse = PaginatedResponse<Business> | Business[]

// Clients / Klanten
export interface Client {
  id: number
  ref?: string
  first_name?: string
  last_name?: string
  name?: string
  email?: string
  phone?: string
  created_at?: string
  children?: Client[]
  clientProducts?: ClientProduct[]
  accessKeys?: AccessKey[]
  [key: string]: unknown
}

export interface ClientProduct {
  id: number
  name?: string
  [key: string]: unknown
}

export interface AccessKey {
  id: number
  key?: string
  [key: string]: unknown
}

export type ClientsResponse = PaginatedResponse<Client> | Client | Client[]

// Orders / Bestellingen
export interface OrderLine {
  id: number
  description?: string
  quantity?: number
  unit_price?: number
  total?: number
  [key: string]: unknown
}

export interface Order {
  id: number
  ref?: string
  client_id?: number
  domain?: string
  order_date?: string
  invoice_date?: string
  total?: number
  status?: string
  lines?: OrderLine[]
  paymentInfo?: {
    paid?: boolean
    method?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type OrdersResponse = PaginatedResponse<Order> | Order | Order[]

// Sessions / Sessies
export interface SessionBooking {
  id: number
  client_id?: number
  status?: string
  [key: string]: unknown
}

export interface Session {
  id: number
  ref?: string
  name?: string
  domain?: string
  from?: string
  until?: string
  capacity?: number
  bookings?: SessionBooking[]
  clients?: Client[]
  accessKeys?: AccessKey[]
  [key: string]: unknown
}

export type SessionsResponse = PaginatedResponse<Session> | Session | Session[]
