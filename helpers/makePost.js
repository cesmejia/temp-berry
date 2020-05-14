const fetch = require("node-fetch");

const makePost = (temp) => {
    
    fetch("http://localhost:8080/temp", {
        method: "post",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ temp: temp, sensorID: 1 }),
    })
    .then((res) => res.json())
    .then((res) => console.log(res));
    
};

module.exports = makePost;