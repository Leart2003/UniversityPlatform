# University Platform

University Platform is a full-stack university management system built with a React frontend and multiple .NET backend services. The project is organized as a microservice-style architecture where different parts of the system handle login, students, courses, exams, and notifications.

## Overview

This project gives a university-like platform for managing common academic tasks, including:

- user registration and login
- view and manage student records
- manage courses and enrollment data
- manage exams
- send and view notifications
- use a single frontend app to interact with multiple services

## Tech Stack

Frontend
- React
- Vite
- JavaScript
- Lucide React

Backend
- ASP.NET Core
- C#
- Multiple .NET services for different domains

## Repository Structure

```text
UniversityPlatform/
├── client/
│   ├── src/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── src/
│   ├── ApiGateway/
│   ├── LoginService/
│   ├── StudentService/
│   ├── CourseService/
│   ├── ExamService/
│   └── NotificationService/
├── UniversityPlatform.slnx
├── .gitignore
├── .gitattributes
└── README.md
```

### Service Breakdown

- `src/ApiGateway` - API gateway
- `src/LoginService` - authentication and user login flow
- `src/StudentService` - student management
- `src/CourseService` - course management
- `src/ExamService` - exam management
- `src/NotificationService` - notifications and alerts
- `client` - frontend React app that connects to the services

## Features

- Register and sign in through the login service
- Manage students, courses, exams, and notifications
- View campus overview data from the UI
- Search and filter lists in the client app
- Connect to multiple backend services from one frontend app
- Service URLs are configured through environment variables

## Prerequisites

Before running the project, make sure you have:

- Node.js LTS
- npm
- .NET SDK
- A local development environment for the backend services

## Frontend Setup

1. Open a terminal in the `client` folder.
2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file if needed:

```bash
cp .env.example .env
```

4. Start the frontend:

```bash
npm run dev
```

The app will typically run on a Vite development port like:

```text
http://localhost:5173
```

The client app reads API URLs from environment variables and connects to the local ASP.NET services.

## Backend Setup

Each service in `src/` is a separate ASP.NET Core application. You need to run the required services locally before using the frontend.

Example flow:

```bash
dotnet run --project src/ApiGateway
```

```bash
dotnet run --project src/LoginService/LoginService.Api
```

```bash
dotnet run --project src/StudentService/StudentService.Api
```

```bash
dotnet run --project src/CourseService/CourseService.Api
```

```bash
dotnet run --project src/ExamService/ExamService.Api
```

```bash
dotnet run --project src/NotificationService/NotificationService.Api
```

The frontend is configured to communicate with local service URLs, and the CORS settings allow requests from the Vite client ports.

## Environment Configuration

The frontend uses environment variables stored in `.env`. The sample file is available in:

```text
client/.env.example
```

Update the values if your service URLs differ from the default local configuration.

## Notes

This repository is built as a practical multi-service application, which means the project is split across several backend services instead of being a single monolithic API. This architecture is useful for separation of concerns and makes it easier to expand each domain independently.

The client app currently uses the login flow where the server returns a user record to the browser and the frontend keeps that in local storage for the session.

## Future Improvements

Possible improvements for the project include:

- better authentication tokens
- stronger validation and error handling
- admin dashboards
- better UI/UX improvements
- deployment setup
- automated testing
- more documentation for each service

## Conclusion

University Platform is a learning and project-oriented application that demonstrates how a university management system can be split into multiple .NET services while still being consumed through one React frontend.
