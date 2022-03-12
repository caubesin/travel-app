const express = require('express');
const router = express.Router();
const controller = require('../controller/records_ctrl');

router.get('/destinations', controller.getDestinations);
router.get('/hotels/byCity/:id', controller.getHotelsByIdOnCity);
router.get('/select/geo', controller.getGeoBySelect);

module.exports = router;