import { GetCharacterUseCase } from '../../../application/use-cases/GetCharacterUseCase';
import { CharacterRepository } from '../../../domain/ports/CharacterRepository';
import { RequestLogRepository } from '../../../domain/ports/RequestLogRepository';

describe('GetCharacterUseCase', () => {
  let useCase: GetCharacterUseCase;
  let mockCharacterRepository: jest.Mocked<CharacterRepository>;
  let mockRequestLogRepository: jest.Mocked<RequestLogRepository>;

  beforeEach(() => {
    mockCharacterRepository = {
      getCharacter: jest.fn()
    };

    mockRequestLogRepository = {
      save: jest.fn()
    };

    useCase = new GetCharacterUseCase(
      mockCharacterRepository,
      mockRequestLogRepository
    );
  });

  describe('execute', () => {
    const mockParams = {
      franchise: 'pokemon',
      version: 'v1',
      metadata: { name: 'pikachu' },
      config: { baseUrl: 'https://pokeapi.co/api/v2' }
    };

    const mockCharacter = {
      name: 'pikachu',
      weight: 60,
      powers: ['static', 'lightning-rod'],
      evolutions: ['raichu']
    };

    it('should return character information and log success', async () => {
      mockCharacterRepository.getCharacter.mockResolvedValueOnce(mockCharacter);

      const result = await useCase.execute(
        mockParams.franchise,
        mockParams.version,
        mockParams.metadata,
        mockParams.config
      );

      expect(result).toEqual(mockCharacter);
      expect(mockCharacterRepository.getCharacter).toHaveBeenCalledWith(
        mockParams.franchise,
        mockParams.version,
        mockParams.metadata,
        mockParams.config
      );
      expect(mockRequestLogRepository.save).toHaveBeenCalledWith({
        franchise: mockParams.franchise,
        version: mockParams.version,
        metadata: mockParams.metadata,
        timestamp: expect.any(Date),
        status: 'success'
      });
    });

    it('should log error and rethrow when character repository fails', async () => {
      const error = new Error('API Error');
      mockCharacterRepository.getCharacter.mockRejectedValueOnce(error);

      await expect(
        useCase.execute(
          mockParams.franchise,
          mockParams.version,
          mockParams.metadata,
          mockParams.config
        )
      ).rejects.toThrow('API Error');

      expect(mockRequestLogRepository.save).toHaveBeenCalledWith({
        franchise: mockParams.franchise,
        version: mockParams.version,
        metadata: mockParams.metadata,
        timestamp: expect.any(Date),
        status: 'fail',
        errorMessage: 'API Error'
      });
    });
  });

  describe('setCharacterRepository', () => {
    it('should update the character repository', async () => {
      const newRepository: CharacterRepository = {
        getCharacter: jest.fn()
      };

      useCase.setCharacterRepository(newRepository);

      // @ts-ignore - accessing private property for testing
      expect(useCase.characterRepository).toBe(newRepository);
    });
  });
}); 