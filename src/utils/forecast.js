const request = require("request");

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/2c3e66246cfb915310e11a1e45ce0a35/${latitude},${longitude}`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback("Unable to connect to network!");
        } else if (body.error) {
            callback("Unable to find location!");
        } else {
            callback(
                undefined,
                `${body.daily.data[0].summary} It is currently ${
                    body.currently.temperature
                } degrees out.  There is a ${
                    body.currently.precipProbability
                }% chance of rain.`
            );
        }
    });
};

module.exports = forecast;
