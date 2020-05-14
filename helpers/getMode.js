
const getModes = (array) => {
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

module.exports = getModes;
  