# Student Records App

A simple web application for managing student information in a school or classroom.

## Features

- ✅ Add new students with name, age, and classroom
- ✅ View all student records in a table format
- ✅ MySQL database for persistent storage
- ✅ Simple server-rendered HTML interface
- ✅ Dockerized backend and database
- ✅ Environment-based configuration

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: MySQL
- **Templating**: EJS
- **Frontend**: Bootstrap 5 + Font Awesome
- **Containerization**: Docker & Docker Compose

## Installation & Setup

### Local Development

```bash
# Install dependencies
npm install

# Create .env file with database credentials
cp .env.example .env

# Start the application
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the app at http://localhost:3000
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
