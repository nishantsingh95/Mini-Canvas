const mongoose = require('mongoose');

const ElementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['rect', 'circle', 'text'],
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 120,
    },
    height: {
      type: Number,
      default: 80,
    },
    radius: {
      type: Number,
      default: 50,
    },
    rotation: {
      type: Number,
      default: 0,
    },
    scaleX: {
      type: Number,
      default: 1,
    },
    scaleY: {
      type: Number,
      default: 1,
    },
    fill: {
      type: String,
      default: '#3b82f6',
    },
    stroke: {
      type: String,
      default: '#1e293b',
    },
    strokeWidth: {
      type: Number,
      default: 0,
    },
    opacity: {
      type: Number,
      default: 1,
      min: 0,
      max: 1,
    },
    cornerRadius: {
      type: Number,
      default: 0,
    },
    // Text-specific properties
    text: {
      type: String,
      default: 'Double click to edit',
    },
    fontSize: {
      type: Number,
      default: 24,
    },
    fontFamily: {
      type: String,
      default: 'Inter',
    },
    fontWeight: {
      type: String,
      default: '600',
    },
    fontStyle: {
      type: String,
      default: 'normal',
    },
    align: {
      type: String,
      default: 'left',
    },
    // Layer and state flags
    zIndex: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const CanvasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Canvas name is required'],
      trim: true,
      maxlength: [100, 'Canvas name cannot exceed 100 characters'],
      default: 'Untitled Canvas',
    },
    width: {
      type: Number,
      default: 1200,
      min: 100,
      max: 8000,
    },
    height: {
      type: Number,
      default: 800,
      min: 100,
      max: 8000,
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    elements: {
      type: [ElementSchema],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for element count
CanvasSchema.virtual('elementCount').get(function () {
  return this.elements ? this.elements.length : 0;
});

// Configure toJSON to include virtuals and format _id as id
CanvasSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Canvas', CanvasSchema);
