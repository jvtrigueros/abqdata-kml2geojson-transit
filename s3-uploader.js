/**
 * Author: Jose V. Trigueros
 */
var nconf = require('nconf').file({file: __dirname + '/config.json'})
  , AWS = require('aws-sdk')
  , fs = require('fs')
  , request = require('request')
  , kml2geojson = require('./kml2geojson').kml2geojson

var s3Options = nconf.get('S3Options')
var s3PutObject = {
  ACL: s3Options.ACL,
  Bucket: s3Options.Bucket,
  ContentType: s3Options.ContentType
}

var payloadIdx = -1
process.argv.forEach( function(val, idx) {
  if ( val == '-payload' )
    payloadIdx = idx + 1
})


fs.readFile(process.argv[payloadIdx], 'ascii', function(err, payload) {
  var awsKey = JSON.parse(payload)
  console.log(payload)
  AWS.config.update({
    accessKeyId: awsKey.access,
    secretAccessKey:awsKey.secretaccess,
    region: awsKey.region
  })
})

request(nconf.get('RouteBaseUrl') + nconf.get('Route'), function(err,res,body) {
//  console.log(body)
  kml2geojson(body, function(err,jsonRoute) {
    var s3 = new AWS.S3()
    s3PutObject.Key = s3Options.Key
    s3PutObject.Body = jsonRoute
    console.log()
//    s3.putObject(s3PutObject,function(err,data){
      if(err)
        console.log("Route data could not be save due to: " + err)
      else
        console.log("Successfully uploaded route data!")
//    })
  })
})
