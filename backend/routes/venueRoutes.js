import express from 'express';
import upload from '../middlewares/upload.js';
const router = express.Router();

import { createVenue, deleteVenue, getAllVenue, updateVenue, getVenueById } from '../controllers/venueController.js';


router.post("/", upload.single('image'), createVenue);  // add Venue
router.get("/", getAllVenue); // Get All Venue
router.put('/:id', upload.single('image'), updateVenue); //update venue

router.delete("/:id", deleteVenue); // delete venue
// routes/venueRoutes.js
router.get("/:id", getVenueById);

export default router;
