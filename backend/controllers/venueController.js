import sharp from "sharp";
import fs from "fs/promises"; // use promise version of fs
import path from "path";
import VenueModel from "../models/VenueModel.js";

// Post/ add New data
export const createVenue = async (req, res) => {
  try {
    const { name, city, address, sports, pricing } = req.body;
    let imageFileName = "";

    if (req.file) {
      const originalPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const baseName = path
        .basename(req.file.originalname, ext)
        .replace(/\s+/g, "_");
      const newFileName = `${baseName}_${Date.now()}.jpg`;
      const outputPath = path.join("uploads", newFileName);

      await sharp(originalPath).jpeg({ quality: 80 }).toFile(outputPath);

      // Delay the unlink to avoid EPERM error
      setTimeout(async () => {
        try {
          await fs.unlink(originalPath);
        } catch (err) {
          console.warn("Could not delete original file:", err.message);
        }
      }, 500);

      imageFileName = newFileName;
    }

    const venue = new VenueModel({
      name,
      city,
      address,
      sports,
      pricing,
      image: imageFileName,
    });

    const saved = await venue.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating venue" });
  }
};

// get all data
export const getAllVenue = async (req, res) => {
  try {
    const venues = await VenueModel.find();
    res.status(201).json(venues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

// update venue
export const updateVenue = async (req, res) => {
  try {
    const { name, city, address, sports, pricing } = req.body;
    let updated = { name, city, address, pricing };

    if (sports) {
      updated.sports = sports.includes(",")
        ? sports.split(",").map((s) => s.trim())
        : [sports];
    }

    if (req.file) {
      const input = req.file.path;
      const base = path.basename(
        req.file.originalname,
        path.extname(req.file.originalname)
      );
      const newName = `${base.replace(/\s+/g, "_")}_${Date.now()}.jpg`;
      const output = path.join("uploads", newName);

      await sharp(input).jpeg({ quality: 80 }).toFile(output);
      fs.unlinkSync(input);
      // delete old image
      const old = await VenueModel.findById(req.params.id);
      if (old?.image) {
        const oldPath = path.join("uploads", old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updated.image = newName;
    }
    const saved = await VenueModel.findByIdAndUpdate(req.params.id, updated, {
      new: true,
    });
    res.status(200).json(saved);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Failed to update venue " });
  }
};

//delete venue
export const deleteVenue = async (req, res) => {
  try {
    const venue = await VenueModel.findByIdAndDelete(req.params.id);
    res.status(201).json(venue);
  } catch (error) {
    console.error(error);
    res.status(501).json({ error: "Failed to delete Venue" });
  }
};
