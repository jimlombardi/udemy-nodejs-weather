const request = require("postman-request");

const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherapi.com/v1/current.json?key=ae740f99c126499d862194013240103&q=' + encodeURIComponent(lat) + ',' + encodeURIComponent(long) + '&aqi=no'

    // Original
    // request({url: url, json: true}, (error, response) => {
    //     if (error) {
    //         callback('Unable to connect to weather service', undefined)
    //     } else if (response.body.error) {
    //         callback('Location not found', undefined)
    //     } else {
    //         const message = response.body.current.condition.text + ': It is currently ' + response.body.current.temp_f + ' degrees out.  It feels like ' + response.body.current.feelslike_f + ' degrees.'
    //         callback(undefined, message)
    //     }
    // })

    // Destructured
    request({url, json: true}, (error,{ body } = {}) => {
        if (error) {
            callback('Unable to connect to weather service', undefined)
        } else if (body.error) {
            callback('Location not found', undefined)
        } else {
            const conditions = 'Conditions are ' + body.current.condition.text + '. '
            const temperature = 'It is currently ' + body.current.temp_f + ' degrees out.  It feels like ' + body.current.feelslike_f + ' degrees. '
            const moreWeather = 'The humidity is ' + body.current.humidity + '% with ' + body.current.cloud + '% cloud cover.'
            const message =  conditions + temperature + moreWeather
            callback(undefined, message)
        }
    })
}

module.exports = forecast

