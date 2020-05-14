const Gpio = require("pigpio").Gpio;
const i2c = require("i2c-bus");
const getModes = require("./helpers/getMode");
const makePost = require("./helpers/makePost");
const URL =  "http://localhost:8080/temp";

const trigger = new Gpio(23, { mode: Gpio.OUTPUT });
const echo = new Gpio(24, { mode: Gpio.INPUT, alert: true });

const ADDR = 0x5b;
const TEMP_REG = 0x27;
const MICROSECDONDS_PER_CM = 1e6 / 34321; // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
let watchDog = 30;
let arr = [];

const toCelsius = (t) => {
  return t * 0.02 - 273.15;
};

trigger.digitalWrite(0); // Make sure trigger is low

const watchHCSR04 = () => {
  let startTick;

  echo.on("alert", (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // it's the same as endTick - startTick, I don't know why the use >>
      watchDog = diff / 2 / MICROSECDONDS_PER_CM;
    }
  });
};

watchHCSR04();

setInterval(() => {
  trigger.trigger(10, 1);
  const condition = (watchDog <= 10) && (watchDog > 1);

  if (condition) {
    const i2c1 = i2c.open(1, (err) => {
      if (err) throw err;

      i2c1.readWord(ADDR, TEMP_REG, (err, rawData) => {
        if (err) throw err;

        arr.push(toCelsius(rawData));

        if (arr.length === 35) {
          const mode = getModes(arr); 
          const len = mode.length;
          let temp;

          if (len > 1) {
            let prom = 0;
            mode.forEach((e) => {
              prom += parseFloat(e);
            });
            console.log({ temp: prom / len, len, prom, val: mode })
            temp = (prom / len);		
          } else {
            console.log({ temp: parseFloat(mode[0]), len: len });
            temp = parseFloat(mode[0]);
          }
            makePost(temp, URL);
            arr = [];
        } else {
          console.log("checking.....");
        }

        i2c1.close((err) => {
          if (err) throw err;
        });
      });
    });
  }
}, 100);
