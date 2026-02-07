import express from "express";
import { getAuthUser } from "../../Middleware/Middleware.js";
import PostListing from "../../Database/Listings/Post/PostListings.js";

import UpdateHolding from "../../Database/Investments/Post/UpdateHoldings.js";
import { FindingBuyerListing, FindingSellerListing, FindListings, FindPropertyListing } from "../../Database/Listings/Get/FetchLisiting.js";
import CancelListing from "../../Database/Listings/Delete/CancelListing.js";
import Holdings from "../../Database/Investments/Post/Holdings.js";
const router = express.Router();


/* CREATE LISTING */
router.post("/listing", async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const listingData = req.body;
    const listing = await PostListing(listingData, user);
    await UpdateHolding(listingData, user);

    return res.status(201).json({
      message: "Listing successful",
      listing,
    });

  } catch (err) {
    console.error("Listing Failed:", err.message);
    return res.status(400).json({
      error: err.message || "Listing failed",
    });
  }
});

/* Get User LISTING */
router.get("/listings", async (req, res) => {
  try {
    const { status } = req.query;
    const { tag } = req.query;
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!tag || !["buyer", "seller"].includes(tag)) {
      return res.status(400).json({ error: "Invalid tag" });
    }
    let listings;
    if (tag === "buyer") {
      listings = await FindingBuyerListing(user.id, status);
    }
    if (tag === "seller") {
      listings = await FindingSellerListing(user.id, status);
    }
    return res.status(200).json(listings);

  } catch (err) {
    console.error("Error Fetching Listings:", err.message);
    return res.status(400).json({
      error: err.message,
    });
  }
});

/* Get Property LISTING */
router.get("/propertylisting/:id", async (req, res) => {
  try {
    const { id: propertyId } = req.params;
    const propertylisting = await FindPropertyListing(
      "ACTIVE",
      propertyId,
    );
    return res.status(200).json(propertylisting);
  }
  catch (err) {
    console.error("Error Fetching Property Listing :", err.message);
    return res.status(400).json({ error: err.message });
  }

})

/* Get All LISTING */
router.get("/propertylisting", async (req, res) => {
  try {
    const { status } = req.query;
    const propertylisting = await FindListings(
      status
    );
    return res.status(200).json(propertylisting);
  }
  catch (err) {
    console.error("Error Fetching Properties Listed :", err.message);
    return res.status(400).json({ error: err.message });
  }

})

/* Cancel Listing */
router.post("/cancellisting", async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const listingData = req.body;

    const listing = await CancelListing(listingData.id, user, "CANCELLED");
    await Holdings(listingData, user);

    return res.status(200).json({
      message: "Listing successfully cancelled",
      listing,
    });
  } catch (err) {
    console.error("Listing Cancellation Failed:", err);
    return res.status(400).json({
      error: err.message || "Listing cancellation failed",
    });
  }
});

export default router;


