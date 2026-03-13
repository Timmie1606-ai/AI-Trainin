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

    // Sensible defaults voor paginering als ze niet zijn meegegeven
    const finalParams = { ...params }
    if (!finalParams.perPage && !endpoint.includes('/')) { // Alleen voor lijst-endpoints
      finalParams.perPage = 100
    }

    if (finalParams) {
      Object.entries(finalParams).forEach(([key, value]) => {
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
        let message = `Trainin API fout: ${response.status} ${response.statusText} op ${endpoint}`
        try {
          const bodyText = await response.text()
          if (bodyText) {
            try {
              const errorBody = JSON.parse(bodyText)
              message = errorBody.message ?? errorBody.error ?? message
            } catch {
              message = `${message} (Body: ${bodyText.slice(0, 100)})`
            }
          } else {
            message = `${message} (geen response body)`
          }
        } catch {
          // Gebruik standaard bericht
        }
        throw new TraininAPIError(response.status, message)
      }

      return response.json() as Promise<T>
    } catch (err) {
      if (err instanceof TraininAPIError) throw err
      if (err instanceof Error && err.name === 'AbortError') {
        throw new TraininAPIError(408, `Verzoek naar ${endpoint} duurt te lang (timeout). Probeer een kortere periode of minder data op te vragen.`)
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
    return this.request<ClientsResponse>('/clients', { perPage: 100, ...params })
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
    return this.request<OrdersResponse>('/orders', { perPage: 100, ...params })
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
    return this.request<SessionsResponse>('/sessions', { perPage: 100, ...params })
  }

  async getSession(ref: string, params?: { include?: string }): Promise<SessionsResponse> {
    return this.request<SessionsResponse>(`/sessions/${ref}`, params)
  }
}
