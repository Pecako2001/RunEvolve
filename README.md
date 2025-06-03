# RunEvolve - Full-Stack Running Tracker

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Pecako2001/RunEvolve context](https://badge.forgithub.com/Pecako2001/RunEvolve?accept=text%2Fhtml&maxTokens=20000)](https://github.com/Pecako2001/RunEvolve?accept=text%2Fhtml&maxTokens=20000)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://https://github.com/Pecako2001/RunEvolve)
[![Last Commit](https://img.shields.io/github/last-commit/your-repo/runevolve)](https://https://github.com/Pecako2001/RunEvolve/commits/main)

RunEvolve is a full-stack running tracker application designed to help users monitor their running activities, analyze performance statistics, and connect with their fitness goals. The frontend is built with Next.js, featuring a modern and responsive UI using the Mantine component library. The backend is powered by FastAPI, providing a robust and efficient API. Future plans include integration with Strava for seamless activity syncing.

## Features

- **Track Running Activities:** Log essential details about your runs, such as distance, time, average speed, and heart rate.
- **View Detailed Statistics:** Analyze your performance with comprehensive summaries, charts, and historical data.
- **User-Friendly Interface:** Experience a clean, modern, and responsive UI built with Mantine.
- **(Planned) Strava Integration:** Automatically sync your activities from Strava.
- **New & Upcoming Pages:**
  - `/goals`: Define and track weekly/monthly distance or time goals.
  - `/profile`: View past run summaries, personal bests, and manage Strava sync status.
  - `/calendar`: Visualize your runs on a calendar view.

## Tech Stack

- **Frontend:**
  - Next.js (v15)
  - React (v19)
  - TypeScript
  - Mantine UI
  - CSS Modules
  - Recharts
- **Backend:**
  - FastAPI (Python)
  - PostgreSQL
  - SQLAlchemy (ORM)
- **DevOps & Tooling:**
  - Docker & Docker Compose
  - ESLint
  - Jest

## Prerequisites

- Node.js (v18 or later recommended)
- npm (comes with Node.js) or yarn
- Docker Desktop (or Docker Engine and Docker Compose CLI)
- Python (v3.9 or later, if setting up the backend manually without Docker)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/runevolve.git
cd runevolve
```

_(Remember to replace `your-repo/runevolve` with the actual repository URL if you fork it)._

### 2. Backend Setup (using Docker - Recommended)

The backend, along with the PostgreSQL database, is containerized using Docker.

1.  **Navigate to the `backend` directory:**
    ```bash
    cd backend
    ```
2.  **Create `.env` file:**
    Copy the example environment file and customize it if needed.
    ```bash
    cp .env.example .env
    ```
3.  **Configure Environment Variables (in `backend/.env`):**

    - **`DATABASE_URL`**: The default `DATABASE_URL` in `.env.example` is configured to work with the PostgreSQL service defined in the `docker-compose.yml` file at the root of the project (`postgresql://user:password@db/app`). Update this if your PostgreSQL setup differs (e.g., if you're using an external database).
    - **Strava Integration (Future):** The `.env` file also contains placeholders for `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, and `STRAVA_WEBHOOK_CALLBACK_URL`. These will be used for the planned Strava integration.

4.  **Build and Run Docker Containers:**
    From the **root `runevolve` directory** (where `docker-compose.yml` is located):

    ```bash
    docker-compose up -d --build
    ```

    This command will build the images for the backend and database services and start them in detached mode.

5.  **Verify Backend:**
    The backend API should now be accessible at `http://localhost:8000`.
    You can view the interactive API documentation (Swagger UI) at `http://localhost:8000/docs` or ReDoc at `http://localhost:8000/redoc`.

### 3. Frontend Setup

1.  **Navigate to the `frontend` directory:**
    If you are in the `backend` directory, go back to the root and then into `frontend`:

    ```bash
    cd ../frontend
    ```

    If you are in the root `runevolve` directory:

    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

    Alternatively, if you prefer using yarn:

    ```bash
    # yarn install
    ```

3.  **Configure Environment Variables (`frontend/.env.local`):**

    - Copy the provided example file and customize it if needed:
      ```bash
      cp .env.local.example .env.local
      ```
    - If your backend API is running on a URL different from the default (`http://localhost:8000`), update the `NEXT_PUBLIC_API_URL` value in `.env.local`.
    - If this file is not present, the application defaults to `http://localhost:8000` for API calls.

4.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    This will start the Next.js development server (typically with Turbopack).

5.  **Access the Application:**
    The frontend application should now be accessible at `http://localhost:3000`.

## Environment Variables

### Backend (`backend/.env`)

- `DATABASE_URL`: PostgreSQL connection string. (e.g., `postgresql://user:password@host:port/database`)
- `STRAVA_CLIENT_ID`: (Optional) Your Strava application's Client ID for future Strava integration.
- `STRAVA_CLIENT_SECRET`: (Optional) Your Strava application's Client Secret.
- `STRAVA_WEBHOOK_CALLBACK_URL`: (Optional) Your Strava webhook callback URL.

### Frontend (`frontend/.env.local` - Optional)

- Copy `.env.local.example` to `.env.local` and adjust values as needed.
- `NEXT_PUBLIC_API_URL`: The base URL for the backend API. If not set, the application defaults to `http://localhost:8000`.

## Available Scripts (Frontend)

The following scripts are available in the `frontend` directory (via `package.json`):

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Builds the application for production deployment.
- `npm run start`: Starts a Next.js production server (requires a prior build).
- `npm run lint`: Lints the codebase using Next.js's integrated ESLint configuration.
- `npm run test`: Runs tests using Jest.

### Styling

Shared utilities and theme-aware classes live in `frontend/src/styles/global.module.css`.
Import this module in components to access base styles like `cardHover` or
`createRunForm__submitButton` and ensure consistent dark/light theme behavior.

## API Endpoints (Backend)

The backend API is built with FastAPI, which provides automatic interactive API documentation.

Once the backend service is running (e.g., via `docker-compose up`), you can access the API documentation at:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

These interfaces provide detailed information about all available endpoints, request parameters, and response models.

## Screenshots/Demo

Screenshots and demos will be added here soon!

## Contributing

Contributions are welcome! Please follow the standard fork and pull request (PR) workflow. More detailed contribution guidelines will be added in the future.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the Apache License 2.0. See the `LICENSE` file in the root directory for more details.
