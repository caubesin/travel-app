const express = require('express');
const router = express.Router();
const controller = require('../controller/records_ctrl');

router.get('/destinations', controller.getDestinations);
router.get('/city/destinations', controller.findCityToGetDestinations);
router.get('/hotels/byCity/:cityName', controller.getHotelByCity);
router.get('/hotels/byIdOnCity/:id', controller.getHotelsByIdOnCity);
router.post('/select/geo', controller.getGeoBySelect);

module.exports = router;