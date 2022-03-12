exports.getDestinations = async (req, res) => {
    const cluster = req.app.locals.cluster;
 
    /*const query = `SELECT DISTINCT airport.city as name
              FROM \`travel-sample\` airport
              INNER JOIN \`travel-sample\` hotel
              USE HASH(probe)
              ON hotel.city = airport.city
              WHERE airport.type = 'airport'
              AND hotel.type = 'hotel';`;*/
    const query = `SELECT * FROM default:\`travel-sample\`.inventory.hotel`;
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
 
    const query = `SELECT hotel.name, hotel.address, airport.name, airport.icao, hotel.geo
              FROM \`travel-sample\` airport
              INNER JOIN \`travel-sample\` hotel
                ON hotel.type = 'hotel' AND hotel.city = airport.city
              WHERE airport.type = 'airport'
                AND airport.city = '${req.params.id}'
              LIMIT 5;`;
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
 
    const query = `UPSERT INTO 'travel-sample' (KEY, VALUE) VALUES('trigger', ${location})`;
 
    try {
        const result = await cluster.query(query);
        res.json(result);
    }
    catch(err) {
        res.status(500).send({ error: err });
    }
}