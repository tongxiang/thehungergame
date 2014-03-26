'use strict';

// restaurants routes use restaurants controller
var restaurants = require('../controllers/restaurants');
var authorization = require('./middlewares/authorization');
var foursquare = require('../controllers/foursquare')

// restaurant authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.restaurant.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/restaurants/latitudeLongitude', foursquare.foursquareQuery);
    
    app.get('/restaurants', restaurants.all);
    app.post('/restaurants', authorization.requiresLogin, restaurants.create);
    app.get('/restaurants/:restaurantId', restaurants.show);
    app.put('/restaurants/:restaurantId', authorization.requiresLogin, hasAuthorization, restaurants.update);
    app.del('/restaurants/:restaurantId', authorization.requiresLogin, hasAuthorization, restaurants.destroy);

    // Finish with setting up the restaurantId param
    app.param('restaurantId', restaurants.restaurant);
};
