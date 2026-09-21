const express = require('express');
const router = express.Router();
const {
  createCanvas,
  getAllCanvases,
  getCanvasById,
  updateCanvas,
  deleteCanvas,
} = require('../controllers/canvasController');
const { optionalAuth } = require('../middleware/authMiddleware');

// Apply optionalAuth to all canvas routes so logged-in users get ownership & filtering
router.use(optionalAuth);

router.route('/')
  .post(createCanvas)
  .get(getAllCanvases);

router.route('/:id')
  .get(getCanvasById)
  .put(updateCanvas)
  .delete(deleteCanvas);

module.exports = router;
