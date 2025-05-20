export type PokemonVersion = 'v1' | 'v2';
export type DigimonVersion = 'v1' | 'classic' | 'digitalworld';

export const VALID_VERSIONS = {
  pokemon: ['v1', 'v2'] as PokemonVersion[],
  digimon: ['v1', 'classic', 'digitalworld'] as DigimonVersion[]
} as const;

export enum ErrorCodes {
  INVALID_FRANCHISE = 'INVALID_FRANCHISE',
  INVALID_VERSION = 'INVALID_VERSION',
  INVALID_METADATA = 'INVALID_METADATA',
  INVALID_CONFIG = 'INVALID_CONFIG',
  API_ERROR = 'API_ERROR',
  PARSING_ERROR = 'PARSING_ERROR'
}

export const ERROR_MESSAGES = {
  [ErrorCodes.INVALID_FRANCHISE]: 'The franchise must be "pokemon" or "digimon"',
  [ErrorCodes.INVALID_VERSION]: 'Invalid version for this franchise',
  [ErrorCodes.INVALID_METADATA]: 'Invalid metadata for this franchise',
  [ErrorCodes.INVALID_CONFIG]: 'Invalid configuration',
  [ErrorCodes.API_ERROR]: 'Error querying the external API',
  [ErrorCodes.PARSING_ERROR]: 'Error parsing query parameters'
} as const; 