const express = require('express');
const router = express.Router();
const regionController = require('../../controller/regionController');

router.get('/getAllCities', regionController.getAllCities);
router.get('/getSpecificCity/:city', regionController.getSpecificCity);
router.get(
    '/getLatLongFromPostcode/:postcode',
    regionController.getLatLongFromPostcode
);
router.get('/getAroundCities/:postcode', regionController.getAroundCities);
module.exports = router;
