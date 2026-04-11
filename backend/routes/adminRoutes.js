const express = require('express');
const {
  getAllUsers, getUserById, updateUser, deleteUser,
  getAllApplications, updateApplicationStatus,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);

router.route('/users').get(getAllUsers);
router.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

router.route('/applications').get(getAllApplications);
router.route('/applications/:id/status').put(updateApplicationStatus);

module.exports = router;
