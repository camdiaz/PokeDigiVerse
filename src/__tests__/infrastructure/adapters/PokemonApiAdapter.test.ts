import axios from 'axios';
import { PokemonApiAdapter } from '../../../infrastructure/adapters/PokemonApiAdapter';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PokemonApiAdapter', () => {
  let adapter: PokemonApiAdapter;
  const mockConfig = {
    baseUrl: 'https://pokeapi.co/api/v2'
  };

  beforeEach(() => {
    adapter = new PokemonApiAdapter();
    jest.clearAllMocks();
  });

  describe('getCharacter', () => {
    it('should return character information for a valid Pokémon', async () => {
      const mockPokemonData = {
        data: {
          name: 'pikachu',
          weight: 60,
          abilities: [
            { ability: { name: 'static' } },
            { ability: { name: 'lightning-rod' } }
          ],
          evolution_chain: {
            url: 'https://pokeapi.co/api/v2/evolution-chain/10'
          }
        }
      };

      const mockEvolutionData = {
        data: {
          chain: {
            evolves_to: [
              {
                species: { name: 'raichu' },
                evolves_to: []
              }
            ]
          }
        }
      };

      mockedAxios.get
        .mockResolvedValueOnce(mockPokemonData)
        .mockResolvedValueOnce(mockEvolutionData);

      const result = await adapter.getCharacter(
        'pokemon',
        'v1',
        { name: 'pikachu' },
        mockConfig
      );

      expect(result).toEqual({
        name: 'pikachu',
        weight: 60,
        powers: ['static', 'lightning-rod'],
        evolutions: ['raichu']
      });

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/evolution-chain/10'
      );
    });

    it('should handle Pokémon without evolution chain', async () => {
      const mockPokemonData = {
        data: {
          name: 'mewtwo',
          weight: 1220,
          abilities: [
            { ability: { name: 'pressure' } },
            { ability: { name: 'unnerve' } }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockPokemonData);

      const result = await adapter.getCharacter(
        'pokemon',
        'v1',
        { name: 'mewtwo' },
        mockConfig
      );

      expect(result).toEqual({
        name: 'mewtwo',
        weight: 1220,
        powers: ['pressure', 'unnerve'],
        evolutions: []
      });

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the API call fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        adapter.getCharacter('pokemon', 'v1', { name: 'invalid' }, mockConfig)
      ).rejects.toThrow('Error fetching Pokemon data: API Error');
    });
  });
}); 