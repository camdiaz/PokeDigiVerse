import axios from 'axios';
import { Character } from '../../domain/entities/Character';
import { CharacterRepository } from '../../domain/ports/CharacterRepository';

export class PokemonApiAdapter implements CharacterRepository {
  async getCharacter(
    franchise: string,
    version: string,
    metadata: Record<string, any>,
    config: Record<string, any>
  ): Promise<Character> {
    try {
      if (franchise !== 'pokemon') {
        throw new Error('Invalid franchise for PokemonApiAdapter');
      }

      if (!['v1', 'v2'].includes(version)) {
        throw new Error('Invalid version for Pokemon API');
      }

      const response = await axios.get(`${config.baseUrl}/pokemon/${metadata.name.toLowerCase()}`);
      const data = response.data;

      if (!data || !data.name) {
        throw new Error('No information found for the Pokémon');
      }

      let evolutions: string[] = [];
      try {
        const evolutionChainUrl = data.evolution_chain?.url || 
          (data.species?.url && (await axios.get(data.species.url)).data.evolution_chain?.url);

        if (evolutionChainUrl) {
          const evolutionResponse = await axios.get(evolutionChainUrl);
          evolutions = this.extractEvolutions(evolutionResponse.data.chain);
        }
      } catch (evolutionError) {
        console.warn('Could not fetch evolution chain:', evolutionError);
      }

      return {
        name: data.name,
        weight: data.weight,
        powers: data.abilities.map((ability: any) => ability.ability.name),
        evolutions: evolutions
      };
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Error fetching Pokemon data: ${error.response.status} - ${error.response.statusText}`);
      }
      throw new Error(`Error fetching Pokemon data: ${error.message}`);
    }
  }

  private extractEvolutions(chain: any): string[] {
    const evolutions: string[] = [];
    let current = chain;

    while (current.evolves_to && current.evolves_to.length > 0) {
      evolutions.push(current.evolves_to[0].species.name);
      current = current.evolves_to[0];
    }

    return evolutions;
  }
} 