import express from "express";
import { getAuthUser } from "../../Middleware/Middleware.js";
import FindHoldings from "../../Database/Investments/Get/Holdings.js";
import FreezeHolding from "../../Database/Investments/Post/FreezeHolding.js";

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


router.put("/holding/freeze", async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { holdingId } = req.body;
    if (!holdingId) {
      return res.status(400).json({ error: "Holding ID is required" });
    }
    const result = await FreezeHolding(holdingId, user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.error("Error Freezing Holding:", err.message);

    return res.status(500).json({
      error: err.message,
    });
  }
});


export default router;