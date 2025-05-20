import axios from 'axios';
import { Character } from '../../domain/entities/Character';
import { CharacterRepository } from '../../domain/ports/CharacterRepository';

export class DigimonApiAdapter implements CharacterRepository {
  async getCharacter(
    franchise: string,
    version: string,
    metadata: Record<string, any>,
    config: Record<string, any>
  ): Promise<Character> {
    try {
      if (franchise !== 'digimon') {
        throw new Error('Invalid franchise for DigimonApiAdapter');
      }

      if (!['v1', 'classic', 'digitalworld'].includes(version)) {
        throw new Error('Invalid version for Digimon API');
      }

      const response = await axios.get(`${config.baseUrl}/digimon/${metadata.id}`);
      const data = response.data;

      if (!data || !data.name) {
        throw new Error('No information found for the Digimon');
      }
      
      const powers = data.skills 
        ? data.skills.map((skill: any) => skill.skill)
        : data.attacks 
          ? data.attacks.map((attack: any) => attack.name)
          : [];

      const evolutions = data.nextEvolutions 
        ? data.nextEvolutions.map((evolution: any) => evolution.digimon || evolution.name)
        : [];

      return {
        name: data.name,
        weight: data.weight,
        powers: powers,
        evolutions: evolutions
      };
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Error fetching Digimon data: ${error.response.status} - ${error.response.statusText}`);
      }
      throw new Error(`Error fetching Digimon data: ${error.message}`);
    }
  }
} 