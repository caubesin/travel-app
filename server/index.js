require('dotenv').config();
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const couchbase = require('couchbase');

    couchbase.connect('couchbase://10.233.6.250', {
    //process.env.CLUSTER, process.env.CLUSTER_PASSWORD dùng để lấy biến CLUSTER, CLUSTER_PASSWORD trong file .env
        username: process.env.CLUSTER,
        password: process.env.CLUSTER_PASSWORD,
    }).then((cluster) => {
        app.locals.couchbase = couchbase;
        app.locals.cluster = cluster;
        app.locals.travel = cluster.bucket('travel-sample');
        app.locals.eventing = cluster.bucket('eventing');
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static(path.join(__dirname, '../client')));

//Config cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

//Route
const records = require('./routers/records');
const events = require('./routers/events');
app.use('/records', records);
app.use('/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
   
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//Server listen
http.createServer(app).listen(process.env.PORT, () => {
    //process.env.PORT dùng để lấy biến PORT trong file .env
    console.log(`Server Listening on http://localhost:${process.env.PORT}`)
})