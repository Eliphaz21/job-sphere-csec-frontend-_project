const express = require('express');
const { applyJob, getApplications, deleteApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { mongoIdParam } = require('../middleware/validators');
const { validate } = require('../middleware/validate');
const router = express.Router();

router.route('/')
  .post(protect, applyJob)
  .get(protect, getApplications);

router.route('/:id')
  .delete(protect, mongoIdParam, validate, deleteApplication);

module.exports = router;
