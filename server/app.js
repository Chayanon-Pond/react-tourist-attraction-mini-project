import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import trips from "./db.js";

const app = express();
const port = 4001;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/trips", (req, res) => {
  // Query params: keywords (optional), page (1-based), limit (per page)
  const { keywords = "", page = "1", limit = "10" } = req.query;

  let results = [];

  if (!keywords || keywords.trim() === "") {
    // no keyword filtering -> all trips
    results = trips;
  } else {
    const regexKeywords = keywords.split(" ").join("|");
    const regex = new RegExp(regexKeywords, "ig");
    results = trips.filter((trip) => {
      return (
        (trip.title && trip.title.match(regex)) ||
        (trip.description && trip.description.match(regex)) ||
        (trip.tags && trip.tags.filter((tag) => tag.match(regex)).length)
      );
    });
  }

  // pagination
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const perPage = Math.max(parseInt(limit, 10) || 10, 1);
  const total = results.length;
  const totalPages = Math.max(Math.ceil(total / perPage), 1);
  const start = (pageNum - 1) * perPage;
  const paginated = results.slice(start, start + perPage);

  return res.json({
    data: paginated,
    meta: {
      total,
      page: pageNum,
      perPage,
      totalPages,
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
