const express = require('express');
const router = express.Router();
const regionController = require('../../controller/regionController')

router.get('/getCities', regionController.getCities);


module.exports = router;