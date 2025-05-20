import { Character } from '../../domain/entities/Character';
import { CharacterRepository } from '../../domain/ports/CharacterRepository';
import { RequestLogRepository } from '../../domain/ports/RequestLogRepository';

export class GetCharacterUseCase {
  constructor(
    private characterRepository: CharacterRepository,
    private requestLogRepository: RequestLogRepository
  ) {}

  setCharacterRepository(repository: CharacterRepository): void {
    this.characterRepository = repository;
  }

  async execute(
    franchise: string,
    version: string,
    metadata: Record<string, any>,
    config: Record<string, any>
  ): Promise<Character> {
    try {
      const character = await this.characterRepository.getCharacter(
        franchise,
        version,
        metadata,
        config
      );

      await this.requestLogRepository.save({
        franchise,
        version,
        metadata,
        timestamp: new Date(),
        status: 'success'
      });

      return character;
    } catch (error: any) {
      await this.requestLogRepository.save({
        franchise,
        version,
        metadata,
        timestamp: new Date(),
        status: 'fail',
        errorMessage: error.message
      });

      throw error;
    }
  }
} 