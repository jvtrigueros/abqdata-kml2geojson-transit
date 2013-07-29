/**
 * Author: Jose V. Trigueros
 */
var ironioHelper = require('./ironio-payload-config')
  , ironio = require('node-ironio')

ironioHelper.loadPayload( function(payload) {
  var body = { payload : JSON.stringify(payload)
             , code_name : "kml2geojson-transit-uploader"
             }

  var project = ironio(payload.token).projects(payload.project_id)

  project.tasks.queue(body, function(err, res) {
    console.log(res.tasks.length)
  })
})

