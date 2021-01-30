const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');
const authController = require('../controllers/authController');

router.post('/', committeeController.createCommittee);
router.get('/:id', committeeController.getSingleCommittee);
router.patch('/:id', committeeController.updateCommittee);

module.exports = router