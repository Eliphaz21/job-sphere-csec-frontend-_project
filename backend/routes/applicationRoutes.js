const express = require('express');
const { applyJob, getApplications, deleteApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, applyJob).get(protect, getApplications);
router.route('/:id').delete(protect, deleteApplication);

module.exports = router;
