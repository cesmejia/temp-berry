const i2c = require('i2c-bus');
 
const ADDR = 0x5b;
const TEMP_REG = 0x27;

const toCelsius = (t) => {
	return (t*0.02)-273.15;
};
 

 setInterval(()=>{
	const i2c1 = i2c.open(1, err => {
	  if (err) throw err;

	  i2c1.readWord(ADDR, TEMP_REG, (err, rawData) => {
	    if (err) throw err;
	 
	    console.log({raw:rawData,C:toCelsius(rawData)});
	 
	    i2c1.close(err => {
	      if (err) throw err;
	    });
	  });
	});

 }, 300);


///64183