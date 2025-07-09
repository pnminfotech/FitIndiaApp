import express from 'express';
import {getCourts, createCourt, updateCourt, deleteCourt} from '../controllers/slotController.js';
const slotRouter = express.Router();

slotRouter.get("/:venueId/:courtId", getCourts);
slotRouter.post("/:venueId/:courtId", createCourt);
slotRouter.put("/:venueId/:courtId/:slotId", updateCourt);
slotRouter.delete("/:venueId/:courtId/:slotId", deleteCourt);

export default slotRouter;
