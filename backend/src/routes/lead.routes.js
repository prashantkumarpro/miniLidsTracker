const express = require('express');
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  addNoteToLead,
  deleteLead
} = require('../controllers/lead.controller');
const verifyToken = require('../middlewares/auth.middleware');
const {
  createLeadValidator,
  updateLeadValidator,
  createNoteValidator
} = require('../validators/lead.validator');
const validate = require('../middlewares/validation.middleware');

const router = express.Router();

// Apply auth middleware to protect all lead routes
router.use(verifyToken);

// Create Lead and List Leads
router
  .route('/')
  .post(createLeadValidator, validate, createLead)
  .get(getLeads);

// Individual Lead CRUD Operations
router
  .route('/:id')
  .get(getLeadById)
  .patch(updateLeadValidator, validate, updateLead)
  .delete(deleteLead);

// Add notes to a Lead
router.route('/:id/notes').post(createNoteValidator, validate, addNoteToLead);

module.exports = router;
