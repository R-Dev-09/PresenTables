const express = require('express');
const PresentController = require('../controllers/present');

const router = express.Router();

router.post('/', PresentController.createPresentable);
router.get('/', PresentController.getPresentables);
router.delete('/:presId', PresentController.deletePresentable);
router.put('/:presId', PresentController.updatePresentable);

module.exports = router;
