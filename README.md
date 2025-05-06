# 🔗 ShortLink — URL Shortener Service

ShortLink is a simple but powerful URL shortening service. It allows users to create short links for long URLs, track visits, and retrieve statistics through RESTful APIs.

---

This project is preconfigured with the following stack and setup conventions:

---

## 🏗️ 1. Project Structure

shortlink/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── utils/
│   ├── storage/
│   ├── app.ts
│   └── server.ts
├── tests/
│   └── encodeDecode.test.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md


---

## ✨ 2. Development Stack

* **Node.js** with **TypeScript**
* **Express.js**
* **MongoDB** (via `mongoose`)
* **pnpm** (as the package manager only)
* **Redis** (caching & batching)
* **Jest** + **Supertest** (unit & integration tests)
* **Docker** + **Docker Compose** (for full environment)
* **Joi** for schema validation
* **Winston** for logging (with daily rotation)
* **React** for frontend integration
* **Node Version Guide** available in [`node_version_guide.md`](./node_version_guide.md):

  * Specifies that the project uses **Node.js v22**
  * Includes a one-liner **bash script** to automatically switch or install the correct version using `nvm`

---

## 📦 3. Package Manager

### ✅ `pnpm` only

* Set in `package.json`:

```json
"packageManager": "pnpm@8.15.4"
```

* Prevents install via npm/yarn using `preinstall` script:

```ts
// enforce-pnpm.js
if (!process.env.npm_config_user_agent?.includes('pnpm')) {
  console.error('Please use pnpm to install dependencies.');
  process.exit(1);
}
```

---

## 4. Linting & Formatting

* ESLint configured with TypeScript plugin
* Prettier for consistent formatting
* Auto-run on commit via `lint-staged`

### Scripts

```json
"lint": "eslint src/**/*.ts",
"lint:fix": "eslint src/**/*.ts --fix",
"prettier": "prettier --write src/**/*.ts"
```

### Pre-commit Hook

Runs:

* Lint
* Prettier
* Optional: Test or PNPM check

---

## 5. Security Middleware

* `helmet` for HTTP headers
* `cors` for cross-origin requests
* `express-rate-limit` and `rate-limiter-flexible` for rate limiting

---

## 6. Env Configuration

Uses `.env` and `dotenv` to load environment variables.

---

## 🏁 Getting Started (Setup Instructions)

 **Clone the Repository**

```bash
git clone https://github.com/yakubu234/URL-Shortener-Indicina.git
cd 'URL-Shortener-Indicina'
```
---

**Environment Variables**

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/short_link
PORT=4000
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000,http://localhost:4000,http://localhost:5173
ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=null
REDIS_PASSWORD=null
REACT_APP_API_BASE_URL=http://localhost:4000/api
VITE_API_BASE_URL=http://localhost:4000/api
```
---

```bash
pnpm install          # install dependencies (only via pnpm)
pnpm dev              # run dev server (ts-node-dev)
pnpm lint:fix         # fix code style issues
pnpm commit           # commit with conventional prompts
```

---

## ✅ Ready for Production

```bash
pnpm build            # compile TypeScript to /dist
pnpm start            # run compiled app
```


---

##  Redis Visit Count Strategy

- Visit counts are stored in Redis to reduce MongoDB writes.
- A background job flushes Redis counts to MongoDB every 60 seconds.
- `getStats`, `search`, and `getAll` automatically **merge Redis cache** for accurate stats.

---

##  API Endpoints

- `POST /api/encode`: Shorten a long URL
- `POST /api/decode`: Decode a short URL
- `GET /:shortCode`: Redirect to the original long URL
- `GET /api/statistic/:urlPath`: View stats for a short URL
- `GET /api/list`: List all shortened URLs
- `GET /api/search?query=...`: Search by partial long URL

* **postman documentation** available at [`here`](https://documenter.getpostman.com/view/12538701/2sB2j6BBQt)
---

## 7.  Conventional Commits

* `feat:`, `fix:`, `chore:`
* Enforced via Husky + Commitlint

---

## 8. Husky + Commitlint Setup

### Commitlint

```js
// commitlint.config.js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

### Husky Hook

```sh
pnpm dlx husky add .husky/commit-msg "pnpm commitlint --edit $1"
```


##  Test Strategy

This project uses **multi-layered tests** for robust QA:

| Layer        | Tool        | Location                       |
|--------------|-------------|--------------------------------|
| Unit tests   | Jest        | `urlService.test.ts`           |
| Controller   | Jest + Mocks| `shortlink.controller.test.ts` |
| Integration  | Supertest   | `api.integration.test.ts`      |
| Negative cases| Supertest   | `api.negative.test.ts`         |

### Run All Tests

#### for unit test run
```bash
pnpm run test:unit
```

#### for integration test run
```bash
pnpm run test:integration
```