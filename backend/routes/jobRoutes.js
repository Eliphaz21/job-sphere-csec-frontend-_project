const express = require('express');
const {
  getJobs, createJob, searchJobs, updateJob, toggleBookmark, deleteJob,
} = require('../controllers/jobController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { jobRules, mongoIdParam } = require('../middleware/validators');
const { validate } = require('../middleware/validate');
const router = express.Router();

router.get('/search', searchJobs);

router.route('/')
  .get(getJobs)
  .post(protect, adminOnly, jobRules, validate, createJob);

router.route('/:id')
  .put(protect, adminOnly, mongoIdParam, jobRules, validate, updateJob)
  .delete(protect, adminOnly, mongoIdParam, validate, deleteJob);

router.put('/:id/bookmark', mongoIdParam, validate, toggleBookmark);

module.exports = router;
