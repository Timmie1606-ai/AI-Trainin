import { ToolDefinition } from '@/lib/trainin/tools';

export const VERCEL_TOOLS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'get_vercel_status',
      description: 'Haalt de huidige status van het Vercel project op, inclusief de laatste deployments en of de site live is. Gebruik dit voor vragen over hosting, status van de website op Vercel, of wanneer een update live staat.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_vercel_deployments',
      description: 'Haalt een lijst van de meest recente Vercel deployments op. Handig om te controleren of een build is geslaagd of mislukt.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Aantal deployments om op te halen (standaard 5).'
          }
        },
        required: []
      }
    }
  }
];

export type VercelToolName = 'get_vercel_status' | 'get_vercel_deployments';
