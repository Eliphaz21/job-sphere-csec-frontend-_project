const express = require('express');
const { getJobs, createJob, searchJobs, updateJob, toggleBookmark, deleteJob } = require('../controllers/jobController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/search', searchJobs);
router.route('/')
  .get(getJobs)
  .post(protect, adminOnly, createJob);

router.route('/:id')
  .put(protect, adminOnly, updateJob)
  .delete(protect, adminOnly, deleteJob);

router.put('/:id/bookmark', toggleBookmark);

module.exports = router;
