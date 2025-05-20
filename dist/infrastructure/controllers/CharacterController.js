"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterController = void 0;
class CharacterController {
    constructor(getCharacterUseCase) {
        this.getCharacterUseCase = getCharacterUseCase;
    }
    async getCharacter(req, res) {
        try {
            const { franchise, version } = req.params;
            const metadata = JSON.parse(req.query.metadata);
            const config = JSON.parse(req.query.config);
            const character = await this.getCharacterUseCase.execute(franchise, version, metadata, config);
            res.json(character);
        }
        catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
}
exports.CharacterController = CharacterController;
