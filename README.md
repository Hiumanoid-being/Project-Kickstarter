# Project Kickstarter

A flexible full-stack application template with Docker support, featuring a React frontend, Node.js backend, and support for multiple database backends: **PostgreSQL**, **MongoDB**, **Supabase**, and **Firebase**.

## Features

- 🚀 **Quick Setup** - Get started in minutes with the interactive setup script
- 🗄️ **Multiple Database Options** - Choose from PostgreSQL, MongoDB, Supabase, or Firebase
- 🐳 **Docker Support** - Pre-configured Docker Compose files for each database
- ⚡ **Modern Stack** - React (Vite) + Node.js (Express) + ES Modules
- 🔄 **Flexible Architecture** - Easy to switch between database backends
- 🎨 **TypeScript Ready** - Ready for TypeScript integration
- 📦 **Production Ready** - Best practices and security considerations included

## Project Structure

```
Project-Kickstarter/
├── client/                 # React frontend application
│   ├── src/
│   │   └── api.js         # API service with multi-backend support
│   ├── .env.template      # Client environment template
│   └── package.json
├── server/                 # Node.js backend API
│   ├── src/
│   │   ├── index.js       # Server entry point
│   │   ├── app.js         # Express app configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic & database services
│   │       ├── database.js           # Main database service
│   │       ├── database.postgres.js  # PostgreSQL implementation
│   │       ├── database.mongodb.js   # MongoDB implementation
│   │       ├── database.supabase.js  # Supabase implementation
│   │       └── database.firebase.js  # Firebase implementation
│   ├── .env.template      # Server environment template
│   └── package.json
├── firebase/               # Firebase configuration & emulator
│   ├── functions/         # Cloud Functions
│   ├── firebase.json      # Firebase configuration
│   ├── firestore.rules    # Firestore security rules
│   ├── firestore.indexes.json
│   └── storage.rules      # Storage security rules
├── docker/                 # Docker configuration files
│   ├── client.Dockerfile
│   └── server.Dockerfile
├── scripts/
│   └── setup.sh           # Interactive setup script
├── docker-compose.yml     # PostgreSQL configuration (default)
├── docker-compose.mongodb.yml    # MongoDB configuration
├── docker-compose.supabase.yml   # Supabase configuration
├── docker-compose.firebase.yml   # Firebase configuration
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) and Docker Compose (optional, for containerized deployment)
- [Git](https://git-scm.com/)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Hiumanoid-being/Project-Kickstarter.git
cd Project-Kickstarter
```

### 2. Run the interactive setup script

```bash
bash scripts/setup.sh
```

The setup script will:
- Install dependencies for both client and server
- Create environment files from templates
- Let you choose your preferred database backend
- Optionally start Docker containers

### 3. Start the application

#### Option A: Using Docker (Recommended)

```bash
# For PostgreSQL (default)
docker-compose up --build

# For MongoDB
docker-compose -f docker-compose.mongodb.yml up --build

# For Supabase
docker-compose -f docker-compose.supabase.yml up --build

# For Firebase
docker-compose -f docker-compose.firebase.yml up --build
```

#### Option B: Development Mode (without Docker)

```bash
# Terminal 1: Start the server
cd server
npm install
npm run dev

# Terminal 2: Start the client
cd client
npm install
npm run dev
```

## Services

Once running, access the services at:

| Service  | URL                     | Description                |
|----------|-------------------------|----------------------------|
| Frontend | http://localhost:3000   | React application          |
| Backend  | http://localhost:5000   | Node.js API server         |

### Database Services

| Database   | Port    | Docker Compose File              |
|------------|---------|----------------------------------|
| PostgreSQL | 5432    | `docker-compose.yml` (default)   |
| MongoDB    | 27017   | `docker-compose.mongodb.yml`     |
| Supabase   | 5432    | `docker-compose.supabase.yml`    |
| Firebase   | 4000    | `docker-compose.firebase.yml`    |

## Database Configuration

### PostgreSQL (Default)

PostgreSQL is the default database, perfect for relational data and production use.

**Environment Variables (server/.env):**
```env
DB_TYPE=postgres
DB_HOST=db
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=app
```

**Start with Docker:**
```bash
docker-compose up --build
```

### MongoDB

MongoDB is a NoSQL database, ideal for document-based data and flexible schemas.

**Environment Variables (server/.env):**
```env
DB_TYPE=mongodb
MONGODB_URI=mongodb://admin:password@mongodb:27017/app?authSource=admin
```

**Start with Docker:**
```bash
docker-compose -f docker-compose.mongodb.yml up --build
```

### Supabase

Supabase is an open-source Firebase alternative, providing PostgreSQL with real-time capabilities and built-in authentication.

**Environment Variables (server/.env):**
```env
DB_TYPE=supabase
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

**Start with Docker:**
```bash
docker-compose -f docker-compose.supabase.yml up --build
```

**Features included:**
- PostgreSQL database
- Authentication (GoTrue)
- Real-time subscriptions
- Auto-generated APIs

### Firebase

Firebase is Google's mobile development platform, perfect for rapid development and real-time applications.

**Environment Variables (server/.env):**
```env
DB_TYPE=firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

**Start with Docker:**
```bash
docker-compose -f docker-compose.firebase.yml up --build
```

**Firebase Emulator Suite:**
- UI: http://localhost:4000
- Firestore: localhost:8080
- Auth: localhost:8081
- Storage: localhost:9000
- Functions: localhost:9099

## Environment Variables

### Server (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DB_TYPE` | Database type | `postgres` |

#### PostgreSQL Specific
| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `db` |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database user | `user` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `app` |

#### MongoDB Specific
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://admin:password@mongodb:27017/app` |

#### Supabase Specific
| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |

#### Firebase Specific
| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key |

### Client (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | `Project Kickstarter` |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_BACKEND_TYPE` | Backend type | `rest` |

#### Supabase Client
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

#### Firebase Client
| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

## Development

### Frontend Development

```bash
cd client
npm install
npm run dev
```

The development server will start at http://localhost:5173 (Vite default) or http://localhost:3000 (depending on configuration).

### Backend Development

```bash
cd server
npm install
npm run dev
```

The server will start at http://localhost:5000 with hot-reload enabled.

## API Endpoints

The server provides the following REST API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

## Docker Commands

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build

# View logs
docker-compose logs -f

# Stop and remove all containers, networks, and volumes
docker-compose down -v

# For specific database configurations:
docker-compose -f docker-compose.mongodb.yml up --build
docker-compose -f docker-compose.supabase.yml up --build
docker-compose -f docker-compose.firebase.yml up --build
```

## Switching Databases

To switch between database backends:

1. Update `server/.env`:
   ```env
   DB_TYPE=postgres  # or mongodb, supabase, firebase
   ```

2. Update `client/.env`:
   ```env
   VITE_BACKEND_TYPE=rest  # or supabase, firebase
   ```

3. Use the appropriate Docker Compose file or restart your development servers.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues:
- Open an issue on [GitHub](https://github.com/Hiumanoid-being/Project-Kickstarter/issues)

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)