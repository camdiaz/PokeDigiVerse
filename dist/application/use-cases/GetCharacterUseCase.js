"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCharacterUseCase = void 0;
class GetCharacterUseCase {
    constructor(characterRepository, requestLogRepository) {
        this.characterRepository = characterRepository;
        this.requestLogRepository = requestLogRepository;
    }
    setCharacterRepository(repository) {
        this.characterRepository = repository;
    }
    async execute(franchise, version, metadata, config) {
        try {
            const character = await this.characterRepository.getCharacter(franchise, version, metadata, config);
            await this.requestLogRepository.save({
                franchise,
                version,
                metadata,
                timestamp: new Date(),
                status: 'success'
            });
            return character;
        }
        catch (error) {
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
exports.GetCharacterUseCase = GetCharacterUseCase;
