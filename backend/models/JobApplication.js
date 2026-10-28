const mongoose = require('mongoose');

// Allowed status values and transition graph
const STATUS_ENUM = ['Applied', 'Interview', 'Offer', 'Accepted', 'Declined', 'Rejected'];
const FINAL_STATUSES = ['Accepted', 'Declined', 'Rejected'];

const ALLOWED_TRANSITIONS = {
  Applied: ['Interview', 'Rejected'],
  Interview: ['Offer', 'Rejected'],
  Offer: ['Accepted', 'Declined'],
  Accepted: [],
  Declined: [],
  Rejected: [],
};

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: STATUS_ENUM,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: true }
);

const jobApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: [true, 'Application ID is required'],
      unique: true,
      trim: true,
      match: [/^JA-[A-Z0-9]{3}-\d{3}$/, 'Invalid Application ID format'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [1, 'Company name cannot be empty'],
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      minlength: [1, 'Job role cannot be empty'],
    },
    jobType: {
      type: String,
      required: [true, 'Job type is required'],
      enum: {
        values: ['Full-time', 'Internship', 'Contract'],
        message: '{VALUE} is not a supported job type',
      },
    },
    appliedDate: {
      type: Date,
      required: [true, 'Applied date is required'],
      validate: {
        validator: function (value) {
          if (!value) return false;
          // Disallow future dates (allowing 1 minute tolerance for clock drifts)
          const toleranceDate = new Date(Date.now() + 60 * 1000);
          return new Date(value) <= toleranceDate;
        },
        message: 'Applied date cannot be a future date',
      },
    },
    expectedSalary: {
      type: Number,
      min: [0, 'Expected salary must be non-negative'],
      default: null,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: STATUS_ENUM,
      default: 'Applied',
    },
    followUpDate: {
      type: Date,
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to evaluate overdue status dynamically
jobApplicationSchema.virtual('isOverdue').get(function () {
  if (this.status !== 'Applied') {
    return false;
  }
  if (!this.followUpDate) {
    return false;
  }
  return new Date() > new Date(this.followUpDate);
});

// Calculate followUpDate (Applied Date + 7 days) and seed initial history before validation
jobApplicationSchema.pre('validate', function (next) {
  if (this.appliedDate) {
    const applied = new Date(this.appliedDate);
    const followUp = new Date(applied.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.followUpDate = followUp;
  }

  // Seed initial status history entry for newly created applications
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: 'Applied',
        changedAt: this.appliedDate ? new Date(this.appliedDate) : new Date(),
        notes: 'Initial job application submission',
      },
    ];
  }

  next();
});

// Export constants alongside model for centralized rule consistency
module.exports = {
  JobApplication: mongoose.model('JobApplication', jobApplicationSchema),
  STATUS_ENUM,
  FINAL_STATUSES,
  ALLOWED_TRANSITIONS,
};
