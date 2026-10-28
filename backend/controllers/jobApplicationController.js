const {
  JobApplication,
  STATUS_ENUM,
  FINAL_STATUSES,
  ALLOWED_TRANSITIONS,
} = require('../models/JobApplication');
const { generateApplicationId } = require('../utils/idGenerator');

// Utility to escape regex special characters
const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

/**
 * @desc    Create a new job application
 * @route   POST /api/applications
 * @access  Public
 */
const createApplication = async (req, res) => {
  try {
    const { company, role, jobType, appliedDate, expectedSalary, notes } = req.body;

    // Field validations
    if (!company || !company.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required.',
        data: null,
      });
    }

    if (!role || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Job role is required.',
        data: null,
      });
    }

    if (!jobType) {
      return res.status(400).json({
        success: false,
        message: 'Job type is required (Full-time, Internship, or Contract).',
        data: null,
      });
    }

    if (!appliedDate) {
      return res.status(400).json({
        success: false,
        message: 'Applied date is required.',
        data: null,
      });
    }

    const appliedDateTime = new Date(appliedDate);
    const toleranceFuture = new Date(Date.now() + 60 * 1000);
    if (isNaN(appliedDateTime.getTime()) || appliedDateTime > toleranceFuture) {
      return res.status(400).json({
        success: false,
        message: 'Applied date cannot be a future date.',
        data: null,
      });
    }

    const trimmedCompany = company.trim();
    const trimmedRole = role.trim();

    // Duplicate Check: Same Company and Job Role (case-insensitive) cannot be added if active
    const activeDuplicate = await JobApplication.findOne({
      company: { $regex: new RegExp(`^${escapeRegex(trimmedCompany)}$`, 'i') },
      role: { $regex: new RegExp(`^${escapeRegex(trimmedRole)}$`, 'i') },
      status: { $nin: FINAL_STATUSES },
    });

    if (activeDuplicate) {
      return res.status(409).json({
        success: false,
        message: `An active application for "${trimmedCompany}" as "${trimmedRole}" already exists (${activeDuplicate.applicationId} - ${activeDuplicate.status}). Wait for its completion or apply for a different role.`,
        data: null,
      });
    }

    // Auto-generate company-scoped ID (client cannot override)
    const applicationId = await generateApplicationId(JobApplication, trimmedCompany);

    // Compute follow up date (7 days after applied date)
    const followUpDate = new Date(appliedDateTime.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newApplication = new JobApplication({
      applicationId,
      company: trimmedCompany,
      role: trimmedRole,
      jobType,
      appliedDate: appliedDateTime,
      expectedSalary: expectedSalary !== undefined && expectedSalary !== '' ? Number(expectedSalary) : null,
      notes: notes ? notes.trim() : '',
      status: 'Applied',
      followUpDate,
      statusHistory: [
        {
          status: 'Applied',
          changedAt: appliedDateTime,
          notes: 'Application submitted',
        },
      ],
    });

    const savedApplication = await newApplication.save();

    return res.status(201).json({
      success: true,
      message: 'Job application created successfully.',
      data: savedApplication,
    });
  } catch (error) {
    console.error('Error in createApplication:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while creating application.',
      data: null,
    });
  }
};

/**
 * @desc    Get all job applications with status filter and company search
 * @route   GET /api/applications
 * @access  Public
 */
const getApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    // Filter by Status query parameter
    if (status && status !== 'all' && STATUS_ENUM.includes(status)) {
      filter.status = status;
    }

    // Search by Company query parameter (case-insensitive substring)
    if (search && search.trim() !== '') {
      filter.company = { $regex: new RegExp(escapeRegex(search.trim()), 'i') };
    }

    const applications = await JobApplication.find(filter)
      .sort({ appliedDate: -1, createdAt: -1 })
      .lean({ virtuals: true });

    return res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully.',
      data: applications,
    });
  } catch (error) {
    console.error('Error in getApplications:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving applications.',
      data: null,
    });
  }
};

/**
 * @desc    Get aggregate metrics/counts of applications per status
 * @route   GET /api/applications/stats
 * @access  Public
 */
const getApplicationStats = async (req, res) => {
  try {
    const now = new Date();

    const counts = {
      total: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      accepted: 0,
      declined: 0,
      rejected: 0,
      overdue: 0,
    };

    const allApps = await JobApplication.find({}, { status: 1, followUpDate: 1 }).lean();

    allApps.forEach((app) => {
      counts.total += 1;
      const lowerStatus = app.status.toLowerCase();
      if (counts[lowerStatus] !== undefined) {
        counts[lowerStatus] += 1;
      }

      if (app.status === 'Applied' && app.followUpDate && now > new Date(app.followUpDate)) {
        counts.overdue += 1;
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Application statistics retrieved successfully.',
      data: counts,
    });
  } catch (error) {
    console.error('Error in getApplicationStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while calculating statistics.',
      data: null,
    });
  }
};

