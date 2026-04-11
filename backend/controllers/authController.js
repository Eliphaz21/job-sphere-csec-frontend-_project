const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const buildUserResponse = (user) => ({
  _id:     user._id,
  name:    user.name,
  email:   user.email,
  isAdmin: user.isAdmin,
  token:   generateToken(user._id),
});

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json(buildUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin credentials are stored exclusively in .env — never hardcoded
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!admin) {
        admin = await User.create({
          name: 'Admin',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          isAdmin: true,
        });
      } else if (!admin.isAdmin) {
        admin.isAdmin = true;
        await admin.save();
      }
      return res.json(buildUserResponse(admin));
    }

    // Normal user login
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json(buildUserResponse(user));
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
