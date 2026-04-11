const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// ── Users ──────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name    = name    ?? user.name;
    user.email   = email   ?? user.email;
    user.isAdmin = isAdmin ?? user.isAdmin;
    const updated = await user.save();

    res.json({ _id: updated._id, name: updated.name, email: updated.email, isAdmin: updated.isAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isAdmin) return res.status(400).json({ message: 'Cannot delete admin account' });
    await user.deleteOne();
    // Also remove their applications
    await Application.deleteMany({ userId: req.params.id });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Applications ───────────────────────────────────────────
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate('userId', 'name email')
      .populate('jobId', 'title company location type salary currency logo')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('userId', 'name email').populate('jobId', 'title company');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Dashboard stats ────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      Job.countDocuments({}),
      Application.countDocuments({}),
    ]);
    res.json({ totalUsers, totalJobs, totalApplications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
