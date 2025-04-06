# Employee Management System

A full-stack web application for managing employee data, built with Angular, GraphQL, Express, and MongoDB.

## Features

- **User Authentication**: Secure login and registration system
- **Employee Management**: CRUD operations for employee records
- **Search Functionality**: Filter employees by department or designation
- **Responsive Design**: Works on desktop and mobile devices
- **Profile Pictures**: Support for employee photos with file upload functionality

## Tech Stack

### Frontend
- **Angular 17**: Modern frontend framework
- **Apollo Client**: GraphQL client for Angular
- **Angular Material**: UI component library
- **RxJS**: Reactive programming library
- **TypeScript**: Typed JavaScript
- **File Upload**: Support for uploading employee profile pictures

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **Apollo Server**: GraphQL server
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Multer**: Middleware for handling file uploads

## Project Structure

```
project/
├── 101476134_comp3133_assignment2/    # Frontend (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/                  # Authentication components
│   │   │   ├── employee/              # Employee components
│   │   │   ├── services/              # Services for API communication
│   │   │   ├── guards/                # Route guards
│   │   │   └── ...
│   │   └── ...
│   ├── Dockerfile                     # Frontend Docker configuration
│   └── ...
├── employee-management-system/        # Backend (Express/GraphQL)
│   ├── src/
│   │   ├── models/                    # MongoDB models
│   │   ├── resolvers/                 # GraphQL resolvers
│   │   ├── schema/                    # GraphQL schema
│   │   └── middleware/                # Express middleware
│   ├── Dockerfile                     # Backend Docker configuration
│   └── ...
└── docker-compose.yml                 # Docker Compose configuration
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/101476134_comp3133_assignment2.git
   cd 101476134_comp3133_assignment2
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install frontend dependencies
   cd 101476134_comp3133_assignment2
   npm install

   # Install backend dependencies
   cd ../employee-management-system
   npm install
   ```

### Running the Application

#### Using Docker (Recommended)

From the root directory:
```bash
docker-compose up -d
```

This will start:
- MongoDB at port 27017
- Backend at port 8081
- Frontend at port 4200

#### Without Docker

1. Start the backend:
   ```bash
   cd employee-management-system
   npm start
   ```

2. Start the frontend:
   ```bash
   cd 101476134_comp3133_assignment2
   npm start
   ```

3. Open your browser and navigate to:
   - Frontend: http://localhost:4200
   - GraphQL Playground: http://localhost:8081/graphql

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## API Documentation

### GraphQL Endpoints

- **Login**: Authenticate a user and receive a JWT token
- **Signup**: Register a new user
- **getAllEmployees**: Retrieve all employees
- **searchEmployeeById**: Get a specific employee by ID
- **searchEmployeeByDesignationOrDepartment**: Search employees by designation or department
- **addEmployee**: Create a new employee record
- **updateEmployee**: Update an existing employee record
- **deleteEmployee**: Remove an employee record

### REST Endpoints

- **POST /upload**: Upload an employee profile picture and receive a URL

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- George Brown College - COMP 3133 Full Stack Development II
- Professor: Pritesh Patel
