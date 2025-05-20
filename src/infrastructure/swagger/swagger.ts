import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'PokeDigiVerse API',
    version: '1.0.0',
    description: 'A REST API that allows clients to fetch information from either the Pokémon or Digimon franchise.',
    contact: {
      name: 'API Support',
      email: 'support@pokedigiverse.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  paths: {
    '/api/{franchise}/{version}': {
      get: {
        summary: 'Get character information',
        description: 'Retrieves information about a character from either Pokémon or Digimon franchise',
        parameters: [
          {
            name: 'franchise',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              enum: ['pokemon', 'digimon']
            },
            description: 'The franchise to query (pokemon or digimon)'
          },
          {
            name: 'version',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'The version of the API to use (e.g., v1, classic, digitalworld)'
          },
          {
            name: 'metadata',
            in: 'query',
            required: true,
            schema: {
                  type: 'string',
              description: 'JSON string containing metadata object specific to the franchise'
            },
            example: '{"name": "pikachu"}'
          },
          {
            name: 'config',
            in: 'query',
            required: true,
            schema: {
                  type: 'string',
              description: 'JSON string containing configuration object for the external API'
            },
            example: '{"baseUrl": "https://pokeapi.co/api/v2"}'
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Character name'
                    },
                    weight: {
                      type: 'number',
                      description: 'Character weight'
                    },
                    powers: {
                      type: 'array',
                      items: {
                        type: 'string'
                      },
                      description: 'List of character powers/abilities'
                    },
                    evolutions: {
                      type: 'array',
                      items: {
                        type: 'string'
                      },
                      description: 'List of possible evolutions'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Invalid parameters'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    }
  }
};

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} 