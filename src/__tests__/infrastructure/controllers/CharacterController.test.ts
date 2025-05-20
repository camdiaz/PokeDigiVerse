import { Request, Response } from 'express';
import { CharacterController } from '../../../infrastructure/controllers/CharacterController';
import { GetCharacterUseCase } from '../../../application/use-cases/GetCharacterUseCase';

describe('CharacterController', () => {
  let controller: CharacterController;
  let mockUseCase: jest.Mocked<GetCharacterUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(),
      setCharacterRepository: jest.fn()
    } as unknown as jest.Mocked<GetCharacterUseCase>;

    mockRequest = {
      params: {
        franchise: 'pokemon',
        version: 'v1'
      },
      query: {
        metadata: JSON.stringify({ name: 'pikachu' }),
        config: JSON.stringify({ baseUrl: 'https://pokeapi.co/api/v2' })
      }
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    controller = new CharacterController(mockUseCase);
  });

  describe('getCharacter', () => {
    it('should return character information on success', async () => {
      const mockCharacter = {
        name: 'pikachu',
        weight: 60,
        powers: ['static', 'lightning-rod'],
        evolutions: ['raichu']
      };

      mockUseCase.execute.mockResolvedValueOnce(mockCharacter);

      await controller.getCharacter(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUseCase.execute).toHaveBeenCalledWith(
        'pokemon',
        'v1',
        { name: 'pikachu' },
        { baseUrl: 'https://pokeapi.co/api/v2' }
      );
      expect(mockResponse.json).toHaveBeenCalledWith(mockCharacter);
    });

    it('should handle invalid JSON in query parameters', async () => {
      mockRequest.query = {
        metadata: 'invalid-json',
        config: JSON.stringify({ baseUrl: 'https://pokeapi.co/api/v2' })
      };

      await controller.getCharacter(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'PARSING_ERROR',
        error: 'Error parsing query parameters'
      });
    });

    it('should handle errors from use case', async () => {
      const error = new Error('API Error');
      mockUseCase.execute.mockRejectedValueOnce(error);

      await controller.getCharacter(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'API_ERROR',
        error: 'API Error'
      });
    });
  });
}); 