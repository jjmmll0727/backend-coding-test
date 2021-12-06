const express = require('express');
const router = express.Router();
const storeController = require('../../controller/storeController');

router.get('/AllStores', storeController.getAllStores);
router.get('/SpecificStore/:store', storeController.getSpecificStore);
router.get(
    '/LatLongFromPostcode/:postcode',
    storeController.getLatLongFromPostcode
);
router.get('/AroundStores/:postcode', storeController.getAroundStores);

module.exports = router;
