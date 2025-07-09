import Venue from '../models/VenueModel.js';


export const createCourt = async (req, res) => {
  const { courtName, sports, slots } = req.body;
  const venueId = req.params.venueId;

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    venue.courts.push({ courtName, sports, slots });
    await venue.save();

    res.status(201).json({ message: 'Court added successfully', venue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCourt = async (req, res) => {
  const { courtName, sports, slots } = req.body;
  const { venueId, courtId } = req.params;

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    const court = venue.courts.id(courtId);
    if (!court) return res.status(404).json({ message: 'Court not found' });

    court.courtName = courtName;
    court.sports = sports;
    court.slots = slots;

    await venue.save();
    res.json({ message: 'Court updated successfully', venue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCourt = async (req, res) => {
  const { venueId, courtId } = req.params;

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    venue.courts.id(courtId).remove();
    await venue.save();

    res.json({ message: 'Court deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourts = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    res.json(venue.courts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
