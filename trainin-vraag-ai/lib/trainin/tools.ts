// ============================================
// Trainin API Tool Definities voor OpenRouter
// Gebaseerd op de officiële Trainin API endpoints:
// /businesses, /clients, /orders, /sessions
// ============================================

export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, unknown>
      required?: string[]
    }
  }
}

export const TRAININ_TOOLS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'get_clients',
      description:
        'Haalt een lijst van klanten/leden op uit Trainin. ' +
        'Gebruik dit voor vragen over klanten, leden, cliënten, deelnemers of contacten. ' +
        'Kan ook hun gekochte producten en toegangssleutels ophalen. ' +
        'Dutch keywords: klanten, leden, cliënten, deelnemers, wie zijn mijn klanten.',
      parameters: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'Filter op specifieke business domain (optioneel)',
          },
          include: {
            type: 'string',
            description: 'Komma-gescheiden relaties om mee te laden: "children", "clientProducts", "accessKeys"',
          },
          page: {
            type: 'number',
            description: 'Paginanummer. Standaard 1.',
          },
          perPage: {
            type: 'number',
            description: 'Aantal resultaten per pagina. Max 1000. Standaard 1000.',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_orders',
      description:
        'Haalt bestellingen/facturen op uit Trainin. ' +
        'Gebruik dit voor vragen over omzet, inkomsten, betalingen, facturen of bestellingen. ' +
        'Kan gefilterd worden op order- of factuurdatum. ' +
        'Dutch keywords: omzet, inkomsten, bestellingen, facturen, betalingen, verdiensten, opbrengst.',
      parameters: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'Filter op specifieke business domain (optioneel)',
          },
          orderDateFrom: {
            type: 'string',
            description: 'Filter orders vanaf deze datum (YYYY-MM-DD). Bijv. eerste dag van de maand.',
          },
          orderDateUntil: {
            type: 'string',
            description: 'Filter orders tot en met deze datum (YYYY-MM-DD). Bijv. laatste dag van de maand.',
          },
          invoiceDateFrom: {
            type: 'string',
            description: 'Filter op factuurdatum vanaf (YYYY-MM-DD)',
          },
          invoiceDateUntil: {
            type: 'string',
            description: 'Filter op factuurdatum tot (YYYY-MM-DD)',
          },
          include: {
            type: 'string',
            description: 'Komma-gescheiden relaties: "lines" (orderregels), "paymentInfo"',
          },
          page: {
            type: 'number',
            description: 'Paginanummer. Standaard 1.',
          },
          perPage: {
            type: 'number',
            description: 'Aantal resultaten per pagina. Max 1000.',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_sessions',
      description:
        'Haalt sessies/lessen/afspraken op uit Trainin. ' +
        'Gebruik dit voor vragen over het rooster, agenda, geplande lessen, boekingen bij sessies of bezetting. ' +
        'Kan gefilterd worden op datum en kan boekingen en klantinfo bevatten. ' +
        'Dutch keywords: sessies, lessen, agenda, rooster, afspraken, boekingen, planning, bezetting.',
      parameters: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'Filter op specifieke business domain (optioneel)',
          },
          from: {
            type: 'string',
            description: 'Filter sessies vanaf deze datum (YYYY-MM-DD)',
          },
          until: {
            type: 'string',
            description: 'Filter sessies tot en met deze datum (YYYY-MM-DD)',
          },
          include: {
            type: 'string',
            description: 'Komma-gescheiden relaties: "bookings" (boekingen per sessie), "clients" (klantinfo), "accessKeys"',
          },
          page: {
            type: 'number',
            description: 'Paginanummer. Standaard 1.',
          },
          perPage: {
            type: 'number',
            description: 'Aantal resultaten per pagina. Max 1000.',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_businesses',
      description:
        'Haalt de bedrijven/locaties op die gekoppeld zijn aan dit Trainin account. ' +
        'Gebruik dit voor vragen over welke businesses/locaties er zijn of accountoverzicht. ' +
        'Dutch keywords: bedrijven, locaties, vestigingen, account.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'number',
            description: 'Paginanummer. Standaard 1.',
          },
          perPage: {
            type: 'number',
            description: 'Aantal resultaten per pagina.',
          },
        },
        required: [],
      },
    },
  },
]

export type ToolName =
  | 'get_clients'
  | 'get_orders'
  | 'get_sessions'
  | 'get_businesses'
