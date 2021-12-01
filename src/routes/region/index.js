const express = require('express');
const router = express.Router();
const regionController = require('../../controller/regionController');

router.get('/getAllCities', regionController.getAllCities);
router.get('/getSpecificCity/:city', regionController.getSpecificCity);

module.exports = router;
