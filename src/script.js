'use strict';

var symbol = require('./symbol.js');
var tokml = require('tokml');
var fs = require('fs');
var et = require('elementtree');


exports.fromGeoJson = function(geojson, fileName, options, callback) {
    var kmlGeoJson = JSON.parse(JSON.stringify(geojson));
    var kmlContent = tokml(kmlGeoJson, {
        name: options && 'name' in options ? options.name : 'name'
    });

    if(options && 'symbol' in options) {
        // Assume there is only one geometry type in the geojson
        kmlContent = symbol.addTo(kmlContent,
                                  geojson.features[0].geometry.type,
                                  options.symbol);
    }

    fs.writeFile(fileName, kmlContent, function(err) {
        if(!callback) { return; }
        callback(err, fileName);
    });
};
