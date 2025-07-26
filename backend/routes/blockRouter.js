import express, { Router } from 'express';
import { blockSlot,unblockSlot,getBlockedOfCourt, getBlockedSlots, blockSlotsForMonth, } from '../controllers/blockController.js';
import { unblockMonthSlots } from '../controllers/blockController.js';


const router = express.Router();
router.post('/', blockSlot);
router.get('/blocked',getBlockedSlots);
router.get('/:venueId/:courtId', getBlockedOfCourt);
router.delete('/:id',unblockSlot);


router.post('/bulk', blockSlotsForMonth);




router.post('/unblock-month', unblockMonthSlots);

export default router;