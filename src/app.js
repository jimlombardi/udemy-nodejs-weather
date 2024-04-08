const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const  port = process.env.PORT || 3000  // Use hosting port or default to 3000 for local  operation

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static content directory
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'JimL'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me',
        name: 'JimL'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        helpMsg: 'All your help text goes here',
        name: 'JimL'
    })
})


// app.get('', (req, res) => {
//     res.send('<h1>Weather</h1>')
// })

// app.get('/help', (req,res) => {
//     res.send({
//         name: 'Jim',
//         age: 62
//     })
// })

// app.get('/about', (req,res) => {
//     res.send('<h1>About</h1>')
// })

app.get('/weather', (req,res) => {
    const address = req.query.address
    if (!address) {
        return res.send({
            error: 'You must provide an address in your URI'
        })
    }
    // res.send({
    //     forecast: 'Overcast: It is currently 59.4 degrees out.  It feels like 58.1 degrees.',
    //     location: 'Philadelphia',
    //     address: req.query.address
    // })

    geocode(address, (error, {latitude, longitude, location} = {}) => {  // Using default values for second argument
        if (error) {
            return res.send({
                error: error
            })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
            res.send({
                forecast: forecastData,
                location: location,
                address: address
            })
        })
    })
})

app.get('/products', (req,res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('notfound', {
        title: 'HTTP 404',
        errorMsg: 'Help article not found.',
        name: 'JimL'
    })
})

app.get('*',(req,res) => {
    res.render('notfound', {
        title: 'HTTP 404',
        errorMsg: 'Page not found.',
        name: 'JimL'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})