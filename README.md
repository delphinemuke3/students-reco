# Student Records Management App

A full-stack web application for managing student records with a Node.js/Express backend, MySQL database, and a Bootstrap-styled frontend.

## Features

- ✅ Add new student records with name, age, and classroom
- ✅ View all student records in a responsive table
- ✅ Persistent data storage with MySQL
- ✅ Health check endpoint for monitoring
- ✅ Docker support for containerized deployment
- ✅ Comprehensive test suite with Jest
- ✅ ESLint configured for code quality
- ✅ Environment-based configuration

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0
- **Frontend**: EJS templates, Bootstrap 5, Vanilla JavaScript
- **Testing**: Jest, Supertest
- **DevOps**: Docker, Docker Compose
- **Code Quality**: ESLint

## Prerequisites

- Node.js 18+ or Docker/Docker Compose
- MySQL 8.0+ (if running locally without Docker)
- npm 9+

## Installation & Setup

### Option 1: Local Setup (without Docker)

1. **Clone the repository**
   ```bash
   cd students-reco
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=students_db
   PORT=3000
   NODE_ENV=development
   ```

4. **Create the database**
   ```bash
   mysql -u root -p < init.sql
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   Visit `http://localhost:3000`

### Option 2: Docker Setup (Recommended)

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: `http://localhost:3000`
   - Health Check: `http://localhost:3000/health`

3. **Stop containers**
   ```bash
   docker-compose down
   ```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## Available Scripts

```bash
npm start          # Start the server
npm test           # Run test suite
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run dev        # Start with nodemon (development)
```

## Project Structure

```
students-reco/
├── index.js              # Main server file
├── package.json          # Node dependencies
├── Dockerfile            # Docker image configuration
├── docker-compose.yml    # Docker services orchestration
├── init.sql              # Database initialization
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── views/
│   └── index.ejs        # EJS template for student records
├── public/
│   ├── index.html       # Static HTML (fallback)
│   └── styles.css       # Custom CSS styling
└── README.md            # This file
```

## API Endpoints

- `GET /` - Display student records page
- `POST /add-student` - Add a new student
- `GET /health` - Health check endpoint

## Environment Variables

```
DB_HOST=db
DB_USER=root
DB_PASSWORD=root_password
DB_NAME=students_db
PORT=3000
NODE_ENV=production
```

## Usage

1. Open http://localhost:3000 in your browser
2. Fill in the "Add New Student" form with:
   - Student Name
   - Age (1-100)
   - Classroom (e.g., 10A)
3. Click "Add Student" button
4. View all records in the table below

## Troubleshooting

- **Database connection failed**: Ensure MySQL is running and credentials match .env
- **Port 3000 already in use**: Change PORT in .env file
- **npm install fails**: Delete node_modules and package-lock.json, then retry

## License

ISC
