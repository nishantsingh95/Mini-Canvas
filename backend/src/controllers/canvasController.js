const mongoose = require('mongoose');
const Canvas = require('../models/Canvas');

// @desc    Create a new canvas
// @route   POST /api/canvases
// @access  Public / Authenticated
exports.createCanvas = async (req, res, next) => {
  try {
    const { name, width, height, backgroundColor, elements, thumbnail, description, isPublic } = req.body;

    const canvasData = {
      name: name || 'Untitled Canvas',
      width: width || 1200,
      height: height || 800,
      backgroundColor: backgroundColor || '#ffffff',
      elements: Array.isArray(elements) ? elements : [],
      thumbnail: thumbnail || '',
      description: description || '',
      isPublic: Boolean(isPublic),
    };

    // Attach user as owner if logged in
    if (req.user) {
      canvasData.owner = req.user._id;
    }

    const canvas = await Canvas.create(canvasData);

    res.status(201).json({
      success: true,
      data: canvas,
      message: 'Canvas created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get canvases (filtered by owner if authenticated)
// @route   GET /api/canvases
// @access  Public / Authenticated
exports.getAllCanvases = async (req, res, next) => {
  try {
    let query = {};

    if (req.user) {
      // Authenticated user: show their own canvases + any public ones
      query = {
        $or: [
          { owner: req.user._id },
          { isPublic: true },
        ],
      };
    } else {
      // Guest: show unowned or public canvases
      query = {
        $or: [
          { owner: null },
          { isPublic: true },
        ],
      };
    }

    const canvases = await Canvas.find(query)
      .select('name width height backgroundColor thumbnail createdAt updatedAt elements owner isPublic')
      .sort({ updatedAt: -1 });

    const formatted = canvases.map((canvas) => ({
      id: canvas._id,
      name: canvas.name,
      width: canvas.width,
      height: canvas.height,
      backgroundColor: canvas.backgroundColor,
      elementCount: canvas.elements ? canvas.elements.length : 0,
      thumbnail: canvas.thumbnail,
      owner: canvas.owner,
      isOwnedByMe: req.user ? canvas.owner?.toString() === req.user._id.toString() : !canvas.owner,
      isPublic: canvas.isPublic,
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
// @access  Public / Authenticated
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

    // Access control: if canvas has owner and isn't public, verify requester is owner
    if (
      canvas.owner &&
      !canvas.isPublic &&
      (!req.user || canvas.owner.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this canvas',
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
// @access  Public / Authenticated
exports.updateCanvas = async (req, res, next) => {
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

    // Access control: if canvas has owner, only owner can update
    if (
      canvas.owner &&
      (!req.user || canvas.owner.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this canvas',
      });
    }

    // If canvas was previously unowned and a logged-in user saves it, claim ownership
    if (!canvas.owner && req.user) {
      canvas.owner = req.user._id;
    }

    const { name, width, height, backgroundColor, elements, thumbnail, description, isPublic } = req.body;

    if (name !== undefined) canvas.name = name;
    if (width !== undefined) canvas.width = width;
    if (height !== undefined) canvas.height = height;
    if (backgroundColor !== undefined) canvas.backgroundColor = backgroundColor;
    if (elements !== undefined) canvas.elements = elements;
    if (thumbnail !== undefined) canvas.thumbnail = thumbnail;
    if (description !== undefined) canvas.description = description;
    if (isPublic !== undefined) canvas.isPublic = isPublic;

    await canvas.save();

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
// @access  Public / Authenticated
exports.deleteCanvas = async (req, res, next) => {
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

    // Access control: if canvas has owner, only owner can delete
    if (
      canvas.owner &&
      (!req.user || canvas.owner.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this canvas',
      });
    }

    await Canvas.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: { id: canvas._id },
      message: 'Canvas deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
