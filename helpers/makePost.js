const fetch = require("node-fetch");

const makePost = async (temp, URL) => {
    
   await fetch( URL, {
        method: "post",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
	    "Access-Control-Allow-Origin":"*"
        },
        body: JSON.stringify({ temp: temp, sensorID: 1 }),
    })
    .then((res) => console.log({status:res.status,text:res.statusText}) )
    .catch(err => console.log(err));
   
};

module.exports = makePost;