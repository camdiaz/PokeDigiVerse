"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const PokemonApiAdapter_1 = require("./infrastructure/adapters/PokemonApiAdapter");
const DigimonApiAdapter_1 = require("./infrastructure/adapters/DigimonApiAdapter");
const SqliteRequestLogRepository_1 = require("./infrastructure/adapters/SqliteRequestLogRepository");
const GetCharacterUseCase_1 = require("./application/use-cases/GetCharacterUseCase");
const CharacterController_1 = require("./infrastructure/controllers/CharacterController");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Initialize repositories
const requestLogRepository = new SqliteRequestLogRepository_1.SqliteRequestLogRepository();
const pokemonAdapter = new PokemonApiAdapter_1.PokemonApiAdapter();
const digimonAdapter = new DigimonApiAdapter_1.DigimonApiAdapter();
// Initialize use cases
const getCharacterUseCase = new GetCharacterUseCase_1.GetCharacterUseCase(pokemonAdapter, // Default adapter
requestLogRepository);
// Initialize controllers
const characterController = new CharacterController_1.CharacterController(getCharacterUseCase);
// Routes
app.get('/api/:franchise/:version', (req, res) => {
    const { franchise } = req.params;
    // Switch adapter based on franchise
    if (franchise === 'digimon') {
        getCharacterUseCase.setCharacterRepository(digimonAdapter);
    }
    else {
        getCharacterUseCase.setCharacterRepository(pokemonAdapter);
    }
    characterController.getCharacter(req, res);
});
// Initialize database and start server
async function start() {
    try {
        await requestLogRepository.initialize();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
start();
