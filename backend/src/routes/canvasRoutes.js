const express = require('express');
const router = express.Router();
const {
  createCanvas,
  getAllCanvases,
  getCanvasById,
  updateCanvas,
  deleteCanvas,
} = require('../controllers/canvasController');

router.route('/')
  .post(createCanvas)
  .get(getAllCanvases);

router.route('/:id')
  .get(getCanvasById)
  .put(updateCanvas)
  .delete(deleteCanvas);

module.exports = router;
