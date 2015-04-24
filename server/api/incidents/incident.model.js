/*jslint node: true */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IncidentSchema = new Schema({
    lat: Number,
    lon: Number,
    offense: String
});

module.exports = mongoose.model('Incident', IncidentSchema);
