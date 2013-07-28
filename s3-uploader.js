/**
 * Author: Jose V. Trigueros
 */
var nconf = require('nconf').file({file: __dirname + '/config.json'})
  , AWS = require('aws-sdk')
  , fs = require('fs')
  , request = require('request')
  , kml2geojson = require('./kml2geojson').kml2geojson


// Figure out where the configuration file is, and get the index
var payloadIdx = -1
process.argv.forEach( function(val, idx) {
  if ( val == '-payload' )
    payloadIdx = idx + 1
})

// Use that index to read the file, and set the AWS configuration.
fs.readFile(process.argv[payloadIdx], 'ascii', function(err, payload) {
  var awsKey = JSON.parse(payload)

  var s3 = new AWS.S3(awsKey)

})

// Read the S3 Options and create JSON object to store these
var s3Options = nconf.get('S3Options')
var s3PutOptions = {
  ACL: s3Options.ACL,
  Bucket: s3Options.Bucket,
  ContentType: s3Options.ContentType
}

var s3 = new AWS.S3()
s3PutOptions.Key = 'test.json'
s3PutOptions.Body = 'test'


s3.putObject(s3PutOptions, function(err, data) {
  if( err )
    console.log('Didn\'t work:' + err )
})


function upload() {request(nconf.get('RouteBaseUrl') + nconf.get('Route'), function(err,res,body) {
//  console.log(body)
  kml2geojson(body, function(err,jsonRoute) {
    /*var s3 = new AWS.S3()
    s3PutObject.Key = s3Options.Key
    s3PutObject.Body = jsonRoute*/
    console.log(jsonRoute)
//    s3.putObject(s3PutObject,function(err,data){
      if(err)
        console.log("Route data could not be save due to: " + err)
      else
        console.log("Successfully uploaded route data!")
//    })
  })
})
}
