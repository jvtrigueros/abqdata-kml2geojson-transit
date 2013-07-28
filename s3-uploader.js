/**
 * Author: Jose V. Trigueros
 */
var nconf = require('nconf').file({file: __dirname + '/config.json'})
  , AWS = require('aws-sdk')
  , fs = require('fs')
  , request = require('request')
  , kml2geojson = require('./kml2geojson')


// Figure out where the configuration file is, and get the index
var payloadIdx = -1
process.argv.forEach( function(val, idx) {
  if ( val == '-payload' )
    payloadIdx = idx + 1
})

// Use that index to read the file, and set the AWS configuration.
fs.readFile(process.argv[payloadIdx], 'ascii', function(err, payload) {
  var awsKey = JSON.parse(payload)
  AWS.config.update({
    accessKeyId: awsKey.access,
    secretAccessKey:awsKey.secretaccess,
    region: awsKey.region
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