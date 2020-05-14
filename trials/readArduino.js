const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter')
const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 9600
});
//

const parser = port.pipe(new Delimiter({ delimiter: '\n' }));
parser.on('data', function(data){
    console.log("data " + data.toString())
    
});