/**
 * @desc    Get a single application by ID or Application ID
 * @route   GET /api/applications/:id
 * @access  Public
 */
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    let application = null;
    if (id.startsWith('JA-')) {
      application = await JobApplication.findOne({ applicationId: id });
    } else {
      application = await JobApplication.findById(id);
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Application retrieved successfully.',
      data: application,
    });
  } catch (error) {
    console.error('Error in getApplicationById:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching application.',
      data: null,
    });
  }
};

/**
 * @desc    Edit application details (Company, Role, Job Type, Salary, Notes)
 *          Application ID and Applied Date are immutable.
 * @route   PUT /api/applications/:id
 * @access  Public
 */
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, role, jobType, expectedSalary, notes } = req.body;

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
        data: null,
      });
    }

    // Ensure company and role are provided
    const newCompany = company !== undefined ? company.trim() : application.company;
    const newRole = role !== undefined ? role.trim() : application.role;

    if (!newCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company name cannot be empty.',
        data: null,
      });
    }

    if (!newRole) {
      return res.status(400).json({
        success: false,
        message: 'Job role cannot be empty.',
        data: null,
      });
    }

    // Duplicate check if company or role has changed
    const companyChanged = newCompany.toLowerCase() !== application.company.toLowerCase();
    const roleChanged = newRole.toLowerCase() !== application.role.toLowerCase();

    if (companyChanged || roleChanged) {
      const activeDuplicate = await JobApplication.findOne({
        _id: { $ne: application._id },
        company: { $regex: new RegExp(`^${escapeRegex(newCompany)}$`, 'i') },
        role: { $regex: new RegExp(`^${escapeRegex(newRole)}$`, 'i') },
        status: { $nin: FINAL_STATUSES },
      });

      if (activeDuplicate) {
        return res.status(409).json({
          success: false,
          message: `Cannot update: An active application for "${newCompany}" as "${newRole}" already exists (${activeDuplicate.applicationId} - ${activeDuplicate.status}).`,
          data: null,
        });
      }
    }

    // Update allowed fields only (Application ID and Applied Date are strictly immutable)
    application.company = newCompany;
    application.role = newRole;
    if (jobType) application.jobType = jobType;
    application.expectedSalary =
      expectedSalary !== undefined && expectedSalary !== '' ? Number(expectedSalary) : null;
    if (notes !== undefined) application.notes = notes.trim();

    const updated = await application.save();

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error in updateApplication:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while updating application.',
      data: null,
    });
  }
};

/**
 * @desc    Transition status according to strict state machine rules
 * @route   PATCH /api/applications/:id/status
 * @access  Public
 */
const transitionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: nextStatus, notes } = req.body;

    if (!nextStatus) {
      return res.status(400).json({
        success: false,
        message: 'New status is required.',
        data: null,
      });
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
        data: null,
      });
    }

    const currentStatus = application.status;

    // Check if current status is final
    if (FINAL_STATUSES.includes(currentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Status "${currentStatus}" is final and cannot be modified further.`,
        data: null,
      });
    }

    // Validate transition
    const validTransitions = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!validTransitions.includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition from "${currentStatus}" to "${nextStatus}". Allowed transitions are: ${
          validTransitions.length > 0 ? validTransitions.join(', ') : 'None (Terminal state)'
        }.`,
        data: null,
      });
    }

    // Update status and append to timeline history
    application.status = nextStatus;
    application.statusHistory.push({
      status: nextStatus,
      changedAt: new Date(),
      notes: notes ? notes.trim() : `Status progressed to ${nextStatus}`,
    });

    const updatedApplication = await application.save();

    return res.status(200).json({
      success: true,
      message: `Application status successfully moved to "${nextStatus}".`,
      data: updatedApplication,
    });
  } catch (error) {
    console.error('Error in transitionStatus:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while transitioning status.',
      data: null,
    });
  }
};

/**
 * @desc    Delete an application if status is 'Applied' or in final status.
 *          Applications in 'Interview' or 'Offer' cannot be deleted.
 * @route   DELETE /api/applications/:id
 * @access  Public
 */
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
        data: null,
      });
    }

    // Delete Safeguard Rule:
    // "An application can be deleted only if its status is Applied or in a final status.
    // Applications in Interview or Offer status must not be deleted, and the backend must return an error in that case."
    if (application.status === 'Interview' || application.status === 'Offer') {
      return res.status(400).json({
        success: false,
        message: `Applications in "${application.status}" status cannot be deleted. Delete is only permitted for "Applied" or final statuses (Accepted, Declined, Rejected).`,
        data: null,
      });
    }

    await JobApplication.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Application ${application.applicationId} was deleted successfully.`,
      data: {
        id: application._id,
        applicationId: application.applicationId,
      },
    });
  } catch (error) {
    console.error('Error in deleteApplication:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting application.',
      data: null,
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationStats,
  getApplicationById,
  updateApplication,
  transitionStatus,
  deleteApplication,
};
