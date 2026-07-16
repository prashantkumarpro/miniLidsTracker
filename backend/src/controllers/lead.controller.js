const Lead = require('../models/lead.model');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create a new lead.
 * POST /api/v1/leads
 */
const createLead = asyncHandler(async (req, res) => {
  const { name, phone, status } = req.body;

  const newLead = new Lead({
    name,
    phone,
    status
  });

  const savedLead = await newLead.save();

  return ApiResponse.success(res, 'Lead created successfully', savedLead, 201);
});

/**
 * Get all leads with search, filter, pagination, and summary stats.
 * GET /api/v1/leads
 */
const getLeads = asyncHandler(async (req, res) => {
  const { q, status, page = 1, limit = 10 } = req.query;

  // Construct query object
  const query = {};

  // Status filter
  if (status && status !== 'All') {
    query.status = status;
  }

  // Name or phone search (case-insensitive partial match)
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } }
    ];
  }

  // Pagination parameters
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  // Fetch leads (newest first)
  const leads = await Lead.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Total matching records
  const total = await Lead.countDocuments(query);

  // Aggregate stats across ALL leads (not filtered by current page/status/search query)
  const statsAggregation = await Lead.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Format stats with default zeros
  const stats = {
    total: await Lead.countDocuments({}),
    New: 0,
    Contacted: 0,
    Interested: 0,
    Converted: 0,
    Lost: 0
  };

  statsAggregation.forEach((item) => {
    if (item._id && Object.prototype.hasOwnProperty.call(stats, item._id)) {
      stats[item._id] = item.count;
    }
  });

  return ApiResponse.success(res, 'Leads retrieved successfully', {
    leads,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    },
    stats
  });
});

/**
 * Get a single lead by ID (includes notes).
 * GET /api/v1/leads/:id
 */
const getLeadById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lead = await Lead.findById(id);
  if (!lead) {
    return ApiResponse.error(res, 'Lead not found', [], 404);
  }

  return ApiResponse.success(res, 'Lead retrieved successfully', lead);
});

/**
 * Update a lead by ID.
 * PATCH /api/v1/leads/:id
 */
const updateLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, phone, status } = req.body;

  const lead = await Lead.findById(id);
  if (!lead) {
    return ApiResponse.error(res, 'Lead not found', [], 404);
  }

  // Update fields if provided
  if (name !== undefined) lead.name = name;
  if (phone !== undefined) lead.phone = phone;
  if (status !== undefined) lead.status = status;

  const updatedLead = await lead.save();

  return ApiResponse.success(res, 'Lead updated successfully', updatedLead);
});

/**
 * Add a note to a lead.
 * POST /api/v1/leads/:id/notes
 */
const addNoteToLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const lead = await Lead.findById(id);
  if (!lead) {
    return ApiResponse.error(res, 'Lead not found', [], 404);
  }

  // Add the note
  lead.notes.push({ text });
  await lead.save();

  // Return the updated lead with all notes
  return ApiResponse.success(res, 'Note added successfully', lead);
});

/**
 * Delete a lead by ID.
 * DELETE /api/v1/leads/:id
 */
const deleteLead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    return ApiResponse.error(res, 'Lead not found', [], 404);
  }

  return ApiResponse.success(res, 'Lead deleted successfully', {});
});

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  addNoteToLead,
  deleteLead
};
