const mongoose = require('mongoose');
const Canvas = require('../models/Canvas');

// @desc    Create a new canvas
// @route   POST /api/canvases
// @access  Public
exports.createCanvas = async (req, res, next) => {
  try {
    const { name, width, height, backgroundColor, elements, thumbnail, description } = req.body;

    const canvas = await Canvas.create({
      name: name || 'Untitled Canvas',
      width: width || 1200,
      height: height || 800,
      backgroundColor: backgroundColor || '#ffffff',
      elements: Array.isArray(elements) ? elements : [],
      thumbnail: thumbnail || '',
      description: description || '',
    });

    res.status(201).json({
      success: true,
      data: canvas,
      message: 'Canvas created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all canvases (metadata summary for list view)
// @route   GET /api/canvases
// @access  Public
exports.getAllCanvases = async (req, res, next) => {
  try {
    const canvases = await Canvas.find()
      .select('name width height backgroundColor thumbnail createdAt updatedAt elements')
      .sort({ updatedAt: -1 });

    const formatted = canvases.map((canvas) => ({
      id: canvas._id,
      name: canvas.name,
      width: canvas.width,
      height: canvas.height,
      backgroundColor: canvas.backgroundColor,
      elementCount: canvas.elements ? canvas.elements.length : 0,
      thumbnail: canvas.thumbnail,
      createdAt: canvas.createdAt,
      updatedAt: canvas.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single canvas by ID
// @route   GET /api/canvases/:id
// @access  Public
exports.getCanvasById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid canvas ID format',
      });
    }

    const canvas = await Canvas.findById(id);

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: `Canvas with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: canvas,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing canvas
// @route   PUT /api/canvases/:id
// @access  Public
exports.updateCanvas = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid canvas ID format',
      });
    }

    const { name, width, height, backgroundColor, elements, thumbnail, description } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (width !== undefined) updateData.width = width;
    if (height !== undefined) updateData.height = height;
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor;
    if (elements !== undefined) updateData.elements = elements;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (description !== undefined) updateData.description = description;

    const canvas = await Canvas.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: `Canvas with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: canvas,
      message: 'Canvas updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a canvas
// @route   DELETE /api/canvases/:id
// @access  Public
exports.deleteCanvas = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid canvas ID format',
      });
    }

    const canvas = await Canvas.findByIdAndDelete(id);

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: `Canvas with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: { id: canvas._id },
      message: 'Canvas deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
