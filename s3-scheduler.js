/**
 * This script will run every 5mins, and the data should be uploaded every 15seconds.
 * Meaning that there will be (5*60)/15 = 20 tasks
 * Author: Jose V. Trigueros
 */
var ironioHelper = require('./ironio-payload-config')
  , ironio = require('node-ironio')

var taskIntervalRate = 15 // seconds
var scheduleIntervalRate = 300 // seconds or 5 mins
var range = Array.apply(null, {length: scheduleIntervalRate/taskIntervalRate}).map(Number.call, Number)

ironioHelper.loadPayload( function(payload) {
  var body = { payload : JSON.stringify(payload)
             , code_name : "kml2geojson-transit-uploader"
             }

  var project = ironio(payload.token).projects(payload.project_id)

  range.forEach( function(index) {
    body.delay = index * taskIntervalRate
    project.tasks.queue(body, function(err) {
      if( err ) console.log(err)
    })
  })
})

