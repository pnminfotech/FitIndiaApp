import path from "path";
import sharp from "sharp";
import { promises as fs } from "fs";
import VenueModel from "../models/VenueModel.js";

// Post/ add New data
export const createVenue = async (req, res) => {
  try {
    const { name, city,location, pricing } = req.body;
    const sports = req.body.sports?.split(',').map(item => item.trim()) || [];
    const amenities = req.body.amenities?.split(',').map(item => item.trim()) || [];

    console.log("BODY RECEIVED:", req.body);
    const loc = {
      address: location?.address || "",
      lat: parseFloat(location?.lat),
      lng: parseFloat(location?.lng),
    };

    if (!loc.address || isNaN(loc.lat) || isNaN(loc.lng)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing location fields", loc });
    }

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
      location: loc,
      pricing,
      image: imageFileName,
      sports,
      amenities
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
    const { name, city,location, pricing, sports, amenities } = req.body;
    // Parse location fields from FormData
    const loc = {
      address: location?.address || "",
      lat: parseFloat(location?.lat),
      lng: parseFloat(location?.lng),
    };

    if (!loc.address || isNaN(loc.lat) || isNaN(loc.lng)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing location fields", loc });
    }
    let updated = { name, city, location:loc, pricing};

    if (sports) {
      updated.sports = sports.includes(",")
        ? sports.split(",").map((s) => s.trim())
        : [sports];
    }
    if (amenities) {
      updated.amenities = amenities.includes(",")
        ? amenities.split(",").map((s) => s.trim())
        : [amenities];
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
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        console.warn("Couldn't delete old image:", err.message);
      }

      // delete old image
      const old = await VenueModel.findById(req.params.id); // ✅ also important
      if (old?.image) {
        const oldPath = path.join("uploads", old.image);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          console.warn("Old image not found or already deleted:", oldPath);
        }
      }

      updated.image = newName;
    }

    // console.log("Update ID:", req.params.id);
    // console.log("Update data:", updated);

    const saved = await VenueModel.findByIdAndUpdate(req.params.id, updated, {
      new: true,
    });

    if (!saved) {
      return res.status(404).json({ error: "Venue not found" });
    }

    // ✅ Send success response
    res.status(200).json(saved);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Failed to update venue" });
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
