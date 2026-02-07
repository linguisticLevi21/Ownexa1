import express from "express";
import { getAuthUser } from "../../Middleware/Middleware.js";
import FindHoldings from "../../Database/Investments/Get/Holdings.js";

const router = express.Router();

/* Get User Holdings */
router.get("/holdings", async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const holdings = await FindHoldings(user)
    return res.status(200).json(holdings);
  } catch (err) {
    console.error("Error Fetching User Holdings:", err.message);
    return res.status(400).json({
      error: err.message
    });
  }
});

export default router;