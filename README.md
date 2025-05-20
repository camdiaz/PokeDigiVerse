# PokeDigiVerse API

A modern REST API that provides a unified interface to fetch information from both Pokémon and Digimon franchises. Built with TypeScript and following Hexagonal Architecture principles.

## 🚀 Features

- **Unified API**: Single endpoint for both Pokémon and Digimon data
- **Modern Architecture**: 
  - Hexagonal Architecture (Ports & Adapters)
  - Clean Code principles
  - SOLID principles
- **Robust Infrastructure**:
  - Request logging
  - Rate limiting
  - SQLite database for persistence
  - Swagger documentation
  - Docker support
- **Quality Assurance**:
  - Unit testing with Jest
  - TypeScript for type safety
  - ESLint for code quality

## 🛠️ Technologies

- **Backend**:
  - Node.js
  - TypeScript
  - Express.js
- **Database**:
  - SQLite
- **Testing**:
  - Jest
  - Supertest
- **Documentation**:
  - Swagger/OpenAPI
- **Containerization**:
  - Docker
  - Docker Compose

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/camdiaz/PokeDigiVerse.git
cd pokedigiverse
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the development server:
```bash
npm run dev
```

### Docker Deployment

1. Build and start the containers:
```bash
docker-compose up --build
```

2. For development with hot-reload:
```bash
docker-compose up
```

3. To stop the containers:
```bash
docker-compose down
```

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📚 API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when the server is running.

### Endpoint Structure

```
GET /api/:franchise/:version
```

#### Parameters:
- `franchise`: "pokemon" or "digimon"
- `version`: API version
  - Pokémon: "v1"
  - Digimon: "classic", "digitalworld"

#### Query Parameters:
- `metadata`: JSON object with franchise-specific parameters
  - Pokémon: `{ "name": "pikachu" }`
  - Digimon: `{ "id": 42 }`
- `config`: JSON object with external API configuration
  - Pokémon: `{ "baseUrl": "https://pokeapi.co/api/v2" }`
  - Digimon: `{ "baseUrl": "https://digi-api.com/api/v1" }`

### Example Request

```bash
curl "http://localhost:3000/api/pokemon/v1?metadata={\"name\":\"pikachu\"}&config={\"baseUrl\":\"https://pokeapi.co/api/v2\"}"
```

### Example Response

```json
{
  "name": "pikachu",
  "weight": 60,
  "powers": ["static", "lightning-rod"],
  "evolutions": ["raichu"]
}
```

## 📁 Project Structure

```
src/
├── application/         # Use cases and business logic
│   └── use-cases/      # Application use cases
├── domain/             # Core business logic
│   ├── constants/      # Domain constants
│   ├── errors/         # Custom error classes
│   └── ports/          # Port interfaces
├── infrastructure/     # External adapters and implementations
│   ├── adapters/       # External service adapters
│   ├── controllers/    # API controllers
│   ├── entities/       # Database entities
│   └── swagger/        # API documentation
└── index.ts           # Application entry point
```

## 🔧 Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot-reload
- `npm run build`: Build the TypeScript project
- `npm test`: Run tests
- `npm run test:coverage`: Run tests with coverage report
- `npm run test:watch`: Run tests in watch mode
