const {Client} =  require("@googlemaps/google-maps-services-js");  

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('a user connected');
    const client = new Client({});
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  //{ lat: 45, lng: -110 }
    socket.on("selectGeo", (geo) => {
      client.placesNearby({
        params: {
          location: geo.location,
          key: process.env.GOOGLE_MAP_KEY,
          type: geo.type,
          radius: geo.radius
        },
        timeout: 1000, // milliseconds
      })
      .then((r) => {
          //console.log(r.data.results);
          io.emit("getGeo", {
            data: r.data.results
          })
          //res.send(r.data.results[0].elevation)
  
      })
      .catch((e) => {
          console.log(e);
          //res.send(e.response.data.error_message)
      });
    })
  });
}
