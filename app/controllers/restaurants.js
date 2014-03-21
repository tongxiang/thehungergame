'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Restaurant = mongoose.model('Restaurant'),
    _ = require('lodash');


/**
 * Find restaurant by id
 */
exports.restaurant = function(req, res, next, id) {
    Restaurant.load(id, function(err, restaurant) {
        if (err) return next(err);
        if (!restaurant) return next(new Error('Failed to load restaurant ' + id));
        req.restaurant = restaurant;
        next();
    });
};

/**
 * Create an restaurant
 */
exports.create = function(req, res) {
    var restaurant = new Restaurant(req.body);
    restaurant.user = req.user;

    restaurant.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                restaurant: restaurant
            });
        } else {
            res.jsonp(restaurant);
        }
    });
};

/**
 * Update an restaurant
 */
exports.update = function(req, res) {
    var restaurant = req.restaurant;

    restaurant = _.extend(restaurant, req.body);

    restaurant.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                restaurant: restaurant
            });
        } else {
            res.jsonp(restaurant);
        }
    });
};

/**
 * Delete an restaurant
 */
exports.destroy = function(req, res) {
    var restaurant = req.restaurant;

    restaurant.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                restaurant: restaurant
            });
        } else {
            res.jsonp(restaurant);
        }
    });
};

/**
 * Show an restaurant
 */
exports.show = function(req, res) {
    res.jsonp(req.restaurant);
};

/**
 * List of restaurants
 */
exports.all = function(req, res) {
    Restaurant.find().sort('-created').populate('user', 'name username').exec(function(err, restaurants) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(restaurants);
        }
    });
};
