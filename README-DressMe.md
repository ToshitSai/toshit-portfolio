# DressMe

Full-stack virtual try-on app with a React + Vite + TailwindCSS frontend and an Express + Multer backend that calls Replicate's IDM-VTON model.

## Setup

```bash
cd server
copy .env.example .env
```

Add your Replicate token:

```bash
REPLICATE_API_TOKEN=your_token_here
PORT=5000
```

Install dependencies:

```bash
cd ../server
npm install
cd ../client
npm install
```

Run both apps in separate terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## API

`POST /api/try-on`

Multipart fields:

- `person_image`: JPG, PNG, or WEBP
- `garment_image`: JPG, PNG, or WEBP
- `category`: `upper_body`, `lower_body`, `full_outfit`, or `accessory`

The server temporarily stores uploads in `server/uploads`, sends them to Replicate as data URIs, polls the async prediction, returns `{ "outputUrl": "..." }`, and removes temp files in a `finally` block.
