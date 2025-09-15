## react-tourist-attraction-mini-project

Simple demo app that lists tourist-attraction "trips" from a small server and shows client-side search with pagination.

Structure
- client/: React + Vite frontend
- server/: small Express server that serves a static in-memory `trips` dataset

Quick start

1) Install dependencies

	 - Server

		 ```powershell
		 cd server
		 npm install
		 ```

	 - Client

		 ```powershell
		 cd client
		 npm install
		 ```

2) Run the server (development)

	 ```powershell
	 cd server
	 npm start
	 ```

	 The server listens on http://localhost:4001 by default.

3) Run the client

	 ```powershell
	 cd client
	 npm run dev
	 ```

	 Open the address printed by Vite (usually http://localhost:5173).

API

- GET /trips
	- Query params:
		- keywords (string) optional: space-separated keywords used to filter by title, description, or tags
		- page (integer, 1-based) optional: page number for pagination
		- limit (integer) optional: items per page
	- Response:
		- { data: [...], meta: { total, page, perPage, totalPages } }

Pagination behavior

- Server-side: when the frontend requests `/trips` without `keywords` or with `keywords` and also sends `page` and `limit`, the server will return only the requested page and include `meta.totalPages`.
- Client-side search (from the `SearchBar` component) currently requests up to 100 results and passes the array to the `TouristAttractionList` component in "prop mode". In prop mode the list performs deduplication by `eid` and paginates client-side at 5 items per page.

Notes and troubleshooting

- If results look duplicated: ensure you're running only one instance of the client and server. The project uses an in-memory dataset in `server/db.js` so multiple server instances won't add or remove data but duplicated UI usually comes from rendering the list component multiple times.
- To change page size for the search mode edit `client/src/Components/TouristAttractionList.jsx` (itemsPerPage in prop mode).
- The code uses CORS and simple JSON responses; this is a demo not hardened for production.

Small edits you may want

- Lower the `limit` sent by the search box if you expect many results.
- Wire server-side pagination from the search box (currently search uses client-side paging) — see `client/src/Components/SearchBar.jsx` and `client/src/Components/TouristAttractionList.jsx` for where to change that.

License

This repository is an example/demo. No license specified.
