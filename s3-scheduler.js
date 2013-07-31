/**
 * This script will run every 5mins, and the data should be uploaded every 15seconds.
 * Meaning that there will be (5*60)/15 = 20 tasks
 * Author: Jose V. Trigueros
 */
var ironioHelper = require('./ironio-payload-config')
  , ironio = require('node-ironio')
  , moment = require('moment')

var now = moment()
var endTime = moment().hours(23).minutes(0).seconds(0) // 10pm
var startTime = moment().add('days',1).hours(6).minutes(0).seconds(0) // 6am

var taskIntervalRate = 15 // seconds
var scheduleIntervalRate = 300 // seconds or 5 mins

ironioHelper.loadPayload( function(payload) {
  var body = { payload : JSON.stringify(payload)  }
  var project = ironio(payload.token).projects(payload.project_id)

  if( now.isAfter(endTime) || now.isBefore(startTime) ) {
    body.code_name = 'kml2geojson-transit-scheduler'
    rescheduler(body, project)
  } else {
    body.code_name = 'kml2geojson-transit-uploader'
    body.priority = 2
    var range = Array.apply(null, {length: scheduleIntervalRate/taskIntervalRate}).map(Number.call, Number)
    range.forEach( function(index) {
      body.delay = index * taskIntervalRate
      project.tasks.queue(body, function(err) {
        if( err ) console.log('Error queueing :' + JSON.stringify(err))
      })
    })
  }
})

function rescheduler(body, project) {
  var tasks = project.tasks
  body.run_every = scheduleIntervalRate
  body.start_at = startTime.toISOString()

  // Find out if the task is running, cancel it if it is.
  // Then proceed to schedule the next task the following morning.
  tasks.scheduled.list(function(err,res) {
    if(err) console.log('Error listing :'+ JSON.stringify(err))
    else {
      res.schedules.forEach( function(schedule) {
        if(schedule.code_name === body.code_name )
          tasks.scheduled.cancel(schedule.id, function (cErr ) {
            if( cErr ) console.log( 'Error Cancelling :' + JSON.stringify(cErr) )
          })
      })

      // Schedule new task in the future
      tasks.schedule(body, function( err ) {
        if( err ) console.log('Error Scheduling :' + JSON.stringify(err))
      })
    }
  })
}