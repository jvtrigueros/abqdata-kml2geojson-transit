/**
 * Author: Jose V. Trigueros
 */
var nconf = require('nconf').file({file: __dirname + '/config.json'})
  , AWS = require('aws-sdk')
  , request = require('request')
  , kml2geojson = require('./kml2geojson')
  , ironio = require('./ironio-payload-config')

// Use that index to read the file, and set the AWS configuration.
ironio.loadPayload(function(payload) {
  AWS.config.update({
    accessKeyId: payload.access,
    secretAccessKey:payload.secretaccess,
    region: payload.region
  })

  // Read the S3 Options and create JSON object to store these
  var s3Options = nconf.get('S3Options')

  // Upload the file
  upload(new AWS.S3(), s3Options)
})

function upload(s3, s3Object) {
  request(nconf.get('RouteBaseUrl') + nconf.get('Route'), function(err,res,body) {
    kml2geojson.convertTransit(body, function(err,jsonRoute) {
      s3Object.Body = JSON.stringify(jsonRoute)

      s3.putObject(s3Object,function(err) {
        if(err)
          console.log("Route data could not be save due to: " + err)
        else
          console.log("Successfully uploaded route data!")
      })
    })
  })
}