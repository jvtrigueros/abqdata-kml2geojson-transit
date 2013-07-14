/**
 * Author: Jose V. Trigueros
 */
var fs = require('fs')
  , xml2js = require('xml2js')

var parser = new xml2js.Parser(
  { trim : true
  , normalize : true
  , normalizeTags : true
  , ignoreAttrs : true
  , explicitRoot : false
  , explicitArray : false
  }
)

exports.kml2geojson = function kml2geojson(kmlString, callback) {
    parser.parseString(kmlString, function(err, result) {
      try {
        var busRoutes = result.document.placemark
        var geoJsonRoutes = []
        if (busRoutes) {
          busRoutes.forEach(function (route) {
            var currentRoute = { type : 'Feature'
                               , properties : { route : route.name
                                              , heading : route.style.iconstyle.heading
                                              }
                               , geometry : { type : 'Point'
                                            , coordinates: route.point.coordinates.split(',')
                                            }
                               }

            // TODO: There is probably a fancier way of doing this mumbo jumbo
            route.description.table.tr.forEach(function (tr) {
              var td = tr.td
              var routeProperties = currentRoute.properties
              if (td[0].match(/.*(vehicle).*/i)) routeProperties.vehicle = td[1]
              else if (td[0].match(/.*(speed).*/i)) routeProperties.speed = td[1].split(' ')[0]
              else if (td[0].match(/.*(time).*/i)) routeProperties.timestamp = td[1]
              else if (td[0].match(/.*(stop).*/i)) routeProperties.destination = td[1]
            })

            geoJsonRoutes.push(currentRoute)
          })
        }
        // Wrapping the header information that completes the GeoJson file
        geoJsonRoutes = { type : 'FeatureCollection'
                        , features: geoJsonRoutes
                        }

        callback(null, geoJsonRoutes)
      } catch (e) {
        callback(e, null)
      }
    })
}
