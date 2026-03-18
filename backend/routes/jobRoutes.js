const express = require('express');
const { getJobs, createJob, searchJobs, toggleBookmark, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getJobs).post(protect, createJob);
router.route('/:id').delete(protect, deleteJob);
router.get('/search', searchJobs);
router.put('/:id/bookmark', toggleBookmark);

module.exports = router;
