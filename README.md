# NutrIA

This project includes a small Express API alongside a React frontend.

## Environment variables

Create a `.env` file in the project root and define the following variable:

```
JWT_SECRET=your_jwt_secret_key
```

The Express server in `backend/server.mjs` uses this value to sign authentication tokens.
