
const axios = require('axios');


exports.getDestinations = async (req, res) => {
    const cluster = req.app.locals.cluster;
 
    const query = `SELECT DISTINCT airport.city as name
              FROM \`travel-sample\`.inventory.airport
              INNER JOIN \`travel-sample\`.inventory.hotel
              USE HASH(probe)
              ON hotel.city = airport.city
              WHERE airport.type = 'airport'
              AND hotel.type = 'hotel';`;
    try {
        const result = await cluster.query(query);
        res.json(result);
    }
    catch(err) {
        res.status(500).send({ error: err });
    }
}

exports.findCityToGetDestinations = async (req, res) => {
    const cluster = req.app.locals.cluster;
    const city = req.body.city;
    
    try {
        const queryCity = `SELECT hotel.city as name
        FROM \`travel-sample\`.inventory.hotel
        WHERE hotel.city = \'${city.name}\'`

        const cityResult = await cluster.query(queryCity)
        console.log(cityResult)
        if(cityResult.rows.length !== 0) {
            res.redirect(`/records/hotels/byCity/${city.name}`);
        }
        else {
            const getHotel = async (lat, lng, q) => {
                var newData = [];
                var hotelData = [];
                try {
                  const response = await axios.get(
                    `https://places.ls.hereapi.com/places/v1/discover/search?at=${lat},${lng}&q=${q}&Accept-Language=en-US%2Cen%3Bq%3D0.9&app_id=o7kvU5eZj0W6pyPI8XTE&app_code=IREgYrcIRt37_6WOjOFX-A`
                  );
                  newData = response;
                  hotelData.push(...newData.data.results.items);
                  if (newData.data.results.next) {
                    const response1 = await axios.get(newData.data.results.next);
                    newData = response1;
                    hotelData.push(...newData.data.items);
                    var newDataNext = newData.data.next;
                    while (newDataNext != undefined) {
                      const response2 = await axios.get(newDataNext);
                      newData = response2.data;
                      hotelData.push(...newData.items);
          
                      if (newData.data) {
                        newDataNext = newData.data.next;
                      } else {
                        newDataNext = newData.next;
                      }
                    }
                  }
                  return hotelData;
                } catch (err) {
                  // Handle Error Here
                }
            }
            const hotels = await getHotel(city.lat, city.lon, "hotel");
            const airports = await getHotel(city.lat, city.lon, "airport");
            const addHotel = hotels.map((item) => {
                item = {
                    ...item,
                    city: city.name
                }
                const query = `UPSERT INTO \`travel-sample\`.inventory.hotel (KEY, VALUE) VALUES(\'hotel_${item.id}\', ${JSON.stringify(item)})`;
                return new Promise((resolve, rejects) => {
                    try {
                        resolve(cluster.query(query))
                    }
                    catch(err) {
                        rejects(err)
                    }
                })
            })
            const addAirPort = airports.map((item) => {
                item = {
                    ...item,
                    city: city.name
                }
                const query = `UPSERT INTO \`travel-sample\`.inventory.airport (KEY, VALUE) VALUES(\'airport_${item.id}\', ${JSON.stringify(item)})`;
                return new Promise((resolve, rejects) => {
                    try {
                        resolve(cluster.query(query))
                    }
                    catch(err) {
                        rejects(err)
                    }
                })
            })
            Promise.all[addHotel, addAirPort]
            res.send(await cluster.query(queryCity))
        }
    }
    catch(err) {
        res.status(500).send({ error: err });
    }
}

exports.getHotelByCity = async (req, res) => {
    const cluster = req.app.locals.cluster;

    const query = `SELECT DISTINCT *
        FROM \`travel-sample\`.inventory.hotel
        INNER JOIN \`travel-sample\`.inventory.airport
        USE HASH(probe)
        ON hotel.city = airport.city
        WHERE hotel.city = '${req.params.cityName}'
        LIMIT 5`;

    try {
        const result = await cluster.query(query);
        res.json(result);
    }
    catch(err) {
        res.status(500).send({ error: err });
    }
}

exports.getHotelsByIdOnCity = async (req, res) => {
    const cluster = req.app.locals.cluster;
 
    /*const query = `SELECT hotel.name, hotel.address, airport.name, airport.icao, hotel.geo
              FROM \`travel-sample\`.inventory.airport
              INNER JOIN \`travel-sample\`.inventory.hotel
                ON hotel.type = 'hotel' AND hotel.city = airport.city
              WHERE airport.type = 'airport'
                AND airport.city = '${req.params.id}'
              LIMIT 5;`;*/
    const query = `SELECT * FROM \`travel-sample\`.inventory.hotel WHERE hotel.id = ${req.params.id}`
    try {
        const result = await cluster.query(query);
        res.json(result);
    }
    catch(err) {
        res.status(500).send({ error: err });
    }
}

exports.getGeoBySelect = async (req, res) => {
    const cluster = req.app.locals.cluster;
    const location = JSON.stringify(req.body);
    console.log(location);
    const query = `UPSERT INTO \`travel-sample\` (KEY, VALUE) VALUES('trigger', ${location})`;
 
    try {
        const result = await cluster.query(query);
        res.json(result);
    }
    catch(err) {
        res.status(500).send({ error: err });
    }
}