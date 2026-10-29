# Campus client

The React and Vite client for UniversityPlatform. It connects to the five existing .NET services: login, students, courses, exams, and notifications.

## Run locally

1. Install a current Node.js LTS release.
2. From this directory run `npm install`.
3. Copy `.env.example` to `.env` if your service URLs differ from the local defaults.
4. Start the five ASP.NET APIs in Development using their HTTP profiles.
5. Run `npm run dev` and open the URL printed by Vite (normally `http://localhost:3000`).

The development API ports are read from each API project's `Properties/launchSettings.json`. ASP.NET Development CORS policies allow the Vite origins on ports 3000 and 5173. The browser app calls the services directly; the current `ApiGateway` project does not yet provide proxy routes.

## Features

- Register and sign in using the Login service.
- View the campus overview, course catalog, students, exams, and notifications.
- Create students, courses, exams, and notifications; edit and delete courses.
- Enroll a student in a course and view enrollment counts.
- Search the course and student lists; adjust service URLs through Vite environment variables.

Login is the existing email/password API flow. The server returns a user record and does not currently issue a token, so the client keeps the returned user in local storage for the browser session experience.
