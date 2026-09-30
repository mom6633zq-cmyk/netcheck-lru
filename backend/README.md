# NetCheck PHP API deployment

This directory contains a deployable PHP API. It deliberately excludes the local XAMPP `config.php`, `seed.php`, and uploaded issue images. The sample seed script contains predictable demo passwords and must not be exposed on a public server.

## Container settings

- Dockerfile: `backend/Dockerfile`
- Container port: `80`
- Set these environment variables in the backend host:
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
  - `APP_ALLOWED_ORIGINS=https://netcheck-lru.vercel.app`
- Create a MySQL database and import `schema.sql` into it. For an existing database created from the older schema, run `migration_v2.sql` after selecting that database.
- The API lives under `/api`; the frontend base URL should end in `/api`, for example `https://your-api-host.example/api`.
- Create an administrator using the registration page, then promote that account to `admin` in the database. Do not deploy the XAMPP `seed.php` demo accounts.

Use a persistent volume mounted at `/var/www/html/uploads` if issue images must survive container redeployments.
