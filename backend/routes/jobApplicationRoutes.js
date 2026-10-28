const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationStats,
  getApplicationById,
  updateApplication,
  transitionStatus,
  deleteApplication,
} = require('../controllers/jobApplicationController');

// Aggregate statistics route (must be placed before /:id)
router.get('/stats', getApplicationStats);

// Collection routes
router.route('/')
  .get(getApplications)
  .post(createApplication);

// Item specific routes
router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

// Status transition workflow route
router.patch('/:id/status', transitionStatus);

module.exports = router;
