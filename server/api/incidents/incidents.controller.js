/*jslint node: true, nomen: true */
'use strict';

var _ = require('lodash');
var Incident = require('./incident.model');

function handleError(res, err) {
    return res.send(500, err);
}

// Get list of incidents
exports.index = function (req, res) {
    Incident.find(function (err, incidents) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, incidents);
    });
};

// Get a single thing
exports.show = function (req, res) {
    Incident.findById(req.params.id, function (err, thing) {
        if (err) {
            return handleError(res, err);
        }
        if (!thing) {
            return res.send(404);
        }
        return res.json(thing);
    });
};

exports.showYear = function (req, res) {
    Incident.find(req.params.year, 'lat lon offense year', function (err, incidents) {
        if (err) {
            return handleError(res, err);
        }

        if (!incidents) {
            return res.send(404);
        }

        return res.json(incidents);
    });
};
