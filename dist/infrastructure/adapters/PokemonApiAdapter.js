"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonApiAdapter = void 0;
const axios_1 = __importDefault(require("axios"));
class PokemonApiAdapter {
    async getCharacter(franchise, version, metadata, config) {
        try {
            const response = await axios_1.default.get(`${config.baseUrl}/pokemon/${metadata.name.toLowerCase()}`);
            const data = response.data;
            return {
                name: data.name,
                weight: data.weight,
                powers: data.abilities.map((ability) => ability.ability.name),
                evolutions: data.evolution_chain ? await this.getEvolutions(data.evolution_chain.url) : []
            };
        }
        catch (error) {
            throw new Error(`Error fetching Pokemon data: ${error.message}`);
        }
    }
    async getEvolutions(evolutionChainUrl) {
        try {
            const response = await axios_1.default.get(evolutionChainUrl);
            const chain = response.data.chain;
            const evolutions = [];
            let current = chain;
            while (current.evolves_to.length > 0) {
                evolutions.push(current.evolves_to[0].species.name);
                current = current.evolves_to[0];
            }
            return evolutions;
        }
        catch (error) {
            console.error('Error fetching evolution chain:', error);
            return [];
        }
    }
}
exports.PokemonApiAdapter = PokemonApiAdapter;
