# Deployment Guide for Employee Management System

This guide provides instructions for deploying the Employee Management System application, which consists of:
- Angular frontend
- GraphQL/Express backend
- MongoDB database

## Local Development Deployment

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- Git

### Option 1: Running Without Docker

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd employee-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/employee_db
   JWT_SECRET=your_jwt_secret
   PORT=8081
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The GraphQL server will be available at http://localhost:8081/graphql

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd 101476134_comp3133_assignment2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Angular development server:
   ```bash
   npm start
   ```
   The frontend will be available at http://localhost:4200

### Option 2: Using Docker Compose (Recommended)

1. Make sure Docker and Docker Compose are installed on your system.

2. From the root directory containing both frontend and backend folders, run:
   ```bash
   docker-compose up -d
   ```

3. This will start:
   - MongoDB at port 27017
   - Backend at port 8081
   - Frontend at port 4200

4. To stop the containers:
   ```bash
   docker-compose down
   ```

## Cloud Deployment

### Deploying to Vercel

#### Frontend Deployment
1. Create a Vercel account if you don't have one.
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Navigate to the frontend directory and run:
   ```bash
   vercel
   ```
4. Follow the prompts to deploy your application.

#### Backend Deployment
1. Create a `vercel.json` file in the backend directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "index.js"
       }
     ]
   }
   ```
2. Deploy the backend:
   ```bash
   vercel
   ```

### Deploying to Heroku

1. Create a Heroku account if you don't have one.
2. Install the Heroku CLI and login:
   ```bash
   npm install -g heroku
   heroku login
   ```

#### Backend Deployment
1. Navigate to the backend directory.
2. Create a new Heroku app:
   ```bash
   heroku create your-backend-app-name
   ```
3. Add MongoDB add-on:
   ```bash
   heroku addons:create mongodb:sandbox
   ```
4. Deploy the backend:
   ```bash
   git push heroku main
   ```

#### Frontend Deployment
1. Navigate to the frontend directory.
2. Update the API URL in the environment files to point to your deployed backend.
3. Create a new Heroku app:
   ```bash
   heroku create your-frontend-app-name
   ```
4. Deploy the frontend:
   ```bash
   git push heroku main
   ```

## Environment Configuration

After deployment, make sure to update the following environment variables:

### Backend Environment Variables
- `MONGODB_URI`: Connection string to your MongoDB database
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Port number for the server (default: 8081)

### Frontend Environment Variables
- Update the GraphQL API URL in the frontend code to point to your deployed backend.

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure the backend has proper CORS configuration to allow requests from the frontend domain.
2. **Database Connection Issues**: Verify the MongoDB connection string is correct and the database is accessible.
3. **Authentication Errors**: Check that the JWT secret is properly set and consistent.

### Logs
- Check Docker logs: `docker-compose logs -f`
- Check Heroku logs: `heroku logs --tail --app your-app-name`

## Maintenance

### Updating the Application
1. Pull the latest changes from the repository.
2. Rebuild and restart the containers:
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

### Database Backup
1. Create a MongoDB backup:
   ```bash
   docker exec -it mongodb mongodump --out /data/backup
   ```
2. Copy the backup to the host:
   ```bash
   docker cp mongodb:/data/backup ./backup
