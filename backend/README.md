# NetCheck PHP API deployment

This directory contains a deployable PHP API. It deliberately excludes the local XAMPP `config.php`, `seed.php`, and uploaded issue images. The sample seed script contains predictable demo passwords and must not be exposed on a public server.

## Container settings

- Dockerfile: `backend/Dockerfile`
- Container port: `80`
- Set these environment variables in the backend host:
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
  - `APP_ALLOWED_ORIGINS=https://netcheck-lru.vercel.app`
- Create a new MySQL database and import `schema.sql` into it. The fresh schema includes the current application columns. Do not import `migration_v2.sql` for a fresh database; it is only for upgrading an older local database.
- The API lives under `/api`; the frontend base URL should end in `/api`, for example `https://your-api-host.example/api`.
- Create an administrator using the registration page, then promote that account to `admin` in the database. Do not deploy the XAMPP `seed.php` demo accounts.

Use a persistent volume mounted at `/var/www/html/uploads` if issue images must survive container redeployments.

## No-cost shared PHP hosting option

For free shared hosting, serve the built Vite frontend and this PHP API from the same host name so browser requests are same-origin. Some free hosts block API requests from a separate site such as the current Vercel domain.

1. Build the frontend with `npm run build`.
2. Upload the contents of `dist/` to the host's web root.
3. Upload `backend/api/`, `backend/includes/`, `backend/uploads/`, and `backend/config.php` to that same web root. Upload `backend/site-root.htaccess` as `.htaccess`.
4. Create a MySQL database in the hosting panel and import `backend/schema.sql` into it.
5. Copy `backend/config.local.php.example` to `config.local.php` in the web root and fill in the host-provided DB values. Never put those values in GitHub or chat.
6. Enable HTTPS, then open the PHP host's domain (not the Vercel domain) and register the first account.

Free plans can impose limits or add an interstitial/security layer. Check that API endpoints can be called by browser JavaScript on the same site before moving real user data.
