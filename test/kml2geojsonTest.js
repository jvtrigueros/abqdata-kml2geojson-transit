/**
 * Author: Jose V. Trigueros
 */
var kml2geojson = require('../kml2geojson').kml2geojson
  , should = require('should')
  , request = require('superagent').agent()


describe('Conversion', function() {
    var testFunction = function(kmlData,done) {
      kml2geojson(kmlData, function(err,geoJson) {
        geoJson.should.not.equal(null)
        done()
      })
    }
    describe('from static file', function() {
      it('should complete without error', function(done) {
        var fs = require('fs')
        fs.readFile( __dirname + '/allroutes.kml', 'utf8', function(err, kmlData) {
          testFunction(kmlData,done)
        })
    })
    })
})

describe('Connnection', function() {
  describe('to ABQ data server', function() {
    it('should connect without error', function(done) {
      request
        .get('http://data.cabq.gov/transit/realtime/route/allroutes.kml')
        .end( function(err,res) {
          res.should.have.status(200)
          return done()
        })
    })
  })
})