import { Character } from '../entities/Character';

export interface CharacterRepository {
  getCharacter(franchise: string, version: string, metadata: Record<string, any>, config: Record<string, any>): Promise<Character>;
} 