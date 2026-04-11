const express = require('express');
const {
  getAllUsers, getUserById, updateUser, deleteUser,
  getAllApplications, updateApplicationStatus,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { updateUserRules, statusRules, mongoIdParam } = require('../middleware/validators');
const { validate } = require('../middleware/validate');
const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);

router.route('/users').get(getAllUsers);
router.route('/users/:id')
  .get(mongoIdParam, validate, getUserById)
  .put(updateUserRules, validate, updateUser)
  .delete(mongoIdParam, validate, deleteUser);

router.route('/applications').get(getAllApplications);
router.route('/applications/:id/status').put(statusRules, validate, updateApplicationStatus);

module.exports = router;
