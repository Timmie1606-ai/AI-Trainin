import type {
  BusinessesResponse,
  ClientsResponse,
  OrdersResponse,
  SessionsResponse,
  VerifyResponse,
} from './types'

// Base URL bevat de tenant-domain in het pad
// Bijv: https://api.trainin.app/integrations/tenant/mijn-gym
const API_HOST = 'https://api.trainin.app/integrations/tenant'

export class TraininAPIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'TraininAPIError'
  }
}

export class TraininClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(apiKey: string, tenantDomain: string) {
    this.baseUrl = `${API_HOST}/${tenantDomain}`
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value))
        }
      })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(url.toString(), {
        headers: this.headers,
        signal: controller.signal,
      })

      if (!response.ok) {
        let message = `Trainin API fout: ${response.status} ${response.statusText}`
        try {
          const errorBody = await response.json()
          message = errorBody.message ?? errorBody.error ?? message
        } catch {
          // Gebruik standaard bericht
        }
        throw new TraininAPIError(response.status, message)
      }

      return response.json() as Promise<T>
    } catch (err) {
      if (err instanceof TraininAPIError) throw err
      if (err instanceof Error && err.name === 'AbortError') {
        throw new TraininAPIError(408, 'Verzoek duurt te lang (timeout). Probeer een kortere periode of minder data op te vragen.')
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }

  async verify(): Promise<VerifyResponse> {
    try {
      const data = await this.request<BusinessesResponse>('/businesses', { perPage: 1 })
      const businesses = Array.isArray(data) ? data : (data as { data?: unknown[] }).data ?? []
      const firstName = (businesses[0] as { name?: string } | undefined)?.name
      return {
        success: true,
        accountName: firstName,
      }
    } catch (error) {
      if (error instanceof TraininAPIError) {
        return {
          success: false,
          error: error.status === 401 || error.status === 403
            ? 'Ongeldige API Key of Tenant Domain'
            : error.message,
        }
      }
      return {
        success: false,
        error: 'Kon geen verbinding maken met Trainin API',
      }
    }
  }

  async getBusinesses(params?: { page?: number; perPage?: number }): Promise<BusinessesResponse> {
    return this.request<BusinessesResponse>('/businesses', params)
  }

  async getClients(params?: {
    domain?: string
    include?: string
    page?: number
    perPage?: number
  }): Promise<ClientsResponse> {
    return this.request<ClientsResponse>('/clients', params)
  }

  async getClient(ref: string, params?: { include?: string }): Promise<ClientsResponse> {
    return this.request<ClientsResponse>(`/clients/${ref}`, params)
  }

  async getOrders(params?: {
    domain?: string
    orderDateFrom?: string
    orderDateUntil?: string
    invoiceDateFrom?: string
    invoiceDateUntil?: string
    include?: string
    page?: number
    perPage?: number
  }): Promise<OrdersResponse> {
    return this.request<OrdersResponse>('/orders', params)
  }

  async getOrder(ref: string, params?: { include?: string }): Promise<OrdersResponse> {
    return this.request<OrdersResponse>(`/orders/${ref}`, params)
  }

  async getSessions(params?: {
    domain?: string
    from?: string
    until?: string
    include?: string
    page?: number
    perPage?: number
  }): Promise<SessionsResponse> {
    return this.request<SessionsResponse>('/sessions', params)
  }

  async getSession(ref: string, params?: { include?: string }): Promise<SessionsResponse> {
    return this.request<SessionsResponse>(`/sessions/${ref}`, params)
  }
}
