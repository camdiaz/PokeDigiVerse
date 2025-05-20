import { Request, Response } from 'express';
import { GetCharacterUseCase } from '../../application/use-cases/GetCharacterUseCase';
import { VALID_VERSIONS, ErrorCodes, ERROR_MESSAGES, PokemonVersion, DigimonVersion } from '../../domain/constants/constants';
import { AppError } from '../../domain/errors/AppError';

export class CharacterController {
  constructor(private getCharacterUseCase: GetCharacterUseCase) {}

  private validateRequest(franchise: string, version: string, metadata: any, config: any): void {
    if (!['pokemon', 'digimon'].includes(franchise)) {
      throw new AppError(ErrorCodes.INVALID_FRANCHISE);
    }

    const validVersions = VALID_VERSIONS[franchise as keyof typeof VALID_VERSIONS];
    if (!validVersions.some(v => v === version)) {
      throw new AppError(ErrorCodes.INVALID_VERSION);
    }

    if (franchise === 'pokemon' && !metadata.name) {
      throw new AppError(ErrorCodes.INVALID_METADATA, 'For Pokémon, the "name" field is required in metadata');
    }
    if (franchise === 'digimon' && !metadata.id) {
      throw new AppError(ErrorCodes.INVALID_METADATA, 'For Digimon, the "id" field is required in metadata');
    }

    if (!config.baseUrl) {
      throw new AppError(ErrorCodes.INVALID_CONFIG, 'The "baseUrl" field is required in config');
    }
  }

  async getCharacter(req: Request, res: Response): Promise<void> {
    try {
      const { franchise, version } = req.params;
      console.log('Params:', { franchise, version });
      console.log('Query:', req.query);
      
      let metadata, config;

      try {
        metadata = JSON.parse(req.query.metadata as string);
        config = JSON.parse(req.query.config as string);
        console.log('Parsed metadata:', metadata);
        console.log('Parsed config:', config);

        this.validateRequest(franchise, version, metadata, config);

        if (franchise === 'pokemon') {
          config.baseUrl = 'https://pokeapi.co/api/v2';
        } else if (franchise === 'digimon') {
          config.baseUrl = 'https://digimon-api.com/api/v1';
        }

      } catch (parseError) {
        console.error('Parse error:', parseError);
        if (parseError instanceof AppError) {
          res.status(400).json({
            code: parseError.code,
            error: parseError.message || ERROR_MESSAGES[parseError.code]
          });
        } else {
          res.status(500).json({
            code: ErrorCodes.PARSING_ERROR,
            error: ERROR_MESSAGES[ErrorCodes.PARSING_ERROR]
          });
        }
        return;
      }

      const character = await this.getCharacterUseCase.execute(
        franchise,
        version,
        metadata,
        config
      );

      res.json(character);
    } catch (error: any) {
      console.error('Execution error:', error);
      if (error instanceof AppError) {
        res.status(400).json({
          code: error.code,
          error: error.message || ERROR_MESSAGES[error.code]
        });
      } else {
      res.status(500).json({
          code: ErrorCodes.API_ERROR,
          error: error.message || ERROR_MESSAGES[ErrorCodes.API_ERROR]
      });
      }
    }
  }
} 