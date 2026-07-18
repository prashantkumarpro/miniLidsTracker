const mongoose = require('mongoose');
const { LEAD_STATUSES } = require('../constants/leadStatus');

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 500
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false } // Only need createdAt for notes
  }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 16
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit phone number!`
      }
    },
    status: {
      type: String,
      required: true,
      enum: LEAD_STATUSES,
      default: 'New'
    },
    notes: [noteSchema]
  },
  {
    timestamps: true
  }
);

// Indexes for faster search and filtering
leadSchema.index({ name: 'text' }); // Text index or prefix index. Let's do simple indexes.
leadSchema.index({ phone: 1 }, { unique: true });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema, 'tracker_leads');

module.exports = Lead;
