/**
 * Author: Jose V. Trigueros
 */
var fs = require('fs')
   ,xml2js = require('xml2js')
   ,http = require('http')
   ,request = require('request')
   ,AWS = require('aws-sdk')
   ,nconf = require('nconf').file({file:__dirname + '/config.json'})
//   ,inspect = require('eyes').inspector({maxLength: false})

var parser = new xml2js.Parser({
    trim: true,
    normalize: true,
    normalizeTags: true,
    ignoreAttrs: true,
    explicitRoot: false,
    explicitArray: false
})

function kml2json(kmlString, callback) {
    parser.parseString(kmlString, function(err, result) {
//        inspect(result)
      try {
        var routes = result.document.placemark
        var jsonRoute = []
        if (routes !== undefined) {
          routes.forEach(function (route) {
            var currentRoute = {
              type : 'Feature',
              properties: {
                route      : route.name,
                heading    : route.style.iconstyle.heading
              },
              geometry : {
                type : 'Point',
                coordinates: route.point.coordinates.split(',')
              }
            }
            // TODO: There is probably a fancier way of doing this mumbo jumbo
            route.description.table.tr.forEach(function (tr) {
              var td = tr.td
              var routeProperties = currentRoute.properties
              if (td[0].match(/.*(vehicle).*/i)) {
                routeProperties.vehicle = td[1]
              } else if (td[0].match(/.*(speed).*/i)) {
                routeProperties.speed = td[1].split(' ')[0]
              } else if (td[0].match(/.*(time).*/i)) {
                routeProperties.timestamp = td[1]
              } else if (td[0].match(/.*(stop).*/i)) {
                routeProperties.destination = td[1]
              }
            })

            jsonRoute.push(currentRoute)
          })
        }
        callback(JSON.stringify(jsonRoute,null,0))
      } catch (e) {
        console.log(e)
        var s3 = new AWS.S3()
        s3PutObject.Key = 'error_'+ Date.now() +'.xml'
        s3PutObject.Body = kmlString
        s3.putObject(s3PutObject)
        callback({error: e})
      }
    })
}

// TODO: Convert this into a test of some sort
/*fs.readFile(__dirname + '/test/allroutes.kml', function(err, kmlString) {
  kml2json(kmlString, console.log)
})*/

