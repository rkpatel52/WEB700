# WEB700 Assignment 6 — Sequelize + Postgres (LEGO)

Follow these steps to run the app locally and to deploy.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Neon.tech credentials.
3. `npm start`
4. Open http://localhost:8080

## Notes
- A6 requires Sequelize models for `Set` and `Theme` and routes for reading/adding/deleting sets.
- Theme filtering uses `getSetsByTheme` with `Op.iLike`.
- The set details page fetches a random quote from DummyJSON.
