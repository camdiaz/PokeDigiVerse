"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigimonApiAdapter = void 0;
const axios_1 = __importDefault(require("axios"));
class DigimonApiAdapter {
    async getCharacter(franchise, version, metadata, config) {
        try {
            const response = await axios_1.default.get(`${config.baseUrl}/digimon/${metadata.id}`);
            const data = response.data;
            return {
                name: data.name,
                weight: data.weight || undefined,
                powers: data.attacks.map((attack) => attack.name),
                evolutions: data.nextEvolutions.map((evolution) => evolution.name)
            };
        }
        catch (error) {
            throw new Error(`Error fetching Digimon data: ${error.message}`);
        }
    }
}
exports.DigimonApiAdapter = DigimonApiAdapter;
