/**
 * This script will run every 5mins, and the data should be uploaded every 15seconds.
 * Meaning that there will be (5*60)/15 = 20 tasks
 * Author: Jose V. Trigueros
 */
var ironioHelper = require('./ironio-payload-config')
  , ironio = require('node-ironio')

var endTime = 22 // 10pm
var startTime = 6 // 6am

var taskIntervalRate = 15 // seconds
var scheduleIntervalRate = 300 // seconds or 5 mins

ironioHelper.loadPayload( function(payload) {
  var body = { payload : JSON.stringify(payload)  }
  var project = ironio(payload.token).projects(payload.project_id)

  // TODO: Check if the current time schedule is a valid one
  var time = new Date()
  if( time.getHours() > endTime || time.getHours() < startTime ) {
    body.code_name = 'kml2geojson-transit-scheduler'
    body.delay = 8 * 60 * 60 // 6am
    project.tasks.scheduled.list(function(err, res) {
      console.log(res)
      // replace info with cancel, but then we should be able to schedule it again
      project.tasks.scheduled.info(res.schedules[0].id, function(innerErr, innerRes) {
        console.log(innerRes)
      })
    })
/*    project.tasks.queue(body, function(err) {
      if( err ) console.log(err)
    })*/
  } else {
    body.code_name = 'kml2geojson-transit-uploader'
    var range = Array.apply(null, {length: scheduleIntervalRate/taskIntervalRate}).map(Number.call, Number)
    range.forEach( function(index) {
      body.delay = index * taskIntervalRate
      console.log(body.delay)
      /*project.tasks.queue(body, function(err) {
        if( err ) console.log(err)
      })*/
    })
  }
})

