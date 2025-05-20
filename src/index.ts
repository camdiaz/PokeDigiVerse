import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { PokemonApiAdapter } from './infrastructure/adapters/PokemonApiAdapter';
import { DigimonApiAdapter } from './infrastructure/adapters/DigimonApiAdapter';
import { SqliteRequestLogRepository } from './infrastructure/adapters/SqliteRequestLogRepository';
import { GetCharacterUseCase } from './application/use-cases/GetCharacterUseCase';
import { CharacterController } from './infrastructure/controllers/CharacterController';
import { setupSwagger } from './infrastructure/swagger/swagger';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Setup Swagger documentation
setupSwagger(app);

// Initialize repositories
const requestLogRepository = new SqliteRequestLogRepository();
const pokemonAdapter = new PokemonApiAdapter();
const digimonAdapter = new DigimonApiAdapter();

// Initialize use cases
const getCharacterUseCase = new GetCharacterUseCase(
  pokemonAdapter, // Default adapter
  requestLogRepository
);

// Initialize controllers
const characterController = new CharacterController(getCharacterUseCase);

// Routes
app.get('/api/:franchise/:version', (req, res) => {
  const { franchise } = req.params;
  
  // Switch adapter based on franchise
  if (franchise === 'digimon') {
    getCharacterUseCase.setCharacterRepository(digimonAdapter);
  } else {
    getCharacterUseCase.setCharacterRepository(pokemonAdapter);
  }
  
  characterController.getCharacter(req, res);
});

// Initialize database and start server
async function start() {
  try {
    await requestLogRepository.initialize();
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`🔍 API documentation available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start(); 