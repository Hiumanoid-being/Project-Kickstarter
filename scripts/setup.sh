#!/bin/bash

# Project Kickstarter Setup Script
# Supports multiple database configurations: PostgreSQL, MongoDB, Supabase, Firebase

set -e

echo "🚀 Project Kickstarter Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
print_info "Checking required tools..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

if ! command_exists docker; then
    print_warning "Docker is not installed. Some features may not work."
fi

if ! command_exists git; then
    print_warning "Git is not installed. Some features may not work."
fi

print_success "Required tools check completed"
echo ""

# Install dependencies
print_info "Installing server dependencies..."
cd server
npm install
cd ..
print_success "Server dependencies installed"
echo ""

print_info "Installing client dependencies..."
cd client
npm install
cd ..
print_success "Client dependencies installed"
echo ""

# Create environment files if they don't exist
print_info "Setting up environment files..."

if [ ! -f server/.env ]; then
    cp server/.env.template server/.env
    print_success "Created server/.env from template"
else
    print_warning "server/.env already exists, skipping..."
fi

if [ ! -f client/.env ]; then
    cp client/.env.template client/.env
    print_success "Created client/.env from template"
else
    print_warning "client/.env already exists, skipping..."
fi

echo ""

# Database selection menu
print_info "Database Configuration"
echo "=============================="
echo "Select your preferred database backend:"
echo ""
echo "1) PostgreSQL (Default - Recommended for production)"
echo "2) MongoDB"
echo "3) Supabase"
echo "4) Firebase"
echo "5) Skip (Keep default PostgreSQL configuration)"
echo ""
read -p "Enter your choice [1-5]: " db_choice

case $db_choice in
    1)
        print_info "Configuring for PostgreSQL..."
        echo "DB_TYPE=postgres" > server/.env
        echo "DB_HOST=db" >> server/.env
        echo "DB_PORT=5432" >> server/.env
        echo "DB_USER=user" >> server/.env
        echo "DB_PASSWORD=password" >> server/.env
        echo "DB_NAME=app" >> server/.env
        echo "VITE_BACKEND_TYPE=rest" > client/.env
        print_success "PostgreSQL configuration applied"
        ;;
    2)
        print_info "Configuring for MongoDB..."
        echo "DB_TYPE=mongodb" > server/.env
        echo "MONGODB_URI=mongodb://admin:password@mongodb:27017/app?authSource=admin" >> server/.env
        echo "VITE_BACKEND_TYPE=rest" > client/.env
        print_success "MongoDB configuration applied"
        ;;
    3)
        print_info "Configuring for Supabase..."
        echo "DB_TYPE=supabase" > server/.env
        echo "SUPABASE_URL=http://localhost:8000" >> server/.env
        echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" >> server/.env
        echo "SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsD3W0YRN8030" >> server/.env
        echo "VITE_BACKEND_TYPE=supabase" > client/.env
        echo "VITE_SUPABASE_URL=http://localhost:8000" >> client/.env
        echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" >> client/.env
        print_success "Supabase configuration applied"
        ;;
    4)
        print_info "Configuring for Firebase..."
        echo "DB_TYPE=firebase" > server/.env
        echo "FIREBASE_PROJECT_ID=demo-project" >> server/.env
        echo "FIREBASE_CLIENT_EMAIL=firebase-adminsdk-demo@demo-project.iam.gserviceaccount.com" >> server/.env
        echo "FIREBASE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n\"" >> server/.env
        echo "VITE_BACKEND_TYPE=firebase" > client/.env
        echo "VITE_FIREBASE_API_KEY=your-api-key" >> client/.env
        echo "VITE_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com" >> client/.env
        echo "VITE_FIREBASE_PROJECT_ID=demo-project" >> client/.env
        echo "VITE_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com" >> client/.env
        echo "VITE_FIREBASE_MESSAGING_SENDER_ID=123456789" >> client/.env
        echo "VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456" >> client/.env
        print_success "Firebase configuration applied"
        print_warning "Remember to update Firebase credentials with your actual values!"
        ;;
    5)
        print_info "Keeping default PostgreSQL configuration"
        ;;
    *)
        print_warning "Invalid choice, keeping default PostgreSQL configuration"
        ;;
esac

echo ""

# Docker setup
if command_exists docker; then
    read -p "Do you want to start the application with Docker? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Starting Docker containers..."
        
        case $db_choice in
            2)
                docker-compose -f docker-compose.mongodb.yml up --build -d
                ;;
            3)
                docker-compose -f docker-compose.supabase.yml up --build -d
                ;;
            4)
                docker-compose -f docker-compose.firebase.yml up --build -d
                ;;
            *)
                docker-compose up --build -d
                ;;
        esac
        
        print_success "Docker containers started!"
        echo ""
        print_info "Services running at:"
        echo "  - Frontend: http://localhost:3000"
        echo "  - Backend:  http://localhost:5000"
        
        case $db_choice in
            1)
                echo "  - PostgreSQL: localhost:5432"
                ;;
            2)
                echo "  - MongoDB: localhost:27017"
                ;;
            3)
                echo "  - Supabase: localhost:5432 (PostgreSQL)"
                echo "  - Supabase Auth: localhost:8000"
                ;;
            4)
                echo "  - Firebase Emulator: localhost:4000"
                ;;
        esac
    else
        print_info "Docker containers not started. You can start them manually with:"
        case $db_choice in
            2)
                echo "  docker-compose -f docker-compose.mongodb.yml up --build"
                ;;
            3)
                echo "  docker-compose -f docker-compose.supabase.yml up --build"
                ;;
            4)
                echo "  docker-compose -f docker-compose.firebase.yml up --build"
                ;;
            *)
                echo "  docker-compose up --build"
                ;;
        esac
    fi
else
    print_warning "Docker is not installed. Please install Docker and start the containers manually."
fi

echo ""
print_success "Setup completed! 🎉"
echo ""
print_info "Next steps:"
echo "  1. Review and update environment variables in server/.env and client/.env"
echo "  2. For Firebase, update the credentials with your actual Firebase project values"
echo "  3. Run 'npm run dev' in both client/ and server/ directories for development"
echo "  4. Or use Docker to run the entire stack"
echo ""
print_info "For more information, see README.md"