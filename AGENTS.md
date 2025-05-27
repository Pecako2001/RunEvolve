# Agents Setup Guide

This guide describes how to run the application, including both the frontend and backend components.

---


## Running the Frontend

Navigate to the `frontend` directory and start the development server:

```bash
cd frontend
npm install        # Run once to install dependencies
npm run dev
```

This will start the frontend on http://localhost:3000 by default.

---

## Running the Backend

Navigate to the `backend` directory and start the FastAPI backend server:

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

This will start the API server on http://localhost:8000.

---

## Notes

- Ensure the backend and frontend are both running for full functionality.
- You can configure API endpoints and database connections in the `.env` file if provided.
- The frontend is expected to communicate with the backend at `localhost:8000`. Update `API_BASE_URL` in the frontend config if needed.

---

## Docker (Optional)

To run the project with Docker:

```bash
docker-compose up --build
```

Refer to `docker-compose.yml` for configuration details.