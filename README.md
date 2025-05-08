# Model United Nations (MUN) Management System

A comprehensive platform for organizing and participating in Model UN conferences.

## Features

- User management (delegates, chairs, admins)
- Committee management
- Country assignments
- Document submission and review
- Event tracking
- Scoring and awards
- Block formation

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: React with Tailwind CSS
- **Database**: SQL Server

## Prerequisites

- Node.js (v14 or higher)
- SQL Server
- The SQL script provided in the project must be executed to set up the database

## Installation

### Database Setup

1. Execute the SQL script `Final_MUN.sql` in your SQL Server Management Studio or equivalent tool
2. This will create the database, tables, stored procedures, triggers, and views

### Backend Setup

1. Navigate to the backend directory:
   \`\`\`
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file with the following variables:
   \`\`\`
   PORT=5000
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_SERVER=your_db_server
   DB_DATABASE=Mun_Database_Final1
   DB_PORT=1433
   \`\`\`

4. Start the backend server:
   \`\`\`
   npm run dev
   \`\`\`

### Frontend Setup

1. Navigate to the frontend directory:
   \`\`\`
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Start the frontend development server:
   \`\`\`
   npm start
   \`\`\`

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Users

- `GET /api/users/:id` - Get user by ID
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Delegates

- `GET /api/delegates/:id` - Get delegate by ID
- `PUT /api/delegates/:id` - Update delegate
- `GET /api/delegates/:id/experiences` - Get delegate's past experiences
- `POST /api/delegates/:id/experiences` - Add past experience
- `GET /api/delegates/:id/assignments` - Get delegate's committee assignments
- `GET /api/delegates/:id/documents` - Get delegate's documents
- `GET /api/delegates/:id/scores` - Get delegate's scores

### Chairs

- `GET /api/chairs/:id` - Get chair by ID
- `PUT /api/chairs/:id` - Update chair
- `GET /api/chairs/:id/committees` - Get committees chaired by a specific chair
- `POST /api/chairs/scores` - Record a score for a delegate
- `PUT /api/chairs/documents/:id/status` - Change document status
- `PUT /api/chairs/events/:id/status` - Change event status

### Committees

- `GET /api/committees` - Get all committees
- `GET /api/committees/:id` - Get committee by ID
- `POST /api/committees` - Create committee
- `PUT /api/committees/:id` - Update committee
- `DELETE /api/committees/:id` - Delete committee
- `GET /api/committees/:id/delegates` - Get committee delegates
- `GET /api/committees/:id/documents` - Get committee documents
- `GET /api/committees/:id/events` - Get committee events
- `GET /api/committees/:id/blocks` - Get committee blocks

### Countries

- `GET /api/countries` - Get all countries
- `GET /api/countries/:id` - Get country by ID
- `POST /api/countries` - Create country
- `PUT /api/countries/:id` - Update country
- `DELETE /api/countries/:id` - Delete country
- `POST /api/countries/populate` - Populate countries

### Documents

- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Create document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/vote` - Vote on document
- `GET /api/documents/:id/votes` - Get votes for a document

### Events

- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/vote` - Vote on event
- `GET /api/events/:id/votes` - Get votes for an event

### Blocks

- `GET /api/blocks/:id` - Get block by ID
- `POST /api/blocks` - Create block
- `PUT /api/blocks/:id` - Update block
- `DELETE /api/blocks/:id` - Delete block
- `POST /api/blocks/assign` - Assign delegate to block

### Admin

- `GET /api/admin/:id` - Get admin by ID
- `PUT /api/admin/:id` - Update admin
- `GET /api/admin/stats` - Get system stats
- `POST /api/admin/assign-delegate` - Assign delegate to committee
- `POST /api/admin/assign-chair` - Assign chair to committee
- `POST /api/admin/calculate-scores` - Calculate overall scores
- `POST /api/admin/generate-awards` - Generate awards
- `POST /api/admin/allocate-countries` - Allocate countries by experience

## License

This project is licensed under the MIT License.
