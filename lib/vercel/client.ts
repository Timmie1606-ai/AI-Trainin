/**
 * Vercel API Client
 * Gebruikt voor het ophalen van projectstatus en deployment informatie.
 */
export class VercelClient {
  private token: string;
  private projectId: string;
  private baseUrl = 'https://api.vercel.com';

  constructor() {
    this.token = process.env.VERCEL_TOKEN || '';
    this.projectId = process.env.VERCEL_PROJECT_ID || '';

    if (!this.token || !this.projectId) {
      console.warn('VercelClient: VERCEL_TOKEN of VERCEL_PROJECT_ID ontbreekt in .env');
    }
  }

  private async fetchVercel(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Vercel API Error: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Haalt basisinformatie over het project op.
   */
  async getProject() {
    return this.fetchVercel(`/v9/projects/${this.projectId}`);
  }

  /**
   * Haalt een lijst van de laatste deployments op.
   */
  async getDeployments(limit = 5) {
    return this.fetchVercel(`/v6/deployments?projectId=${this.projectId}&limit=${limit}`);
  }

  /**
   * Haalt details op van een specifieke deployment.
   */
  async getDeployment(id: string) {
    return this.fetchVercel(`/v13/deployments/${id}`);
  }
}
