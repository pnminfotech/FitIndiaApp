import User from '../models/User.js';


// controllers/userController.js
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const user = req.user;
  res.json({
    _id: user._id,
    mobile: user.mobile,
    name: user.name,
    city: user.city,
    sportsPreferences: user.sportsPreferences,
    createdAt: user.createdAt,
  });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

 export const updateMe = async (req, res) => {
    const updates = req.body;
    const  user = await User.findByIdAndUpdate(req.user._id, updates, { new: true});
    res.json(user);
 }


 export const updateUserLocation = async (req, res) => {
  const userId = req.user._id;
  const { latitude, longitude } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "Location saved", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update location" });
  }
};
