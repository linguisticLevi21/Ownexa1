import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import Auth from "./Routes/Authentication/Auth.js";
import FetchProperty from "./Routes/Property/FetchingProperty.js";
import UpdateProperty from "./Routes/Property/UpdatingProperty.js";
import PrimaryTransaction from "./Routes/Transactions/PrimaryTransactions.js"
import Holdings from "./Routes/Holdings/Holding.js"
import Listings from "./Routes/Listings/Listing.js"
import Stats from "./Routes/Analytics/Analytics.js"

const app = express();
const PORT = 4000;

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ROUTES
app.use("/", Auth);
app.use("/", UpdateProperty);
app.use("/", FetchProperty);
app.use("/", PrimaryTransaction);
app.use("/", Holdings);
app.use("/", Listings);
app.use("/", Stats);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});