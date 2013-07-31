/**
 * Author: Jose V. Trigueros
 */
var fs = require('fs')

function getPayloadIndex() {
// Figure out where the configuration file is, and get the index
  var payloadIdx = -1
  process.argv.forEach(function (val, idx) {
    if (val == '-payload')
      payloadIdx = idx + 1
  })
  return payloadIdx;
}

exports.loadPayload = function loadPayload(cb) {
  var payloadIdx = getPayloadIndex();
  fs.readFile(process.argv[payloadIdx], 'ascii', function(err, payload) {
    if( !err )cb(JSON.parse(payload))
    else console.log("Error occurred reading payload file : " + err)
  })
}

exports.loadPayloadSync = function loadPayloadSync() {
  return fs.readFileSync(process.argv[getPayloadIndex()], 'ascii')
}

