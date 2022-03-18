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

exports.getHotelByCity = async (req, res) => {
    const cluster = req.app.locals.cluster;

    const query = `SELECT DISTINCT *
        FROM \`travel-sample\`.inventory.hotel
        INNER JOIN \`travel-sample\`.inventory.airport
        USE HASH(probe)
        ON hotel.city = airport.city
        WHERE hotel.city = '${req.params.cityName}'
        LIMIT 30`;

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