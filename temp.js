const Gpio = require('pigpio').Gpio;
const i2c = require('i2c-bus');
const ADDR = 0x5b;
const TEMP_REG = 0x27;
const MICROSECDONDS_PER_CM = 1e6/34321; // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius


const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
let watchDog = 30;
let arr = [];


const toCelsius = (t) => {
	return (t*0.02)-273.15;
};

function getModes(array) {
  var frequency = {}; // array of frequency.
  var maxFreq = 0; // holds the max frequency.
  var modes = [];

  for (var i in array) {
    frequency[array[i]] = (frequency[array[i]] || 0) + 1; // increment frequency.

    if (frequency[array[i]] > maxFreq) { // is this frequency > max so far ?
      maxFreq = frequency[array[i]]; // update max.
    }
  }

  for (var k in frequency) {
    if (frequency[k] == maxFreq) {
      modes.push(k);
    }
  }

  return modes;
}


trigger.digitalWrite(0); // Make sure trigger is low

const watchHCSR04 = () => {
  let startTick;

  echo.on('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      watchDog = diff / 2 / MICROSECDONDS_PER_CM;      
     // console.log({len:watchDog});
    }
  });
};

watchHCSR04();


setInterval(()=>{

 trigger.trigger(10, 1);
 const condition = (watchDog <=10) && (watchDog >1);

 if(condition){ 
     	const i2c1 = i2c.open(1, err => {
	  if (err) throw err;

	  i2c1.readWord(ADDR, TEMP_REG, (err, rawData) => {
	    if (err) throw err;
	 
	   // console.log({raw:rawData,C:toCelsius(rawData),dist:watchDog});
	    arr.push(toCelsius(rawData));
            if(arr.length === 30){
	        const len = getModes(arr).length; 
		if( len > 1 ){
			let prom = 0;			
			getModes(arr).forEach(e=>{
				prom+=parseFloat(e);   		
			})
                  	console.log({temp: prom/len,len, prom, val:getModes(arr)});
			arr = [];				
		} else{
                  	console.log({temp: parseFloat(getModes(arr)[0]), len:len})
	                arr = [];
                }
            }else{
            	console.log("checking.....")
            }
	 
	    i2c1.close(err => {
	      if (err) throw err;
	    });
	  });
	});
 }
},100);




