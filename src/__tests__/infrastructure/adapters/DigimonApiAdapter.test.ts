import axios from 'axios';
import { DigimonApiAdapter } from '../../../infrastructure/adapters/DigimonApiAdapter';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DigimonApiAdapter', () => {
  let adapter: DigimonApiAdapter;
  const mockConfig = {
    baseUrl: 'https://digi-api.com/api/v1'
  };

  beforeEach(() => {
    adapter = new DigimonApiAdapter();
    jest.clearAllMocks();
  });

  describe('getCharacter', () => {
    it('should return character information for a valid Digimon', async () => {
      const mockDigimonData = {
        data: {
          name: 'Agumon',
          weight: 20,
          attacks: [
            { name: 'Pepper Breath' },
            { name: 'Baby Flame' }
          ],
          nextEvolutions: [
            { name: 'Greymon' },
            { name: 'MetalGreymon' }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockDigimonData);

      const result = await adapter.getCharacter(
        'digimon',
        'v1',
        { id: 1 },
        mockConfig
      );

      expect(result).toEqual({
        name: 'Agumon',
        weight: 20,
        powers: ['Pepper Breath', 'Baby Flame'],
        evolutions: ['Greymon', 'MetalGreymon']
      });

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://digi-api.com/api/v1/digimon/1'
      );
    });

    it('should handle Digimon without weight', async () => {
      const mockDigimonData = {
        data: {
          name: 'Gabumon',
          attacks: [
            { name: 'Blue Blaster' }
          ],
          nextEvolutions: [
            { name: 'Garurumon' }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockDigimonData);

      const result = await adapter.getCharacter(
        'digimon',
        'v1',
        { id: 2 },
        mockConfig
      );

      expect(result).toEqual({
        name: 'Gabumon',
        weight: undefined,
        powers: ['Blue Blaster'],
        evolutions: ['Garurumon']
      });
    });

    it('should throw an error when the API call fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        adapter.getCharacter('digimon', 'v1', { id: 999 }, mockConfig)
      ).rejects.toThrow('Error fetching Digimon data: API Error');
    });
  });
}); 