'use strict';


module.exports = function(app) {

    // Home route, Foursquare route
    var index = require('../controllers/index');
    var foursquare = require('../controllers/foursquare');
    app.get('/', index.render);
    app.get('/venues', foursquare.foursquareQuery);
};
