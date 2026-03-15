# 🎸 Guitar Manager

A web app for guitar collectors to manage their collection, inventory, and wishlist.

## Features

- **Collection** — track guitars with photos, price bought/sold, condition, and notes
- **Dashboard** — overview stats: total invested, total sold, P&L by category
- **Wishlist** — keep track of guitars you want to buy
- **Offers** — receive and manage purchase offers via a shareable link
- **Share** — generate a public link to share your collection with others

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express
- **Database:** SQLite (built-in Node.js `--experimental-sqlite`)

## Requirements

- Node.js **v22+** (required for built-in SQLite support)

Check your version:
```bash
node --version
```

## Run Locally

```bash
# 1. Install root dependencies
npm install

# 2. Install server dependencies
cd server && npm install && cd ..

# 3. Install client dependencies
cd client && npm install && cd ..

# 4. Start both server and client
npm run dev
```

- **App:** http://localhost:5173
- **API:** http://localhost:3001

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server + client together |
| `npm run server` | Start API server only |
| `npm run client` | Start frontend only |

## Project Structure

```
guitar-manager/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── api.js
├── server/          # Express backend
│   ├── routes/
│   ├── db.js
│   └── index.js
└── package.json     # Root — runs both together
```
